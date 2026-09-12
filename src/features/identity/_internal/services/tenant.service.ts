import { cache } from "react";
import { prisma, type Db, type Prisma } from "@/shared/lib/infra/prisma";
import { DEFAULT_PALETTE, isPalette, type PaletteId } from "@/shared/lib/palette";
import { errors } from "@/shared/lib/errors";
import { writeAudit } from "../audit";
import type { UpdateSettingsInput } from "../validations/settings";

export interface SmtpSettings {
  enabled: boolean;
  service: "gmail" | "custom";
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export interface ContactSettings {
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  facebookUrl: string;
  lineUrl: string;
  youtubeUrl: string;
  mapUrl: string;
}

export interface TenantSettings {
  code: string;
  nameTh: string;
  nameEn: string;
  logoUrl: string | null;
  palette: PaletteId;
  smtp: SmtpSettings;
  contact: ContactSettings;
}

export const defaultSmtp: SmtpSettings = {
  enabled: false,
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  user: "",
  pass: "",
  from: "",
};

export const defaultContact: ContactSettings = {
  address: "",
  phone: "",
  email: "",
  officeHours: "",
  facebookUrl: "",
  lineUrl: "",
  youtubeUrl: "",
  mapUrl: "",
};

async function readTenantSettings(tenantId: string, db: Db): Promise<TenantSettings> {
  let t = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!t) {
    t = await db.tenant.findFirst({ orderBy: { createdAt: "asc" } });
  }
  if (!t) throw errors.not_found();
  const s = (t.settings as { palette?: unknown; smtp?: Partial<SmtpSettings>; contact?: Partial<ContactSettings> } | null) || {};
  const p = s.palette;
  return {
    code: t.code,
    nameTh: t.nameTh,
    nameEn: t.nameEn,
    logoUrl: t.logoUrl,
    palette: isPalette(p) ? p : DEFAULT_PALETTE,
    smtp: { ...defaultSmtp, ...(s.smtp || {}) },
    contact: { ...defaultContact, ...(s.contact || {}) },
  };
}

export async function getTenantSettings(tenantId: string): Promise<TenantSettings> {
  return readTenantSettings(tenantId, prisma);
}

/** เก็บคีย์อื่น ๆ ใน settings JSON ไว้ทั้งหมด — merge เฉพาะ palette, smtp และ contact ที่เปลี่ยน ไม่ทับทั้งก้อน */
export async function updateTenantSettings(input: { tenantId: string; actorId: string } & UpdateSettingsInput): Promise<void> {
  await prisma.$transaction(async (tx) => {
    let targetTenantId = input.tenantId;
    let t = await tx.tenant.findUnique({ where: { id: targetTenantId }, select: { id: true, settings: true } });
    if (!t) {
      const fallback = await tx.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true, settings: true } });
      if (fallback) {
        t = fallback;
        targetTenantId = fallback.id;
      }
    }
    if (!t) throw errors.not_found();
    const before = await readTenantSettings(targetTenantId, tx);
    const current = (t.settings as object) || {};
    const newSettings: Record<string, unknown> = {
      ...current,
      palette: input.palette,
    };
    if (input.smtp !== undefined) {
      newSettings.smtp = input.smtp;
    }
    if (input.contact !== undefined) {
      newSettings.contact = input.contact;
    }
    await tx.tenant.update({
      where: { id: targetTenantId },
      data: { nameTh: input.nameTh, nameEn: input.nameEn, logoUrl: input.logoUrl || null, settings: newSettings as Prisma.InputJsonObject },
    });
    await writeAudit({ tenantId: targetTenantId, actorId: input.actorId, action: "tenant.settings_update", entity: "tenant", entityId: targetTenantId, before, after: input }, tx);
  });
}

export async function getTenantPalette(tenantId: string): Promise<PaletteId> {
  let t = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } });
  if (!t) {
    t = await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { settings: true } });
  }
  const p = (t?.settings as { palette?: unknown } | null)?.palette;
  return isPalette(p) ? p : DEFAULT_PALETTE;
}

/**
 * tenant ของ session ถ้ามี — import แบบ dynamic เพราะ `../auth` ดึง next-auth ทั้งก้อนเข้ามา และ
 * โมดูลนี้ถูก import จาก root layout ที่รันทุก request · แยก try ของตัวเองไว้ต่างหากโดยเจตนา
 */
async function sessionTenantId(): Promise<string | null> {
  try {
    const { auth } = await import("../auth");
    return (await auth())?.tenantId || null;
  } catch {
    return null;
  }
}

/** ใช้โดย root layout ทุก request — tenant จาก session ถ้ามี ไม่งั้น tenant แรก (หน้า login ยังไม่มี session) · ไม่ throw */
export const resolvePalette = cache(async (): Promise<PaletteId> => {
  try {
    const tenantId =
      (await sessionTenantId()) ||
      (await prisma.tenant.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" }, select: { id: true } }))?.id ||
      (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantPalette(tenantId) : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
});

export const resolveTenantSettings = cache(async (): Promise<TenantSettings | null> => {
  try {
    const tenantId =
      (await sessionTenantId()) ||
      (await prisma.tenant.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" }, select: { id: true } }))?.id ||
      (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantSettings(tenantId) : null;
  } catch {
    return null;
  }
});

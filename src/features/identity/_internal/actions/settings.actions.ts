"use server";
import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { errors } from "@/shared/lib/errors";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { P } from "../../permissions";
import { requirePermission } from "../rbac";
import nodemailer from "nodemailer";
import { updateSettingsSchema, testSmtpSchema } from "../validations/settings";
import { getTenantSettings, updateTenantSettings, type TenantSettings } from "../services/tenant.service";

export async function getSettingsAction(): Promise<ActionResult<TenantSettings>> {
  return runAction(async () => getTenantSettings((await requirePermission(P.settingsManage)).tenantId));
}

export async function testSmtpAction(input: unknown): Promise<ActionResult<{ success: boolean; message: string }>> {
  return runAction(async () => {
    await requirePermission(P.settingsManage);
    const data = testSmtpSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    try {
      const transport = nodemailer.createTransport({
        host: data.host,
        port: data.port,
        secure: data.secure,
        auth: data.user ? { user: data.user, pass: data.pass } : undefined,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
      });

      await transport.verify();

      await transport.sendMail({
        from: data.from || data.user,
        to: data.testTo,
        subject: "ทดสอบการเชื่อมต่อระบบอีเมล (SMTP Gmail Test)",
        text: `สวัสดีครับ,\n\nนี่คืออีเมลทดสอบการเชื่อมต่อ Gmail SMTP จากระบบสำเร็จเรียบร้อยแล้ว\nส่งเมื่อ: ${new Date().toLocaleString("th-TH")}`,
        html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #16a34a;">✓ การเชื่อมต่อ Gmail SMTP สำเร็จ</h2>
          <p>ระบบได้ทดสอบส่งอีเมลผ่าน <strong>${data.host}</strong> (${data.user}) เรียบร้อยแล้ว</p>
          <p style="color: #64748b; font-size: 13px;">ส่งเมื่อ: ${new Date().toLocaleString("th-TH")}</p>
        </div>`,
      });

      return { success: true, message: "เชื่อมต่อและส่งอีเมลทดสอบสำเร็จ" };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      throw errors.internal(`การส่งอีเมลไม่สำเร็จ: ${errMsg}`);
    }
  });
}
export async function updateSettingsAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.settingsManage);
    await updateTenantSettings({ tenantId: ctx.tenantId, actorId: ctx.userId, ...updateSettingsSchema.parse(input, { error: zodErrorMap(await getLocale()) }) });
    revalidatePath("/", "layout");
    revalidatePath("/(admin)", "layout");
    revalidatePath("/portal", "layout");
  });
}

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
export async function uploadLogoAction(formData: FormData): Promise<ActionResult<string>> {
  return runAction(async () => {
    await requirePermission(P.settingsManage);
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    // Security: Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Security: Whitelist allowed image extensions and MIME types
    const ALLOWED_EXTS = ["png", "jpg", "jpeg", "webp"];
    const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/webp"];
    const ext = (file.name.split('.').pop() || "").toLowerCase();
    
    if (!ALLOWED_EXTS.includes(ext) || (file.type && !ALLOWED_MIMES.includes(file.type))) {
      throw new Error("Invalid file type. Only PNG, JPG, and WEBP images are allowed.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `logo-${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  });
}

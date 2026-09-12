import { prisma } from "@/shared/lib/infra/prisma";
import { hashPassword } from "@/shared/lib/security/password";
import { errors } from "@/shared/lib/errors";
import { SUPER_ADMIN_CODE } from "../../permissions";
import { writeAudit } from "../audit";

export interface ExportUsersOptions {
  status?: "all" | "active" | "inactive";
  roleId?: string;
}

export interface ValidImportUser {
  email: string;
  name: string;
  roleId: string;
  roleCode: string;
  password?: string;
  isActive: boolean;
}

export interface InvalidImportUser {
  rowNumber: number;
  email: string;
  name: string;
  roleCode: string;
  errors: string[];
}

export interface CsvValidationResult {
  totalRows: number;
  validRows: ValidImportUser[];
  invalidRows: InvalidImportUser[];
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const lines = clean.split(/\r\n|\n|\r/);
  const result: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let insideQuotes = false;
    let current = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }
  return result;
}

export async function exportUsersToCsv(
  tenantId: string,
  options: ExportUsersOptions = {}
): Promise<string> {
  const where = {
    tenantId,
    ...(options.status === "active"
      ? { isActive: true, user: { isActive: true } }
      : options.status === "inactive"
        ? { OR: [{ isActive: false }, { user: { isActive: false } }] }
        : {}),
    ...(options.roleId ? { userRoles: { some: { roleId: options.roleId } } } : {}),
  };

  const users = await prisma.userTenant.findMany({
    where,
    orderBy: { user: { name: "asc" } },
    include: {
      user: true,
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  const headers = [
    "ID",
    "ชื่อ (Name)",
    "อีเมล (Email)",
    "บทบาท (Roles)",
    "สถานะ (Status)",
    "เข้าสู่ระบบล่าสุด (Last Login)",
    "วันที่สร้าง (Created At)",
  ];

  const rows = users.map((ut) => {
    const rolesStr = ut.userRoles.map((ur) => ur.role.nameTh || ur.role.code).join(", ");
    const statusStr = ut.isActive && ut.user.isActive ? "ใช้งาน (Active)" : "ระงับ (Suspended)";
    const lastLogin = ut.user.lastLoginAt ? ut.user.lastLoginAt.toISOString() : "-";
    const createdAt = ut.user.createdAt.toISOString();

    return [
      escapeCsv(ut.user.id),
      escapeCsv(ut.user.name),
      escapeCsv(ut.user.email),
      escapeCsv(rolesStr),
      escapeCsv(statusStr),
      escapeCsv(lastLogin),
      escapeCsv(createdAt),
    ].join(",");
  });

  return "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
}

export function generateUserCsvTemplate(): string {
  const headers = ["email", "name", "roleCode", "password", "status"];
  const samples = [
    ["somchai@example.com", "สมชาย ใจดี", "MEMBER", "Password123!", "active"],
    ["somying@example.com", "สมหญิง รักเรียน", "ADMIN", "", "active"],
    ["prasert@example.com", "ประเสริฐ สุขใจ", "MEMBER", "", "inactive"],
  ];

  return (
    "\uFEFF" +
    [
      headers.join(","),
      ...samples.map((r) => r.map(escapeCsv).join(",")),
    ].join("\r\n")
  );
}

export async function validateUsersCsv(
  tenantId: string,
  csvText: string,
  actor: { isSuperAdmin: boolean; permissions: string[] }
): Promise<CsvValidationResult> {
  const parsed = parseCsv(csvText);
  if (parsed.length < 2) {
    throw errors.validation("ไฟล์ CSV ว่างเปล่า หรือไม่มีข้อมูลแถว");
  }

  const rawHeaders = parsed[0].map((h) => h.toLowerCase().trim());
  const emailIdx = rawHeaders.indexOf("email");
  const nameIdx = rawHeaders.indexOf("name");
  const roleIdx =
    rawHeaders.indexOf("rolecode") !== -1
      ? rawHeaders.indexOf("rolecode")
      : rawHeaders.indexOf("role");
  const pwdIdx = rawHeaders.indexOf("password");
  const statusIdx = rawHeaders.indexOf("status");

  if (emailIdx === -1 || nameIdx === -1) {
    throw errors.validation("รูปแบบหัวตาราง CSV ไม่ถูกต้อง ต้องมีคอลัมน์ 'email' และ 'name'");
  }

  const tenantRoles = await prisma.role.findMany({
    where: { tenantId },
    select: { id: true, code: true, nameTh: true, nameEn: true },
  });
  const roleByCode = new Map(tenantRoles.map((r) => [r.code.toUpperCase(), r]));
  const defaultRole = tenantRoles.find((r) => r.code === "MEMBER") || tenantRoles[0];

  const existingUsers = await prisma.user.findMany({
    select: { email: true },
  });
  const existingEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));

  const seenEmailsInFile = new Set<string>();
  const validRows: ValidImportUser[] = [];
  const invalidRows: InvalidImportUser[] = [];

  for (let i = 1; i < parsed.length; i++) {
    const row = parsed[i];
    const email = (row[emailIdx] || "").trim().toLowerCase();
    const name = (row[nameIdx] || "").trim();
    const roleCodeRaw = (roleIdx !== -1 ? row[roleIdx] : "") || "";
    const roleCode = roleCodeRaw.trim().toUpperCase();
    const password = pwdIdx !== -1 ? (row[pwdIdx] || "").trim() : "";
    const statusRaw = statusIdx !== -1 ? (row[statusIdx] || "").trim().toLowerCase() : "active";
    const isActive = statusRaw !== "inactive" && statusRaw !== "false" && statusRaw !== "0";

    const rowErrors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      rowErrors.push("ไม่ระบุอีเมล");
    } else if (!emailRegex.test(email)) {
      rowErrors.push("รูปแบบอีเมลไม่ถูกต้อง");
    } else if (existingEmails.has(email)) {
      rowErrors.push("อีเมลนี้มีอยู่ในระบบแล้ว");
    } else if (seenEmailsInFile.has(email)) {
      rowErrors.push("อีเมลซ้ำกับแถวอื่นในไฟล์");
    }

    if (!name) {
      rowErrors.push("ไม่ระบุชื่อผู้ใช้");
    }

    const matchedRole = roleCode ? roleByCode.get(roleCode) : defaultRole;
    if (roleCode && !matchedRole) {
      rowErrors.push(`ไม่พบบทบาท '${roleCode}' ในระบบ`);
    } else if (matchedRole?.code === SUPER_ADMIN_CODE && !actor.isSuperAdmin) {
      rowErrors.push("ไม่มีสิทธิ์กำหนดบทบาทผู้ดูแลสูงสุด (SUPER_ADMIN)");
    }

    if (password && password.length < 8) {
      rowErrors.push("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    }

    if (rowErrors.length > 0) {
      invalidRows.push({
        rowNumber: i + 1,
        email: email || "-",
        name: name || "-",
        roleCode: roleCode || defaultRole?.code || "-",
        errors: rowErrors,
      });
    } else {
      seenEmailsInFile.add(email);
      validRows.push({
        email,
        name,
        roleId: matchedRole!.id,
        roleCode: matchedRole!.code,
        password: password || undefined,
        isActive,
      });
    }
  }

  return {
    totalRows: parsed.length - 1,
    validRows,
    invalidRows,
  };
}

export async function batchImportUsers(
  tenantId: string,
  actor: { tenantId: string; actorId: string; isSuperAdmin: boolean; permissions: string[] },
  users: ValidImportUser[],
  defaultPassword?: string
): Promise<{ count: number }> {
  if (users.length === 0) return { count: 0 };

  const defaultHash =
    defaultPassword && defaultPassword.trim().length >= 8
      ? await hashPassword(defaultPassword.trim())
      : null;

  let imported = 0;

  await prisma.$transaction(async (tx) => {
    for (const item of users) {
      const passwordHash = item.password
        ? await hashPassword(item.password)
        : defaultHash;

      const user = await tx.user.create({
        data: {
          email: item.email,
          name: item.name,
          passwordHash,
          isActive: item.isActive,
          mustChangePassword: !!passwordHash,
          emailVerified: true,
        },
      });

      const ut = await tx.userTenant.create({
        data: {
          userId: user.id,
          tenantId,
          isActive: item.isActive,
        },
      });

      await tx.userRole.create({
        data: {
          userTenantId: ut.id,
          roleId: item.roleId,
          scopeType: "ALL",
          scopeId: null,
        },
      });

      imported++;
    }

    await writeAudit(
      {
        tenantId,
        actorId: actor.actorId,
        action: "user.import_csv",
        entity: "user",
        entityId: `batch_${imported}`,
        after: { count: imported, emails: users.map((u) => u.email) },
      },
      tx
    );
  });

  return { count: imported };
}

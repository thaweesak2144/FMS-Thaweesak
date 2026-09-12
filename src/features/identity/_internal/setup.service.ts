import { prisma } from "@/shared/lib/infra/prisma";
import bcrypt from "bcryptjs";
import { seedCore, seedUser } from "../../../../prisma/lib/seed-core";

export interface InitialSetupInput {
  tenantNameTh: string;
  tenantNameEn: string;
  adminName: string;
  adminEmail: string;
  password: string;
}

export async function isSetupRequired(): Promise<boolean> {
  const count = await prisma.user.count();
  return count === 0;
}

export async function performInitialSetup(input: InitialSetupInput) {
  const existingCount = await prisma.user.count();
  if (existingCount > 0) {
    throw new Error("System has already been initialized");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const core = await seedCore(prisma, {
    tenantCode: "DEFAULT",
    nameTh: input.tenantNameTh.trim() || "องค์กรหลัก",
    nameEn: input.tenantNameEn.trim() || "Main Organization",
  });

  await seedUser(prisma, core.tenantId, {
    email: input.adminEmail.trim().toLowerCase(),
    name: input.adminName.trim(),
    passwordHash,
    roleIds: [core.roleIds.SUPER_ADMIN],
    mustChangePassword: false,
    isActive: true,
  });

  return { ok: true, email: input.adminEmail.trim().toLowerCase() };
}

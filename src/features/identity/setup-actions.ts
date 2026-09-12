"use server";

import { z } from "zod";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { isSetupRequired, performInitialSetup } from "./_internal/setup.service";

const setupSchema = z
  .object({
    tenantNameTh: z.string().min(1, "กรุณากรอกชื่อหน่วยงานภาษาไทย"),
    tenantNameEn: z.string().min(1, "กรุณากรอกชื่อหน่วยงานภาษาอังกฤษ"),
    adminName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล ผู้ดูแลระบบ"),
    adminEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type SetupFormValues = z.infer<typeof setupSchema>;

export async function checkSetupRequiredAction(): Promise<ActionResult<{ setupRequired: boolean }>> {
  return runAction(async () => {
    const required = await isSetupRequired();
    return { setupRequired: required };
  });
}

export async function performInitialSetupAction(
  input: SetupFormValues
): Promise<ActionResult<{ success: boolean; email: string }>> {
  return runAction(async () => {
    const validated = setupSchema.parse(input);
    const res = await performInitialSetup(validated);
    return { success: res.ok, email: res.email };
  });
}

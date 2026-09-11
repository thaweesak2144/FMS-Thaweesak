"use server";
import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { P } from "../../permissions";
import { requirePermission } from "../rbac";
import { updateSettingsSchema } from "../validations/settings";
import { getTenantSettings, updateTenantSettings, type TenantSettings } from "../services/tenant.service";

export async function getSettingsAction(): Promise<ActionResult<TenantSettings>> {
  return runAction(async () => getTenantSettings((await requirePermission(P.settingsManage)).tenantId));
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

import { writeFile } from "fs/promises";
import { join } from "path";
export async function uploadLogoAction(formData: FormData): Promise<ActionResult<string>> {
  return runAction(async () => {
    await requirePermission(P.settingsManage);
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || "png";
    const filename = `logo-${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), "public/uploads");
    require("fs").mkdirSync(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  });
}

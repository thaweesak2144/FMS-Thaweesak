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
    require("fs").mkdirSync(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  });
}

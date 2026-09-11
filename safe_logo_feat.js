const fs = require('fs');
const path = require('path');

function replace(file, search, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replacement);
  fs.writeFileSync(file, content, 'utf8');
}

// 1. next.config.ts
replace('next.config.ts', 'poweredByHeader: false,', `poweredByHeader: false,\n  experimental: { serverActions: { bodySizeLimit: '10mb' } },`);

// 2. src/app/(admin)/settings/_components/settings-form.tsx
let sf = fs.readFileSync('src/app/(admin)/settings/_components/settings-form.tsx', 'utf8');
sf = sf.replace(
  `import { updateSettingsAction } from "@/features/identity/actions";`,
  `import { updateSettingsAction, uploadLogoAction } from "@/features/identity/actions";\nimport { useRef } from "react";`
);
sf = sf.replace(
  `const [pending, start] = useTransition();`,
  `const [pending, start] = useTransition();\n  const fileRef = useRef<HTMLInputElement>(null);\n\n  const handleUpload = () => { if (fileRef.current) fileRef.current.click(); };\n  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; start(async () => { const formData = new FormData(); formData.append("file", file); const res = await uploadLogoAction(formData); if (res.ok) { setForm(prev => ({ ...prev, logoUrl: res.data })); toast.success("Logo uploaded successfully"); } else { toast.error("Failed to upload logo"); } if (fileRef.current) fileRef.current.value = ""; }); };`
);
sf = sf.replace(
  `<LiyonField label={t("settings.logoUrl")} htmlFor="s-logo" hint={t("common.optional")} error={errors.logoUrl?.[0]}><input id="s-logo" type="url" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} /></LiyonField>`,
  `<LiyonField label={t("settings.logoUrl")} htmlFor="s-logo" hint={t("common.optional")} error={errors.logoUrl?.[0]}>\n              <div className="flex gap-2">\n                <input id="s-logo" type="url" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} className="flex-1" />\n                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />\n                <Button type="button" variant="outline" onClick={handleUpload} disabled={pending}>Upload</Button>\n              </div>\n            </LiyonField>`
);
fs.writeFileSync('src/app/(admin)/settings/_components/settings-form.tsx', sf, 'utf8');

// 3. src/features/identity/_internal/validations/settings.ts
replace('src/features/identity/_internal/validations/settings.ts', '.url()', '');

// 4. src/features/identity/_internal/actions/settings.actions.ts
let act = fs.readFileSync('src/features/identity/_internal/actions/settings.actions.ts', 'utf8');
act += `
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
    const filename = \`logo-\${Date.now()}.\${ext}\`;
    const filepath = join(process.cwd(), "public/uploads", filename);
    await writeFile(filepath, buffer);
    return \`/uploads/\${filename}\`;
  });
}
`;
fs.writeFileSync('src/features/identity/_internal/actions/settings.actions.ts', act, 'utf8');

// 5. src/features/identity/actions.ts
replace('src/features/identity/actions.ts', 'getSettingsAction, updateSettingsAction', 'getSettingsAction, updateSettingsAction, uploadLogoAction');

// 6. src/features/identity/_internal/services/tenant.service.ts
let ten = fs.readFileSync('src/features/identity/_internal/services/tenant.service.ts', 'utf8');
ten += `
export const resolveTenantSettings = cache(async (): Promise<TenantSettings | null> => {
  try {
    const tenantId = (await sessionTenantId()) || (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantSettings(tenantId) : null;
  } catch {
    return null;
  }
});
`;
fs.writeFileSync('src/features/identity/_internal/services/tenant.service.ts', ten, 'utf8');

// 7. src/features/identity/server.ts
replace('src/features/identity/server.ts', 'resolvePalette,', 'resolvePalette, resolveTenantSettings,');

// 8. src/shared/components/liyon/admin-shell.tsx
let shell = fs.readFileSync('src/shared/components/liyon/admin-shell.tsx', 'utf8');
shell = shell.replace('brandTagline: string;', 'brandTagline: string;\n  brandLogo?: string | null;');
shell = shell.replace('brandTagline,', 'brandTagline,\n  brandLogo,');
shell = shell.replace('<b>{brandName}</b>', '{brandLogo ? <img src={brandLogo} alt={brandName} style={{ height: "2rem", objectFit: "contain" }} /> : <b>{brandName}</b>}');
fs.writeFileSync('src/shared/components/liyon/admin-shell.tsx', shell, 'utf8');

// 9. Admin Layout
fs.renameSync('src/app/(admin)/layout.tsx', 'src/app/(admin)/client-layout.tsx');
let adm = fs.readFileSync('src/app/(admin)/client-layout.tsx', 'utf8');
adm = adm.replace('export default function AdminLayout({ children }: { children: React.ReactNode })', 'export default function AdminClientLayout({ children, logoUrl }: { children: React.ReactNode; logoUrl?: string | null })');
adm = adm.replace('brandName={t("app.name")}', 'brandName={t("app.name")} brandLogo={logoUrl}');
fs.writeFileSync('src/app/(admin)/client-layout.tsx', adm, 'utf8');
fs.writeFileSync('src/app/(admin)/layout.tsx', `import { resolveTenantSettings } from "@/features/identity/server";\nimport AdminClientLayout from "./client-layout";\n\nexport default async function AdminLayout({ children }: { children: React.ReactNode }) {\n  const settings = await resolveTenantSettings();\n  return <AdminClientLayout logoUrl={settings?.logoUrl}>{children}</AdminClientLayout>;\n}`, 'utf8');

// 10. Portal Layout
fs.renameSync('src/app/portal/layout.tsx', 'src/app/portal/client-layout.tsx');
let prt = fs.readFileSync('src/app/portal/client-layout.tsx', 'utf8');
prt = prt.replace('export default function PortalLayout({ children }: { children: React.ReactNode })', 'export default function PortalClientLayout({ children, logoUrl }: { children: React.ReactNode; logoUrl?: string | null })');
prt = prt.replace(/<div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">[\s\S]*?<\/div>/, '{logoUrl ? <img src={logoUrl} alt="Logo" className="h-10 object-contain group-hover:scale-105 transition-transform" /> : <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform"><GraduationCap className="h-6 w-6" /></div>}');
fs.writeFileSync('src/app/portal/client-layout.tsx', prt, 'utf8');
fs.writeFileSync('src/app/portal/layout.tsx', `import { resolveTenantSettings } from "@/features/identity/server";\nimport PortalClientLayout from "./client-layout";\n\nexport default async function PortalLayout({ children }: { children: React.ReactNode }) {\n  const settings = await resolveTenantSettings();\n  return <PortalClientLayout logoUrl={settings?.logoUrl}>{children}</PortalClientLayout>;\n}`, 'utf8');

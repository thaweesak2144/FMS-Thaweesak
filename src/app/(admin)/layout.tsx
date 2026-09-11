import { resolveTenantSettings } from "@/features/identity/server";
import AdminClientLayout from "./client-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await resolveTenantSettings();
  return <AdminClientLayout logoUrl={settings?.logoUrl} orgNameTh={settings?.nameTh} orgNameEn={settings?.nameEn}>{children}</AdminClientLayout>;
}
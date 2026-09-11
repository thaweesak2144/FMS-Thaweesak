import { resolveTenantSettings } from "@/features/identity/server";
import PortalClientLayout from "./client-layout";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const settings = await resolveTenantSettings();
  return <PortalClientLayout logoUrl={settings?.logoUrl}>{children}</PortalClientLayout>;
}
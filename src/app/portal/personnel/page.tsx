import {
  getDefaultTenantId,
  listPersonnel,
  listDepartments,
} from "@/features/personnel/server";
import { PortalPersonnelClient } from "./_components/portal-personnel-client";

export default async function PublicPersonnelDirectoryPage() {
  const tenantId = await getDefaultTenantId();
  const [personnelList, departments] = await Promise.all([
    listPersonnel(tenantId, { isActive: true }),
    listDepartments(tenantId),
  ]);

  return (
    <PortalPersonnelClient
      personnelList={personnelList}
      departments={departments}
    />
  );
}

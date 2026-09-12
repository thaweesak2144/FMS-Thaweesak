import { requirePermission, P } from "@/features/identity/server";
import { listRolesForPickerAction } from "@/features/identity/actions";
import { ImportExportClient } from "./_components/import-export-client";

export default async function UserImportExportPage() {
  await requirePermission(P.usersManage);
  const rolesRes = await listRolesForPickerAction();
  const roles = rolesRes.ok ? rolesRes.data : [];

  return <ImportExportClient roles={roles} />;
}

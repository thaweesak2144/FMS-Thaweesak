import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  PERSONNEL_P,
  listPersonnel,
  listDepartments,
} from "@/features/personnel/server";
import { PersonnelClient } from "./_components/personnel-client";

export default async function PersonnelPage() {
  const ctx = await requirePermission(PERSONNEL_P.personnelRead);
  const [initialPersonnel, departments] = await Promise.all([
    listPersonnel(ctx.tenantId),
    listDepartments(ctx.tenantId),
  ]);

  return (
    <PersonnelClient
      initialPersonnel={initialPersonnel}
      departments={departments}
      canWrite={hasPermission(ctx, PERSONNEL_P.personnelWrite)}
      canDelete={hasPermission(ctx, PERSONNEL_P.personnelDelete)}
    />
  );
}

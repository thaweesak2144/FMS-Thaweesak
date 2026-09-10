import { requirePermission } from "@/features/identity/server";
import { PERSONNEL_P, listDepartments } from "@/features/personnel/server";
import { DepartmentsClient } from "./_components/departments-client";

export default async function DepartmentsPage() {
  const ctx = await requirePermission(PERSONNEL_P.departmentManage);
  const initialItems = await listDepartments(ctx.tenantId);
  return <DepartmentsClient initialItems={initialItems} />;
}

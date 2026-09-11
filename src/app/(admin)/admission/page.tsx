import { requirePermission, hasPermission } from "@/features/identity/server";
import { ADMISSION_P, getRounds } from "@/features/admission/server";
import { listCurriculums } from "@/features/curriculum/server";
import { AdmissionClient } from "./_components/admission-client";

export default async function AdmissionPage() {
  const ctx = await requirePermission(ADMISSION_P.admissionRead);
  const rounds = await getRounds(ctx);
  const curriculums = await listCurriculums(ctx.tenantId, {});

  const canManage = hasPermission(ctx, ADMISSION_P.admissionManage);

  return (
    <AdmissionClient 
      initialRounds={rounds} 
      curriculums={curriculums}
      canManage={canManage}
    />
  );
}

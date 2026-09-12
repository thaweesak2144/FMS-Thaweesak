import { Suspense } from "react";
import { requirePermission, hasPermission } from "@/features/identity/server";
import { CURRICULUM_P, listCurriculums } from "@/features/curriculum/server";
import { CurriculumClient } from "./_components/curriculum-client";
import { prisma } from "@/shared/lib/infra/prisma";

export const metadata = { title: "Curriculum Management" };

export default async function CurriculumPage() {
  const ctx = await requirePermission(CURRICULUM_P.curriculumRead);

  const curriculums = await listCurriculums(ctx.tenantId, {});
  
  const departments = await prisma.department.findMany({
    where: { tenantId: ctx.tenantId },
    orderBy: { nameTh: "asc" },
    select: { id: true, nameTh: true, nameEn: true },
  });

  return (
    <Suspense fallback={null}>
      <CurriculumClient
        initialCurriculums={curriculums}
        departments={departments}
        canWrite={hasPermission(ctx, CURRICULUM_P.curriculumWrite)}
        canManage={hasPermission(ctx, CURRICULUM_P.curriculumManage)}
        canDelete={hasPermission(ctx, CURRICULUM_P.curriculumDelete)}
      />
    </Suspense>
  );
}

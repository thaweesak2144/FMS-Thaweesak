import { notFound } from "next/navigation";
import { requirePermission, hasPermission } from "@/features/identity/server";
import { CURRICULUM_P, getCurriculumById, listCurriculumPlans } from "@/features/curriculum/server";
import { PlanClient } from "./_components/plan-client";

export const metadata = { title: "Study Plan Management" };

export default async function StudyPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requirePermission(CURRICULUM_P.curriculumRead);

  const { id } = await params;
  
  const curriculum = await getCurriculumById(ctx.tenantId, id);
  if (!curriculum) return notFound();

  const plans = await listCurriculumPlans(id);

  return (
    <PlanClient
      curriculum={curriculum}
      initialPlans={plans}
      canManage={hasPermission(ctx, CURRICULUM_P.curriculumManage)}
    />
  );
}

import { notFound } from "next/navigation";
import { getCurriculumById, listCurriculumPlans, getDefaultTenantId } from "@/features/curriculum/server";
import { PortalCurriculumDetailClient } from "./_components/portal-curriculum-detail-client";

export default async function PortalCurriculumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenantId = await getDefaultTenantId();
  
  const curriculum = await getCurriculumById(tenantId, id);
  if (!curriculum || !curriculum.isActive) return notFound();

  const plans = await listCurriculumPlans(id);

  return <PortalCurriculumDetailClient curriculum={curriculum} plans={plans} />;
}

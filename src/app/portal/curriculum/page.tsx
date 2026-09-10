import { getDefaultTenantId, listCurriculums } from "@/features/curriculum/server";
import { PortalCurriculumClient } from "./_components/portal-curriculum-client";

export const metadata = { title: "Academic Programs" };

export default async function PortalCurriculumPage() {
  const tenantId = await getDefaultTenantId();
  const curriculums = await listCurriculums(tenantId, {});

  return <PortalCurriculumClient curriculums={curriculums} />;
}

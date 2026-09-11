import { requirePermission, hasPermission } from "@/features/identity/server";
import { RESEARCH_P, getProjects, getPublications } from "@/features/research/server";
import { ResearchClient } from "./_components/research-client";

export default async function ResearchPage() {
  const ctx = await requirePermission(RESEARCH_P.researchRead);
  
  const projects = await getProjects(ctx);
  const publications = await getPublications(ctx);

  const canWrite = hasPermission(ctx, RESEARCH_P.researchWrite);
  const canManage = hasPermission(ctx, RESEARCH_P.researchManage);

  return (
    <ResearchClient 
      initialProjects={projects} 
      initialPublications={publications}
      canWrite={canWrite}
      canManage={canManage}
    />
  );
}

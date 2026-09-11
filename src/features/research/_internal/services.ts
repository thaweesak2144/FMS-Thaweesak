import { prisma as db } from "@/shared/lib/infra/prisma";
import type { SessionContext } from "@/features/identity/server";
import { createProjectSchema, updateProjectSchema, createPublicationSchema } from "./validations";
import { z } from "zod";

export async function getProjects(ctx: SessionContext) {
  return db.researchProject.findMany({
    where: { tenantId: ctx.tenantId },
    include: {
      principal: { select: { firstNameTh: true, lastNameTh: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProject(ctx: SessionContext, data: z.infer<typeof createProjectSchema>) {
  const parsed = createProjectSchema.parse(data);
  
  // Find current user's personnel profile
  const profile = await db.personnelProfile.findFirst({
    where: { userId: ctx.userId, tenantId: ctx.tenantId }
  });
  if (!profile) throw new Error("Personnel profile required to create research");

  return db.researchProject.create({
    data: {
      ...parsed,
      tenantId: ctx.tenantId,
      principalId: profile.id,
    },
  });
}

export async function updateProject(ctx: SessionContext, data: z.infer<typeof updateProjectSchema>) {
  const parsed = updateProjectSchema.parse(data);
  return db.researchProject.update({
    where: { id: parsed.id, tenantId: ctx.tenantId },
    data: {
      titleTh: parsed.titleTh,
      titleEn: parsed.titleEn,
      abstractTh: parsed.abstractTh,
      abstractEn: parsed.abstractEn,
      researchType: parsed.researchType,
      budget: parsed.budget,
      fundingSource: parsed.fundingSource,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      keywords: parsed.keywords,
      status: parsed.status,
    },
  });
}

export async function deleteProject(ctx: SessionContext, id: string) {
  return db.researchProject.delete({
    where: { id, tenantId: ctx.tenantId },
  });
}

export async function getPublications(ctx: SessionContext) {
  return db.publication.findMany({
    where: { tenantId: ctx.tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPublication(ctx: SessionContext, data: z.infer<typeof createPublicationSchema>) {
  const parsed = createPublicationSchema.parse(data);
  return db.publication.create({
    data: {
      ...parsed,
      tenantId: ctx.tenantId,
    },
  });
}

export async function deletePublication(ctx: SessionContext, id: string) {
  return db.publication.delete({
    where: { id, tenantId: ctx.tenantId },
  });
}

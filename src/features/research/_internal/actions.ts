"use server";

import { requirePermission } from "@/features/identity/server";
import { runAction } from "@/shared/lib/result";
import { RESEARCH_P } from "../permissions";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getPublications,
  createPublication,
  deletePublication,
} from "./services";
import { createProjectSchema, updateProjectSchema, createPublicationSchema } from "./validations";
import { z } from "zod";

export async function getProjectsAction() {
  const ctx = await requirePermission(RESEARCH_P.researchRead);
  return runAction(() => getProjects(ctx));
}

export async function createProjectAction(data: z.infer<typeof createProjectSchema>) {
  const ctx = await requirePermission(RESEARCH_P.researchWrite);
  return runAction(() => createProject(ctx, data));
}

export async function updateProjectAction(data: z.infer<typeof updateProjectSchema>) {
  const ctx = await requirePermission(RESEARCH_P.researchWrite); // Should also verify ownership or manage perm inside service
  return runAction(() => updateProject(ctx, data));
}

export async function deleteProjectAction(id: string) {
  const ctx = await requirePermission(RESEARCH_P.researchManage);
  return runAction(() => deleteProject(ctx, id));
}

export async function getPublicationsAction() {
  const ctx = await requirePermission(RESEARCH_P.researchRead);
  return runAction(() => getPublications(ctx));
}

export async function createPublicationAction(data: z.infer<typeof createPublicationSchema>) {
  const ctx = await requirePermission(RESEARCH_P.researchWrite);
  return runAction(() => createPublication(ctx, data));
}

export async function deletePublicationAction(id: string) {
  const ctx = await requirePermission(RESEARCH_P.researchManage);
  return runAction(() => deletePublication(ctx, id));
}

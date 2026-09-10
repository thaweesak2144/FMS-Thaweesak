"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { CURRICULUM_P } from "../permissions";
import {
  curriculumSchema,
  updateCurriculumSchema,
  curriculumPlanSchema,
  updateCurriculumPlanSchema,
} from "./validations";
import {
  listCurriculums,
  getCurriculumById,
  createCurriculum,
  updateCurriculum,
  toggleCurriculumActive,
  deleteCurriculum,
  listCurriculumPlans,
  createCurriculumPlan,
  updateCurriculumPlan,
  deleteCurriculumPlan,
  type CurriculumDto,
  type CurriculumPlanDto,
  type CurriculumFilter,
} from "./services";

// ---------------- Curriculum Actions ----------------

export async function getCurriculumsAction(filter?: CurriculumFilter): Promise<ActionResult<CurriculumDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumRead);
    return listCurriculums(ctx.tenantId, filter);
  });
}

export async function getCurriculumDetailAction(id: string): Promise<ActionResult<CurriculumDto | null>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumRead);
    return getCurriculumById(ctx.tenantId, id);
  });
}

export async function createCurriculumAction(input: unknown): Promise<ActionResult<CurriculumDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumWrite);
    const parsed = curriculumSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await createCurriculum(ctx.tenantId, parsed);
    revalidatePath("/curriculum");
    revalidatePath("/portal/curriculum");
    return res;
  });
}

export async function updateCurriculumAction(input: unknown): Promise<ActionResult<CurriculumDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumWrite);
    const parsed = updateCurriculumSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await updateCurriculum(ctx.tenantId, parsed);
    revalidatePath("/curriculum");
    revalidatePath(`/curriculum/${res.id}/plan`);
    revalidatePath("/portal/curriculum");
    revalidatePath(`/portal/curriculum/${res.id}`);
    return res;
  });
}

export async function toggleCurriculumActiveAction(id: string): Promise<ActionResult<boolean>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumWrite);
    const res = await toggleCurriculumActive(ctx.tenantId, id);
    revalidatePath("/curriculum");
    revalidatePath("/portal/curriculum");
    return res;
  });
}

export async function deleteCurriculumAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumDelete);
    await deleteCurriculum(ctx.tenantId, id);
    revalidatePath("/curriculum");
    revalidatePath("/portal/curriculum");
  });
}

// ---------------- Study Plan Actions ----------------

export async function getCurriculumPlansAction(curriculumId: string): Promise<ActionResult<CurriculumPlanDto[]>> {
  return runAction(async () => {
    await requirePermission(CURRICULUM_P.curriculumRead);
    return listCurriculumPlans(curriculumId);
  });
}

export async function createCurriculumPlanAction(input: unknown): Promise<ActionResult<CurriculumPlanDto>> {
  return runAction(async () => {
    await requirePermission(CURRICULUM_P.curriculumManage);
    const parsed = curriculumPlanSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await createCurriculumPlan(parsed);
    revalidatePath(`/curriculum/${parsed.curriculumId}/plan`);
    revalidatePath(`/portal/curriculum/${parsed.curriculumId}`);
    return res;
  });
}

export async function updateCurriculumPlanAction(input: unknown): Promise<ActionResult<CurriculumPlanDto>> {
  return runAction(async () => {
    await requirePermission(CURRICULUM_P.curriculumManage);
    const parsed = updateCurriculumPlanSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await updateCurriculumPlan(parsed);
    revalidatePath(`/curriculum/${parsed.curriculumId}/plan`);
    revalidatePath(`/portal/curriculum/${parsed.curriculumId}`);
    return res;
  });
}

export async function deleteCurriculumPlanAction(curriculumId: string, id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    await requirePermission(CURRICULUM_P.curriculumManage);
    await deleteCurriculumPlan(id);
    revalidatePath(`/curriculum/${curriculumId}/plan`);
    revalidatePath(`/portal/curriculum/${curriculumId}`);
  });
}

"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { PERSONNEL_P } from "../permissions";
import {
  departmentSchema,
  updateDepartmentSchema,
  personnelSchema,
  updatePersonnelSchema,
} from "./validations";
import {
  listDepartments,
  listDepartmentCurriculums,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listPersonnel,
  getPersonnelById,
  createPersonnel,
  updatePersonnel,
  togglePersonnelActive,
  deletePersonnel,
  type DepartmentDto,
  type DepartmentCurriculumSummaryDto,
  type PersonnelDto,
  type PersonnelFilter,
} from "./services";

// ---------------- Department Actions ----------------

export async function getDepartmentsAction(): Promise<ActionResult<DepartmentDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelRead);
    return listDepartments(ctx.tenantId);
  });
}

export async function createDepartmentAction(input: unknown): Promise<ActionResult<DepartmentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.departmentManage);
    const parsed = departmentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createDepartment(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath("/personnel/departments");
    revalidatePath("/portal/personnel");
    return result;
  });
}

export async function updateDepartmentAction(input: unknown): Promise<ActionResult<DepartmentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.departmentManage);
    const parsed = updateDepartmentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateDepartment(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath("/personnel/departments");
    revalidatePath("/portal/personnel");
    return result;
  });
}

export async function getDepartmentCurriculumsAction(departmentId: string): Promise<ActionResult<DepartmentCurriculumSummaryDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelRead);
    return listDepartmentCurriculums(ctx.tenantId, departmentId);
  });
}

export async function deleteDepartmentAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.departmentManage);
    await deleteDepartment(ctx.tenantId, id);
    revalidatePath("/personnel");
    revalidatePath("/personnel/departments");
    revalidatePath("/curriculum");
    revalidatePath("/portal/personnel");
  });
}

// ---------------- Personnel Actions ----------------

export async function getPersonnelListAction(filter?: PersonnelFilter): Promise<ActionResult<PersonnelDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelRead);
    return listPersonnel(ctx.tenantId, filter);
  });
}

export async function getPersonnelDetailAction(id: string): Promise<ActionResult<PersonnelDto | null>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelRead);
    return getPersonnelById(ctx.tenantId, id);
  });
}

export async function createPersonnelAction(input: unknown): Promise<ActionResult<PersonnelDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelWrite);
    const parsed = personnelSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createPersonnel(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath("/portal/personnel");
    return result;
  });
}

export async function updatePersonnelAction(input: unknown): Promise<ActionResult<PersonnelDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelWrite);
    const parsed = updatePersonnelSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updatePersonnel(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath(`/personnel/${result.id}`);
    revalidatePath("/portal/personnel");
    revalidatePath(`/portal/personnel/${result.id}`);
    return result;
  });
}

export async function togglePersonnelActiveAction(id: string): Promise<ActionResult<boolean>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelWrite);
    const active = await togglePersonnelActive(ctx.tenantId, id);
    revalidatePath("/personnel");
    revalidatePath("/portal/personnel");
    return active;
  });
}

export async function deletePersonnelAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelDelete);
    await deletePersonnel(ctx.tenantId, id);
    revalidatePath("/personnel");
    revalidatePath("/portal/personnel");
  });
}

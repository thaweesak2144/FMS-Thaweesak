"use server";

import { requirePermission } from "@/features/identity/server";
import { runAction } from "@/shared/lib/result";
import { ADMISSION_P } from "../permissions";
import {
  getRounds,
  createRound,
  updateRound,
  deleteRound,
  getRoundDetails,
  createApplication,
  reviewApplication,
} from "./services";
import { createRoundSchema, updateRoundSchema, createAppSchema, updateAppSchema } from "./validations";
import { z } from "zod";

export async function getRoundsAction() {
  const ctx = await requirePermission(ADMISSION_P.admissionRead);
  return runAction(() => getRounds(ctx));
}

export async function createRoundAction(data: z.infer<typeof createRoundSchema>) {
  const ctx = await requirePermission(ADMISSION_P.admissionManage);
  return runAction(() => createRound(ctx, data));
}

export async function updateRoundAction(data: z.infer<typeof updateRoundSchema>) {
  const ctx = await requirePermission(ADMISSION_P.admissionManage);
  return runAction(() => updateRound(ctx, data));
}

export async function deleteRoundAction(id: string) {
  const ctx = await requirePermission(ADMISSION_P.admissionManage);
  return runAction(() => deleteRound(ctx, id));
}

export async function getRoundDetailsAction(id: string) {
  const ctx = await requirePermission(ADMISSION_P.admissionRead);
  return runAction(() => getRoundDetails(ctx, id));
}

export async function createApplicationAction(data: z.infer<typeof createAppSchema>) {
  const ctx = await requirePermission(ADMISSION_P.admissionWrite);
  return runAction(() => createApplication(ctx, data));
}

export async function reviewApplicationAction(data: z.infer<typeof updateAppSchema>) {
  const ctx = await requirePermission(ADMISSION_P.admissionReview);
  return runAction(() => reviewApplication(ctx, data));
}

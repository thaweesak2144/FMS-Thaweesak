"use server";

import { requirePermission } from "@/features/identity/server";
import { runAction } from "@/shared/lib/result";
import { PETITION_P } from "../permissions";
import {
  getPetitionTypes,
  createPetitionType,
  getPetitions,
  submitPetition,
  processPetition,
} from "./services";
import { createPetitionTypeSchema, submitPetitionSchema, processPetitionSchema } from "./validations";
import { z } from "zod";

export async function getPetitionTypesAction() {
  const ctx = await requirePermission(PETITION_P.petitionRead);
  return runAction(() => getPetitionTypes(ctx));
}

export async function createPetitionTypeAction(data: z.infer<typeof createPetitionTypeSchema>) {
  const ctx = await requirePermission(PETITION_P.petitionManage);
  return runAction(() => createPetitionType(ctx, data));
}

export async function getPetitionsAction() {
  const ctx = await requirePermission(PETITION_P.petitionRead);
  return runAction(() => getPetitions(ctx));
}

export async function submitPetitionAction(data: z.infer<typeof submitPetitionSchema>) {
  const ctx = await requirePermission(PETITION_P.petitionSubmit);
  return runAction(() => submitPetition(ctx, data));
}

export async function processPetitionAction(data: z.infer<typeof processPetitionSchema>) {
  const ctx = await requirePermission(PETITION_P.petitionProcess);
  return runAction(() => processPetition(ctx, data));
}

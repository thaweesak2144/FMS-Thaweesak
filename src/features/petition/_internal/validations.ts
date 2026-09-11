import { z } from "zod";
import { PetitionActionType } from "@/generated/prisma";

export const createPetitionTypeSchema = z.object({
  code: z.string().min(1),
  nameTh: z.string().min(1),
  nameEn: z.string().min(1),
  description: z.string().optional(),
  slaDays: z.number().default(3),
  isActive: z.boolean().default(true),
});

export const submitPetitionSchema = z.object({
  petitionTypeId: z.string().uuid(),
  studentName: z.string().optional(),
  studentIdCard: z.string().optional(),
  formData: z.record(z.string(), z.any()),
});

export const processPetitionSchema = z.object({
  petitionId: z.string().uuid(),
  action: z.nativeEnum(PetitionActionType),
  comment: z.string().optional(),
});

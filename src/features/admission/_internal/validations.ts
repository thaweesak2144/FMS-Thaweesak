import { z } from "zod";
import { AdmissionRoundStatus, ApplicationStatus } from "@/generated/prisma";

export const createRoundSchema = z.object({
  nameTh: z.string().min(1, "Name TH required"),
  nameEn: z.string().min(1, "Name EN required"),
  academicYear: z.number().int().min(2500, "Invalid academic year"),
  curriculumId: z.string().uuid("Invalid curriculum ID"),
  openDate: z.date().optional(),
  closeDate: z.date().optional(),
  announceDate: z.date().optional(),
  quota: z.number().int().min(0, "Quota must be >= 0").default(0),
  status: z.nativeEnum(AdmissionRoundStatus).default("UPCOMING"),
  requirements: z.any().optional(), // Could be more strictly typed JSON structure
});

export const updateRoundSchema = createRoundSchema.extend({
  id: z.string().uuid(),
});

export const createAppSchema = z.object({
  roundId: z.string().uuid(),
  applicantNameTh: z.string().min(1),
  applicantNameEn: z.string().min(1),
  idCard: z.string().min(13).max(13),
  email: z.string().email(),
  phone: z.string().min(9),
  score: z.number().optional(),
  documentsMeta: z.any().optional(),
});

export const updateAppSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(ApplicationStatus),
  score: z.number().optional(),
  reviewerNote: z.string().optional(),
});

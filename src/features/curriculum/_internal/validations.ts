import { z } from "zod";

export const curriculumSchema = z.object({
  code: z.string().min(1).max(50),
  nameTh: z.string().min(1).max(255),
  nameEn: z.string().min(1).max(255),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "DOCTORAL", "CERTIFICATE"]).default("BACHELOR"),
  departmentId: z.string().uuid(),
  totalCredits: z.number().int().min(1),
  curriculumYear: z.number().int().min(2500).max(2600),
  philosophyTh: z.string().nullable().optional(),
  philosophyEn: z.string().nullable().optional(),
  careerProspectsTh: z.string().nullable().optional(),
  careerProspectsEn: z.string().nullable().optional(),
  tuitionFee: z.number().int().nullable().optional(),
  studyPeriodYears: z.number().int().min(1).max(8).default(4),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateCurriculumSchema = curriculumSchema.extend({
  id: z.string().uuid(),
});

export const curriculumPlanSchema = z.object({
  curriculumId: z.string().uuid(),
  academicYear: z.number().int().min(1).max(8),
  semester: z.number().int().min(1).max(3),
  courseCode: z.string().min(1).max(50),
  courseNameTh: z.string().min(1).max(200),
  courseNameEn: z.string().min(1).max(200),
  credits: z.number().int().min(1).max(20),
  courseType: z.string().min(1).max(50),
  sortOrder: z.number().int().default(0),
});

export const updateCurriculumPlanSchema = curriculumPlanSchema.extend({
  id: z.string().uuid(),
});

export type CreateCurriculumInput = z.infer<typeof curriculumSchema>;
export type UpdateCurriculumInput = z.infer<typeof updateCurriculumSchema>;
export type CreateCurriculumPlanInput = z.infer<typeof curriculumPlanSchema>;
export type UpdateCurriculumPlanInput = z.infer<typeof updateCurriculumPlanSchema>;

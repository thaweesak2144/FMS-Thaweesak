import { z } from "zod";

export const departmentSchema = z.object({
  code: z.string().min(1).max(50),
  nameTh: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateDepartmentSchema = departmentSchema.extend({
  id: z.string().uuid(),
});

export const educationItemSchema = z.object({
  degree: z.string().min(1).max(100),
  major: z.string().min(1).max(200),
  institution: z.string().min(1).max(300),
  graduationYear: z.number().int().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const personnelSchema = z.object({
  employeeCode: z.string().min(1).max(50),
  titleTh: z.string().min(1).max(50),
  titleEn: z.string().min(1).max(50),
  firstNameTh: z.string().min(1).max(100),
  lastNameTh: z.string().min(1).max(100),
  firstNameEn: z.string().min(1).max(100),
  lastNameEn: z.string().min(1).max(100),
  positionTh: z.string().min(1).max(200),
  positionEn: z.string().min(1).max(200),
  academicRank: z.string().max(100).nullable().optional(),
  departmentId: z.string().uuid(),
  personnelType: z.enum(["FULL_TIME", "PART_TIME", "EXTERNAL"]).default("FULL_TIME"),
  email: z.string().email(),
  phone: z.string().max(50).nullable().optional(),
  photoUrl: z.string().max(500).nullable().optional(),
  bioTh: z.string().nullable().optional(),
  bioEn: z.string().nullable().optional(),
  expertiseTags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  educations: z.array(educationItemSchema).default([]),
});

export const updatePersonnelSchema = personnelSchema.extend({
  id: z.string().uuid(),
});

export type CreateDepartmentInput = z.infer<typeof departmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type EducationItemInput = z.infer<typeof educationItemSchema>;
export type CreatePersonnelInput = z.infer<typeof personnelSchema>;
export type UpdatePersonnelInput = z.infer<typeof updatePersonnelSchema>;

import { z } from "zod";
import { ResearchType, ResearchStatus, PublicationType, Quartile, ResearchRole } from "@/generated/prisma";

export const createProjectSchema = z.object({
  titleTh: z.string().min(1),
  titleEn: z.string().optional(),
  abstractTh: z.string().optional(),
  abstractEn: z.string().optional(),
  researchType: z.nativeEnum(ResearchType),
  budget: z.number().optional(),
  fundingSource: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  keywords: z.array(z.string()).default([]),
});

export const updateProjectSchema = createProjectSchema.extend({
  id: z.string().uuid(),
  status: z.nativeEnum(ResearchStatus).optional(),
});

export const createPublicationSchema = z.object({
  title: z.string().min(1),
  authors: z.array(z.string()),
  journalName: z.string().optional(),
  publicationType: z.nativeEnum(PublicationType),
  doi: z.string().optional(),
  publishedYear: z.number().optional(),
  quartile: z.nativeEnum(Quartile).optional(),
  fileUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  projectId: z.string().uuid().optional(),
});

export const updatePublicationSchema = createPublicationSchema.extend({
  id: z.string().uuid(),
});

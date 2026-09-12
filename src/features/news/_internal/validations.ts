import { z } from "zod";

export const newsCategorySchema = z.object({
  code: z.string().min(1).max(50),
  nameTh: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  slug: z.string().min(1).max(120),
  sortOrder: z.number().int().default(0),
});

export const updateNewsCategorySchema = newsCategorySchema.extend({
  id: z.string().uuid(),
});

export const newsAttachmentSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url().max(500),
  fileSize: z.number().int().nullable().optional(),
});

export const newsPostSchema = z.object({
  titleTh: z.string().min(1).max(500),
  titleEn: z.string().min(1).max(500),
  slug: z.string().min(1).max(600),
  bodyTh: z.string().min(1),
  bodyEn: z.string().min(1),
  excerptTh: z.string().nullable().optional(),
  excerptEn: z.string().nullable().optional(),
  coverImageUrl: z.string().url().max(500).nullable().optional(),
  categoryId: z.string().uuid(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isPinned: z.boolean().default(false),
  attachments: z.array(newsAttachmentSchema).default([]),
});

export const updateNewsPostSchema = newsPostSchema.extend({
  id: z.string().uuid(),
});

export const generateNewsAiSchema = z.object({
  titleTh: z.string().trim().min(1, "กรุณาระบุหัวข้อข่าวภาษาไทย"),
  excerptTh: z.string().trim().optional(),
  bodyTh: z.string().trim().min(1, "กรุณาระบุเนื้อหาข่าวภาษาไทย"),
});

export type CreateNewsCategoryInput = z.infer<typeof newsCategorySchema>;
export type UpdateNewsCategoryInput = z.infer<typeof updateNewsCategorySchema>;
export type NewsAttachmentInput = z.infer<typeof newsAttachmentSchema>;
export type CreateNewsPostInput = z.infer<typeof newsPostSchema>;
export type UpdateNewsPostInput = z.infer<typeof updateNewsPostSchema>;
export type GenerateNewsAiInput = z.infer<typeof generateNewsAiSchema>;

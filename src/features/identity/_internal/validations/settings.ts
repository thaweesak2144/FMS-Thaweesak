import { z } from "zod";
import { PALETTE_IDS } from "@/shared/lib/palette";

export const smtpSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  service: z.enum(["gmail", "custom"]).default("gmail"),
  host: z.string().trim().default("smtp.gmail.com"),
  port: z.coerce.number().int().default(465),
  secure: z.boolean().default(true),
  user: z.string().trim().default(""),
  pass: z.string().default(""),
  from: z.string().trim().default(""),
});

export const testSmtpSchema = z.object({
  host: z.string().trim().min(1),
  port: z.coerce.number().int().min(1).max(65535),
  secure: z.boolean(),
  user: z.string().trim().min(1),
  pass: z.string().min(1),
  from: z.string().trim().default(""),
  testTo: z.string().trim().email(),
});

export const contactSettingsSchema = z.object({
  address: z.string().trim().max(1000).default(""),
  phone: z.string().trim().max(100).default(""),
  email: z.string().trim().max(255).default(""),
  officeHours: z.string().trim().max(255).default(""),
  facebookUrl: z.string().trim().max(500).default(""),
  lineUrl: z.string().trim().max(500).default(""),
  youtubeUrl: z.string().trim().max(500).default(""),
  mapUrl: z.string().trim().max(1000).default(""),
});

export const updateSettingsSchema = z.object({
  nameTh: z.string().trim().min(1).max(255),
  nameEn: z.string().trim().min(1).max(255),
  logoUrl: z.string().trim().max(500).or(z.literal("")).default(""),
  palette: z.enum(PALETTE_IDS),
  smtp: smtpSettingsSchema.optional(),
  contact: contactSettingsSchema.optional(),
});
export const updateProfileSchema = z.object({ name: z.string().trim().min(1).max(255), locale: z.enum(["th", "en"]) });
export type SmtpSettingsInput = z.infer<typeof smtpSettingsSchema>;
export type TestSmtpInput = z.infer<typeof testSmtpSchema>;
export type ContactSettingsInput = z.infer<typeof contactSettingsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;


import { z } from "zod";

export const documentTypeSchema = z.object({
  code: z.string().min(1, "Required"),
  nameTh: z.string().min(1, "Required"),
  nameEn: z.string().min(1, "Required"),
  approvalSteps: z.array(z.object({
    step: z.number().int().positive(),
    roleCode: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
  })).default([]),
});
export type CreateDocumentTypeInput = z.infer<typeof documentTypeSchema>;

export const updateDocumentTypeSchema = documentTypeSchema.extend({
  id: z.string().uuid(),
});
export type UpdateDocumentTypeInput = z.infer<typeof updateDocumentTypeSchema>;

export const documentSchema = z.object({
  documentTypeId: z.string().uuid("Required"),
  title: z.string().min(1, "Required"),
  metadata: z.record(z.string(), z.any()).default({}),
});
export type CreateDocumentInput = z.infer<typeof documentSchema>;

export const approveDocumentSchema = z.object({
  documentId: z.string().uuid(),
  action: z.enum(["APPROVED", "REJECTED", "RETURNED"]),
  comment: z.string().optional(),
}).refine(data => {
  if (data.action !== "APPROVED" && (!data.comment || data.comment.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Comment is required when rejecting or returning",
  path: ["comment"],
});
export type ApproveDocumentInput = z.infer<typeof approveDocumentSchema>;

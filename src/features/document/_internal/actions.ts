"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { DOCUMENT_P } from "../permissions";
import {
  documentTypeSchema,
  updateDocumentTypeSchema,
  documentSchema,
  approveDocumentSchema,
} from "./validations";
import {
  listDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  createDocument,
  submitDocument,
  cancelDocument,
  processDocumentApproval,
  type DocumentTypeDto,
  type DocumentDto,
} from "./services";

export async function listDocumentTypesAction(): Promise<ActionResult<DocumentTypeDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentManage);
    return listDocumentTypes(ctx.tenantId);
  });
}

export async function createDocumentTypeAction(input: unknown): Promise<ActionResult<DocumentTypeDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentManage);
    const parsed = documentTypeSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await createDocumentType(ctx.tenantId, parsed);
    revalidatePath("/document/types");
    return res;
  });
}

export async function updateDocumentTypeAction(input: unknown): Promise<ActionResult<DocumentTypeDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentManage);
    const parsed = updateDocumentTypeSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await updateDocumentType(ctx.tenantId, parsed);
    revalidatePath("/document/types");
    return res;
  });
}

export async function deleteDocumentTypeAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentManage);
    await deleteDocumentType(ctx.tenantId, id);
    revalidatePath("/document/types");
  });
}

export async function createDocumentAction(input: unknown): Promise<ActionResult<DocumentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentWrite);
    const parsed = documentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await createDocument(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/document");
    return res;
  });
}

export async function submitDocumentAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentWrite);
    await submitDocument(ctx.tenantId, id);
    revalidatePath("/document");
    revalidatePath(`/document/${id}`);
  });
}

export async function cancelDocumentAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentWrite);
    await cancelDocument(ctx.tenantId, id);
    revalidatePath("/document");
    revalidatePath(`/document/${id}`);
  });
}

export async function approveDocumentAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOCUMENT_P.documentApprove);
    const parsed = approveDocumentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await processDocumentApproval(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/document");
    revalidatePath(`/document/${parsed.documentId}`);
  });
}

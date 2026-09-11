import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import type {
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
  CreateDocumentInput,
  ApproveDocumentInput,
} from "./validations";

export interface DocumentTypeDto {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  approvalSteps: unknown;
  createdAt: string;
}

export interface DocumentDto {
  id: string;
  docNumber: string;
  documentTypeId: string;
  documentTypeNameTh?: string;
  title: string;
  createdById: string;
  createdByName?: string;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  currentStep: number;
  metadata: Prisma.JsonValue;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getDefaultTenantId(): Promise<string> {
  const tenant = await prisma.tenant.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!tenant) throw new Error("No active tenant found");
  return tenant.id;
}

// -- Document Types --

export async function listDocumentTypes(tenantId: string): Promise<DocumentTypeDto[]> {
  const types = await prisma.documentType.findMany({
    where: { tenantId },
    orderBy: { createdAt: "asc" },
  });
  return types.map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function createDocumentType(tenantId: string, input: CreateDocumentTypeInput): Promise<DocumentTypeDto> {
  const created = await prisma.documentType.create({
    data: {
      tenantId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      approvalSteps: input.approvalSteps,
    },
  });
  return { ...created, createdAt: created.createdAt.toISOString() };
}

export async function updateDocumentType(tenantId: string, input: UpdateDocumentTypeInput): Promise<DocumentTypeDto> {
  const updated = await prisma.documentType.update({
    where: { id: input.id, tenantId },
    data: {
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      approvalSteps: input.approvalSteps,
    },
  });
  return { ...updated, createdAt: updated.createdAt.toISOString() };
}

export async function deleteDocumentType(tenantId: string, id: string): Promise<void> {
  await prisma.documentType.delete({
    where: { id, tenantId },
  });
}

// -- Documents --

export async function listDocuments(tenantId: string): Promise<DocumentDto[]> {
  const docs = await prisma.document.findMany({
    where: { tenantId },
    include: {
      documentType: true,
      createdBy: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return docs.map(d => ({
    id: d.id,
    docNumber: d.docNumber,
    documentTypeId: d.documentTypeId,
    documentTypeNameTh: d.documentType.nameTh,
    title: d.title,
    createdById: d.createdById,
    createdByName: d.createdBy.name,
    status: d.status,
    currentStep: d.currentStep,
    metadata: d.metadata,
    submittedAt: d.submittedAt?.toISOString() ?? null,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));
}

export async function getDocumentById(tenantId: string, id: string) {
  const doc = await prisma.document.findFirst({
    where: { id, tenantId },
    include: {
      documentType: true,
      createdBy: true,
      approvals: {
        include: { approver: true },
        orderBy: { actionAt: "asc" },
      },
    },
  });
  if (!doc) return null;
  return {
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    submittedAt: doc.submittedAt?.toISOString() ?? null,
    approvals: doc.approvals.map(a => ({
      ...a,
      actionAt: a.actionAt.toISOString(),
    })),
  };
}

export type DocumentDetailDto = NonNullable<Awaited<ReturnType<typeof getDocumentById>>>;

export async function createDocument(tenantId: string, userId: string, input: CreateDocumentInput): Promise<DocumentDto> {
  // Generate docNumber DOC-YYYY-MMDD-XXXX
  const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, "");
  const count = await prisma.document.count({ where: { tenantId, createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } });
  const docNumber = `DOC-${dateStr}-${String(count + 1).padStart(4, "0")}`;

  const doc = await prisma.document.create({
    data: {
      tenantId,
      docNumber,
      documentTypeId: input.documentTypeId,
      title: input.title,
      createdById: userId,
      status: "DRAFT",
      currentStep: 1,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });

  return {
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    submittedAt: null,
  };
}

export async function submitDocument(tenantId: string, id: string): Promise<void> {
  await prisma.document.update({
    where: { id, tenantId },
    data: {
      status: "PENDING",
      submittedAt: new Date(),
    },
  });
}

export async function cancelDocument(tenantId: string, id: string): Promise<void> {
  await prisma.document.update({
    where: { id, tenantId },
    data: {
      status: "CANCELLED",
    },
  });
}

export async function processDocumentApproval(tenantId: string, userId: string, input: ApproveDocumentInput): Promise<void> {
  const doc = await prisma.document.findFirst({
    where: { id: input.documentId, tenantId },
    include: { documentType: true },
  });
  if (!doc) throw new Error("Document not found");
  if (doc.status !== "PENDING") throw new Error("Document is not pending");

  const steps = (doc.documentType.approvalSteps as Array<{ step: number }>) ?? [];
  const currentStepDef = steps.find(s => s.step === doc.currentStep);
  if (!currentStepDef) throw new Error("Invalid current step");

  // Record approval
  await prisma.documentApproval.create({
    data: {
      documentId: doc.id,
      step: doc.currentStep,
      approverId: userId,
      action: input.action,
      comment: input.comment,
    },
  });

  if (input.action === "REJECTED") {
    await prisma.document.update({
      where: { id: doc.id },
      data: { status: "REJECTED" },
    });
  } else if (input.action === "RETURNED") {
    await prisma.document.update({
      where: { id: doc.id },
      data: { status: "DRAFT", currentStep: 1 }, // return to author
    });
  } else if (input.action === "APPROVED") {
    const nextStep = doc.currentStep + 1;
    const hasNextStep = steps.some(s => s.step === nextStep);
    
    if (hasNextStep) {
      await prisma.document.update({
        where: { id: doc.id },
        data: { currentStep: nextStep },
      });
    } else {
      await prisma.document.update({
        where: { id: doc.id },
        data: { status: "APPROVED" },
      });
    }
  }
}

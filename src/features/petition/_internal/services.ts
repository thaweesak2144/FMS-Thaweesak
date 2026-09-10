import { prisma as db } from "@/shared/lib/infra/prisma";
import type { SessionContext } from "@/features/identity/_internal/session";
import { createPetitionTypeSchema, submitPetitionSchema, processPetitionSchema } from "./validations";
import { z } from "zod";
import { PetitionStatus } from "@/generated/prisma";

export async function getPetitionTypes(ctx: SessionContext) {
  return db.petitionType.findMany({
    where: { tenantId: ctx.tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPetitionType(ctx: SessionContext, data: z.infer<typeof createPetitionTypeSchema>) {
  const parsed = createPetitionTypeSchema.parse(data);
  return db.petitionType.create({
    data: {
      ...parsed,
      tenantId: ctx.tenantId,
    },
  });
}

export async function getPetitions(ctx: SessionContext) {
  return db.petition.findMany({
    where: { tenantId: ctx.tenantId },
    include: {
      petitionType: true,
      student: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyPetitions(ctx: SessionContext) {
  return db.petition.findMany({
    where: { tenantId: ctx.tenantId, studentId: ctx.userId },
    include: { petitionType: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function submitPetition(ctx: SessionContext, data: z.infer<typeof submitPetitionSchema>) {
  const parsed = submitPetitionSchema.parse(data);

  const type = await db.petitionType.findUnique({ where: { id: parsed.petitionTypeId } });
  if (!type) throw new Error("Petition type not found");

  const count = await db.petition.count({ where: { tenantId: ctx.tenantId } });
  const yearMonth = new Date().toISOString().slice(0, 7).replace("-", ""); // YYYYMM
  const petitionNumber = `PET-${yearMonth}-${String(count + 1).padStart(4, "0")}`;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + type.slaDays);

  return db.petition.create({
    data: {
      tenantId: ctx.tenantId,
      petitionNumber,
      petitionTypeId: parsed.petitionTypeId,
      studentId: ctx.userId,
      studentName: parsed.studentName,
      studentIdCard: parsed.studentIdCard,
      formData: parsed.formData as any,
      status: "SUBMITTED",
      dueDate,
      submittedAt: new Date(),
    },
  });
}

export async function processPetition(ctx: SessionContext, data: z.infer<typeof processPetitionSchema>) {
  const parsed = processPetitionSchema.parse(data);

  const petition = await db.petition.findUnique({
    where: { id: parsed.petitionId, tenantId: ctx.tenantId },
  });
  if (!petition) throw new Error("Petition not found");

  let newStatus = petition.status;
  if (parsed.action === "APPROVED") {
    newStatus = "APPROVED";
  } else if (parsed.action === "REJECTED") {
    newStatus = "REJECTED";
  } else if (parsed.action === "COMMENTED") {
    newStatus = "IN_REVIEW";
  } else if (parsed.action === "FORWARDED") {
    newStatus = "IN_REVIEW";
  }

  const [updated, actionRecord] = await db.$transaction([
    db.petition.update({
      where: { id: petition.id },
      data: { status: newStatus },
    }),
    db.petitionAction.create({
      data: {
        petitionId: petition.id,
        actorId: ctx.userId!,
        action: parsed.action,
        comment: parsed.comment,
      },
    }),
  ]);

  return updated;
}

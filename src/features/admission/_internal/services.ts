import { prisma as db } from "@/shared/lib/infra/prisma";
import type { SessionContext } from "@/features/identity/server";
import { createRoundSchema, updateRoundSchema, createAppSchema, updateAppSchema } from "./validations";
import { z } from "zod";

function generateAppNumber(year: number, count: number): string {
  const pad = count.toString().padStart(5, "0");
  return `APP-${year}-${pad}`;
}

export async function getRounds(ctx: SessionContext) {
  return db.admissionRound.findMany({
    where: { tenantId: ctx.tenantId },
    include: {
      curriculum: {
        select: { nameTh: true, nameEn: true },
      },
      _count: {
        select: { applications: true },
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createRound(ctx: SessionContext, data: z.infer<typeof createRoundSchema>) {
  const parsed = createRoundSchema.parse(data);
  return db.admissionRound.create({
    data: {
      ...parsed,
      tenantId: ctx.tenantId,
    },
  });
}

export async function updateRound(ctx: SessionContext, data: z.infer<typeof updateRoundSchema>) {
  const parsed = updateRoundSchema.parse(data);
  return db.admissionRound.update({
    where: { id: parsed.id, tenantId: ctx.tenantId },
    data: {
      nameTh: parsed.nameTh,
      nameEn: parsed.nameEn,
      academicYear: parsed.academicYear,
      curriculumId: parsed.curriculumId,
      openDate: parsed.openDate,
      closeDate: parsed.closeDate,
      announceDate: parsed.announceDate,
      quota: parsed.quota,
      status: parsed.status,
      requirements: parsed.requirements ?? {},
    },
  });
}

export async function deleteRound(ctx: SessionContext, id: string) {
  return db.admissionRound.delete({
    where: { id, tenantId: ctx.tenantId },
  });
}

export async function getRoundDetails(ctx: SessionContext, roundId: string) {
  const round = await db.admissionRound.findUnique({
    where: { id: roundId, tenantId: ctx.tenantId },
    include: {
      curriculum: { select: { nameTh: true, nameEn: true } },
    }
  });
  if (!round) throw new Error("Round not found");

  const applications = await db.admissionApplication.findMany({
    where: { roundId, tenantId: ctx.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return { round, applications };
}

export async function createApplication(ctx: SessionContext, data: z.infer<typeof createAppSchema>) {
  const parsed = createAppSchema.parse(data);
  
  // Verify round
  const round = await db.admissionRound.findUnique({
    where: { id: parsed.roundId, tenantId: ctx.tenantId },
  });
  if (!round) throw new Error("Round not found");

  return db.$transaction(async (tx: any) => {
    // Generate app number
    const count = await tx.admissionApplication.count({
      where: { tenantId: ctx.tenantId, round: { academicYear: round.academicYear } }
    });
    const appNumber = generateAppNumber(round.academicYear, count + 1);

    return tx.admissionApplication.create({
      data: {
        ...parsed,
        appNumber,
        tenantId: ctx.tenantId,
        documentsMeta: parsed.documentsMeta ?? {},
      },
    });
  });
}

export async function reviewApplication(ctx: SessionContext, data: z.infer<typeof updateAppSchema>) {
  const parsed = updateAppSchema.parse(data);
  return db.admissionApplication.update({
    where: { id: parsed.id, tenantId: ctx.tenantId },
    data: {
      status: parsed.status,
      score: parsed.score,
      reviewerNote: parsed.reviewerNote,
      reviewerId: ctx.userId,
    },
  });
}

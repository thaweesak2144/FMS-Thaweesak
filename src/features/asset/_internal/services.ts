import { prisma as db } from "@/shared/lib/infra/prisma";
import type { SessionContext } from "@/features/identity/server";
import { createLocationSchema, createAssetSchema, transferAssetSchema } from "./validations";
import { z } from "zod";

export async function getLocations(ctx: SessionContext) {
  return db.assetLocation.findMany({
    where: { tenantId: ctx.tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createLocation(ctx: SessionContext, data: z.infer<typeof createLocationSchema>) {
  const parsed = createLocationSchema.parse(data);
  return db.assetLocation.create({
    data: { ...parsed, tenantId: ctx.tenantId },
  });
}

export async function getCategories(ctx: SessionContext) {
  return db.assetCategory.findMany({
    where: { tenantId: ctx.tenantId },
  });
}

export async function getAssets(ctx: SessionContext) {
  return db.asset.findMany({
    where: { tenantId: ctx.tenantId },
    include: {
      location: true,
      category: true,
      custodian: { select: { firstNameTh: true, lastNameTh: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAsset(ctx: SessionContext, data: z.infer<typeof createAssetSchema>) {
  const parsed = createAssetSchema.parse(data);
  return db.asset.create({
    data: {
      ...parsed,
      tenantId: ctx.tenantId,
      status: "ACTIVE",
      condition: "GOOD",
    },
  });
}

export async function transferAsset(ctx: SessionContext, data: z.infer<typeof transferAssetSchema>) {
  const parsed = transferAssetSchema.parse(data);

  const asset = await db.asset.findUnique({
    where: { id: parsed.assetId, tenantId: ctx.tenantId },
  });
  if (!asset) throw new Error("Asset not found");

  const [updated] = await db.$transaction([
    db.asset.update({
      where: { id: asset.id },
      data: {
        locationId: parsed.toLocationId,
        custodianId: parsed.toCustodianId,
      },
    }),
    db.assetTransfer.create({
      data: {
        assetId: asset.id,
        fromLocationId: asset.locationId,
        toLocationId: parsed.toLocationId,
        fromCustodianId: asset.custodianId,
        toCustodianId: parsed.toCustodianId,
        transferredById: ctx.userId!,
        reason: parsed.reason,
      },
    }),
  ]);

  return updated;
}

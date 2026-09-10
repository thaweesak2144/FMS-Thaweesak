import { z } from "zod";
import { AssetStatus, AssetCondition } from "@/generated/prisma";

export const createLocationSchema = z.object({
  name: z.string().min(1),
  building: z.string().min(1),
  floor: z.string().min(1),
  room: z.string().min(1),
});

export const createAssetSchema = z.object({
  assetNumber: z.string().min(1),
  name: z.string().min(1),
  categoryId: z.string().uuid(),
  locationId: z.string().uuid(),
  custodianId: z.string().uuid(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchasePrice: z.number().optional(),
});

export const transferAssetSchema = z.object({
  assetId: z.string().uuid(),
  toLocationId: z.string().uuid(),
  toCustodianId: z.string().uuid(),
  reason: z.string().optional(),
});

"use server";

import { requirePermission } from "@/features/identity/server";
import { runAction } from "@/shared/lib/result";
import { ASSET_P } from "../permissions";
import {
  getLocations,
  createLocation,
  getAssets,
  createAsset,
  transferAsset,
} from "./services";
import { createLocationSchema, createAssetSchema, transferAssetSchema } from "./validations";
import { z } from "zod";

export async function getLocationsAction() {
  const ctx = await requirePermission(ASSET_P.assetRead);
  return runAction(() => getLocations(ctx));
}

export async function createLocationAction(data: z.infer<typeof createLocationSchema>) {
  const ctx = await requirePermission(ASSET_P.assetManage);
  return runAction(() => createLocation(ctx, data));
}

export async function getAssetsAction() {
  const ctx = await requirePermission(ASSET_P.assetRead);
  return runAction(() => getAssets(ctx));
}

export async function createAssetAction(data: z.infer<typeof createAssetSchema>) {
  const ctx = await requirePermission(ASSET_P.assetWrite);
  return runAction(() => createAsset(ctx, data));
}

export async function transferAssetAction(data: z.infer<typeof transferAssetSchema>) {
  const ctx = await requirePermission(ASSET_P.assetTransfer);
  return runAction(() => transferAsset(ctx, data));
}

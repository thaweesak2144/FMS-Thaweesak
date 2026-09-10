import type { Asset, AssetLocation, AssetCategory } from "@/generated/prisma";

export * from "./permissions";
export * from "./_internal/services";
export * from "./_internal/validations";

export type AssetDto = Asset & {
  location?: AssetLocation;
  category?: AssetCategory;
  custodian?: { firstNameTh: string; lastNameTh: string };
};

export type AssetLocationDto = AssetLocation;
export type AssetCategoryDto = AssetCategory;

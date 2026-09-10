import { requirePermission, hasPermission } from "@/features/identity/server";
import { ASSET_P, getAssets, getLocations, getCategories } from "@/features/asset/server";
import { listPersonnel } from "@/features/personnel/server";
import { AssetClient } from "./_components/asset-client";

export default async function AssetPage() {
  const ctx = await requirePermission(ASSET_P.assetRead);
  
  const assets = await getAssets(ctx);
  const locations = await getLocations(ctx);
  const categories = await getCategories(ctx);
  
  const custodians = await listPersonnel(ctx.tenantId, {});

  const canWrite = hasPermission(ctx, ASSET_P.assetWrite);
  const canTransfer = hasPermission(ctx, ASSET_P.assetTransfer);
  const canManage = hasPermission(ctx, ASSET_P.assetManage);

  return (
    <AssetClient 
      initialAssets={assets as any} 
      locations={locations as any}
      categories={categories as any}
      custodians={custodians as any}
      canWrite={canWrite}
      canTransfer={canTransfer}
      canManage={canManage}
    />
  );
}

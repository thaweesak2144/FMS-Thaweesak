import type { PermissionDef } from "@/shared/lib/permission-def";

export const ASSET_P = {
  assetRead: "asset:read",
  assetWrite: "asset:write",
  assetTransfer: "asset:transfer",
  assetDispose: "asset:dispose",
  assetManage: "asset:manage",
} as const;

export const ASSET_PERMISSIONS: readonly PermissionDef[] = [
  { code: ASSET_P.assetRead, module: "asset", action: "read", description: "ดูรายการครุภัณฑ์" },
  { code: ASSET_P.assetWrite, module: "asset", action: "write", description: "เพิ่ม/แก้ไขครุภัณฑ์" },
  { code: ASSET_P.assetTransfer, module: "asset", action: "transfer", description: "โอนย้ายครุภัณฑ์" },
  { code: ASSET_P.assetDispose, module: "asset", action: "dispose", description: "จำหน่ายครุภัณฑ์" },
  { code: ASSET_P.assetManage, module: "asset", action: "manage", description: "จัดการหมวดหมู่และสถานที่" },
];

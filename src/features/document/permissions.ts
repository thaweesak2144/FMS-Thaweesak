import type { PermissionDef } from "@/shared/lib/permission-def";

export const DOCUMENT_P = {
  documentRead: "document:read",
  documentWrite: "document:write",
  documentApprove: "document:approve",
  documentManage: "document:manage",
} as const;

export const DOCUMENT_PERMISSIONS: readonly PermissionDef[] = [
  { code: DOCUMENT_P.documentRead, module: "document", action: "read", description: "ดูเอกสารทั้งหมด" },
  { code: DOCUMENT_P.documentWrite, module: "document", action: "write", description: "สร้างและส่งเอกสาร" },
  { code: DOCUMENT_P.documentApprove, module: "document", action: "approve", description: "อนุมัติ/ปฏิเสธเอกสาร" },
  { code: DOCUMENT_P.documentManage, module: "document", action: "manage", description: "จัดการประเภทเอกสารและการตั้งค่า" },
];

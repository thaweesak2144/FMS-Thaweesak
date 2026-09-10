import type { PermissionDef } from "@/shared/lib/permission-def";

export const PETITION_P = {
  petitionRead: "petition:read",
  petitionSubmit: "petition:submit",
  petitionProcess: "petition:process",
  petitionApprove: "petition:approve",
  petitionManage: "petition:manage",
} as const;

export const PETITION_PERMISSIONS: readonly PermissionDef[] = [
  { code: PETITION_P.petitionRead, module: "petition", action: "read", description: "ดูข้อมูลคำร้อง" },
  { code: PETITION_P.petitionSubmit, module: "petition", action: "submit", description: "ยื่นคำร้อง" },
  { code: PETITION_P.petitionProcess, module: "petition", action: "process", description: "ดำเนินการ/ส่งต่อคำร้อง" },
  { code: PETITION_P.petitionApprove, module: "petition", action: "approve", description: "อนุมัติ/ปฏิเสธคำร้อง" },
  { code: PETITION_P.petitionManage, module: "petition", action: "manage", description: "จัดการประเภทคำร้องทั้งหมด" },
];

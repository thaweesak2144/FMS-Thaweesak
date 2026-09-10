import type { PermissionDef } from "@/shared/lib/permission-def";

export const ADMISSION_P = {
  admissionRead: "admission:read",
  admissionWrite: "admission:write",
  admissionReview: "admission:review",
  admissionManage: "admission:manage",
} as const;

export const ADMISSION_PERMISSIONS: readonly PermissionDef[] = [
  { code: ADMISSION_P.admissionRead, module: "admission", action: "read", description: "ดูข้อมูลการรับสมัคร" },
  { code: ADMISSION_P.admissionWrite, module: "admission", action: "write", description: "ส่งใบสมัคร/จัดการใบสมัครของตนเอง" },
  { code: ADMISSION_P.admissionReview, module: "admission", action: "review", description: "ตรวจและประเมินใบสมัคร" },
  { code: ADMISSION_P.admissionManage, module: "admission", action: "manage", description: "จัดการรอบการรับสมัครและเกณฑ์" },
];

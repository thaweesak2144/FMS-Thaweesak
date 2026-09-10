import type { PermissionDef } from "@/shared/lib/permission-def";

export const PERSONNEL_P = {
  personnelRead: "personnel:read",
  personnelWrite: "personnel:write",
  personnelDelete: "personnel:delete",
  departmentManage: "personnel:department:manage",
} as const;

export const PERSONNEL_PERMISSIONS: readonly PermissionDef[] = [
  { code: PERSONNEL_P.personnelRead, module: "personnel", action: "read", description: "ดูข้อมูลบุคลากร" },
  { code: PERSONNEL_P.personnelWrite, module: "personnel", action: "write", description: "เพิ่ม/แก้ไขข้อมูลบุคลากร" },
  { code: PERSONNEL_P.personnelDelete, module: "personnel", action: "delete", description: "ลบข้อมูลบุคลากร" },
  { code: PERSONNEL_P.departmentManage, module: "personnel", action: "manage_dept", description: "จัดการภาควิชา/หน่วยงาน" },
];

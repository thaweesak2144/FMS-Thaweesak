import type { PermissionDef } from "@/shared/lib/permission-def";

export const CURRICULUM_P = {
  curriculumRead: "curriculum:read",
  curriculumWrite: "curriculum:write",
  curriculumManage: "curriculum:manage",
  curriculumDelete: "curriculum:delete",
} as const;

export const CURRICULUM_PERMISSIONS: readonly PermissionDef[] = [
  { code: CURRICULUM_P.curriculumRead, module: "curriculum", action: "read", description: "ดูข้อมูลหลักสูตร" },
  { code: CURRICULUM_P.curriculumWrite, module: "curriculum", action: "write", description: "เพิ่ม/แก้ไขหลักสูตร" },
  { code: CURRICULUM_P.curriculumManage, module: "curriculum", action: "manage_plan", description: "จัดการแผนการเรียนรายวิชา" },
  { code: CURRICULUM_P.curriculumDelete, module: "curriculum", action: "delete", description: "ลบหลักสูตร" },
];

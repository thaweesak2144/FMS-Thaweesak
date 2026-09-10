import type { PermissionDef } from "@/shared/lib/permission-def";

export const RESEARCH_P = {
  researchRead: "research:read",
  researchWrite: "research:write",
  researchApprove: "research:approve",
  researchManage: "research:manage",
} as const;

export const RESEARCH_PERMISSIONS: readonly PermissionDef[] = [
  { code: RESEARCH_P.researchRead, module: "research", action: "read", description: "ดูงานวิจัยและบทความ" },
  { code: RESEARCH_P.researchWrite, module: "research", action: "write", description: "เสนอโครงการ/เพิ่มบทความ" },
  { code: RESEARCH_P.researchApprove, module: "research", action: "approve", description: "อนุมัติโครงการวิจัย" },
  { code: RESEARCH_P.researchManage, module: "research", action: "manage", description: "จัดการงานวิจัยและบทความทั้งหมด" },
];

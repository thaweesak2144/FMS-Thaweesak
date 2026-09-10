import type { PermissionDef } from "@/shared/lib/permission-def";
import { IDENTITY_PERMISSIONS } from "@/features/identity/permissions";
import { SAMPLE_PERMISSIONS } from "@/features/sample/permissions";
import { PERSONNEL_PERMISSIONS } from "@/features/personnel/permissions";
import { NEWS_PERMISSIONS } from "@/features/news/permissions";
import { CURRICULUM_PERMISSIONS } from "@/features/curriculum/permissions";
import { DOCUMENT_PERMISSIONS } from "@/features/document/permissions";
import { ADMISSION_PERMISSIONS } from "@/features/admission/permissions";
import { RESEARCH_PERMISSIONS } from "@/features/research/permissions";
import { PETITION_PERMISSIONS } from "@/features/petition/permissions";
import { ASSET_PERMISSIONS } from "@/features/asset/permissions";

/** สิทธิ์ทั้งระบบ — feature ใหม่เพิ่มบรรทัดที่นี่ · seed เขียนลง permissions ทุกครั้ง */
export const ALL_PERMISSIONS: readonly PermissionDef[] = [
  ...IDENTITY_PERMISSIONS,
  ...SAMPLE_PERMISSIONS,
  ...PERSONNEL_PERMISSIONS,
  ...NEWS_PERMISSIONS,
  ...CURRICULUM_PERMISSIONS,
  ...DOCUMENT_PERMISSIONS,
  ...ADMISSION_PERMISSIONS,
  ...RESEARCH_PERMISSIONS,
  ...PETITION_PERMISSIONS,
  ...ASSET_PERMISSIONS,
];

const codes = ALL_PERMISSIONS.map((p) => p.code);
if (new Set(codes).size !== codes.length) throw new Error("permission code ซ้ำใน ALL_PERMISSIONS");

import type { PermissionDef } from "@/shared/lib/permission-def";

export const NEWS_P = {
  newsRead: "news:read",
  newsWrite: "news:write",
  newsPublish: "news:publish",
  newsDelete: "news:delete",
  categoryManage: "news:category:manage",
} as const;

export const NEWS_PERMISSIONS: readonly PermissionDef[] = [
  { code: NEWS_P.newsRead, module: "news", action: "read", description: "ดูรายการข่าวสาร" },
  { code: NEWS_P.newsWrite, module: "news", action: "write", description: "สร้างและแก้ไขเนื้อหาข่าว" },
  { code: NEWS_P.newsPublish, module: "news", action: "publish", description: "เผยแพร่ข่าวและจัดเก็บ" },
  { code: NEWS_P.newsDelete, module: "news", action: "delete", description: "ลบข่าวสาร" },
  { code: NEWS_P.categoryManage, module: "news", action: "category_manage", description: "จัดการหมวดหมู่ข่าว" },
];

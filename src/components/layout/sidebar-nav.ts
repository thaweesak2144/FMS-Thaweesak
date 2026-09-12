import { LayoutDashboard, Users, Settings, Layers, UserCheck, Newspaper, GraduationCap, FileText, UserPlus, FileQuestion, Package, type LucideIcon } from "lucide-react";
import { hasPermission, P } from "@/features/identity";
import { SAMPLE_P } from "@/features/sample";
import { PERSONNEL_P } from "@/features/personnel";
import { NEWS_P } from "@/features/news";
import { CURRICULUM_P } from "@/features/curriculum";
import { DOCUMENT_P } from "@/features/document/permissions";
import { ADMISSION_P } from "@/features/admission/permissions";

export interface NavItem {
  /** i18n key */
  title: string;
  href: string;
  icon?: LucideIcon;
  /** ต้องมีสิทธิ์นี้ถึงเห็น — ไม่มี = ทุกคนที่ login เห็น */
  permission?: string;
  children?: NavItem[];
}
export interface NavGroup { label: string; items: NavItem[] }
export interface NavCrumb { title: string; href: string }

export const sidebarGroups: NavGroup[] = [
  { label: "nav.group.overview", items: [{ title: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    label: "curriculum.nav",
    items: [
      {
        title: "curriculum.nav",
        href: "/curriculum",
        icon: GraduationCap,
        permission: CURRICULUM_P.curriculumRead,
        children: [
          { title: "curriculum.nav.departments", href: "/personnel/departments", permission: CURRICULUM_P.curriculumRead },
          { title: "curriculum.nav.list", href: "/curriculum", permission: CURRICULUM_P.curriculumRead },
        ],
      },
    ],
  },
  {
    label: "admission.nav",
    items: [
      {
        title: "admission.nav",
        href: "/admission",
        icon: UserPlus,
        permission: ADMISSION_P.admissionRead,
        children: [
          { title: "admission.nav.list", href: "/admission", permission: ADMISSION_P.admissionRead },
        ],
      },
    ],
  },
  {
    label: "research.nav",
    items: [
      {
        title: "research.nav",
        href: "/research",
        icon: FileText,
        permission: "research:read",
        children: [
          { title: "research.nav.projects", href: "/research", permission: "research:read" },
        ],
      },
    ],
  },
  {
    label: "petition.nav",
    items: [
      {
        title: "petition.nav",
        href: "/petition",
        icon: FileQuestion,
        permission: "petition:read",
        children: [
          { title: "petition.nav", href: "/petition", permission: "petition:read" },
        ],
      },
    ],
  },
  {
    label: "asset.nav",
    items: [
      {
        title: "asset.nav",
        href: "/asset",
        icon: Package,
        permission: "asset:read",
        children: [
          { title: "asset.nav", href: "/asset", permission: "asset:read" },
        ],
      },
    ],
  },
  {
    label: "document.nav",
    items: [
      {
        title: "document.nav",
        href: "/document",
        icon: FileText,
        permission: DOCUMENT_P.documentRead,
        children: [
          { title: "document.title", href: "/document", permission: DOCUMENT_P.documentRead },
          { title: "document.type.title", href: "/document/types", permission: DOCUMENT_P.documentManage },
        ],
      },
    ],
  },
  {
    label: "news.nav",
    items: [
      {
        title: "news.nav",
        href: "/news",
        icon: Newspaper,
        permission: NEWS_P.newsRead,
        children: [
          { title: "news.nav.list", href: "/news", permission: NEWS_P.newsRead },
          { title: "news.nav.categories", href: "/news/categories", permission: NEWS_P.categoryManage },
        ],
      },
    ],
  },
  {
    label: "personnel.nav",
    items: [
      {
        title: "personnel.nav",
        href: "/personnel",
        icon: UserCheck,
        permission: PERSONNEL_P.personnelRead,
      },
    ],
  },
  {
    label: "nav.group.sample",
    items: [{ title: "sample.nav", href: "/sample", icon: Layers, permission: SAMPLE_P.sampleRead }],
  },
  {
    label: "nav.group.users",
    items: [{
      title: "nav.users", href: "/users", icon: Users, permission: P.usersRead,
      children: [
        { title: "nav.users", href: "/users", permission: P.usersRead },
        { title: "users.importExport.nav", href: "/users/import-export", permission: P.usersManage },
        { title: "nav.roles", href: "/users/roles", permission: P.rolesManage },
      ],
    }],
  },
  { label: "nav.group.settings", items: [{ title: "nav.settings", href: "/settings", icon: Settings, permission: P.settingsManage }] },
];

type Ctx = Parameters<typeof hasPermission>[0];

function visibleItem(item: NavItem, ctx: Ctx): NavItem | null {
  if (item.permission && !hasPermission(ctx, item.permission)) return null;
  if (!item.children) return item;
  const children = item.children.filter((c) => !c.permission || hasPermission(ctx, c.permission));
  return children.length ? { ...item, children } : null;
}

export function visibleGroups(ctx: Ctx): NavGroup[] {
  return sidebarGroups
    .map((g) => ({ ...g, items: g.items.map((i) => visibleItem(i, ctx)).filter((i): i is NavItem => i !== null) }))
    .filter((g) => g.items.length > 0);
}

/** สายเมนูสำหรับ breadcrumb — จับ href ที่ยาวที่สุดที่ตรง (ลูกชนะแม่) */
export function getActiveNavChain(pathname: string): NavCrumb[] {
  let best: { parent: NavItem | null; item: NavItem } | null = null;
  const consider = (item: NavItem, parent: NavItem | null) => {
    if (pathname === item.href || pathname.startsWith(item.href + "/")) {
      if (!best || item.href.length > best.item.href.length || (item.href.length === best.item.href.length && parent)) best = { parent, item };
    }
  };
  for (const g of sidebarGroups) for (const i of g.items) { consider(i, null); for (const c of i.children ?? []) consider(c, i); }
  if (!best) return [];
  const { parent, item } = best as { parent: NavItem | null; item: NavItem };
  const chain: NavCrumb[] = [];
  if (parent && parent.href !== item.href) chain.push({ title: parent.title, href: parent.href });
  chain.push({ title: item.title, href: item.href });
  return chain;
}

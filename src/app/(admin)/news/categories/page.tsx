import { requirePermission } from "@/features/identity/server";
import { NEWS_P, listNewsCategories } from "@/features/news/server";
import { NewsCategoriesClient } from "./_components/categories-client";

export default async function NewsCategoriesPage() {
  const ctx = await requirePermission(NEWS_P.categoryManage);
  const initialItems = await listNewsCategories(ctx.tenantId);
  return <NewsCategoriesClient initialItems={initialItems} />;
}

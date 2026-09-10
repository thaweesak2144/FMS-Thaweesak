import {
  getDefaultTenantId,
  listNewsPosts,
  listNewsCategories,
} from "@/features/news/server";
import { PortalNewsClient } from "./_components/portal-news-client";

export default async function PublicNewsPage() {
  const tenantId = await getDefaultTenantId();
  const [newsList, categories] = await Promise.all([
    listNewsPosts(tenantId, { status: "PUBLISHED" }),
    listNewsCategories(tenantId),
  ]);

  return (
    <PortalNewsClient
      newsList={newsList}
      categories={categories}
    />
  );
}

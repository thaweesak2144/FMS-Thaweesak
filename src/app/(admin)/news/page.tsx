import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  NEWS_P,
  listNewsPosts,
  listNewsCategories,
} from "@/features/news/server";
import { NewsClient } from "./_components/news-client";

export default async function NewsAdminPage() {
  const ctx = await requirePermission(NEWS_P.newsRead);
  const [initialPosts, categories] = await Promise.all([
    listNewsPosts(ctx.tenantId),
    listNewsCategories(ctx.tenantId),
  ]);

  return (
    <NewsClient
      initialPosts={initialPosts}
      categories={categories}
      canWrite={hasPermission(ctx, NEWS_P.newsWrite)}
      canPublish={hasPermission(ctx, NEWS_P.newsPublish)}
      canDelete={hasPermission(ctx, NEWS_P.newsDelete)}
    />
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { NEWS_P } from "../permissions";
import {
  newsCategorySchema,
  updateNewsCategorySchema,
  newsPostSchema,
  updateNewsPostSchema,
} from "./validations";
import {
  listNewsCategories,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
  listNewsPosts,
  getNewsPostById,
  createNewsPost,
  updateNewsPost,
  publishNewsPost,
  archiveNewsPost,
  toggleNewsPostPin,
  deleteNewsPost,
  type NewsCategoryDto,
  type NewsPostDto,
  type NewsFilter,
} from "./services";

// ---------------- Category Actions ----------------

export async function getNewsCategoriesAction(): Promise<ActionResult<NewsCategoryDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsRead);
    return listNewsCategories(ctx.tenantId);
  });
}

export async function createNewsCategoryAction(input: unknown): Promise<ActionResult<NewsCategoryDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.categoryManage);
    const parsed = newsCategorySchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await createNewsCategory(ctx.tenantId, parsed);
    revalidatePath("/news");
    revalidatePath("/news/categories");
    revalidatePath("/portal/news");
    return res;
  });
}

export async function updateNewsCategoryAction(input: unknown): Promise<ActionResult<NewsCategoryDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.categoryManage);
    const parsed = updateNewsCategorySchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await updateNewsCategory(ctx.tenantId, parsed);
    revalidatePath("/news");
    revalidatePath("/news/categories");
    revalidatePath("/portal/news");
    return res;
  });
}

export async function deleteNewsCategoryAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.categoryManage);
    await deleteNewsCategory(ctx.tenantId, id);
    revalidatePath("/news");
    revalidatePath("/news/categories");
    revalidatePath("/portal/news");
  });
}

// ---------------- Post Actions ----------------

export async function getNewsPostsAction(filter?: NewsFilter): Promise<ActionResult<NewsPostDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsRead);
    return listNewsPosts(ctx.tenantId, filter);
  });
}

export async function getNewsPostDetailAction(id: string): Promise<ActionResult<NewsPostDto | null>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsRead);
    return getNewsPostById(ctx.tenantId, id);
  });
}

export async function createNewsPostAction(input: unknown): Promise<ActionResult<NewsPostDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsWrite);
    const parsed = newsPostSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await createNewsPost(ctx.tenantId, ctx.userId ?? null, parsed);
    revalidatePath("/news");
    revalidatePath("/portal/news");
    return res;
  });
}

export async function updateNewsPostAction(input: unknown): Promise<ActionResult<NewsPostDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsWrite);
    const parsed = updateNewsPostSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const res = await updateNewsPost(ctx.tenantId, parsed);
    revalidatePath("/news");
    revalidatePath(`/news/${res.id}`);
    revalidatePath("/portal/news");
    revalidatePath(`/portal/news/${res.slug}`);
    return res;
  });
}

export async function publishNewsPostAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsPublish);
    await publishNewsPost(ctx.tenantId, id);
    revalidatePath("/news");
    revalidatePath("/portal/news");
  });
}

export async function archiveNewsPostAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsPublish);
    await archiveNewsPost(ctx.tenantId, id);
    revalidatePath("/news");
    revalidatePath("/portal/news");
  });
}

export async function toggleNewsPostPinAction(id: string): Promise<ActionResult<boolean>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsWrite);
    const res = await toggleNewsPostPin(ctx.tenantId, id);
    revalidatePath("/news");
    revalidatePath("/portal/news");
    return res;
  });
}

export async function deleteNewsPostAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsDelete);
    await deleteNewsPost(ctx.tenantId, id);
    revalidatePath("/news");
    revalidatePath("/portal/news");
  });
}

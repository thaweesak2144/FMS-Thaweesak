import { prisma } from "@/shared/lib/infra/prisma";
import type {
  CreateNewsCategoryInput,
  UpdateNewsCategoryInput,
  CreateNewsPostInput,
  UpdateNewsPostInput,
} from "./validations";

export interface NewsCategoryDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsAttachmentDto {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
}

export interface NewsPostDto {
  id: string;
  tenantId: string;
  titleTh: string;
  titleEn: string;
  slug: string;
  bodyTh: string;
  bodyEn: string;
  excerptTh: string | null;
  excerptEn: string | null;
  coverImageUrl: string | null;
  categoryId: string;
  categoryNameTh?: string;
  categoryNameEn?: string;
  categorySlug?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isPinned: boolean;
  publishedAt: string | null;
  authorId: string | null;
  authorName?: string | null;
  viewCount: number;
  attachments?: NewsAttachmentDto[];
  createdAt: string;
  updatedAt: string;
}

export async function getDefaultTenantId(): Promise<string> {
  const tenant = await prisma.tenant.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!tenant) throw new Error("No active tenant found");
  return tenant.id;
}

// ---------------- Categories ----------------

export async function listNewsCategories(tenantId: string): Promise<NewsCategoryDto[]> {
  const cats = await prisma.newsCategory.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });

  return cats.map((c) => ({
    id: c.id,
    tenantId: c.tenantId,
    code: c.code,
    nameTh: c.nameTh,
    nameEn: c.nameEn,
    slug: c.slug,
    sortOrder: c.sortOrder,
    postCount: c._count.posts,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function createNewsCategory(tenantId: string, input: CreateNewsCategoryInput): Promise<NewsCategoryDto> {
  const created = await prisma.newsCategory.create({
    data: {
      tenantId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      slug: input.slug,
      sortOrder: input.sortOrder,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    slug: created.slug,
    sortOrder: created.sortOrder,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateNewsCategory(tenantId: string, input: UpdateNewsCategoryInput): Promise<NewsCategoryDto> {
  const updated = await prisma.newsCategory.update({
    where: { id: input.id, tenantId },
    data: {
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      slug: input.slug,
      sortOrder: input.sortOrder,
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    code: updated.code,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    slug: updated.slug,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteNewsCategory(tenantId: string, id: string): Promise<void> {
  await prisma.newsCategory.delete({
    where: { id, tenantId },
  });
}

// ---------------- Posts ----------------

export interface NewsFilter {
  categoryId?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isPinned?: boolean;
  search?: string;
}

export async function listNewsPosts(tenantId: string, filter?: NewsFilter): Promise<NewsPostDto[]> {
  const where: any = { tenantId };

  if (filter?.categoryId) {
    where.categoryId = filter.categoryId;
  }
  if (filter?.status) {
    where.status = filter.status;
  }
  if (filter?.isPinned !== undefined) {
    where.isPinned = filter.isPinned;
  }
  if (filter?.search && filter.search.trim() !== "") {
    const s = filter.search.trim();
    where.OR = [
      { titleTh: { contains: s, mode: "insensitive" } },
      { titleEn: { contains: s, mode: "insensitive" } },
      { excerptTh: { contains: s, mode: "insensitive" } },
      { excerptEn: { contains: s, mode: "insensitive" } },
      { bodyTh: { contains: s, mode: "insensitive" } },
      { bodyEn: { contains: s, mode: "insensitive" } },
    ];
  }

  const posts = await prisma.newsPost.findMany({
    where,
    include: {
      category: true,
      author: {
        select: { name: true },
      },
      attachments: true,
    },
    orderBy: [
      { isPinned: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return posts.map((p) => ({
    id: p.id,
    tenantId: p.tenantId,
    titleTh: p.titleTh,
    titleEn: p.titleEn,
    slug: p.slug,
    bodyTh: p.bodyTh,
    bodyEn: p.bodyEn,
    excerptTh: p.excerptTh,
    excerptEn: p.excerptEn,
    coverImageUrl: p.coverImageUrl,
    categoryId: p.categoryId,
    categoryNameTh: p.category.nameTh,
    categoryNameEn: p.category.nameEn,
    categorySlug: p.category.slug,
    status: p.status,
    isPinned: p.isPinned,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    authorId: p.authorId,
    authorName: p.author?.name ?? null,
    viewCount: p.viewCount,
    attachments: p.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileSize: a.fileSize,
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getNewsPostById(tenantId: string, id: string): Promise<NewsPostDto | null> {
  const p = await prisma.newsPost.findFirst({
    where: { id, tenantId },
    include: {
      category: true,
      author: {
        select: { name: true },
      },
      attachments: true,
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    tenantId: p.tenantId,
    titleTh: p.titleTh,
    titleEn: p.titleEn,
    slug: p.slug,
    bodyTh: p.bodyTh,
    bodyEn: p.bodyEn,
    excerptTh: p.excerptTh,
    excerptEn: p.excerptEn,
    coverImageUrl: p.coverImageUrl,
    categoryId: p.categoryId,
    categoryNameTh: p.category.nameTh,
    categoryNameEn: p.category.nameEn,
    categorySlug: p.category.slug,
    status: p.status,
    isPinned: p.isPinned,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    authorId: p.authorId,
    authorName: p.author?.name ?? null,
    viewCount: p.viewCount,
    attachments: p.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileSize: a.fileSize,
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function getNewsPostBySlug(tenantId: string, slug: string, incrementView = false): Promise<NewsPostDto | null> {
  if (incrementView) {
    await prisma.newsPost.updateMany({
      where: { tenantId, slug },
      data: { viewCount: { increment: 1 } },
    });
  }

  const p = await prisma.newsPost.findFirst({
    where: { tenantId, slug },
    include: {
      category: true,
      author: {
        select: { name: true },
      },
      attachments: true,
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    tenantId: p.tenantId,
    titleTh: p.titleTh,
    titleEn: p.titleEn,
    slug: p.slug,
    bodyTh: p.bodyTh,
    bodyEn: p.bodyEn,
    excerptTh: p.excerptTh,
    excerptEn: p.excerptEn,
    coverImageUrl: p.coverImageUrl,
    categoryId: p.categoryId,
    categoryNameTh: p.category.nameTh,
    categoryNameEn: p.category.nameEn,
    categorySlug: p.category.slug,
    status: p.status,
    isPinned: p.isPinned,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    authorId: p.authorId,
    authorName: p.author?.name ?? null,
    viewCount: p.viewCount,
    attachments: p.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileSize: a.fileSize,
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function createNewsPost(tenantId: string, authorId: string | null, input: CreateNewsPostInput): Promise<NewsPostDto> {
  const publishedAt = input.status === "PUBLISHED" ? new Date() : null;

  const created = await prisma.newsPost.create({
    data: {
      tenantId,
      authorId,
      titleTh: input.titleTh,
      titleEn: input.titleEn,
      slug: input.slug,
      bodyTh: input.bodyTh,
      bodyEn: input.bodyEn,
      excerptTh: input.excerptTh || null,
      excerptEn: input.excerptEn || null,
      coverImageUrl: input.coverImageUrl || null,
      categoryId: input.categoryId,
      status: input.status,
      isPinned: input.isPinned,
      publishedAt,
      attachments: {
        create: (input.attachments || []).map((a) => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileSize: a.fileSize || null,
        })),
      },
    },
    include: {
      category: true,
      author: { select: { name: true } },
      attachments: true,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    titleTh: created.titleTh,
    titleEn: created.titleEn,
    slug: created.slug,
    bodyTh: created.bodyTh,
    bodyEn: created.bodyEn,
    excerptTh: created.excerptTh,
    excerptEn: created.excerptEn,
    coverImageUrl: created.coverImageUrl,
    categoryId: created.categoryId,
    categoryNameTh: created.category.nameTh,
    categoryNameEn: created.category.nameEn,
    categorySlug: created.category.slug,
    status: created.status,
    isPinned: created.isPinned,
    publishedAt: created.publishedAt ? created.publishedAt.toISOString() : null,
    authorId: created.authorId,
    authorName: created.author?.name ?? null,
    viewCount: created.viewCount,
    attachments: created.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileSize: a.fileSize,
    })),
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateNewsPost(tenantId: string, input: UpdateNewsPostInput): Promise<NewsPostDto> {
  const updated = await prisma.$transaction(async (tx) => {
    await tx.newsAttachment.deleteMany({
      where: { postId: input.id },
    });

    const current = await tx.newsPost.findUnique({ where: { id: input.id } });
    let publishedAt = current?.publishedAt;
    if (input.status === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date();
    }

    return tx.newsPost.update({
      where: { id: input.id, tenantId },
      data: {
        titleTh: input.titleTh,
        titleEn: input.titleEn,
        slug: input.slug,
        bodyTh: input.bodyTh,
        bodyEn: input.bodyEn,
        excerptTh: input.excerptTh || null,
        excerptEn: input.excerptEn || null,
        coverImageUrl: input.coverImageUrl || null,
        categoryId: input.categoryId,
        status: input.status,
        isPinned: input.isPinned,
        publishedAt,
        attachments: {
          create: (input.attachments || []).map((a) => ({
            fileName: a.fileName,
            fileUrl: a.fileUrl,
            fileSize: a.fileSize || null,
          })),
        },
      },
      include: {
        category: true,
        author: { select: { name: true } },
        attachments: true,
      },
    });
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    titleTh: updated.titleTh,
    titleEn: updated.titleEn,
    slug: updated.slug,
    bodyTh: updated.bodyTh,
    bodyEn: updated.bodyEn,
    excerptTh: updated.excerptTh,
    excerptEn: updated.excerptEn,
    coverImageUrl: updated.coverImageUrl,
    categoryId: updated.categoryId,
    categoryNameTh: updated.category.nameTh,
    categoryNameEn: updated.category.nameEn,
    categorySlug: updated.category.slug,
    status: updated.status,
    isPinned: updated.isPinned,
    publishedAt: updated.publishedAt ? updated.publishedAt.toISOString() : null,
    authorId: updated.authorId,
    authorName: updated.author?.name ?? null,
    viewCount: updated.viewCount,
    attachments: updated.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileSize: a.fileSize,
    })),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function publishNewsPost(tenantId: string, id: string): Promise<void> {
  await prisma.newsPost.update({
    where: { id, tenantId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
}

export async function archiveNewsPost(tenantId: string, id: string): Promise<void> {
  await prisma.newsPost.update({
    where: { id, tenantId },
    data: { status: "ARCHIVED" },
  });
}

export async function toggleNewsPostPin(tenantId: string, id: string): Promise<boolean> {
  const current = await prisma.newsPost.findFirst({
    where: { id, tenantId },
    select: { isPinned: true },
  });
  if (!current) throw new Error("News post not found");

  const updated = await prisma.newsPost.update({
    where: { id, tenantId },
    data: { isPinned: !current.isPinned },
    select: { isPinned: true },
  });

  return updated.isPinned;
}

export async function deleteNewsPost(tenantId: string, id: string): Promise<void> {
  await prisma.newsPost.delete({
    where: { id, tenantId },
  });
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Tag,
  Download,
  FileText,
  User,
  Share2,
  Newspaper,
} from "lucide-react";
import { getT, getLocale } from "@/i18n/server";
import { formatDate } from "@/shared/lib/format";
import { Button } from "@/components/ui/button";
import {
  getDefaultTenantId,
  getNewsPostBySlug,
  listNewsPosts,
} from "@/features/news/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const tenantId = await getDefaultTenantId();

  // Increment view count when viewing detail
  const post = await getNewsPostBySlug(tenantId, slug, true);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const t = await getT();
  const locale = await getLocale();

  const title = locale === "th" ? post.titleTh : post.titleEn;
  const body = locale === "th" ? post.bodyTh : (post.bodyEn || post.bodyTh);
  const catName = locale === "th" ? post.categoryNameTh : post.categoryNameEn;

  // Fetch 3 related posts in the same category
  const allPosts = await listNewsPosts(tenantId, { categoryId: post.categoryId, status: "PUBLISHED" });
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back to list */}
      <div>
        <Link href="/portal/news">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            {t("portal.news.backToList")}
          </Button>
        </Link>
      </div>

      {/* Main Article Container */}
      <article className="rounded-3xl border bg-card p-6 sm:p-12 shadow-sm space-y-8">
        {/* Meta Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {catName && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {catName}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(new Date(post.publishedAt), locale)}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {post.viewCount} {t("news.post.viewCount")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {title}
          </h1>

          {post.authorName && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
              <User className="h-3.5 w-3.5" />
              <span>{locale === "th" ? "ผู้เผยแพร่:" : "Published by:"} {post.authorName}</span>
            </div>
          )}
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-muted border shadow-sm">
            <img
              src={post.coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt Lead */}
        {(post.excerptTh || post.excerptEn) && (
          <div className="p-4 rounded-xl bg-muted/40 border-l-4 border-primary text-sm sm:text-base font-medium text-foreground/80 italic">
            {locale === "th" ? post.excerptTh : (post.excerptEn || post.excerptTh)}
          </div>
        )}

        {/* Article Body */}
        <div className="text-sm sm:text-base leading-relaxed text-foreground whitespace-pre-line space-y-4">
          {body}
        </div>

        {/* Attachments (if any) */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="border-t pt-6 space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>{t("news.post.attachments")} ({post.attachments.length})</span>
            </h3>
            <div className="divide-y rounded-xl border bg-muted/20">
              {post.attachments.map((att) => (
                <div
                  key={att.id}
                  className="p-3 flex items-center justify-between gap-4 text-xs"
                >
                  <span className="font-medium truncate">{att.fileName}</span>
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-semibold flex-shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related News Section */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {t("portal.news.related")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => {
              const relTitle = locale === "th" ? rel.titleTh : rel.titleEn;
              return (
                <Link
                  key={rel.id}
                  href={`/portal/news/${rel.slug}`}
                  className="group rounded-2xl border bg-card p-4 shadow-sm hover:border-primary/50 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    {rel.publishedAt && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(new Date(rel.publishedAt), locale)}
                      </span>
                    )}
                    <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-primary inline-flex items-center gap-1 group-hover:underline">
                    {t("portal.news.readMore")}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

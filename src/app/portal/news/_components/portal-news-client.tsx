"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Eye, Tag, ArrowRight, Newspaper, Pin } from "lucide-react";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { formatDate } from "@/shared/lib/format";
import type { NewsPostDto, NewsCategoryDto } from "@/features/news";

interface Props {
  newsList: NewsPostDto[];
  categories: NewsCategoryDto[];
}

export function PortalNewsClient({ newsList, categories }: Props) {
  const t = useT();
  const locale = useLocale();

  const [selectedCat, setSelectedCat] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Only published news are shown on portal
  const published = newsList.filter((n) => n.status === "PUBLISHED");
  const pinnedPosts = published.filter((n) => n.isPinned);

  const filtered = published.filter((item) => {
    if (selectedCat !== "ALL" && item.categoryId !== selectedCat) {
      return false;
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const title = `${item.titleTh} ${item.titleEn}`.toLowerCase();
      const excerpt = `${item.excerptTh || ""} ${item.excerptEn || ""}`.toLowerCase();
      const body = `${item.bodyTh} ${item.bodyEn}`.toLowerCase();
      return title.includes(q) || excerpt.includes(q) || body.includes(q);
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {t("portal.news.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("portal.news.subtitle")}
        </p>
      </div>

      {/* Pinned / Featured Banner (if any) */}
      {pinnedPosts.length > 0 && selectedCat === "ALL" && !searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Pin className="h-4 w-4 text-amber-500 rotate-12" />
            <span>{t("portal.news.pinnedSection")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedPosts.slice(0, 2).map((post) => {
              const title = locale === "th" ? post.titleTh : post.titleEn;
              const excerpt = locale === "th" ? (post.excerptTh || post.bodyTh.slice(0, 150)) : (post.excerptEn || post.bodyEn.slice(0, 150));
              const catName = locale === "th" ? post.categoryNameTh : post.categoryNameEn;

              return (
                <Link
                  key={post.id}
                  href={`/portal/news/${post.slug}`}
                  className="group relative rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/50 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary/40">
                        <Newspaper className="h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                        <Pin className="h-3 w-3" />
                        {t("news.post.pinnedBadge")}
                      </span>
                      {catName && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background/90 backdrop-blur shadow-sm">
                          {catName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(new Date(post.publishedAt), locale)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewCount}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Search & Categories Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "th" ? "ค้นหาหัวข้อข่าวสาร, ประกาศ หรือเนื้อหา..." : "Search news, announcements, or content..."}
            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedCat("ALL")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCat === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {t("portal.news.filterAll")} ({published.length})
          </button>
          {categories.map((cat) => {
            const count = published.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCat === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {locale === "th" ? cat.nameTh : cat.nameEn} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* News Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed">
          <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="font-semibold text-base text-foreground">
            {t("portal.news.noNews")}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const title = locale === "th" ? item.titleTh : item.titleEn;
            const excerpt = locale === "th" ? (item.excerptTh || item.bodyTh.slice(0, 120)) : (item.excerptEn || item.bodyEn.slice(0, 120));
            const catName = locale === "th" ? item.categoryNameTh : item.categoryNameEn;

            return (
              <Link
                key={item.id}
                href={`/portal/news/${item.slug}`}
                className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] w-full bg-muted relative overflow-hidden">
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/30">
                        <Newspaper className="h-12 w-12" />
                      </div>
                    )}
                    {catName && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-background/90 backdrop-blur shadow-sm">
                          {catName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      {item.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(new Date(item.publishedAt), locale)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.viewCount}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="border-t pt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">
                      {item.authorName || "Faculty Office"}
                    </span>
                    <span className="font-semibold text-primary inline-flex items-center gap-0.5 group-hover:underline">
                      {t("portal.news.readMore")}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

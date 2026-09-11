"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  Pin,
  PinOff,
  Eye,
  Send,
  Archive,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { formatDate } from "@/shared/lib/format";
import {
  DataTable,
  StatusPill,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonField,
  RowMenuItem,
  type DataTableColumn,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { NewsPostDto, NewsCategoryDto } from "@/features/news";
import { NewsPostStatus } from "@/generated/prisma";
import {
  createNewsPostAction,
  updateNewsPostAction,
  publishNewsPostAction,
  archiveNewsPostAction,
  toggleNewsPostPinAction,
  deleteNewsPostAction,
  getNewsPostsAction,
} from "@/features/news/actions";

interface Props {
  initialPosts: NewsPostDto[];
  categories: NewsCategoryDto[];
  canWrite: boolean;
  canPublish: boolean;
  canDelete: boolean;
}

export function NewsClient({
  initialPosts,
  categories,
  canWrite,
  canPublish,
  canDelete,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const [items, setItems] = useState<NewsPostDto[]>(initialPosts);
  const [isPending, startTransition] = useTransition();

  // Filter states
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState<NewsPostStatus | "">("");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsPostDto | null>(null);
  const [deleteItem, setDeleteItem] = useState<NewsPostDto | null>(null);

  // Form states
  const [formTitleTh, setFormTitleTh] = useState("");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id ?? "");
  const [formStatus, setFormStatus] = useState<NewsPostStatus>(NewsPostStatus.DRAFT);
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formCoverImageUrl, setFormCoverImageUrl] = useState("");
  const [formExcerptTh, setFormExcerptTh] = useState("");
  const [formExcerptEn, setFormExcerptEn] = useState("");
  const [formBodyTh, setFormBodyTh] = useState("");
  const [formBodyEn, setFormBodyEn] = useState("");
  const [formAttachments, setFormAttachments] = useState<Array<{ fileName: string; fileUrl: string }>>([]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormTitleTh("");
    setFormTitleEn("");
    setFormSlug("");
    setFormCategoryId(categories[0]?.id ?? "");
    setFormStatus("DRAFT");
    setFormIsPinned(false);
    setFormCoverImageUrl("");
    setFormExcerptTh("");
    setFormExcerptEn("");
    setFormBodyTh("");
    setFormBodyEn("");
    setFormAttachments([]);
    setModalOpen(true);
  };

  const openEditDialog = (item: NewsPostDto) => {
    setEditingItem(item);
    setFormTitleTh(item.titleTh);
    setFormTitleEn(item.titleEn);
    setFormSlug(item.slug);
    setFormCategoryId(item.categoryId);
    setFormStatus(item.status);
    setFormIsPinned(item.isPinned);
    setFormCoverImageUrl(item.coverImageUrl ?? "");
    setFormExcerptTh(item.excerptTh ?? "");
    setFormExcerptEn(item.excerptEn ?? "");
    setFormBodyTh(item.bodyTh);
    setFormBodyEn(item.bodyEn);
    setFormAttachments(
      (item.attachments ?? []).map((a) => ({
        fileName: a.fileName,
        fileUrl: a.fileUrl,
      }))
    );
    setModalOpen(true);
  };

  const addAttachmentRow = () => {
    setFormAttachments((prev) => [...prev, { fileName: "", fileUrl: "" }]);
  };

  const removeAttachmentRow = (index: number) => {
    setFormAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAttachmentRow = (index: number, field: "fileName" | "fileUrl", value: string) => {
    setFormAttachments((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    if (!formTitleTh.trim() || !formTitleEn.trim() || !formSlug.trim() || !formBodyTh.trim() || !formCategoryId) {
      toast.error(t("common.required"));
      return;
    }

    startTransition(async () => {
      const payload = {
        titleTh: formTitleTh.trim(),
        titleEn: formTitleEn.trim(),
        slug: formSlug.trim().toLowerCase(),
        bodyTh: formBodyTh.trim(),
        bodyEn: formBodyEn.trim() || formBodyTh.trim(),
        excerptTh: formExcerptTh.trim() || null,
        excerptEn: formExcerptEn.trim() || null,
        coverImageUrl: formCoverImageUrl.trim() || null,
        categoryId: formCategoryId,
        status: formStatus,
        isPinned: formIsPinned,
        attachments: formAttachments.filter((a) => a.fileName && a.fileUrl),
      };

      if (editingItem) {
        const res = await updateNewsPostAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          refreshList();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createNewsPostAction(payload);
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          refreshList();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      }
    });
  };

  const handlePublish = (id: string) => {
    startTransition(async () => {
      const res = await publishNewsPostAction(id);
      if (res.ok) {
        toast.success(t("common.saved"));
        refreshList();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleArchive = (id: string) => {
    startTransition(async () => {
      const res = await archiveNewsPostAction(id);
      if (res.ok) {
        toast.success(t("common.saved"));
        refreshList();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleTogglePin = (id: string) => {
    startTransition(async () => {
      const res = await toggleNewsPostPinAction(id);
      if (res.ok) {
        toast.success(t("common.saved"));
        refreshList();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    startTransition(async () => {
      const res = await deleteNewsPostAction(deleteItem.id);
      if (res.ok) {
        toast.success(t("common.deleted"));
        setDeleteItem(null);
        refreshList();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const refreshList = async () => {
    const res = await getNewsPostsAction({
      categoryId: filterCategory || undefined,
      status: filterStatus || undefined,
    });
    if (res.ok) {
      setItems(res.data);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterCategory && item.categoryId !== filterCategory) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  const columns: DataTableColumn<NewsPostDto>[] = [
    {
      key: "title",
      header: t("news.post.titleTh"),
      render: (row) => {
        const title = locale === "th" ? row.titleTh : row.titleEn;
        return (
          <div className="flex items-center gap-3">
            {row.coverImageUrl ? (
              <Image
                src={row.coverImageUrl}
                alt={title}
                width={56}
                height={40}
                unoptimized
                className="h-10 w-14 rounded object-cover border flex-shrink-0"
              />
            ) : (
              <div className="h-10 w-14 rounded bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                <Newspaper className="h-5 w-5 opacity-40" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {row.isPinned && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Pin className="h-2.5 w-2.5" />
                    {t("news.post.pinnedBadge")}
                  </span>
                )}
                <span className="font-semibold text-xs truncate max-w-sm">{title}</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                /{row.slug}
              </div>
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "category",
      header: t("news.post.category"),
      render: (row) => (
        <span className="text-xs font-medium">
          {locale === "th" ? row.categoryNameTh : row.categoryNameEn}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: t("news.post.status"),
      render: (row) => {
        const tone = row.status === "PUBLISHED" ? "ok" : row.status === "DRAFT" ? "warn" : "off";
        return (
          <StatusPill tone={tone}>
            {t(`news.post.status.${row.status}`)}
          </StatusPill>
        );
      },
      sortable: true,
    },
    {
      key: "publishedAt",
      header: t("news.post.publishedAt"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.publishedAt ? formatDate(new Date(row.publishedAt), locale) : "—"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "views",
      header: t("news.post.viewCount"),
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="h-3 w-3" />
          {row.viewCount}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="ph hr flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{t("news.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("news.subtitle")}</p>
        </div>
        {canWrite && (
          <div className="acts ml-auto">
            <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("news.create")}
            </Button>
          </div>
        )}
      </header>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-9 px-3 rounded-md border text-xs bg-background"
        >
          <option value="">{t("news.allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "th" ? c.nameTh : c.nameEn}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as NewsPostStatus | "")}
          className="h-9 px-3 rounded-md border text-xs bg-background"
        >
          <option value="">{t("news.allStatuses")}</option>
          <option value="DRAFT">{t("news.post.status.DRAFT")}</option>
          <option value="PUBLISHED">{t("news.post.status.PUBLISHED")}</option>
          <option value="ARCHIVED">{t("news.post.status.ARCHIVED")}</option>
        </select>
      </div>

      <DataTable
        state={filteredItems.length === 0 ? "empty" : "data"}
        columns={columns}
        rows={filteredItems}
        getRowId={(item) => item.id}
        headHeading={t("news.title")}
        empty={{
          icon: <Newspaper className="h-8 w-8" />,
          title: t("common.noData"),
        }}
        error={{
          icon: <AlertCircle className="h-8 w-8" />,
          title: t("common.error"),
        }}
        renderRowMenu={(row) => (
          <>
            {canWrite && (
              <RowMenuItem
                icon={<Pencil className="h-4 w-4" />}
                onSelect={() => openEditDialog(row)}
              >
                {t("common.edit")}
              </RowMenuItem>
            )}
            {canPublish && row.status !== "PUBLISHED" && (
              <RowMenuItem
                icon={<Send className="h-4 w-4 text-emerald-600" />}
                onSelect={() => handlePublish(row.id)}
              >
                {t("news.publish")}
              </RowMenuItem>
            )}
            {canPublish && row.status === "PUBLISHED" && (
              <RowMenuItem
                icon={<Archive className="h-4 w-4 text-amber-600" />}
                onSelect={() => handleArchive(row.id)}
              >
                {t("news.archive")}
              </RowMenuItem>
            )}
            {canWrite && (
              <RowMenuItem
                icon={row.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4 text-amber-500" />}
                onSelect={() => handleTogglePin(row.id)}
              >
                {t("news.togglePin")}
              </RowMenuItem>
            )}
            {canDelete && (
              <RowMenuItem
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onSelect={() => setDeleteItem(row)}
              >
                {t("common.delete")}
              </RowMenuItem>
            )}
          </>
        )}
      />

      {/* Add / Edit Dialog */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen} wide>
        <LiyonDialogHeader
          title={editingItem ? t("news.edit") : t("news.create")}
          description={t("news.subtitle")}
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Headlines TH / EN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LiyonField label={t("news.post.titleTh")}>
              <input
                value={formTitleTh}
                onChange={(e) => {
                  setFormTitleTh(e.target.value);
                  if (!editingItem && !formSlug) {
                    setFormSlug(e.target.value.toLowerCase().replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, "-"));
                  }
                }}
                placeholder="หัวข้อข่าวประชาสัมพันธ์"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <LiyonField label={t("news.post.titleEn")}>
              <input
                value={formTitleEn}
                onChange={(e) => setFormTitleEn(e.target.value)}
                placeholder="Headline in English"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
          </div>

          {/* Slug & Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LiyonField label={t("news.post.slug")}>
              <input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="url-slug-example"
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              />
            </LiyonField>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("news.post.category")} *
              </label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {locale === "th" ? c.nameTh : c.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("news.post.status")}
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as NewsPostStatus)}
                className="w-full h-9 px-3 rounded-md border text-sm bg-background"
              >
                <option value="DRAFT">{t("news.post.status.DRAFT")}</option>
                <option value="PUBLISHED">{t("news.post.status.PUBLISHED")}</option>
                <option value="ARCHIVED">{t("news.post.status.ARCHIVED")}</option>
              </select>
            </div>
          </div>

          {/* Cover Image URL */}
          <LiyonField label={t("news.post.coverImage")}>
            <input
              value={formCoverImageUrl}
              onChange={(e) => setFormCoverImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-9 px-3 rounded-md border text-sm bg-background"
            />
          </LiyonField>

          {/* Excerpts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("news.post.excerptTh")}
              </label>
              <textarea
                value={formExcerptTh}
                onChange={(e) => setFormExcerptTh(e.target.value)}
                rows={2}
                placeholder="บทคัดย่อหรือย่อหน้านำสั้น ๆ..."
                className="w-full p-2 rounded-md border text-xs bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("news.post.excerptEn")}
              </label>
              <textarea
                value={formExcerptEn}
                onChange={(e) => setFormExcerptEn(e.target.value)}
                rows={2}
                placeholder="Short excerpt or teaser..."
                className="w-full p-2 rounded-md border text-xs bg-background"
              />
            </div>
          </div>

          {/* Full Body Contents */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("news.post.bodyTh")} *
              </label>
              <textarea
                value={formBodyTh}
                onChange={(e) => setFormBodyTh(e.target.value)}
                rows={5}
                placeholder="เนื้อหาข่าวแบบละเอียด (รองรับข้อความหลายย่อหน้า)..."
                className="w-full p-2.5 rounded-md border text-xs bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                {t("news.post.bodyEn")}
              </label>
              <textarea
                value={formBodyEn}
                onChange={(e) => setFormBodyEn(e.target.value)}
                rows={4}
                placeholder="Full content in English..."
                className="w-full p-2.5 rounded-md border text-xs bg-background"
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs">{t("news.post.attachments")}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttachmentRow}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {t("news.post.addAttachment")}
              </Button>
            </div>

            {formAttachments.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">ยังไม่มีเอกสารแนบ</p>
            ) : (
              <div className="space-y-2">
                {formAttachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted/40 rounded border text-xs">
                    <input
                      value={att.fileName}
                      onChange={(e) => updateAttachmentRow(idx, "fileName", e.target.value)}
                      placeholder="ชื่อไฟล์ เช่น ประกาศคณะ.pdf"
                      className="h-8 px-2 rounded border bg-background flex-1"
                    />
                    <input
                      value={att.fileUrl}
                      onChange={(e) => updateAttachmentRow(idx, "fileUrl", e.target.value)}
                      placeholder="https://..."
                      className="h-8 px-2 rounded border bg-background flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachmentRow(idx)}
                      className="h-7 w-7 p-0 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pin Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPinnedCheck"
              checked={formIsPinned}
              onChange={(e) => setFormIsPinned(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isPinnedCheck" className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <Pin className="h-3 w-3" />
              {t("news.post.isPinned")}
            </label>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)} danger>
        <LiyonDialogHeader
          title={t("news.delete")}
          description={t("news.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteItem && (
            <div className="p-3 bg-muted rounded text-sm font-medium">
              {locale === "th" ? deleteItem.titleTh : deleteItem.titleEn}
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteItem(null)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {t("common.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}

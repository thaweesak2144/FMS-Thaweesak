"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, FileText } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  createDocumentAction,
} from "@/features/document/actions";
import type { DocumentDto, DocumentTypeDto } from "@/features/document/server";

interface Props {
  initialDocuments: DocumentDto[];
  types: DocumentTypeDto[];
  canWrite: boolean;
}

export function DocumentClient({ initialDocuments, types, canWrite }: Props) {
  const t = useT();
  const [items, setItems] = useState<DocumentDto[]>(initialDocuments);
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [formTypeId, setFormTypeId] = useState(types[0]?.id ?? "");
  const [formTitle, setFormTitle] = useState("");

  const filtered = items.filter(d => 
    d.docNumber.toLowerCase().includes(search.toLowerCase()) ||
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!formTypeId || !formTitle.trim()) {
      toast.error(t("common.required"));
      return;
    }
    startTransition(async () => {
      const res = await createDocumentAction({
        documentTypeId: formTypeId,
        title: formTitle.trim(),
        metadata: {},
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setModalOpen(false);
        // Typically we'd refresh or redirect
        window.location.href = `/document/${res.data.id}`;
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const getStatusTone = (status: string) => {
    switch (status) {
      case "DRAFT": return "off";
      case "PENDING": return "warn";
      case "APPROVED": return "ok";
      case "REJECTED": return "bad";
      case "CANCELLED": return "bad";
      default: return "info";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("document.title")}</h1>
          <p className="text-muted-foreground">Manage and track documents</p>
        </div>
        <div className="flex items-center gap-2">
          {canWrite && (
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("common.create")}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm">
        <div className="p-4 border-b flex flex-wrap items-center gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder={t("common.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </div>
        </div>

        <DataTable
          state={filtered.length === 0 ? "empty" : "data"}
          rows={filtered}
          getRowId={(d: any) => d.id}
          headHeading={t("document.title")}
          empty={{ icon: <FileText className="h-8 w-8" />, title: t("common.noData") }}
          error={{ icon: <FileText className="h-8 w-8" />, title: t("common.error") }}
          columns={[
            {
              key: "docNumber",
              header: t("document.docNumber"),
              render: (d: any) => (
                <div className="font-mono text-sm font-medium">
                  <Link href={`/document/${d.id}`} className="text-primary hover:underline">
                    {d.docNumber}
                  </Link>
                </div>
              )
            },
            {
              key: "type",
              header: t("document.type.title"),
              render: (d: any) => <div className="text-sm">{d.documentTypeNameTh}</div>
            },
            {
              key: "title",
              header: "Title",
              render: (d: any) => <div className="text-sm">{d.title}</div>
            },
            {
              key: "author",
              header: "Created By",
              render: (d: any) => <div className="text-sm text-muted-foreground">{d.createdByName}</div>
            },
            {
              key: "status",
              header: t("common.status"),
              render: (d: any) => (
                <StatusPill tone={getStatusTone(d.status) as any}>
                  {t(`document.status.${d.status}` as any) || d.status}
                </StatusPill>
              )
            }
          ]}
        />
      </div>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader title={t("common.create")} />
        <div className="p-6 space-y-4">
          <LiyonField label={t("document.type.title")}>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formTypeId}
              onChange={(e) => setFormTypeId(e.target.value)}
            >
              <option value="">{t("common.select")}</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.nameTh}</option>
              ))}
            </select>
          </LiyonField>
          <LiyonField label="Title">
            <input 
              value={formTitle} 
              onChange={(e) => setFormTitle(e.target.value)} 
              placeholder="e.g. Request for equipment purchase"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}

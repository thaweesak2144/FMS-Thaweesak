"use client";

import { useState, useTransition } from "react";
import { Plus, Settings2, Trash2 } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  createDocumentTypeAction,
  updateDocumentTypeAction,
  deleteDocumentTypeAction,
} from "@/features/document/actions";
import type { DocumentTypeDto } from "@/features/document/server";

export function DocumentTypesClient({ initialTypes }: { initialTypes: DocumentTypeDto[] }) {
  const t = useT();
  const items = initialTypes;
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentTypeDto | null>(null);

  const [code, setCode] = useState("");
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [stepsStr, setStepsStr] = useState("[]");

  const openCreate = () => {
    setEditingItem(null);
    setCode("");
    setNameTh("");
    setNameEn("");
    setStepsStr('[\n  {\n    "step": 1,\n    "roleCode": "APPROVER",\n    "description": "หัวหน้าภาคอนุมัติ"\n  }\n]');
    setModalOpen(true);
  };

  const openEdit = (item: DocumentTypeDto) => {
    setEditingItem(item);
    setCode(item.code);
    setNameTh(item.nameTh);
    setNameEn(item.nameEn);
    setStepsStr(JSON.stringify(item.approvalSteps, null, 2));
    setModalOpen(true);
  };

  const handleSave = () => {
    let steps = [];
    try {
      steps = JSON.parse(stepsStr);
    } catch {
      toast.error("Invalid JSON format for approval steps");
      return;
    }

    startTransition(async () => {
      const payload = { code, nameTh, nameEn, approvalSteps: steps };
      if (editingItem) {
        const res = await updateDocumentTypeAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          // Simple client refresh (usually we re-fetch from server action but since items is not state tracked automatically we could just reload)
          window.location.reload();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createDocumentTypeAction(payload);
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          window.location.reload();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await deleteDocumentTypeAction(id);
      if (res.ok) {
        toast.success(t("common.deleted"));
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("document.type.title")}</h1>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("common.create")}
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm">
        <DataTable
          state={items.length === 0 ? "empty" : "data"}
          rows={items}
          getRowId={(d: DocumentTypeDto) => d.id}
          headHeading={t("document.type.title")}
          empty={{ icon: <Settings2 className="h-8 w-8" />, title: t("common.noData") }}
          error={{ icon: <Settings2 className="h-8 w-8" />, title: t("common.error") }}
          columns={[
            {
              key: "code",
              header: "Code",
              render: (d: DocumentTypeDto) => <div className="font-mono text-sm">{d.code}</div>
            },
            {
              key: "nameTh",
              header: "Name (TH)",
              render: (d: DocumentTypeDto) => <div className="text-sm font-medium">{d.nameTh}</div>
            },
            {
              key: "steps",
              header: "Steps",
              render: (d: DocumentTypeDto) => <div className="text-sm text-muted-foreground">{Array.isArray(d.approvalSteps) ? d.approvalSteps.length : 0} steps</div>
            },
            {
              key: "actions",
              header: "",
              render: (d: DocumentTypeDto) => (
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(d)}>
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )
            }
          ]}
        />
      </div>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader title={editingItem ? "Edit Document Type" : "Create Document Type"} />
        <div className="p-6 space-y-4">
          <LiyonField label="Code">
            <input 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="e.g. REQ-01" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Name (TH)">
            <input 
              value={nameTh} 
              onChange={(e) => setNameTh(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Name (EN)">
            <input 
              value={nameEn} 
              onChange={(e) => setNameEn(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Approval Steps (JSON)">
            <textarea 
              value={stepsStr} 
              onChange={(e) => setStepsStr(e.target.value)} 
              className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
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

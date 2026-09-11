"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Settings2, Trash2, Users } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  createRoundAction,
  updateRoundAction,
  deleteRoundAction,
} from "@/features/admission/actions";
import type { AdmissionRoundDto } from "@/features/admission/server";
import { AdmissionRoundStatus } from "@/generated/prisma";

export function AdmissionClient({ 
  initialRounds, 
  curriculums, 
  canManage 
}: { 
  initialRounds: AdmissionRoundDto[];
  curriculums: { id: string; nameTh: string }[];
  canManage: boolean;
}) {
  const t = useT();
  const items = initialRounds;
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdmissionRoundDto | null>(null);

  // Form states
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear() + 543); // default Thai year
  const [curriculumId, setCurriculumId] = useState("");
  const [quota, setQuota] = useState(0);
  const [status, setStatus] = useState<AdmissionRoundStatus>(AdmissionRoundStatus.UPCOMING);

  const openCreate = () => {
    setEditingItem(null);
    setNameTh("");
    setNameEn("");
    setAcademicYear(new Date().getFullYear() + 543);
    setCurriculumId(curriculums[0]?.id || "");
    setQuota(0);
    setStatus("UPCOMING");
    setModalOpen(true);
  };

  const openEdit = (item: AdmissionRoundDto) => {
    setEditingItem(item);
    setNameTh(item.nameTh);
    setNameEn(item.nameEn);
    setAcademicYear(item.academicYear);
    setCurriculumId(item.curriculumId);
    setQuota(item.quota);
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!nameTh || !curriculumId) {
      toast.error(t("common.required"));
      return;
    }
    const payload = {
      nameTh,
      nameEn: nameEn || nameTh,
      academicYear,
      curriculumId,
      quota,
      status,
    };

    startTransition(async () => {
      if (editingItem) {
        const res = await updateRoundAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("common.saved"));
          setModalOpen(false);
          window.location.reload();
        } else {
          toast.error(res.error.message || t("common.error"));
        }
      } else {
        const res = await createRoundAction(payload);
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
      const res = await deleteRoundAction(id);
      if (res.ok) {
        toast.success(t("common.deleted"));
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const getStatusTone = (s: string): "ok" | "warn" | "info" | "neutral" => {
    switch (s) {
      case "OPEN": return "ok";
      case "CLOSED": return "warn";
      case "ANNOUNCED": return "info";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("admission.title")}</h1>
          <p className="text-muted-foreground">{t("admission.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("common.create")}
          </Button>
        )}
      </div>

      <div className="bg-card border rounded-xl shadow-sm">
        <DataTable
          state={items.length === 0 ? "empty" : "data"}
          rows={items}
          getRowId={(d: AdmissionRoundDto) => d.id}
          headHeading={t("admission.title")}
          empty={{ icon: <Users className="h-8 w-8" />, title: t("common.noData") }}
          error={{ icon: <Users className="h-8 w-8" />, title: t("common.error") }}
          columns={[
            {
              key: "name",
              header: t("admission.round.nameTh"),
              render: (d: AdmissionRoundDto) => (
                <div className="font-medium text-sm">
                  <Link href={`/admission/${d.id}`} className="text-primary hover:underline">
                    {d.nameTh}
                  </Link>
                </div>
              )
            },
            {
              key: "year",
              header: t("admission.round.academicYear"),
              render: (d: AdmissionRoundDto) => <div className="text-sm">{d.academicYear}</div>
            },
            {
              key: "curriculum",
              header: t("admission.round.curriculum"),
              render: (d: AdmissionRoundDto) => <div className="text-sm text-muted-foreground">{d.curriculum?.nameTh}</div>
            },
            {
              key: "quota",
              header: t("admission.round.quota"),
              render: (d: AdmissionRoundDto) => <div className="text-sm">{d.quota}</div>
            },
            {
              key: "status",
              header: t("admission.round.status"),
              render: (d: AdmissionRoundDto) => (
                <StatusPill tone={getStatusTone(d.status)}>
                  {d.status}
                </StatusPill>
              )
            },
            {
              key: "actions",
              header: "",
              render: (d: AdmissionRoundDto) => (
                canManage ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(d)}>
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : <span />
              )
            }
          ]}
        />
      </div>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader title={editingItem ? "Edit Admission Round" : "Create Admission Round"} />
        <div className="p-6 space-y-4">
          <LiyonField label={t("admission.round.nameTh")}>
            <input 
              value={nameTh} 
              onChange={(e) => setNameTh(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label={t("admission.round.academicYear")}>
            <input 
              type="number"
              value={academicYear} 
              onChange={(e) => setAcademicYear(Number(e.target.value))} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label={t("admission.round.curriculum")}>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={curriculumId}
              onChange={(e) => setCurriculumId(e.target.value)}
            >
              <option value="">{t("common.select")}</option>
              {curriculums.map(c => (
                <option key={c.id} value={c.id}>{c.nameTh}</option>
              ))}
            </select>
          </LiyonField>
          <LiyonField label={t("admission.round.quota")}>
            <input 
              type="number"
              value={quota} 
              onChange={(e) => setQuota(Number(e.target.value))} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label={t("admission.round.status")}>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={status}
              onChange={(e) => setStatus(e.target.value as AdmissionRoundStatus)}
            >
              <option value="UPCOMING">UPCOMING</option>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
              <option value="ANNOUNCED">ANNOUNCED</option>
            </select>
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

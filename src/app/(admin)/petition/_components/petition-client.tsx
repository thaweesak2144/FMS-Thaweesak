"use client";

import { useState, useTransition } from "react";
import { Plus, Check, X, FileQuestion, MessageSquare } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  processPetitionAction,
  createPetitionTypeAction
} from "@/features/petition/actions";
import type { PetitionDto, PetitionTypeDto } from "@/features/petition/server";

export function PetitionClient({ 
  initialPetitions, 
  types,
  canProcess,
  canApprove,
  canManage 
}: { 
  initialPetitions: PetitionDto[];
  types: PetitionTypeDto[];
  canProcess: boolean;
  canApprove: boolean;
  canManage: boolean;
}) {
  const t = useT();
  const [activeTab, setActiveTab] = useState<"requests" | "types">("requests");
  const [isPending, startTransition] = useTransition();

  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [typeCode, setTypeCode] = useState("");
  const [typeNameTh, setTypeNameTh] = useState("");
  const [typeNameEn, setTypeNameEn] = useState("");
  const [typeSla, setTypeSla] = useState(3);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activePetition, setActivePetition] = useState<PetitionDto | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  const handleSaveType = () => {
    if (!typeCode || !typeNameTh) return toast.error(t("common.required"));
    startTransition(async () => {
      const res = await createPetitionTypeAction({
        code: typeCode,
        nameTh: typeNameTh,
        nameEn: typeNameEn,
        slaDays: typeSla,
        isActive: true,
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setTypeModalOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const openReview = (p: PetitionDto) => {
    setActivePetition(p);
    setReviewComment("");
    setReviewModalOpen(true);
  };

  const handleProcess = (action: "APPROVED" | "REJECTED" | "FORWARDED") => {
    if (!activePetition) return;
    startTransition(async () => {
      const res = await processPetitionAction({
        petitionId: activePetition.id,
        action,
        comment: reviewComment,
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setReviewModalOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const getStatusTone = (s: string): "ok" | "bad" | "warn" | "neutral" => {
    switch (s) {
      case "APPROVED": case "COMPLETED": return "ok";
      case "REJECTED": return "bad";
      case "IN_REVIEW": return "warn";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("petition.title")}</h1>
          <p className="text-muted-foreground">{t("petition.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {canManage && activeTab === "types" && (
            <Button onClick={() => setTypeModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Petition Type
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b">
        <button 
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "requests" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("requests")}
        >
          {t("petition.tab.requests")}
        </button>
        {canManage && (
          <button 
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === "types" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("types")}
          >
            {t("petition.tab.types")}
          </button>
        )}
      </div>

      {activeTab === "requests" && (
        <div className="bg-card border rounded-xl shadow-sm">
          <DataTable
            state={initialPetitions.length === 0 ? "empty" : "data"}
            rows={initialPetitions}
            getRowId={(d: PetitionDto) => d.id}
            headHeading={t("petition.tab.requests")}
            empty={{ icon: <FileQuestion className="h-8 w-8" />, title: t("common.noData") }}
            error={{ icon: <FileQuestion className="h-8 w-8" />, title: t("common.error") }}
            columns={[
              {
                key: "number",
                header: t("petition.col.number"),
                render: (d: PetitionDto) => <div className="font-medium text-sm">{d.petitionNumber}</div>
              },
              {
                key: "student",
                header: t("petition.col.student"),
                render: (d: PetitionDto) => <div className="text-sm">{d.student?.name || d.studentName || "-"}</div>
              },
              {
                key: "type",
                header: t("petition.tab.types"),
                render: (d: PetitionDto) => <div className="text-sm">{d.petitionType?.nameTh}</div>
              },
              {
                key: "status",
                header: t("petition.col.status"),
                render: (d: PetitionDto) => (
                  <StatusPill tone={getStatusTone(d.status)}>
                    {t(`petition.status.${d.status}`) || d.status}
                  </StatusPill>
                )
              },
              {
                key: "actions",
                header: "",
                render: (d: PetitionDto) => (
                  <div className="flex items-center justify-end gap-2">
                    {canProcess && (
                      <Button variant="ghost" size="sm" onClick={() => openReview(d)}>
                        <MessageSquare className="h-4 w-4 text-muted-foreground mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                )
              }
            ]}
          />
        </div>
      )}

      {activeTab === "types" && canManage && (
        <div className="bg-card border rounded-xl shadow-sm p-4">
          <ul className="space-y-2">
            {types.map(t => (
              <li key={t.id} className="p-3 border rounded-md flex justify-between items-center">
                <div>
                  <div className="font-medium">{t.nameTh}</div>
                  <div className="text-xs text-muted-foreground">Code: {t.code} | SLA: {t.slaDays} days</div>
                </div>
              </li>
            ))}
            {types.length === 0 && <div className="text-center text-muted-foreground p-8">No Types Found</div>}
          </ul>
        </div>
      )}

      {/* Petition Type Modal */}
      <LiyonDialog open={typeModalOpen} onOpenChange={setTypeModalOpen}>
        <LiyonDialogHeader title="New Petition Type" />
        <div className="p-6 space-y-4">
          <LiyonField label="Code">
            <input 
              value={typeCode} 
              onChange={(e) => setTypeCode(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Name (TH)">
            <input 
              value={typeNameTh} 
              onChange={(e) => setTypeNameTh(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Name (EN)">
            <input 
              value={typeNameEn} 
              onChange={(e) => setTypeNameEn(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="SLA Days">
            <input 
              type="number"
              value={typeSla} 
              onChange={(e) => setTypeSla(Number(e.target.value))} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setTypeModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveType} disabled={isPending}>Save</Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Review Modal */}
      <LiyonDialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <LiyonDialogHeader title="Review Petition" />
        <div className="p-6 space-y-4">
          <div className="bg-muted p-3 rounded-md text-sm">
            <div><strong>Number:</strong> {activePetition?.petitionNumber}</div>
            <div><strong>Student:</strong> {activePetition?.student?.name || activePetition?.studentName}</div>
            <div><strong>Type:</strong> {activePetition?.petitionType?.nameTh}</div>
          </div>
          <LiyonField label="Review Note">
            <textarea 
              value={reviewComment} 
              onChange={(e) => setReviewComment(e.target.value)} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
          {canApprove && (
            <>
              <Button variant="destructive" onClick={() => handleProcess("REJECTED")} disabled={isPending} className="gap-2">
                <X className="w-4 h-4" /> Reject
              </Button>
              <Button onClick={() => handleProcess("APPROVED")} disabled={isPending} className="gap-2">
                <Check className="w-4 h-4" /> Approve
              </Button>
            </>
          )}
          {!canApprove && canProcess && (
            <Button onClick={() => handleProcess("FORWARDED")} disabled={isPending}>
              Forward
            </Button>
          )}
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}

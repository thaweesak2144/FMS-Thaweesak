"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  createApplicationAction,
  reviewApplicationAction,
} from "@/features/admission/actions";
import type { AdmissionRoundDto, AdmissionApplicationDto } from "@/features/admission/server";

export function ApplicationsClient({ 
  round, 
  initialApplications, 
  canReview,
  canWrite
}: { 
  round: AdmissionRoundDto;
  initialApplications: AdmissionApplicationDto[];
  canReview: boolean;
  canWrite: boolean;
}) {
  const t = useT();
  const [items, setItems] = useState<AdmissionApplicationDto[]>(initialApplications);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<AdmissionApplicationDto | null>(null);

  // Form states (mock student application for admin testing)
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [idCard, setIdCard] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Review states
  const [reviewStatus, setReviewStatus] = useState<string>("PASSED");
  const [reviewScore, setReviewScore] = useState<number>(0);
  const [reviewNote, setReviewNote] = useState("");

  const openCreate = () => {
    setNameTh("");
    setNameEn("");
    setIdCard("");
    setEmail("");
    setPhone("");
    setModalOpen(true);
  };

  const handleSaveApp = () => {
    if (!nameTh || !idCard || !email || !phone) {
      toast.error(t("common.required"));
      return;
    }
    if (idCard.length !== 13) {
      toast.error("ID Card must be 13 digits");
      return;
    }
    const payload = {
      roundId: round.id,
      applicantNameTh: nameTh,
      applicantNameEn: nameEn || nameTh,
      idCard,
      email,
      phone,
    };

    startTransition(async () => {
      const res = await createApplicationAction(payload);
      if (res.ok) {
        toast.success(t("common.saved"));
        setModalOpen(false);
        window.location.reload();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const openReview = (app: AdmissionApplicationDto) => {
    setReviewingItem(app);
    setReviewStatus(app.status === "SUBMITTED" ? "PASSED" : app.status);
    setReviewScore(app.score ? Number(app.score) : 0);
    setReviewNote(app.reviewerNote || "");
    setReviewModalOpen(true);
  };

  const handleReview = () => {
    if (!reviewingItem) return;
    startTransition(async () => {
      const res = await reviewApplicationAction({
        id: reviewingItem.id,
        status: reviewStatus as any,
        score: reviewScore,
        reviewerNote: reviewNote,
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

  const getStatusTone = (s: string) => {
    switch (s) {
      case "PASSED": return "ok";
      case "FAILED": return "bad";
      case "WAITLISTED": return "warn";
      case "UNDER_REVIEW": return "info";
      default: return "off";
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/admission" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Rounds
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{round.nameTh}</h1>
          <p className="text-muted-foreground">Applications for Academic Year {round.academicYear}</p>
        </div>
        <div className="flex gap-2">
          {canWrite && round.status === "OPEN" && (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Mock Add Application
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm">
        <DataTable
          state={items.length === 0 ? "empty" : "data"}
          rows={items}
          getRowId={(d: any) => d.id}
          headHeading={t("admission.application.title")}
          empty={{ icon: <ArrowLeft className="h-8 w-8" />, title: t("common.noData") }}
          error={{ icon: <ArrowLeft className="h-8 w-8" />, title: t("common.error") }}
          columns={[
            {
              key: "appNumber",
              header: t("admission.application.appNumber"),
              render: (d: any) => <div className="font-mono text-sm">{d.appNumber}</div>
            },
            {
              key: "applicantName",
              header: t("admission.application.applicantName"),
              render: (d: any) => <div className="text-sm font-medium">{d.applicantNameTh}</div>
            },
            {
              key: "idCard",
              header: t("admission.application.idCard"),
              render: (d: any) => <div className="text-sm text-muted-foreground">{d.idCard}</div>
            },
            {
              key: "score",
              header: t("admission.application.score"),
              render: (d: any) => <div className="text-sm">{d.score ?? "-"}</div>
            },
            {
              key: "status",
              header: t("admission.round.status"),
              render: (d: any) => (
                <StatusPill tone={getStatusTone(d.status) as any}>
                  {t(`admission.appStatus.${d.status}` as any) || d.status}
                </StatusPill>
              )
            },
            {
              key: "actions",
              header: "",
              render: (d: any) => (
                canReview ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openReview(d)}>
                      Review
                    </Button>
                  </div>
                ) : <span />
              )
            }
          ]}
        />
      </div>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader title="Add Mock Application" />
        <div className="p-6 space-y-4">
          <LiyonField label={t("admission.application.applicantName")}>
            <input 
              value={nameTh} 
              onChange={(e: any) => setNameTh(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label={t("admission.application.idCard")}>
            <input 
              value={idCard} 
              onChange={(e: any) => setIdCard(e.target.value)} 
              maxLength={13}
              placeholder="13 digits"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Email">
            <input 
              type="email"
              value={email} 
              onChange={(e: any) => setEmail(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Phone">
            <input 
              value={phone} 
              onChange={(e: any) => setPhone(e.target.value)} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveApp} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      <LiyonDialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <LiyonDialogHeader title={`Review Application: ${reviewingItem?.appNumber}`} />
        <div className="p-6 space-y-4">
          <LiyonField label="Result Status">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={reviewStatus}
              onChange={(e: any) => setReviewStatus(e.target.value)}
            >
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="PASSED">PASSED</option>
              <option value="FAILED">FAILED</option>
              <option value="WAITLISTED">WAITLISTED</option>
            </select>
          </LiyonField>
          <LiyonField label="Interview / Admission Score">
            <input 
              type="number"
              value={reviewScore} 
              onChange={(e: any) => setReviewScore(Number(e.target.value))} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
          <LiyonField label="Reviewer Notes (Internal)">
            <textarea 
              value={reviewNote} 
              onChange={(e: any) => setReviewNote(e.target.value)} 
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleReview} disabled={isPending}>
            Confirm Review
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}

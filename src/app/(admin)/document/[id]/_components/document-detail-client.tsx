"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Send, XCircle, CheckCircle2, CornerDownLeft, FileText, Clock } from "lucide-react";
import { useT } from "@/shared/lib/i18n/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill, LiyonDialog, LiyonDialogHeader, LiyonDialogFooter, LiyonField } from "@/shared/components/liyon";
import {
  submitDocumentAction,
  cancelDocumentAction,
  approveDocumentAction,
} from "@/features/document/actions";
import type { DocumentDetailDto } from "@/features/document/server";

interface ApprovalStepDef {
  step: number;
  description: string;
  roleCode: string;
}

interface Props {
  doc: DocumentDetailDto;
  currentUserId: string;
  canWrite?: boolean;
  canApprove: boolean;
}

export function DocumentDetailClient({ doc, currentUserId, canApprove }: Props) {
  const t = useT();
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | "RETURNED" | null>(null);
  const [comment, setComment] = useState("");

  const isAuthor = currentUserId === doc.createdById;
  const isPendingDoc = doc.status === "PENDING";
  
  const steps = (doc.documentType.approvalSteps as unknown as ApprovalStepDef[]) || [];
  // Simplistic role check - in a real app we'd check if `currentUserId` actually has `roleCode`.
  // Here we just allow if they have `canApprove` and it's pending.
  const isApproverForStep = canApprove && isPendingDoc;

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await submitDocumentAction(doc.id);
      if (res.ok) {
        toast.success(t("common.saved"));
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleCancel = () => {
    if (!confirm("Are you sure you want to cancel this document?")) return;
    startTransition(async () => {
      const res = await cancelDocumentAction(doc.id);
      if (res.ok) {
        toast.success(t("common.saved"));
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const openAction = (type: "APPROVED" | "REJECTED" | "RETURNED") => {
    setActionType(type);
    setComment("");
    setModalOpen(true);
  };

  const confirmAction = () => {
    if ((actionType === "REJECTED" || actionType === "RETURNED") && !comment.trim()) {
      toast.error("Comment is required");
      return;
    }
    startTransition(async () => {
      const res = await approveDocumentAction({
        documentId: doc.id,
        action: actionType!,
        comment: comment.trim(),
      });
      if (res.ok) {
        toast.success(t("common.saved"));
        setModalOpen(false);
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const getStatusTone = (status: string): "ok" | "bad" | "warn" | "neutral" => {
    switch (status) {
      case "PENDING": return "warn";
      case "APPROVED": return "ok";
      case "REJECTED": case "CANCELLED": return "bad";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/document" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to documents
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight">{doc.docNumber}</h1>
            <StatusPill tone={getStatusTone(doc.status)}>
              {t(`document.status.${doc.status}`) || doc.status}
            </StatusPill>
          </div>
          <p className="text-lg text-muted-foreground">{doc.title}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {doc.status === "DRAFT" && isAuthor && (
            <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
              <Send className="h-4 w-4" />
              Submit
            </Button>
          )}
          {(doc.status === "DRAFT" || doc.status === "PENDING") && isAuthor && (
            <Button onClick={handleCancel} disabled={isPending} variant="destructive" className="gap-2">
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
          {isApproverForStep && (
            <>
              <Button onClick={() => openAction("APPROVED")} disabled={isPending} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
              <Button onClick={() => openAction("RETURNED")} disabled={isPending} variant="outline" className="gap-2 text-orange-600">
                <CornerDownLeft className="h-4 w-4" />
                Return
              </Button>
              <Button onClick={() => openAction("REJECTED")} disabled={isPending} variant="destructive" className="gap-2">
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2 pb-2 border-b">
              <FileText className="h-5 w-5 text-primary" />
              Document Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Type</div>
                <div className="font-medium">{doc.documentType.nameTh}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Author</div>
                <div className="font-medium">{doc.createdBy.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Created At</div>
                <div className="font-medium">{new Date(doc.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Submitted At</div>
                <div className="font-medium">{doc.submittedAt ? new Date(doc.submittedAt).toLocaleString() : "-"}</div>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t">
              <div className="text-muted-foreground mb-2 text-sm">Metadata</div>
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto">
                {JSON.stringify(doc.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold flex items-center gap-2 pb-2 border-b">
              <Clock className="h-5 w-5 text-primary" />
              Approval Workflow
            </h3>
            
            <div className="space-y-4">
              {steps.map((step, idx) => {
                const approval = doc.approvals.find(a => a.step === step.step);
                const isCurrent = isPendingDoc && doc.currentStep === step.step;
                const isPast = doc.currentStep > step.step || doc.status === "APPROVED";
                
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center mt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        approval ? (approval.action === "APPROVED" ? "bg-emerald-500" : "bg-destructive")
                        : isCurrent ? "bg-primary animate-pulse"
                        : "bg-muted-foreground/30"
                      }`} />
                      {idx < steps.length - 1 && (
                        <div className={`w-0.5 h-full min-h-[2rem] my-1 ${
                          isPast ? "bg-emerald-500" : "bg-border"
                        }`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="font-medium text-sm">Step {step.step}: {step.description}</div>
                      <div className="text-xs text-muted-foreground mb-1">Role: {step.roleCode}</div>
                      {approval && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                          <div className="font-semibold">{approval.approver.name}</div>
                          <div className={`text-xs font-bold ${
                            approval.action === "APPROVED" ? "text-emerald-600" 
                            : approval.action === "RETURNED" ? "text-orange-600" 
                            : "text-destructive"
                          }`}>
                            {approval.action} at {new Date(approval.actionAt).toLocaleString()}
                          </div>
                          {approval.comment && (
                            <div className="text-xs text-muted-foreground mt-1 italic">
                              &ldquo;{approval.comment}&rdquo;
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {steps.length === 0 && (
                <div className="text-sm text-muted-foreground">No approval steps defined.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen}>
        <LiyonDialogHeader title={`Confirm ${actionType}`} />
        <div className="p-6 space-y-4">
          <LiyonField label="Comment (Optional for Approval, Required for Return/Reject)">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment..."
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </LiyonField>
        </div>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button 
            onClick={confirmAction} 
            disabled={isPending}
            variant={actionType === "APPROVED" ? "default" : "destructive"}
          >
            Confirm
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}

import { notFound } from "next/navigation";
import { requirePermission, hasPermission } from "@/features/identity/server";
import { DOCUMENT_P, getDocumentById } from "@/features/document/server";
import { DocumentDetailClient } from "./_components/document-detail-client";

export const metadata = { title: "Document Detail" };

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requirePermission(DOCUMENT_P.documentRead);
  const { id } = await params;

  const document = await getDocumentById(ctx.tenantId, id);
  if (!document) return notFound();

  return (
    <DocumentDetailClient
      doc={document}
      currentUserId={ctx.userId}
      canWrite={hasPermission(ctx, DOCUMENT_P.documentWrite)}
      canApprove={hasPermission(ctx, DOCUMENT_P.documentApprove)}
    />
  );
}

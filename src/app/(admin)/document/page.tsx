import { requirePermission, hasPermission } from "@/features/identity/server";
import { DOCUMENT_P, listDocuments, listDocumentTypes } from "@/features/document/server";
import { DocumentClient } from "./_components/document-client";

export const metadata = { title: "Document Management" };

export default async function DocumentPage() {
  const ctx = await requirePermission(DOCUMENT_P.documentRead);

  const [documents, types] = await Promise.all([
    listDocuments(ctx.tenantId),
    listDocumentTypes(ctx.tenantId),
  ]);

  return (
    <DocumentClient
      initialDocuments={documents}
      types={types}
      canWrite={hasPermission(ctx, DOCUMENT_P.documentWrite)}
    />
  );
}

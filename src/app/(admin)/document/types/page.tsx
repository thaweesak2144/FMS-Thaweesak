import { requirePermission } from "@/features/identity/server";
import { DOCUMENT_P, listDocumentTypes } from "@/features/document/server";
import { DocumentTypesClient } from "./_components/types-client";

export const metadata = { title: "Document Types" };

export default async function DocumentTypesPage() {
  const ctx = await requirePermission(DOCUMENT_P.documentManage);

  const types = await listDocumentTypes(ctx.tenantId);

  return <DocumentTypesClient initialTypes={types} />;
}

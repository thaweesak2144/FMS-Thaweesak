import "server-only";

export {
  listDocumentTypes,
  getDocumentById,
  listDocuments,
  getDefaultTenantId,
  type DocumentTypeDto,
  type DocumentDto,
  type DocumentDetailDto,
} from "./_internal/services";
export { DOCUMENT_P, DOCUMENT_PERMISSIONS } from "./permissions";

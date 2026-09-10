import "server-only";

export {
  listNewsCategories,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
  listNewsPosts,
  getNewsPostById,
  getNewsPostBySlug,
  createNewsPost,
  updateNewsPost,
  publishNewsPost,
  archiveNewsPost,
  toggleNewsPostPin,
  deleteNewsPost,
  getDefaultTenantId,
  type NewsCategoryDto,
  type NewsPostDto,
  type NewsAttachmentDto,
  type NewsFilter,
} from "./_internal/services";
export { NEWS_P, NEWS_PERMISSIONS } from "./permissions";

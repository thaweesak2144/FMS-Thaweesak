import "server-only";

export {
  listCurriculums,
  getCurriculumById,
  createCurriculum,
  updateCurriculum,
  toggleCurriculumActive,
  deleteCurriculum,
  listCurriculumPlans,
  createCurriculumPlan,
  updateCurriculumPlan,
  deleteCurriculumPlan,
  getDefaultTenantId,
  type CurriculumDto,
  type CurriculumPlanDto,
  type CurriculumFilter,
} from "./_internal/services";
export { CURRICULUM_P, CURRICULUM_PERMISSIONS } from "./permissions";

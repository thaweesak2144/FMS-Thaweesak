import "server-only";

export {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listPersonnel,
  getPersonnelById,
  createPersonnel,
  updatePersonnel,
  togglePersonnelActive,
  deletePersonnel,
  getDefaultTenantId,
  type DepartmentDto,
  type PersonnelDto,
  type EducationDto,
  type PersonnelFilter,
} from "./_internal/services";
export { PERSONNEL_P, PERSONNEL_PERMISSIONS } from "./permissions";

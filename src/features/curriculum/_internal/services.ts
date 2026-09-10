import { prisma } from "@/shared/lib/infra/prisma";
import type {
  CreateCurriculumInput,
  UpdateCurriculumInput,
  CreateCurriculumPlanInput,
  UpdateCurriculumPlanInput,
} from "./validations";

export interface CurriculumPlanDto {
  id: string;
  curriculumId: string;
  academicYear: number;
  semester: number;
  courseCode: string;
  courseNameTh: string;
  courseNameEn: string;
  credits: number;
  courseType: string;
  sortOrder: number;
  createdAt: string;
}

export interface CurriculumDto {
  id: string;
  tenantId: string;
  departmentId: string;
  departmentNameTh?: string;
  departmentNameEn?: string;
  departmentCode?: string;
  code: string;
  nameTh: string;
  nameEn: string;
  degreeLevel: "BACHELOR" | "MASTER" | "DOCTORAL" | "CERTIFICATE";
  totalCredits: number;
  curriculumYear: number;
  philosophyTh: string | null;
  philosophyEn: string | null;
  careerProspectsTh: string | null;
  careerProspectsEn: string | null;
  tuitionFee: number | null;
  studyPeriodYears: number;
  isActive: boolean;
  sortOrder: number;
  planCount?: number;
  plans?: CurriculumPlanDto[];
  createdAt: string;
  updatedAt: string;
}

export async function getDefaultTenantId(): Promise<string> {
  const tenant = await prisma.tenant.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!tenant) throw new Error("No active tenant found");
  return tenant.id;
}

export interface CurriculumFilter {
  degreeLevel?: "BACHELOR" | "MASTER" | "DOCTORAL" | "CERTIFICATE";
  departmentId?: string;
  isActive?: boolean;
  search?: string;
}

export async function listCurriculums(tenantId: string, filter?: CurriculumFilter): Promise<CurriculumDto[]> {
  const where: any = { tenantId };

  if (filter?.degreeLevel) {
    where.degreeLevel = filter.degreeLevel;
  }
  if (filter?.departmentId) {
    where.departmentId = filter.departmentId;
  }
  if (filter?.isActive !== undefined) {
    where.isActive = filter.isActive;
  }
  if (filter?.search && filter.search.trim() !== "") {
    const s = filter.search.trim();
    where.OR = [
      { code: { contains: s, mode: "insensitive" } },
      { nameTh: { contains: s, mode: "insensitive" } },
      { nameEn: { contains: s, mode: "insensitive" } },
    ];
  }

  const items = await prisma.curriculum.findMany({
    where,
    include: {
      department: true,
      _count: {
        select: { plans: true },
      },
    },
    orderBy: [
      { sortOrder: "asc" },
      { curriculumYear: "desc" },
      { code: "asc" },
    ],
  });

  return items.map((c) => ({
    id: c.id,
    tenantId: c.tenantId,
    departmentId: c.departmentId,
    departmentNameTh: c.department.nameTh,
    departmentNameEn: c.department.nameEn,
    departmentCode: c.department.code,
    code: c.code,
    nameTh: c.nameTh,
    nameEn: c.nameEn,
    degreeLevel: c.degreeLevel,
    totalCredits: c.totalCredits,
    curriculumYear: c.curriculumYear,
    philosophyTh: c.philosophyTh,
    philosophyEn: c.philosophyEn,
    careerProspectsTh: c.careerProspectsTh,
    careerProspectsEn: c.careerProspectsEn,
    tuitionFee: c.tuitionFee,
    studyPeriodYears: c.studyPeriodYears,
    isActive: c.isActive,
    sortOrder: c.sortOrder,
    planCount: c._count.plans,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function getCurriculumById(tenantId: string, id: string): Promise<CurriculumDto | null> {
  const c = await prisma.curriculum.findFirst({
    where: { id, tenantId },
    include: {
      department: true,
      plans: {
        orderBy: [
          { academicYear: "asc" },
          { semester: "asc" },
          { sortOrder: "asc" },
          { courseCode: "asc" },
        ],
      },
    },
  });

  if (!c) return null;

  return {
    id: c.id,
    tenantId: c.tenantId,
    departmentId: c.departmentId,
    departmentNameTh: c.department.nameTh,
    departmentNameEn: c.department.nameEn,
    departmentCode: c.department.code,
    code: c.code,
    nameTh: c.nameTh,
    nameEn: c.nameEn,
    degreeLevel: c.degreeLevel,
    totalCredits: c.totalCredits,
    curriculumYear: c.curriculumYear,
    philosophyTh: c.philosophyTh,
    philosophyEn: c.philosophyEn,
    careerProspectsTh: c.careerProspectsTh,
    careerProspectsEn: c.careerProspectsEn,
    tuitionFee: c.tuitionFee,
    studyPeriodYears: c.studyPeriodYears,
    isActive: c.isActive,
    sortOrder: c.sortOrder,
    plans: c.plans.map((p) => ({
      id: p.id,
      curriculumId: p.curriculumId,
      academicYear: p.academicYear,
      semester: p.semester,
      courseCode: p.courseCode,
      courseNameTh: p.courseNameTh,
      courseNameEn: p.courseNameEn,
      credits: p.credits,
      courseType: p.courseType,
      sortOrder: p.sortOrder,
      createdAt: p.createdAt.toISOString(),
    })),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function createCurriculum(tenantId: string, input: CreateCurriculumInput): Promise<CurriculumDto> {
  const created = await prisma.curriculum.create({
    data: {
      tenantId,
      departmentId: input.departmentId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      degreeLevel: input.degreeLevel,
      totalCredits: input.totalCredits,
      curriculumYear: input.curriculumYear,
      philosophyTh: input.philosophyTh || null,
      philosophyEn: input.philosophyEn || null,
      careerProspectsTh: input.careerProspectsTh || null,
      careerProspectsEn: input.careerProspectsEn || null,
      tuitionFee: input.tuitionFee || null,
      studyPeriodYears: input.studyPeriodYears,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
    include: {
      department: true,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    departmentId: created.departmentId,
    departmentNameTh: created.department.nameTh,
    departmentNameEn: created.department.nameEn,
    departmentCode: created.department.code,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    degreeLevel: created.degreeLevel,
    totalCredits: created.totalCredits,
    curriculumYear: created.curriculumYear,
    philosophyTh: created.philosophyTh,
    philosophyEn: created.philosophyEn,
    careerProspectsTh: created.careerProspectsTh,
    careerProspectsEn: created.careerProspectsEn,
    tuitionFee: created.tuitionFee,
    studyPeriodYears: created.studyPeriodYears,
    isActive: created.isActive,
    sortOrder: created.sortOrder,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateCurriculum(tenantId: string, input: UpdateCurriculumInput): Promise<CurriculumDto> {
  const updated = await prisma.curriculum.update({
    where: { id: input.id, tenantId },
    data: {
      departmentId: input.departmentId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      degreeLevel: input.degreeLevel,
      totalCredits: input.totalCredits,
      curriculumYear: input.curriculumYear,
      philosophyTh: input.philosophyTh || null,
      philosophyEn: input.philosophyEn || null,
      careerProspectsTh: input.careerProspectsTh || null,
      careerProspectsEn: input.careerProspectsEn || null,
      tuitionFee: input.tuitionFee || null,
      studyPeriodYears: input.studyPeriodYears,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
    include: {
      department: true,
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    departmentId: updated.departmentId,
    departmentNameTh: updated.department.nameTh,
    departmentNameEn: updated.department.nameEn,
    departmentCode: updated.department.code,
    code: updated.code,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    degreeLevel: updated.degreeLevel,
    totalCredits: updated.totalCredits,
    curriculumYear: updated.curriculumYear,
    philosophyTh: updated.philosophyTh,
    philosophyEn: updated.philosophyEn,
    careerProspectsTh: updated.careerProspectsTh,
    careerProspectsEn: updated.careerProspectsEn,
    tuitionFee: updated.tuitionFee,
    studyPeriodYears: updated.studyPeriodYears,
    isActive: updated.isActive,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function toggleCurriculumActive(tenantId: string, id: string): Promise<boolean> {
  const current = await prisma.curriculum.findFirst({
    where: { id, tenantId },
    select: { isActive: true },
  });
  if (!current) throw new Error("Curriculum not found");

  const updated = await prisma.curriculum.update({
    where: { id, tenantId },
    data: { isActive: !current.isActive },
    select: { isActive: true },
  });
  return updated.isActive;
}

export async function deleteCurriculum(tenantId: string, id: string): Promise<void> {
  await prisma.curriculum.delete({
    where: { id, tenantId },
  });
}

// ---------------- Study Plan ----------------

export async function listCurriculumPlans(curriculumId: string): Promise<CurriculumPlanDto[]> {
  const plans = await prisma.curriculumPlan.findMany({
    where: { curriculumId },
    orderBy: [
      { academicYear: "asc" },
      { semester: "asc" },
      { sortOrder: "asc" },
      { courseCode: "asc" },
    ],
  });

  return plans.map((p) => ({
    id: p.id,
    curriculumId: p.curriculumId,
    academicYear: p.academicYear,
    semester: p.semester,
    courseCode: p.courseCode,
    courseNameTh: p.courseNameTh,
    courseNameEn: p.courseNameEn,
    credits: p.credits,
    courseType: p.courseType,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
  }));
}

export async function createCurriculumPlan(input: CreateCurriculumPlanInput): Promise<CurriculumPlanDto> {
  const created = await prisma.curriculumPlan.create({
    data: {
      curriculumId: input.curriculumId,
      academicYear: input.academicYear,
      semester: input.semester,
      courseCode: input.courseCode,
      courseNameTh: input.courseNameTh,
      courseNameEn: input.courseNameEn,
      credits: input.credits,
      courseType: input.courseType,
      sortOrder: input.sortOrder,
    },
  });

  return {
    id: created.id,
    curriculumId: created.curriculumId,
    academicYear: created.academicYear,
    semester: created.semester,
    courseCode: created.courseCode,
    courseNameTh: created.courseNameTh,
    courseNameEn: created.courseNameEn,
    credits: created.credits,
    courseType: created.courseType,
    sortOrder: created.sortOrder,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function updateCurriculumPlan(input: UpdateCurriculumPlanInput): Promise<CurriculumPlanDto> {
  const updated = await prisma.curriculumPlan.update({
    where: { id: input.id },
    data: {
      academicYear: input.academicYear,
      semester: input.semester,
      courseCode: input.courseCode,
      courseNameTh: input.courseNameTh,
      courseNameEn: input.courseNameEn,
      credits: input.credits,
      courseType: input.courseType,
      sortOrder: input.sortOrder,
    },
  });

  return {
    id: updated.id,
    curriculumId: updated.curriculumId,
    academicYear: updated.academicYear,
    semester: updated.semester,
    courseCode: updated.courseCode,
    courseNameTh: updated.courseNameTh,
    courseNameEn: updated.courseNameEn,
    credits: updated.credits,
    courseType: updated.courseType,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
  };
}

export async function deleteCurriculumPlan(id: string): Promise<void> {
  await prisma.curriculumPlan.delete({
    where: { id },
  });
}

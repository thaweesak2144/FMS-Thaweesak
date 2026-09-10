import { prisma } from "@/shared/lib/infra/prisma";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreatePersonnelInput,
  UpdatePersonnelInput,
} from "./validations";

export interface DepartmentDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  parentId: string | null;
  sortOrder: number;
  personnelCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationDto {
  id: string;
  degree: string;
  major: string;
  institution: string;
  graduationYear: number | null;
  sortOrder: number;
}

export interface PersonnelDto {
  id: string;
  tenantId: string;
  userId: string | null;
  employeeCode: string;
  titleTh: string;
  titleEn: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  positionTh: string;
  positionEn: string;
  academicRank: string | null;
  departmentId: string;
  departmentNameTh?: string;
  departmentNameEn?: string;
  personnelType: "FULL_TIME" | "PART_TIME" | "EXTERNAL";
  email: string;
  phone: string | null;
  photoUrl: string | null;
  bioTh: string | null;
  bioEn: string | null;
  expertiseTags: string[];
  isActive: boolean;
  sortOrder: number;
  educations?: EducationDto[];
  createdAt: string;
  updatedAt: string;
}

// ---------------- Departments ----------------

export async function listDepartments(tenantId: string): Promise<DepartmentDto[]> {
  const depts = await prisma.department.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: { personnel: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });

  return depts.map((d) => ({
    id: d.id,
    tenantId: d.tenantId,
    code: d.code,
    nameTh: d.nameTh,
    nameEn: d.nameEn,
    parentId: d.parentId,
    sortOrder: d.sortOrder,
    personnelCount: d._count.personnel,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));
}

export async function createDepartment(tenantId: string, input: CreateDepartmentInput): Promise<DepartmentDto> {
  const created = await prisma.department.create({
    data: {
      tenantId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      parentId: input.parentId || null,
      sortOrder: input.sortOrder,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    parentId: created.parentId,
    sortOrder: created.sortOrder,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateDepartment(tenantId: string, input: UpdateDepartmentInput): Promise<DepartmentDto> {
  const updated = await prisma.department.update({
    where: { id: input.id, tenantId },
    data: {
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      parentId: input.parentId || null,
      sortOrder: input.sortOrder,
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    code: updated.code,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    parentId: updated.parentId,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteDepartment(tenantId: string, id: string): Promise<void> {
  await prisma.department.delete({
    where: { id, tenantId },
  });
}

// ---------------- Personnel ----------------

export interface PersonnelFilter {
  departmentId?: string;
  personnelType?: "FULL_TIME" | "PART_TIME" | "EXTERNAL";
  search?: string;
  isActive?: boolean;
}

export async function listPersonnel(tenantId: string, filter?: PersonnelFilter): Promise<PersonnelDto[]> {
  const where: any = { tenantId };

  if (filter?.departmentId) {
    where.departmentId = filter.departmentId;
  }
  if (filter?.personnelType) {
    where.personnelType = filter.personnelType;
  }
  if (filter?.isActive !== undefined) {
    where.isActive = filter.isActive;
  }
  if (filter?.search && filter.search.trim() !== "") {
    const s = filter.search.trim();
    where.OR = [
      { employeeCode: { contains: s, mode: "insensitive" } },
      { firstNameTh: { contains: s, mode: "insensitive" } },
      { lastNameTh: { contains: s, mode: "insensitive" } },
      { firstNameEn: { contains: s, mode: "insensitive" } },
      { lastNameEn: { contains: s, mode: "insensitive" } },
      { positionTh: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
    ];
  }

  const items = await prisma.personnelProfile.findMany({
    where,
    include: {
      department: true,
      educations: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return items.map((p) => ({
    id: p.id,
    tenantId: p.tenantId,
    userId: p.userId,
    employeeCode: p.employeeCode,
    titleTh: p.titleTh,
    titleEn: p.titleEn,
    firstNameTh: p.firstNameTh,
    lastNameTh: p.lastNameTh,
    firstNameEn: p.firstNameEn,
    lastNameEn: p.lastNameEn,
    positionTh: p.positionTh,
    positionEn: p.positionEn,
    academicRank: p.academicRank,
    departmentId: p.departmentId,
    departmentNameTh: p.department.nameTh,
    departmentNameEn: p.department.nameEn,
    personnelType: p.personnelType,
    email: p.email,
    phone: p.phone,
    photoUrl: p.photoUrl,
    bioTh: p.bioTh,
    bioEn: p.bioEn,
    expertiseTags: Array.isArray(p.expertiseTags) ? (p.expertiseTags as string[]) : [],
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    educations: p.educations.map((e) => ({
      id: e.id,
      degree: e.degree,
      major: e.major,
      institution: e.institution,
      graduationYear: e.graduationYear,
      sortOrder: e.sortOrder,
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getPersonnelById(tenantId: string, id: string): Promise<PersonnelDto | null> {
  const p = await prisma.personnelProfile.findFirst({
    where: { id, tenantId },
    include: {
      department: true,
      educations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    tenantId: p.tenantId,
    userId: p.userId,
    employeeCode: p.employeeCode,
    titleTh: p.titleTh,
    titleEn: p.titleEn,
    firstNameTh: p.firstNameTh,
    lastNameTh: p.lastNameTh,
    firstNameEn: p.firstNameEn,
    lastNameEn: p.lastNameEn,
    positionTh: p.positionTh,
    positionEn: p.positionEn,
    academicRank: p.academicRank,
    departmentId: p.departmentId,
    departmentNameTh: p.department.nameTh,
    departmentNameEn: p.department.nameEn,
    personnelType: p.personnelType,
    email: p.email,
    phone: p.phone,
    photoUrl: p.photoUrl,
    bioTh: p.bioTh,
    bioEn: p.bioEn,
    expertiseTags: Array.isArray(p.expertiseTags) ? (p.expertiseTags as string[]) : [],
    isActive: p.isActive,
    sortOrder: p.sortOrder,
    educations: p.educations.map((e) => ({
      id: e.id,
      degree: e.degree,
      major: e.major,
      institution: e.institution,
      graduationYear: e.graduationYear,
      sortOrder: e.sortOrder,
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function createPersonnel(tenantId: string, input: CreatePersonnelInput): Promise<PersonnelDto> {
  const created = await prisma.personnelProfile.create({
    data: {
      tenantId,
      employeeCode: input.employeeCode,
      titleTh: input.titleTh,
      titleEn: input.titleEn,
      firstNameTh: input.firstNameTh,
      lastNameTh: input.lastNameTh,
      firstNameEn: input.firstNameEn,
      lastNameEn: input.lastNameEn,
      positionTh: input.positionTh,
      positionEn: input.positionEn,
      academicRank: input.academicRank || null,
      departmentId: input.departmentId,
      personnelType: input.personnelType,
      email: input.email,
      phone: input.phone || null,
      photoUrl: input.photoUrl || null,
      bioTh: input.bioTh || null,
      bioEn: input.bioEn || null,
      expertiseTags: input.expertiseTags || [],
      isActive: input.isActive,
      sortOrder: input.sortOrder,
      educations: {
        create: (input.educations || []).map((e, idx) => ({
          degree: e.degree,
          major: e.major,
          institution: e.institution,
          graduationYear: e.graduationYear || null,
          sortOrder: e.sortOrder ?? idx,
        })),
      },
    },
    include: {
      department: true,
      educations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    userId: created.userId,
    employeeCode: created.employeeCode,
    titleTh: created.titleTh,
    titleEn: created.titleEn,
    firstNameTh: created.firstNameTh,
    lastNameTh: created.lastNameTh,
    firstNameEn: created.firstNameEn,
    lastNameEn: created.lastNameEn,
    positionTh: created.positionTh,
    positionEn: created.positionEn,
    academicRank: created.academicRank,
    departmentId: created.departmentId,
    departmentNameTh: created.department.nameTh,
    departmentNameEn: created.department.nameEn,
    personnelType: created.personnelType,
    email: created.email,
    phone: created.phone,
    photoUrl: created.photoUrl,
    bioTh: created.bioTh,
    bioEn: created.bioEn,
    expertiseTags: Array.isArray(created.expertiseTags) ? (created.expertiseTags as string[]) : [],
    isActive: created.isActive,
    sortOrder: created.sortOrder,
    educations: created.educations.map((e) => ({
      id: e.id,
      degree: e.degree,
      major: e.major,
      institution: e.institution,
      graduationYear: e.graduationYear,
      sortOrder: e.sortOrder,
    })),
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updatePersonnel(tenantId: string, input: UpdatePersonnelInput): Promise<PersonnelDto> {
  // Update details and replace educations in a transaction
  const updated = await prisma.$transaction(async (tx) => {
    // delete previous educations
    await tx.personnelEducation.deleteMany({
      where: { personnelId: input.id },
    });

    return tx.personnelProfile.update({
      where: { id: input.id, tenantId },
      data: {
        employeeCode: input.employeeCode,
        titleTh: input.titleTh,
        titleEn: input.titleEn,
        firstNameTh: input.firstNameTh,
        lastNameTh: input.lastNameTh,
        firstNameEn: input.firstNameEn,
        lastNameEn: input.lastNameEn,
        positionTh: input.positionTh,
        positionEn: input.positionEn,
        academicRank: input.academicRank || null,
        departmentId: input.departmentId,
        personnelType: input.personnelType,
        email: input.email,
        phone: input.phone || null,
        photoUrl: input.photoUrl || null,
        bioTh: input.bioTh || null,
        bioEn: input.bioEn || null,
        expertiseTags: input.expertiseTags || [],
        isActive: input.isActive,
        sortOrder: input.sortOrder,
        educations: {
          create: (input.educations || []).map((e, idx) => ({
            degree: e.degree,
            major: e.major,
            institution: e.institution,
            graduationYear: e.graduationYear || null,
            sortOrder: e.sortOrder ?? idx,
          })),
        },
      },
      include: {
        department: true,
        educations: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    userId: updated.userId,
    employeeCode: updated.employeeCode,
    titleTh: updated.titleTh,
    titleEn: updated.titleEn,
    firstNameTh: updated.firstNameTh,
    lastNameTh: updated.lastNameTh,
    firstNameEn: updated.firstNameEn,
    lastNameEn: updated.lastNameEn,
    positionTh: updated.positionTh,
    positionEn: updated.positionEn,
    academicRank: updated.academicRank,
    departmentId: updated.departmentId,
    departmentNameTh: updated.department.nameTh,
    departmentNameEn: updated.department.nameEn,
    personnelType: updated.personnelType,
    email: updated.email,
    phone: updated.phone,
    photoUrl: updated.photoUrl,
    bioTh: updated.bioTh,
    bioEn: updated.bioEn,
    expertiseTags: Array.isArray(updated.expertiseTags) ? (updated.expertiseTags as string[]) : [],
    isActive: updated.isActive,
    sortOrder: updated.sortOrder,
    educations: updated.educations.map((e) => ({
      id: e.id,
      degree: e.degree,
      major: e.major,
      institution: e.institution,
      graduationYear: e.graduationYear,
      sortOrder: e.sortOrder,
    })),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function togglePersonnelActive(tenantId: string, id: string): Promise<boolean> {
  const p = await prisma.personnelProfile.findFirst({
    where: { id, tenantId },
    select: { isActive: true },
  });
  if (!p) throw new Error("Personnel not found");

  const updated = await prisma.personnelProfile.update({
    where: { id, tenantId },
    data: { isActive: !p.isActive },
    select: { isActive: true },
  });
  return updated.isActive;
}

export async function deletePersonnel(tenantId: string, id: string): Promise<void> {
  await prisma.personnelProfile.delete({
    where: { id, tenantId },
  });
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

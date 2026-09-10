-- CreateEnum
CREATE TYPE "PersonnelType" AS ENUM ('FULL_TIME', 'PART_TIME', 'EXTERNAL');

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name_th" VARCHAR(200) NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personnel_profiles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID,
    "employee_code" VARCHAR(50) NOT NULL,
    "title_th" VARCHAR(50) NOT NULL,
    "title_en" VARCHAR(50) NOT NULL,
    "first_name_th" VARCHAR(100) NOT NULL,
    "last_name_th" VARCHAR(100) NOT NULL,
    "first_name_en" VARCHAR(100) NOT NULL,
    "last_name_en" VARCHAR(100) NOT NULL,
    "position_th" VARCHAR(200) NOT NULL,
    "position_en" VARCHAR(200) NOT NULL,
    "academic_rank" VARCHAR(100),
    "department_id" UUID NOT NULL,
    "personnel_type" "PersonnelType" NOT NULL DEFAULT 'FULL_TIME',
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "photo_url" VARCHAR(500),
    "bio_th" TEXT,
    "bio_en" TEXT,
    "expertise_tags" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "personnel_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personnel_educations" (
    "id" UUID NOT NULL,
    "personnel_id" UUID NOT NULL,
    "degree" VARCHAR(100) NOT NULL,
    "major" VARCHAR(200) NOT NULL,
    "institution" VARCHAR(300) NOT NULL,
    "graduation_year" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personnel_educations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "departments_tenant_id_idx" ON "departments"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_tenant_id_code_key" ON "departments"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "personnel_profiles_tenant_id_idx" ON "personnel_profiles"("tenant_id");

-- CreateIndex
CREATE INDEX "personnel_profiles_department_id_idx" ON "personnel_profiles"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_profiles_tenant_id_employee_code_key" ON "personnel_profiles"("tenant_id", "employee_code");

-- CreateIndex
CREATE INDEX "personnel_educations_personnel_id_idx" ON "personnel_educations"("personnel_id");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_profiles" ADD CONSTRAINT "personnel_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_profiles" ADD CONSTRAINT "personnel_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_profiles" ADD CONSTRAINT "personnel_profiles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_educations" ADD CONSTRAINT "personnel_educations_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "personnel_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

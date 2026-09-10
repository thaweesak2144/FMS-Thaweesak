-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('BACHELOR', 'MASTER', 'DOCTORAL', 'CERTIFICATE');

-- CreateTable
CREATE TABLE "curriculums" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "degree_level" "DegreeLevel" NOT NULL DEFAULT 'BACHELOR',
    "total_credits" INTEGER NOT NULL,
    "curriculum_year" INTEGER NOT NULL,
    "philosophy_th" TEXT,
    "philosophy_en" TEXT,
    "career_prospects_th" TEXT,
    "career_prospects_en" TEXT,
    "tuition_fee" INTEGER,
    "study_period_years" INTEGER NOT NULL DEFAULT 4,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "curriculums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_plans" (
    "id" UUID NOT NULL,
    "curriculum_id" UUID NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "course_code" VARCHAR(50) NOT NULL,
    "course_name_th" VARCHAR(200) NOT NULL,
    "course_name_en" VARCHAR(200) NOT NULL,
    "credits" INTEGER NOT NULL,
    "course_type" VARCHAR(50) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curriculum_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "curriculums_tenant_id_idx" ON "curriculums"("tenant_id");

-- CreateIndex
CREATE INDEX "curriculums_department_id_idx" ON "curriculums"("department_id");

-- CreateIndex
CREATE INDEX "curriculums_degree_level_idx" ON "curriculums"("degree_level");

-- CreateIndex
CREATE UNIQUE INDEX "curriculums_tenant_id_code_key" ON "curriculums"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "curriculum_plans_curriculum_id_idx" ON "curriculum_plans"("curriculum_id");

-- AddForeignKey
ALTER TABLE "curriculums" ADD CONSTRAINT "curriculums_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculums" ADD CONSTRAINT "curriculums_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_plans" ADD CONSTRAINT "curriculum_plans_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

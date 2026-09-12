--
-- PostgreSQL database dump
--

\restrict 6ob2LjdmISECBJcwqAjKUNnd33PXFiRe7vWk3CAe4UMd0Hf3mZTrf0Hd8DbMtku

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_tenants DROP CONSTRAINT IF EXISTS user_tenants_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_tenants DROP CONSTRAINT IF EXISTS user_tenants_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sample_items DROP CONSTRAINT IF EXISTS sample_items_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_projects DROP CONSTRAINT IF EXISTS research_projects_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_projects DROP CONSTRAINT IF EXISTS research_projects_principal_investigator_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_projects DROP CONSTRAINT IF EXISTS research_projects_approved_by_fkey;
ALTER TABLE IF EXISTS ONLY public.research_members DROP CONSTRAINT IF EXISTS research_members_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_members DROP CONSTRAINT IF EXISTS research_members_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publications DROP CONSTRAINT IF EXISTS publications_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publications DROP CONSTRAINT IF EXISTS publications_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.petitions DROP CONSTRAINT IF EXISTS petitions_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.petitions DROP CONSTRAINT IF EXISTS petitions_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.petitions DROP CONSTRAINT IF EXISTS petitions_petition_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.petition_types DROP CONSTRAINT IF EXISTS petition_types_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.petition_actions DROP CONSTRAINT IF EXISTS petition_actions_petition_id_fkey;
ALTER TABLE IF EXISTS ONLY public.petition_actions DROP CONSTRAINT IF EXISTS petition_actions_actor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.personnel_profiles DROP CONSTRAINT IF EXISTS personnel_profiles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.personnel_profiles DROP CONSTRAINT IF EXISTS personnel_profiles_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.personnel_profiles DROP CONSTRAINT IF EXISTS personnel_profiles_department_id_fkey;
ALTER TABLE IF EXISTS ONLY public.personnel_educations DROP CONSTRAINT IF EXISTS personnel_educations_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news_posts DROP CONSTRAINT IF EXISTS news_posts_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news_posts DROP CONSTRAINT IF EXISTS news_posts_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news_posts DROP CONSTRAINT IF EXISTS news_posts_author_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news_categories DROP CONSTRAINT IF EXISTS news_categories_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.news_attachments DROP CONSTRAINT IF EXISTS news_attachments_post_id_fkey;
ALTER TABLE IF EXISTS ONLY public.documents DROP CONSTRAINT IF EXISTS documents_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.documents DROP CONSTRAINT IF EXISTS documents_document_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.documents DROP CONSTRAINT IF EXISTS documents_created_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.document_types DROP CONSTRAINT IF EXISTS document_types_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.document_approvals DROP CONSTRAINT IF EXISTS document_approvals_document_id_fkey;
ALTER TABLE IF EXISTS ONLY public.document_approvals DROP CONSTRAINT IF EXISTS document_approvals_approver_id_fkey;
ALTER TABLE IF EXISTS ONLY public.departments DROP CONSTRAINT IF EXISTS departments_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.departments DROP CONSTRAINT IF EXISTS departments_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculums DROP CONSTRAINT IF EXISTS curriculums_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculums DROP CONSTRAINT IF EXISTS curriculums_department_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_plans DROP CONSTRAINT IF EXISTS curriculum_plans_curriculum_id_fkey;
ALTER TABLE IF EXISTS ONLY public.auth_tokens DROP CONSTRAINT IF EXISTS auth_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_actor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assets DROP CONSTRAINT IF EXISTS assets_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assets DROP CONSTRAINT IF EXISTS assets_location_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assets DROP CONSTRAINT IF EXISTS assets_custodian_id_fkey;
ALTER TABLE IF EXISTS ONLY public.assets DROP CONSTRAINT IF EXISTS assets_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_transfers DROP CONSTRAINT IF EXISTS asset_transfers_transferred_by_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_transfers DROP CONSTRAINT IF EXISTS asset_transfers_to_location_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_transfers DROP CONSTRAINT IF EXISTS asset_transfers_to_custodian_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_transfers DROP CONSTRAINT IF EXISTS asset_transfers_from_location_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_transfers DROP CONSTRAINT IF EXISTS asset_transfers_from_custodian_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_transfers DROP CONSTRAINT IF EXISTS asset_transfers_asset_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_locations DROP CONSTRAINT IF EXISTS asset_locations_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_inspections DROP CONSTRAINT IF EXISTS asset_inspections_inspector_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_inspections DROP CONSTRAINT IF EXISTS asset_inspections_asset_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_categories DROP CONSTRAINT IF EXISTS asset_categories_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.asset_categories DROP CONSTRAINT IF EXISTS asset_categories_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.admission_rounds DROP CONSTRAINT IF EXISTS admission_rounds_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.admission_rounds DROP CONSTRAINT IF EXISTS admission_rounds_curriculum_id_fkey;
ALTER TABLE IF EXISTS ONLY public.admission_applications DROP CONSTRAINT IF EXISTS admission_applications_tenant_id_fkey;
ALTER TABLE IF EXISTS ONLY public.admission_applications DROP CONSTRAINT IF EXISTS admission_applications_round_id_fkey;
ALTER TABLE IF EXISTS ONLY public.admission_applications DROP CONSTRAINT IF EXISTS admission_applications_reviewer_id_fkey;
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.user_tenants_user_id_tenant_id_key;
DROP INDEX IF EXISTS public.user_tenants_tenant_id_idx;
DROP INDEX IF EXISTS public.user_roles_user_tenant_id_role_id_scope_type_scope_id_key;
DROP INDEX IF EXISTS public.user_roles_role_id_idx;
DROP INDEX IF EXISTS public.tenants_code_key;
DROP INDEX IF EXISTS public.sample_items_tenant_id_idx;
DROP INDEX IF EXISTS public.roles_tenant_id_code_key;
DROP INDEX IF EXISTS public.research_projects_tenant_id_idx;
DROP INDEX IF EXISTS public.research_projects_principal_investigator_id_idx;
DROP INDEX IF EXISTS public.publications_tenant_id_idx;
DROP INDEX IF EXISTS public.publications_project_id_idx;
DROP INDEX IF EXISTS public.petitions_tenant_id_idx;
DROP INDEX IF EXISTS public.petitions_petition_type_id_idx;
DROP INDEX IF EXISTS public.petitions_petition_number_key;
DROP INDEX IF EXISTS public.petition_types_tenant_id_idx;
DROP INDEX IF EXISTS public.petition_types_tenant_id_code_key;
DROP INDEX IF EXISTS public.petition_actions_petition_id_idx;
DROP INDEX IF EXISTS public.personnel_profiles_tenant_id_idx;
DROP INDEX IF EXISTS public.personnel_profiles_tenant_id_employee_code_key;
DROP INDEX IF EXISTS public.personnel_profiles_department_id_idx;
DROP INDEX IF EXISTS public.personnel_educations_personnel_id_idx;
DROP INDEX IF EXISTS public.permissions_code_key;
DROP INDEX IF EXISTS public.news_posts_tenant_id_slug_key;
DROP INDEX IF EXISTS public.news_posts_tenant_id_idx;
DROP INDEX IF EXISTS public.news_posts_status_idx;
DROP INDEX IF EXISTS public.news_posts_category_id_idx;
DROP INDEX IF EXISTS public.news_categories_tenant_id_slug_key;
DROP INDEX IF EXISTS public.news_categories_tenant_id_idx;
DROP INDEX IF EXISTS public.news_categories_tenant_id_code_key;
DROP INDEX IF EXISTS public.news_attachments_post_id_idx;
DROP INDEX IF EXISTS public.documents_tenant_id_idx;
DROP INDEX IF EXISTS public.documents_document_type_id_idx;
DROP INDEX IF EXISTS public.documents_doc_number_key;
DROP INDEX IF EXISTS public.documents_created_by_id_idx;
DROP INDEX IF EXISTS public.document_types_tenant_id_idx;
DROP INDEX IF EXISTS public.document_types_tenant_id_code_key;
DROP INDEX IF EXISTS public.document_approvals_document_id_idx;
DROP INDEX IF EXISTS public.document_approvals_approver_id_idx;
DROP INDEX IF EXISTS public.departments_tenant_id_idx;
DROP INDEX IF EXISTS public.departments_tenant_id_code_key;
DROP INDEX IF EXISTS public.curriculums_tenant_id_idx;
DROP INDEX IF EXISTS public.curriculums_tenant_id_code_key;
DROP INDEX IF EXISTS public.curriculums_department_id_idx;
DROP INDEX IF EXISTS public.curriculums_degree_level_idx;
DROP INDEX IF EXISTS public.curriculum_plans_curriculum_id_idx;
DROP INDEX IF EXISTS public.auth_tokens_user_id_purpose_idx;
DROP INDEX IF EXISTS public.auth_tokens_token_hash_key;
DROP INDEX IF EXISTS public.audit_logs_tenant_id_entity_entity_id_idx;
DROP INDEX IF EXISTS public.audit_logs_tenant_id_created_at_idx;
DROP INDEX IF EXISTS public.assets_tenant_id_idx;
DROP INDEX IF EXISTS public.assets_location_id_idx;
DROP INDEX IF EXISTS public.assets_custodian_id_idx;
DROP INDEX IF EXISTS public.assets_asset_number_key;
DROP INDEX IF EXISTS public.asset_transfers_asset_id_idx;
DROP INDEX IF EXISTS public.asset_locations_tenant_id_idx;
DROP INDEX IF EXISTS public.asset_categories_tenant_id_idx;
DROP INDEX IF EXISTS public.asset_categories_tenant_id_code_key;
DROP INDEX IF EXISTS public.admission_rounds_tenant_id_idx;
DROP INDEX IF EXISTS public.admission_rounds_curriculum_id_idx;
DROP INDEX IF EXISTS public.admission_applications_tenant_id_idx;
DROP INDEX IF EXISTS public.admission_applications_round_id_idx;
DROP INDEX IF EXISTS public.admission_applications_app_number_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.user_tenants DROP CONSTRAINT IF EXISTS user_tenants_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.tenants DROP CONSTRAINT IF EXISTS tenants_pkey;
ALTER TABLE IF EXISTS ONLY public.sample_items DROP CONSTRAINT IF EXISTS sample_items_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.research_projects DROP CONSTRAINT IF EXISTS research_projects_pkey;
ALTER TABLE IF EXISTS ONLY public.research_members DROP CONSTRAINT IF EXISTS research_members_pkey;
ALTER TABLE IF EXISTS ONLY public.publications DROP CONSTRAINT IF EXISTS publications_pkey;
ALTER TABLE IF EXISTS ONLY public.petitions DROP CONSTRAINT IF EXISTS petitions_pkey;
ALTER TABLE IF EXISTS ONLY public.petition_types DROP CONSTRAINT IF EXISTS petition_types_pkey;
ALTER TABLE IF EXISTS ONLY public.petition_actions DROP CONSTRAINT IF EXISTS petition_actions_pkey;
ALTER TABLE IF EXISTS ONLY public.personnel_profiles DROP CONSTRAINT IF EXISTS personnel_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.personnel_educations DROP CONSTRAINT IF EXISTS personnel_educations_pkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.news_posts DROP CONSTRAINT IF EXISTS news_posts_pkey;
ALTER TABLE IF EXISTS ONLY public.news_categories DROP CONSTRAINT IF EXISTS news_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.news_attachments DROP CONSTRAINT IF EXISTS news_attachments_pkey;
ALTER TABLE IF EXISTS ONLY public.login_throttles DROP CONSTRAINT IF EXISTS login_throttles_pkey;
ALTER TABLE IF EXISTS ONLY public.documents DROP CONSTRAINT IF EXISTS documents_pkey;
ALTER TABLE IF EXISTS ONLY public.document_types DROP CONSTRAINT IF EXISTS document_types_pkey;
ALTER TABLE IF EXISTS ONLY public.document_approvals DROP CONSTRAINT IF EXISTS document_approvals_pkey;
ALTER TABLE IF EXISTS ONLY public.departments DROP CONSTRAINT IF EXISTS departments_pkey;
ALTER TABLE IF EXISTS ONLY public.curriculums DROP CONSTRAINT IF EXISTS curriculums_pkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_plans DROP CONSTRAINT IF EXISTS curriculum_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_tokens DROP CONSTRAINT IF EXISTS auth_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.assets DROP CONSTRAINT IF EXISTS assets_pkey;
ALTER TABLE IF EXISTS ONLY public.asset_transfers DROP CONSTRAINT IF EXISTS asset_transfers_pkey;
ALTER TABLE IF EXISTS ONLY public.asset_locations DROP CONSTRAINT IF EXISTS asset_locations_pkey;
ALTER TABLE IF EXISTS ONLY public.asset_inspections DROP CONSTRAINT IF EXISTS asset_inspections_pkey;
ALTER TABLE IF EXISTS ONLY public.asset_categories DROP CONSTRAINT IF EXISTS asset_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.admission_rounds DROP CONSTRAINT IF EXISTS admission_rounds_pkey;
ALTER TABLE IF EXISTS ONLY public.admission_applications DROP CONSTRAINT IF EXISTS admission_applications_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_tenants;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.tenants;
DROP TABLE IF EXISTS public.sample_items;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.research_projects;
DROP TABLE IF EXISTS public.research_members;
DROP TABLE IF EXISTS public.publications;
DROP TABLE IF EXISTS public.petitions;
DROP TABLE IF EXISTS public.petition_types;
DROP TABLE IF EXISTS public.petition_actions;
DROP TABLE IF EXISTS public.personnel_profiles;
DROP TABLE IF EXISTS public.personnel_educations;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS public.news_posts;
DROP TABLE IF EXISTS public.news_categories;
DROP TABLE IF EXISTS public.news_attachments;
DROP TABLE IF EXISTS public.login_throttles;
DROP TABLE IF EXISTS public.documents;
DROP TABLE IF EXISTS public.document_types;
DROP TABLE IF EXISTS public.document_approvals;
DROP TABLE IF EXISTS public.departments;
DROP TABLE IF EXISTS public.curriculums;
DROP TABLE IF EXISTS public.curriculum_plans;
DROP TABLE IF EXISTS public.auth_tokens;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.assets;
DROP TABLE IF EXISTS public.asset_transfers;
DROP TABLE IF EXISTS public.asset_locations;
DROP TABLE IF EXISTS public.asset_inspections;
DROP TABLE IF EXISTS public.asset_categories;
DROP TABLE IF EXISTS public.admission_rounds;
DROP TABLE IF EXISTS public.admission_applications;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TYPE IF EXISTS public."TokenPurpose";
DROP TYPE IF EXISTS public."ScopeType";
DROP TYPE IF EXISTS public."ResearchType";
DROP TYPE IF EXISTS public."ResearchStatus";
DROP TYPE IF EXISTS public."ResearchRole";
DROP TYPE IF EXISTS public."Quartile";
DROP TYPE IF EXISTS public."PublicationType";
DROP TYPE IF EXISTS public."PetitionStatus";
DROP TYPE IF EXISTS public."PetitionActionType";
DROP TYPE IF EXISTS public."PersonnelType";
DROP TYPE IF EXISTS public."NewsPostStatus";
DROP TYPE IF EXISTS public."DocumentStatus";
DROP TYPE IF EXISTS public."DocumentAction";
DROP TYPE IF EXISTS public."DegreeLevel";
DROP TYPE IF EXISTS public."AssetStatus";
DROP TYPE IF EXISTS public."AssetCondition";
DROP TYPE IF EXISTS public."ApplicationStatus";
DROP TYPE IF EXISTS public."AdmissionRoundStatus";
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: AdmissionRoundStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AdmissionRoundStatus" AS ENUM (
    'UPCOMING',
    'OPEN',
    'CLOSED',
    'ANNOUNCED'
);


ALTER TYPE public."AdmissionRoundStatus" OWNER TO postgres;

--
-- Name: ApplicationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApplicationStatus" AS ENUM (
    'SUBMITTED',
    'UNDER_REVIEW',
    'PASSED',
    'FAILED',
    'WAITLISTED'
);


ALTER TYPE public."ApplicationStatus" OWNER TO postgres;

--
-- Name: AssetCondition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssetCondition" AS ENUM (
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'POOR'
);


ALTER TYPE public."AssetCondition" OWNER TO postgres;

--
-- Name: AssetStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssetStatus" AS ENUM (
    'ACTIVE',
    'UNDER_REPAIR',
    'DISPOSED',
    'LOST'
);


ALTER TYPE public."AssetStatus" OWNER TO postgres;

--
-- Name: DegreeLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DegreeLevel" AS ENUM (
    'BACHELOR',
    'MASTER',
    'DOCTORAL',
    'CERTIFICATE'
);


ALTER TYPE public."DegreeLevel" OWNER TO postgres;

--
-- Name: DocumentAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentAction" AS ENUM (
    'APPROVED',
    'REJECTED',
    'RETURNED'
);


ALTER TYPE public."DocumentAction" OWNER TO postgres;

--
-- Name: DocumentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentStatus" AS ENUM (
    'DRAFT',
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."DocumentStatus" OWNER TO postgres;

--
-- Name: NewsPostStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NewsPostStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."NewsPostStatus" OWNER TO postgres;

--
-- Name: PersonnelType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PersonnelType" AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'EXTERNAL'
);


ALTER TYPE public."PersonnelType" OWNER TO postgres;

--
-- Name: PetitionActionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PetitionActionType" AS ENUM (
    'APPROVED',
    'REJECTED',
    'COMMENTED',
    'FORWARDED'
);


ALTER TYPE public."PetitionActionType" OWNER TO postgres;

--
-- Name: PetitionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PetitionStatus" AS ENUM (
    'SUBMITTED',
    'IN_REVIEW',
    'APPROVED',
    'REJECTED',
    'COMPLETED'
);


ALTER TYPE public."PetitionStatus" OWNER TO postgres;

--
-- Name: PublicationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PublicationType" AS ENUM (
    'JOURNAL',
    'CONFERENCE',
    'BOOK_CHAPTER',
    'PATENT'
);


ALTER TYPE public."PublicationType" OWNER TO postgres;

--
-- Name: Quartile; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Quartile" AS ENUM (
    'Q1',
    'Q2',
    'Q3',
    'Q4'
);


ALTER TYPE public."Quartile" OWNER TO postgres;

--
-- Name: ResearchRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ResearchRole" AS ENUM (
    'PI',
    'CO_PI',
    'RESEARCHER',
    'ASSISTANT'
);


ALTER TYPE public."ResearchRole" OWNER TO postgres;

--
-- Name: ResearchStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ResearchStatus" AS ENUM (
    'PROPOSED',
    'APPROVED',
    'IN_PROGRESS',
    'CANCELLED'
);


ALTER TYPE public."ResearchStatus" OWNER TO postgres;

--
-- Name: ResearchType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ResearchType" AS ENUM (
    'BASIC',
    'APPLIED',
    'INNOVATION'
);


ALTER TYPE public."ResearchType" OWNER TO postgres;

--
-- Name: ScopeType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ScopeType" AS ENUM (
    'ALL',
    'CAMPUS',
    'ORG_UNIT'
);


ALTER TYPE public."ScopeType" OWNER TO postgres;

--
-- Name: TokenPurpose; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TokenPurpose" AS ENUM (
    'EMAIL_VERIFY',
    'PASSWORD_RESET'
);


ALTER TYPE public."TokenPurpose" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: admission_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admission_applications (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    round_id uuid NOT NULL,
    app_number character varying(50) NOT NULL,
    applicant_name_th character varying(200) NOT NULL,
    applicant_name_en character varying(200) NOT NULL,
    id_card character varying(13) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30) NOT NULL,
    status public."ApplicationStatus" DEFAULT 'SUBMITTED'::public."ApplicationStatus" NOT NULL,
    score numeric(10,2),
    reviewer_id uuid,
    reviewer_note text,
    documents_meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    submitted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.admission_applications OWNER TO postgres;

--
-- Name: admission_rounds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admission_rounds (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name_th character varying(200) NOT NULL,
    name_en character varying(200) NOT NULL,
    academic_year integer NOT NULL,
    curriculum_id uuid NOT NULL,
    open_date timestamp with time zone,
    close_date timestamp with time zone,
    announce_date timestamp with time zone,
    quota integer DEFAULT 0 NOT NULL,
    status public."AdmissionRoundStatus" DEFAULT 'UPCOMING'::public."AdmissionRoundStatus" NOT NULL,
    requirements jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.admission_rounds OWNER TO postgres;

--
-- Name: asset_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_categories (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name_th character varying(200) NOT NULL,
    name_en character varying(200) NOT NULL,
    code character varying(50) NOT NULL,
    parent_id uuid
);


ALTER TABLE public.asset_categories OWNER TO postgres;

--
-- Name: asset_inspections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_inspections (
    asset_id uuid NOT NULL,
    inspector_id uuid NOT NULL,
    inspection_date date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    condition public."AssetCondition" NOT NULL,
    notes text
);


ALTER TABLE public.asset_inspections OWNER TO postgres;

--
-- Name: asset_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_locations (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    name character varying(200) NOT NULL,
    building character varying(100) NOT NULL,
    floor character varying(50) NOT NULL,
    room character varying(50) NOT NULL
);


ALTER TABLE public.asset_locations OWNER TO postgres;

--
-- Name: asset_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_transfers (
    id uuid NOT NULL,
    asset_id uuid NOT NULL,
    from_location_id uuid,
    to_location_id uuid NOT NULL,
    from_custodian_id uuid,
    to_custodian_id uuid NOT NULL,
    transferred_by uuid NOT NULL,
    transferred_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reason text
);


ALTER TABLE public.asset_transfers OWNER TO postgres;

--
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    asset_number character varying(100) NOT NULL,
    name character varying(500) NOT NULL,
    category_id uuid NOT NULL,
    serial_number character varying(200),
    brand character varying(200),
    model character varying(200),
    purchase_date date,
    purchase_price numeric(15,2),
    location_id uuid NOT NULL,
    custodian_id uuid NOT NULL,
    status public."AssetStatus" DEFAULT 'ACTIVE'::public."AssetStatus" NOT NULL,
    condition public."AssetCondition" DEFAULT 'GOOD'::public."AssetCondition" NOT NULL,
    image_url character varying(500),
    notes text,
    warranty_expiry date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    actor_id uuid,
    action character varying(100) NOT NULL,
    entity character varying(50) NOT NULL,
    entity_id character varying(64) NOT NULL,
    before jsonb,
    after jsonb,
    ip character varying(64),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: auth_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    purpose public."TokenPurpose" NOT NULL,
    token_hash character varying(128) NOT NULL,
    payload jsonb,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.auth_tokens OWNER TO postgres;

--
-- Name: curriculum_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curriculum_plans (
    id uuid NOT NULL,
    curriculum_id uuid NOT NULL,
    academic_year integer NOT NULL,
    semester integer NOT NULL,
    course_code character varying(50) NOT NULL,
    course_name_th character varying(200) NOT NULL,
    course_name_en character varying(200) NOT NULL,
    credits integer NOT NULL,
    course_type character varying(50) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.curriculum_plans OWNER TO postgres;

--
-- Name: curriculums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curriculums (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    department_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name_th character varying(255) NOT NULL,
    name_en character varying(255) NOT NULL,
    degree_level public."DegreeLevel" DEFAULT 'BACHELOR'::public."DegreeLevel" NOT NULL,
    total_credits integer NOT NULL,
    curriculum_year integer NOT NULL,
    philosophy_th text,
    philosophy_en text,
    career_prospects_th text,
    career_prospects_en text,
    tuition_fee integer,
    study_period_years integer DEFAULT 4 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.curriculums OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name_th character varying(200) NOT NULL,
    name_en character varying(200) NOT NULL,
    parent_id uuid,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: document_approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_approvals (
    id uuid NOT NULL,
    document_id uuid NOT NULL,
    step integer NOT NULL,
    approver_id uuid NOT NULL,
    action public."DocumentAction" NOT NULL,
    comment text,
    action_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.document_approvals OWNER TO postgres;

--
-- Name: document_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_types (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name_th character varying(200) NOT NULL,
    name_en character varying(200) NOT NULL,
    approval_steps jsonb DEFAULT '[]'::jsonb NOT NULL,
    template_url character varying(500),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.document_types OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    doc_number character varying(100) NOT NULL,
    document_type_id uuid NOT NULL,
    title character varying(500) NOT NULL,
    created_by_id uuid NOT NULL,
    status public."DocumentStatus" DEFAULT 'DRAFT'::public."DocumentStatus" NOT NULL,
    current_step integer DEFAULT 1 NOT NULL,
    file_url character varying(500),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    submitted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: login_throttles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_throttles (
    key character varying(320) NOT NULL,
    fail_count integer DEFAULT 0 NOT NULL,
    locked_until timestamp with time zone,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.login_throttles OWNER TO postgres;

--
-- Name: news_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_attachments (
    id uuid NOT NULL,
    post_id uuid NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url character varying(500) NOT NULL,
    file_size integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.news_attachments OWNER TO postgres;

--
-- Name: news_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_categories (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name_th character varying(100) NOT NULL,
    name_en character varying(100) NOT NULL,
    slug character varying(120) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.news_categories OWNER TO postgres;

--
-- Name: news_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_posts (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    title_th character varying(500) NOT NULL,
    title_en character varying(500) NOT NULL,
    slug character varying(600) NOT NULL,
    body_th text NOT NULL,
    body_en text NOT NULL,
    excerpt_th text,
    excerpt_en text,
    cover_image_url character varying(500),
    category_id uuid NOT NULL,
    status public."NewsPostStatus" DEFAULT 'DRAFT'::public."NewsPostStatus" NOT NULL,
    is_pinned boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone,
    author_id uuid,
    view_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.news_posts OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    code character varying(100) NOT NULL,
    module character varying(50) NOT NULL,
    action character varying(50) NOT NULL,
    description character varying(255)
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: personnel_educations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personnel_educations (
    id uuid NOT NULL,
    personnel_id uuid NOT NULL,
    degree character varying(100) NOT NULL,
    major character varying(200) NOT NULL,
    institution character varying(300) NOT NULL,
    graduation_year integer,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.personnel_educations OWNER TO postgres;

--
-- Name: personnel_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personnel_profiles (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid,
    employee_code character varying(50) NOT NULL,
    title_th character varying(50) NOT NULL,
    title_en character varying(50) NOT NULL,
    first_name_th character varying(100) NOT NULL,
    last_name_th character varying(100) NOT NULL,
    first_name_en character varying(100) NOT NULL,
    last_name_en character varying(100) NOT NULL,
    position_th character varying(200) NOT NULL,
    position_en character varying(200) NOT NULL,
    academic_rank character varying(100),
    department_id uuid NOT NULL,
    personnel_type public."PersonnelType" DEFAULT 'FULL_TIME'::public."PersonnelType" NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    photo_url character varying(500),
    bio_th text,
    bio_en text,
    expertise_tags jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.personnel_profiles OWNER TO postgres;

--
-- Name: petition_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.petition_actions (
    id uuid NOT NULL,
    petition_id uuid NOT NULL,
    actor_id uuid NOT NULL,
    action public."PetitionActionType" NOT NULL,
    comment text,
    action_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.petition_actions OWNER TO postgres;

--
-- Name: petition_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.petition_types (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name_th character varying(200) NOT NULL,
    name_en character varying(200) NOT NULL,
    description text,
    form_schema jsonb DEFAULT '{}'::jsonb NOT NULL,
    approval_flow jsonb DEFAULT '[]'::jsonb NOT NULL,
    sla_days integer DEFAULT 3 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.petition_types OWNER TO postgres;

--
-- Name: petitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.petitions (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    petition_number character varying(20) NOT NULL,
    petition_type_id uuid NOT NULL,
    student_id uuid,
    student_name character varying(200),
    student_id_card character varying(20),
    form_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    status public."PetitionStatus" DEFAULT 'SUBMITTED'::public."PetitionStatus" NOT NULL,
    current_step integer DEFAULT 1 NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb NOT NULL,
    due_date timestamp with time zone,
    submitted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.petitions OWNER TO postgres;

--
-- Name: publications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publications (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    title character varying(1000) NOT NULL,
    authors text[],
    journal_name character varying(500),
    publication_type public."PublicationType" NOT NULL,
    doi character varying(200),
    published_year integer,
    quartile public."Quartile",
    citation_count integer DEFAULT 0 NOT NULL,
    file_url character varying(500),
    external_url character varying(500),
    project_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.publications OWNER TO postgres;

--
-- Name: research_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.research_members (
    project_id uuid NOT NULL,
    personnel_id uuid NOT NULL,
    role public."ResearchRole" NOT NULL
);


ALTER TABLE public.research_members OWNER TO postgres;

--
-- Name: research_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.research_projects (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    title_th character varying(1000) NOT NULL,
    title_en character varying(1000),
    abstract_th text,
    abstract_en text,
    research_type public."ResearchType" NOT NULL,
    status public."ResearchStatus" DEFAULT 'PROPOSED'::public."ResearchStatus" NOT NULL,
    principal_investigator_id uuid NOT NULL,
    budget numeric(15,2),
    funding_source character varying(200),
    start_date date,
    end_date date,
    keywords text[],
    approved_by uuid,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.research_projects OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name_th character varying(100) NOT NULL,
    name_en character varying(100) NOT NULL,
    description character varying(500),
    is_system boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: sample_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sample_items (
    id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.sample_items OWNER TO postgres;

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name_th character varying(255) NOT NULL,
    name_en character varying(255) NOT NULL,
    logo_url character varying(500),
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid NOT NULL,
    user_tenant_id uuid NOT NULL,
    role_id uuid NOT NULL,
    scope_type public."ScopeType" DEFAULT 'ALL'::public."ScopeType" NOT NULL,
    scope_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tenants (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    joined_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_tenants OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    name character varying(255) NOT NULL,
    image_url character varying(500),
    provider character varying(20) DEFAULT 'credentials'::character varying NOT NULL,
    provider_id character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    must_change_password boolean DEFAULT false NOT NULL,
    locale character varying(5),
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
efe3c084-8ef9-421f-a247-1da61b0a49bd	0b37bf67c23295e217b0d7a1d3428a29cfc6c5fc57175fbf0c53aa6a6e347b9b	2026-09-10 14:12:14.936836+07	20260907020200_init	\N	\N	2026-09-10 14:12:14.844472+07	1
ec3eb1dc-f707-469c-9961-5e48471a49e0	16c8e283afed40a57060e2e41a3d629231d319a7067df0543aed23fb42afe2d8	2026-09-10 14:17:00.102095+07	20260910071700_add_sample_items	\N	\N	2026-09-10 14:17:00.019913+07	1
f6d2625a-2541-4965-bb1f-52578f438b10	91a1c00570a38cea0f9159e7b5e36991a39aedb5b1b59c8e89b1102feca9e32f	2026-09-10 15:10:26.061066+07	20260910081025_add_personnel_and_departments	\N	\N	2026-09-10 15:10:25.957524+07	1
545af41e-3f81-4af4-8201-9aab58e72dc7	597b5273f32faa5b652082fffeaf5710a80167d4cd399699ccfdc5160328609b	2026-09-10 15:23:04.889567+07	20260910082304_add_news_models	\N	\N	2026-09-10 15:23:04.791337+07	1
9b167272-e624-4046-adc9-ad10abb21ca7	291add3b3445d4ba7fa5845e82bd853a8a9fdacb00ddbf4bbcd1a9709ee49e88	2026-09-10 15:30:07.374622+07	20260910083007_add_curriculum_models	\N	\N	2026-09-10 15:30:07.322889+07	1
\.


--
-- Data for Name: admission_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admission_applications (id, tenant_id, round_id, app_number, applicant_name_th, applicant_name_en, id_card, email, phone, status, score, reviewer_id, reviewer_note, documents_meta, submitted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: admission_rounds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admission_rounds (id, tenant_id, name_th, name_en, academic_year, curriculum_id, open_date, close_date, announce_date, quota, status, requirements, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: asset_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_categories (id, tenant_id, name_th, name_en, code, parent_id) FROM stdin;
\.


--
-- Data for Name: asset_inspections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_inspections (asset_id, inspector_id, inspection_date, condition, notes) FROM stdin;
\.


--
-- Data for Name: asset_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_locations (id, tenant_id, name, building, floor, room) FROM stdin;
\.


--
-- Data for Name: asset_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_transfers (id, asset_id, from_location_id, to_location_id, from_custodian_id, to_custodian_id, transferred_by, transferred_at, reason) FROM stdin;
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, tenant_id, asset_number, name, category_id, serial_number, brand, model, purchase_date, purchase_price, location_id, custodian_id, status, condition, image_url, notes, warranty_expiry, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, tenant_id, actor_id, action, entity, entity_id, before, after, ip, created_at) FROM stdin;
\.


--
-- Data for Name: auth_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_tokens (id, user_id, purpose, token_hash, payload, expires_at, used_at, created_at) FROM stdin;
\.


--
-- Data for Name: curriculum_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curriculum_plans (id, curriculum_id, academic_year, semester, course_code, course_name_th, course_name_en, credits, course_type, sort_order, created_at) FROM stdin;
b193126c-b01d-4e2a-a2cc-020d603ad62d	acaa3f2a-bcdb-474b-a9e0-9f07c8ebd338	1	1	CS101	การเขียนโปรแกรมคอมพิวเตอร์ 1	Computer Programming I	3	วิชาแกน	0	2026-09-11 13:55:39.343+07
b30ab846-0deb-4bed-b902-f65af03ffbde	acaa3f2a-bcdb-474b-a9e0-9f07c8ebd338	1	1	MA101	แคลคูลัส 1	Calculus I	3	วิชาพื้นฐาน	0	2026-09-11 13:55:39.343+07
9a4be571-5f5b-423d-8cf1-4f345dbd2e7f	acaa3f2a-bcdb-474b-a9e0-9f07c8ebd338	1	2	CS102	โครงสร้างข้อมูลและอัลกอริทึม	Data Structures and Algorithms	3	วิชาแกน	0	2026-09-11 13:55:39.343+07
86b5c6c1-6c97-449e-bf23-f10d2faf1987	acaa3f2a-bcdb-474b-a9e0-9f07c8ebd338	2	1	CS201	สถาปัตยกรรมคอมพิวเตอร์	Computer Architecture	3	วิชาเฉพาะบังคับ	0	2026-09-11 13:55:39.343+07
72ae5fda-3e30-4d0d-bedc-256e0332a971	acaa3f2a-bcdb-474b-a9e0-9f07c8ebd338	2	2	CS202	ระบบฐานข้อมูล	Database Systems	3	วิชาเฉพาะบังคับ	0	2026-09-11 13:55:39.343+07
5dae3163-92e9-4260-8f53-2db0a2627940	c2195325-61d1-499c-89f9-472f623d7897	1	1	IT101	ความรู้เบื้องต้นเกี่ยวกับเทคโนโลยีสารสนเทศ	Introduction to IT	3	วิชาแกน	0	2026-09-11 13:55:39.354+07
e876f45a-215b-400d-bef3-77066ec072e4	c2195325-61d1-499c-89f9-472f623d7897	1	2	IT102	พื้นฐานเครือข่ายคอมพิวเตอร์	Computer Network Fundamentals	3	วิชาแกน	0	2026-09-11 13:55:39.354+07
db7df070-addd-4763-babf-27e925a029c0	c2195325-61d1-499c-89f9-472f623d7897	2	1	IT201	ความปลอดภัยของระบบสารสนเทศ	Information System Security	3	วิชาเฉพาะบังคับ	0	2026-09-11 13:55:39.354+07
\.


--
-- Data for Name: curriculums; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curriculums (id, tenant_id, department_id, code, name_th, name_en, degree_level, total_credits, curriculum_year, philosophy_th, philosophy_en, career_prospects_th, career_prospects_en, tuition_fee, study_period_years, is_active, sort_order, created_at, updated_at) FROM stdin;
3eb446af-3041-4dbb-9192-7e0d4e07065b	6c59db5b-8a98-41e0-beb6-a21c9236920e	725d886d-5be6-4010-9c08-38347fd3f4c6	2567M1CS	รัฐประศาสนศาสตรบัณฑิต	Bachelor of Public Administration	BACHELOR	36	2567	มุ่งเน้นการวิจัยและพัฒนาองค์ความรู้ระดับสูงทางวิทยาการคอมพิวเตอร์ โดยเน้นเทคโนโลยีเกิดใหม่ เช่น AI และ Quantum Computing	\N	\N	\N	45000	2	t	0	2026-09-11 13:55:39.359+07	2026-09-12 02:33:31.343+07
acaa3f2a-bcdb-474b-a9e0-9f07c8ebd338	6c59db5b-8a98-41e0-beb6-a21c9236920e	725d886d-5be6-4010-9c08-38347fd3f4c6	256601CS	สาขาวิชาการจัดการเชิงพุทธ	Bachelor of Arts Program in Buddhist Management	BACHELOR	129	2566	มุ่งเน้นการผลิตบัณฑิตที่มีความรู้ความสามารถทางการพัฒนาซอฟต์แวร์ ปัญญาประดิษฐ์ และระบบคอมพิวเตอร์สมัยใหม่	\N	- นักพัฒนาซอฟต์แวร์ (Software Developer)\n- วิศวกรข้อมูล (Data Engineer)\n- นักวิทยาศาสตร์ข้อมูล (Data Scientist)	\N	25000	4	t	0	2026-09-11 13:55:39.339+07	2026-09-12 02:34:18+07
c2195325-61d1-499c-89f9-472f623d7897	6c59db5b-8a98-41e0-beb6-a21c9236920e	725d886d-5be6-4010-9c08-38347fd3f4c6	256602IT	ประกาศนียบัตรการบริหารกิจการคณะสงฆ์	Certificate Program in Sangha Administration	CERTIFICATE	125	2566	ผลิตบัณฑิตให้มีความเชี่ยวชาญด้านการประยุกต์ใช้เทคโนโลยีสารสนเทศ การบริหารจัดการเครือข่าย และความปลอดภัยไซเบอร์	\N	- นักวิเคราะห์ระบบสารสนเทศ (System Analyst)\n- ผู้ดูแลระบบเครือข่าย (Network Administrator)\n- ผู้เชี่ยวชาญความปลอดภัยไซเบอร์ (Cybersecurity Specialist)	\N	22000	4	t	0	2026-09-11 13:55:39.35+07	2026-09-12 02:35:22.558+07
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, tenant_id, code, name_th, name_en, parent_id, sort_order, created_at, updated_at) FROM stdin;
725d886d-5be6-4010-9c08-38347fd3f4c6	6c59db5b-8a98-41e0-beb6-a21c9236920e	CS	คณะสังคมศาสตร์	Faculty of Social Sciences	\N	1	2026-09-11 13:55:39.237+07	2026-09-12 02:33:02.41+07
\.


--
-- Data for Name: document_approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_approvals (id, document_id, step, approver_id, action, comment, action_at) FROM stdin;
\.


--
-- Data for Name: document_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_types (id, tenant_id, code, name_th, name_en, approval_steps, template_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, tenant_id, doc_number, document_type_id, title, created_by_id, status, current_step, file_url, metadata, submitted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: login_throttles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_throttles (key, fail_count, locked_until, updated_at) FROM stdin;
\.


--
-- Data for Name: news_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_attachments (id, post_id, file_name, file_url, file_size, created_at) FROM stdin;
\.


--
-- Data for Name: news_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_categories (id, tenant_id, code, name_th, name_en, slug, sort_order, created_at, updated_at) FROM stdin;
b4450ba8-aeb8-423a-8953-3b625363eb29	6c59db5b-8a98-41e0-beb6-a21c9236920e	ACADEMIC	ข่าววิชาการและงานวิจัย	Academic & Research News	academic	1	2026-09-11 13:55:39.293+07	2026-09-11 13:55:39.293+07
00a63b11-81c8-4074-8021-ec36ac6a9ea9	6c59db5b-8a98-41e0-beb6-a21c9236920e	SCHOLARSHIP	ทุนการศึกษาและการแข่งขัน	Scholarships & Competitions	scholarships	2	2026-09-11 13:55:39.303+07	2026-09-11 13:55:39.303+07
e7a11c88-87c5-4d79-9c7e-858d2b9a0148	6c59db5b-8a98-41e0-beb6-a21c9236920e	EVENT	ข่าวกิจกรรมและการอบรม	Events & Workshops	events	3	2026-09-11 13:55:39.307+07	2026-09-11 13:55:39.307+07
\.


--
-- Data for Name: news_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_posts (id, tenant_id, title_th, title_en, slug, body_th, body_en, excerpt_th, excerpt_en, cover_image_url, category_id, status, is_pinned, published_at, author_id, view_count, created_at, updated_at) FROM stdin;
9c9b28c1-eab0-4b22-a790-1376ac6bd241	6c59db5b-8a98-41e0-beb6-a21c9236920e	คณะเปิดตัวหลักสูตรใหม่ ปริญญาตรี AI & Data Engineering ตอบรับความต้องการอุตสาหกรรมดิจิทัลระดับสากล	Faculty Launches New Bachelor's Program in AI & Data Engineering to Meet Global Digital Industry Demands	new-curriculum-ai-data-engineering	คณะมีความยินดีประกาศเปิดหลักสูตรใหม่ วิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล (Bachelor of Engineering in Artificial Intelligence and Data Engineering)\n\nหลักสูตรนี้ได้รับการออกแบบร่วมกับผู้เชี่ยวชาญจากภาคอุตสาหกรรมเทคโนโลยีชั้นนำทั้งในและต่างประเทศ เพื่อสร้างบัณฑิตที่มีทักษะการปฏิบัติงานจริงในด้าน:\n1. สถาปัตยกรรม Machine Learning และโมเดลภาษาขนาดใหญ่ (LLMs)\n2. ระบบวิศวกรรมข้อมูลขนาดใหญ่ (Data Pipelines & Cloud Data Warehousing)\n3. ความมั่นคงปลอดภัยและจริยธรรมของปัญญาประดิษฐ์ (AI Ethics & Governance)\n\nผู้ที่สนใจสามารถศึกษาเกณฑ์การรับสมัครและคุณสมบัติได้ในระบบรับสมัครนิสิตใหม่	The Faculty is proud to announce the launch of our new program: Bachelor of Engineering in Artificial Intelligence and Data Engineering.\n\nDesigned in close collaboration with tech industry leaders, the program prepares graduates for real-world excellence in:\n1. Machine Learning Architectures & LLMs\n2. Big Data Pipelines & Cloud Infrastructure\n3. AI Ethics & Governance	เปิดรับนิสิตรุ่นแรกปีการศึกษา 2569 มุ่งเน้นการบูรณาการ Generative AI, Large Language Models และระบบประมวลผล Cloud ขั้นสูง	First cohort intake for Academic Year 2026 focusing on Generative AI, Large Language Models, and advanced Cloud computing.	https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80	b4450ba8-aeb8-423a-8953-3b625363eb29	PUBLISHED	t	2026-09-09 13:55:39.312+07	966ff26c-5e24-4d58-a162-717bde229822	142	2026-09-11 13:55:39.321+07	2026-09-11 13:55:39.321+07
9e58980b-a928-4a3b-97e7-98b7fdb749ce	6c59db5b-8a98-41e0-beb6-a21c9236920e	เปิดรับสมัครทุนการศึกษาเรียนดีและทุนวิจัยระดับบัณฑิตศึกษา ประจำปีการศึกษา 2569	Call for Applications: Graduate Excellence & Research Scholarships for Academic Year 2026	scholarship-opportunity-2026	คณะเปิดรับสมัครผู้ขอรับทุนการศึกษาเพื่อส่งเสริมศักยภาพทางวิชาการและงานวิจัยขั้นสูง ประจำปีการศึกษา 2569\n\nประเภททุนการศึกษา:\n- ทุนยกเว้นค่าธรรมเนียมการศึกษา 100%\n- ทุนผู้ช่วยสอนและผู้ช่วยวิจัย (TA/RA) พร้อมเงินสนับสนุนรายเดือน\n- ทุนสนับสนุนการนำเสนอผลงานวิชาการในที่ประชุมวิชาการระดับนานาชาติ\n\nกำหนดการรับสมัคร: ตั้งแต่วันนี้ จนถึงวันที่ 30 พฤศจิกายน 2569 ผ่านระบบออนไลน์	Applications are now open for Academic Year 2026 Graduate Excellence & Research Scholarships.\n\nAvailable Scholarship Categories:\n- 100% Tuition Fee Waiver\n- Teaching and Research Assistantships (TA/RA) with monthly stipend\n- International Conference Travel Grants\n\nApplication Deadline: November 30, 2026 through the online portal.	สนับสนุนค่าเล่าเรียนเต็มจำนวนพร้อมค่าใช้จ่ายรายเดือน สำหรับนิสิตระดับปริญญาโทและเอกที่ทำวิจัยนวัตกรรม	Full tuition waiver plus monthly stipend for Master and Ph.D. students conducting innovative research.	https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80	00a63b11-81c8-4074-8021-ec36ac6a9ea9	PUBLISHED	t	2026-09-06 13:55:39.312+07	966ff26c-5e24-4d58-a162-717bde229822	89	2026-09-11 13:55:39.326+07	2026-09-11 13:55:39.326+07
b90f00e8-0958-4f60-9018-f1158f0fd1d7	6c59db5b-8a98-41e0-beb6-a21c9236920e	ขอเชิญเข้าร่วมงานประชุมวิชาการระดับชาติ Digital Transformation in Higher Education 2026	Invitation: National Conference on Digital Transformation in Higher Education 2026	conference-digital-transformation-2026	ขอเชิญคณาจารย์ นิสิตนักศึกษา นักวิจัย และบุคคลทั่วไป เข้าร่วมงานประชุมวิชาการระดับชาติ Digital Transformation in Higher Education 2026\n\nหัวข้อการบรรยายพิเศษ:\n- บทบาทของ Generative AI ในการเรียนการสอนยุคใหม่\n- การพัฒนา Modular Monolith Platform สำหรับสถาบันการศึกษา\n- การรักษาความมั่นคงปลอดภัยไซเบอร์ในระบบสารสนเทศมหาวิทยาลัย\n\nงานจัดขึ้น ณ หอประชุมใหญ่ประจำคณะ และถ่ายทอดสดผ่านระบบออนไลน์	You are cordially invited to join the National Conference on Digital Transformation in Higher Education 2026.\n\nFeatured Sessions:\n- The role of Generative AI in modern pedagogical practices\n- Developing enterprise modular monolith platforms for higher education\n- University-wide cybersecurity risk management	พบกับการบรรยายพิเศษจากคณาจารย์และผู้ทรงคุณวุฒิ พร้อมการนำเสนองานวิจัยด้าน EdTech และ AI in Education	Keynote sessions from distinguished faculty and researchers showcasing EdTech innovations and AI in education.	https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80	e7a11c88-87c5-4d79-9c7e-858d2b9a0148	PUBLISHED	f	2026-09-04 13:55:39.312+07	966ff26c-5e24-4d58-a162-717bde229822	56	2026-09-11 13:55:39.33+07	2026-09-11 13:55:39.33+07
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, code, module, action, description) FROM stdin;
eeaf3f50-74e1-49c3-be8d-d2230c525e45	users:read	users	read	\N
32084cb8-af41-4c3b-8a1b-ddecf1c5dbc4	users:manage	users	manage	\N
6184eac4-a934-44ba-8a26-341588cdbe93	roles:manage	roles	manage	\N
e42cf1ab-1e06-4611-a9b0-a6031e765540	settings:manage	settings	manage	\N
2873a611-c228-4c1c-b238-b56f1425aff3	audit:read	audit	read	\N
b5b32b32-a429-48a5-825c-b9e80027c693	sample:read	sample	read	\N
aa39afc9-3070-44bc-99d0-5425220ec7aa	sample:manage	sample	manage	\N
7c66f738-27bd-4332-ada6-802ede4b600f	personnel:read	personnel	read	ดูข้อมูลบุคลากร
d24dd720-6b8f-4ec9-8781-b826affb812c	personnel:write	personnel	write	เพิ่ม/แก้ไขข้อมูลบุคลากร
4e1ec03e-c9e6-4990-b729-b029d2c44dbe	personnel:delete	personnel	delete	ลบข้อมูลบุคลากร
68381215-c01c-42c7-a4f7-d6310df542af	personnel:department:manage	personnel	manage_dept	จัดการภาควิชา/หน่วยงาน
2a2554a5-8485-4de8-9151-b8b8e28e75d8	news:read	news	read	ดูรายการข่าวสาร
12bfda07-b032-4309-bf0f-e00904e092d9	news:write	news	write	สร้างและแก้ไขเนื้อหาข่าว
65bfc44c-50f8-49bc-a5f5-92edbf93f5e8	news:publish	news	publish	เผยแพร่ข่าวและจัดเก็บ
454b3330-d558-4445-a133-6b55be46f5f0	news:delete	news	delete	ลบข่าวสาร
b88fbf66-aa9e-4759-bc57-22d82ef02358	news:category:manage	news	category_manage	จัดการหมวดหมู่ข่าว
7d08b6d5-4f17-4383-99c7-9d2dbf060785	curriculum:read	curriculum	read	ดูข้อมูลหลักสูตร
a74f0337-3394-4567-ae7b-aef553be5e42	curriculum:write	curriculum	write	เพิ่ม/แก้ไขหลักสูตร
e8b43af2-4a7f-4da7-a649-db3ed71b8489	curriculum:manage	curriculum	manage_plan	จัดการแผนการเรียนรายวิชา
7b34df8f-6d11-4636-b88a-5d8c853778a5	curriculum:delete	curriculum	delete	ลบหลักสูตร
b10485fd-2a43-42a0-a0ef-e893ec1766c1	document:read	document	read	ดูเอกสารทั้งหมด
14126aa8-db31-4360-8a60-4a95c57de993	document:write	document	write	สร้างและส่งเอกสาร
b4573425-fcc4-4e01-b4be-3ad4b4689486	document:approve	document	approve	อนุมัติ/ปฏิเสธเอกสาร
7010c4bc-7b9d-461c-a049-34c41ddc8006	document:manage	document	manage	จัดการประเภทเอกสารและการตั้งค่า
dac6f83b-ec2a-4448-95bf-134a0e118807	admission:read	admission	read	ดูข้อมูลการรับสมัคร
106b1c96-3c71-423a-a350-a7f6431a5c5b	admission:write	admission	write	ส่งใบสมัคร/จัดการใบสมัครของตนเอง
5e574e1a-1639-42b1-8d61-f6a0ebcbad51	admission:review	admission	review	ตรวจและประเมินใบสมัคร
5dc56939-8465-4ba0-b83c-55cfc24d5807	admission:manage	admission	manage	จัดการรอบการรับสมัครและเกณฑ์
09b110dc-6584-49bd-90d8-a15d42787a72	research:read	research	read	ดูงานวิจัยและบทความ
4a6dfa41-5d2b-41e4-9d35-35af6ae9cd55	research:write	research	write	เสนอโครงการ/เพิ่มบทความ
26cae5b3-0b6e-42fb-a5be-4187f60d97b5	research:approve	research	approve	อนุมัติโครงการวิจัย
3d9cbfad-0c0f-4dec-a5d9-aca6c3316877	research:manage	research	manage	จัดการงานวิจัยและบทความทั้งหมด
2b18b021-4744-42e4-82cc-f7a54d23ec95	petition:read	petition	read	ดูข้อมูลคำร้อง
a323e1ae-d9c2-4850-ba8d-467ee8a4b5d8	petition:submit	petition	submit	ยื่นคำร้อง
27199d6f-ee75-43aa-8a9a-d231cb22bf1b	petition:process	petition	process	ดำเนินการ/ส่งต่อคำร้อง
fc909bf6-4306-4372-89f0-b1357c5862ea	petition:approve	petition	approve	อนุมัติ/ปฏิเสธคำร้อง
0c3cfb85-0c49-4d52-a503-17d1fa98591b	petition:manage	petition	manage	จัดการประเภทคำร้องทั้งหมด
f781ba29-1f54-4c4a-88a4-fbe355b38396	asset:read	asset	read	ดูรายการครุภัณฑ์
ef635224-b032-4f3e-b4a8-8e24b80b0d79	asset:write	asset	write	เพิ่ม/แก้ไขครุภัณฑ์
40d688b1-d11a-4926-bd65-d39ed97cadb8	asset:transfer	asset	transfer	โอนย้ายครุภัณฑ์
4023ad0e-cccf-43ac-954c-c91ddfd923c1	asset:dispose	asset	dispose	จำหน่ายครุภัณฑ์
32205796-4586-4684-8b94-f18fbfc20a75	asset:manage	asset	manage	จัดการหมวดหมู่และสถานที่
\.


--
-- Data for Name: personnel_educations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personnel_educations (id, personnel_id, degree, major, institution, graduation_year, sort_order, created_at) FROM stdin;
f8cd18f7-5473-469b-95be-6349af1df575	981bb26b-b655-438f-b472-d6b6f56e6149	Ph.D. in Computer Science	AI & Neural Networks	Stanford University	2005	1	2026-09-11 13:55:39.26+07
21ca3063-316a-4312-97a0-c4c34b9382fc	981bb26b-b655-438f-b472-d6b6f56e6149	M.S. in Computer Science	Computer Science	Chulalongkorn University	2000	2	2026-09-11 13:55:39.26+07
ee202e4f-6b13-452f-acef-18668f9904b1	981bb26b-b655-438f-b472-d6b6f56e6149	B.S. in Computer Science	Computer Science	Chulalongkorn University	1998	3	2026-09-11 13:55:39.26+07
89058b1b-95e1-46a1-999d-3c8f76eed145	e77ba396-8854-4d5a-864b-3de67d682eb8	Ph.D. in Computer Science	Natural Language Processing	Edinburgh University	2021	1	2026-09-11 13:55:39.288+07
43513501-add7-4ab0-a2fb-8e877a3c12ea	e77ba396-8854-4d5a-864b-3de67d682eb8	B.Sc. in Computer Science	Computer Science (1st Class Honors)	Mahidol University	2016	2	2026-09-11 13:55:39.288+07
4c83ff7d-e46a-4db9-a730-70680dec6658	b707388e-c5f6-47e9-9840-05b1427e1a67	M.S. in Information Technology	Network & Security	King Mongkut's Institute of Technology Ladkrabang	2010	0	2026-09-12 02:40:53.147+07
a8f26746-3968-4be3-8297-34775fd80ca8	b707388e-c5f6-47e9-9840-05b1427e1a67	B.S. in Information Technology	Information Technology	King Mongkut's University of Technology North Bangkok	2006	1	2026-09-12 02:40:53.147+07
580aa473-8ffe-43ed-b243-6bfae8d312a6	0cd4354b-c546-42d2-992c-bf3f2580a4eb	Ph.D. in Software Engineering	Software Architecture	Tokyo Institute of Technology	2012	0	2026-09-12 02:40:57.726+07
18f7f909-ee22-469a-8f62-5fff1ea292ac	0cd4354b-c546-42d2-992c-bf3f2580a4eb	M.Eng. in Computer Engineering	Computer Engineering	Kasetsart University	2007	1	2026-09-12 02:40:57.726+07
\.


--
-- Data for Name: personnel_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personnel_profiles (id, tenant_id, user_id, employee_code, title_th, title_en, first_name_th, last_name_th, first_name_en, last_name_en, position_th, position_en, academic_rank, department_id, personnel_type, email, phone, photo_url, bio_th, bio_en, expertise_tags, is_active, sort_order, created_at, updated_at) FROM stdin;
981bb26b-b655-438f-b472-d6b6f56e6149	6c59db5b-8a98-41e0-beb6-a21c9236920e	\N	FMS-001	ศ.ดร.	Prof. Dr.	สมชาย	ใจดี	Somchai	Jaidee	คณบดี และอาจารย์ประจำภาควิชา	Dean & Professor of Computer Science	ศาสตราจารย์	725d886d-5be6-4010-9c08-38347fd3f4c6	FULL_TIME	somchai.j@app.local	02-123-4567	https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80	ผู้เชี่ยวชาญด้านปัญญาประดิษฐ์และวิทยาการข้อมูล มีประสบการณ์สอนและวิจัยกว่า 25 ปี ดำรงตำแหน่งคณบดีประจำคณะ	Expert in Artificial Intelligence and Data Science with over 25 years of teaching and research experience.	["Artificial Intelligence", "Machine Learning", "Data Science", "Computer Vision"]	t	0	2026-09-11 13:55:39.26+07	2026-09-11 13:55:39.26+07
e77ba396-8854-4d5a-864b-3de67d682eb8	6c59db5b-8a98-41e0-beb6-a21c9236920e	\N	FMS-004	ดร.	Dr.	กานดา	สุวรรณรัตน์	Kanda	Suwannarat	อาจารย์ประจำภาควิชาวิทยาการคอมพิวเตอร์	Lecturer in Computer Science	อาจารย์	725d886d-5be6-4010-9c08-38347fd3f4c6	FULL_TIME	kanda.s@app.local	02-123-4570	https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80	นักวิจัยด้านการประมวลผลภาษาธรรมชาติ (NLP) และโมเดลภาษาขนาดใหญ่ (LLM) สำหรับภาษาไทย	Researcher specializing in Natural Language Processing (NLP) and Large Language Models (LLM) for Thai language.	["NLP", "LLM", "Generative AI", "Python"]	t	0	2026-09-11 13:55:39.288+07	2026-09-11 13:55:39.288+07
b707388e-c5f6-47e9-9840-05b1427e1a67	6c59db5b-8a98-41e0-beb6-a21c9236920e	\N	FMS-003	ผศ.	Asst. Prof.	วิชัย	เก่งการช่าง	Wichai	Kengkarnchang	หัวหน้าภาควิชาเทคโนโลยีสารสนเทศ	Head of Information Technology Department	ผู้ช่วยศาสตราจารย์	725d886d-5be6-4010-9c08-38347fd3f4c6	FULL_TIME	wichai.k@app.local	02-123-4569	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80	เชี่ยวชาญด้านความมั่นคงปลอดภัยไซเบอร์ เครือข่ายคอมพิวเตอร์ และระบบบริหารจัดการฐานข้อมูลขนาดใหญ่	Specialist in Cybersecurity, Computer Networks, and Big Data Database Management.	["Cybersecurity", "Network Systems", "Database Management", "IoT"]	t	0	2026-09-11 13:55:39.28+07	2026-09-12 02:40:53.147+07
0cd4354b-c546-42d2-992c-bf3f2580a4eb	6c59db5b-8a98-41e0-beb6-a21c9236920e	\N	FMS-002	รศ.ดร.	Assoc. Prof. Dr.	อรทัย	พัฒนศิลป์	Orathai	Pattanasilp	รองคณบดีฝ่ายวิชาการ	Associate Dean for Academic Affairs	รองศาสตราจารย์	725d886d-5be6-4010-9c08-38347fd3f4c6	FULL_TIME	orathai.p@app.local	02-123-4568	https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80	หัวหน้ากลุ่มวิจัยวิศวกรรมซอฟต์แวร์และการพัฒนาเว็บแอพพลิเคชันระดับองค์กร	Head of Software Engineering Research Group and enterprise web development specialist.	["Software Architecture", "Cloud Computing", "DevOps", "Modular Monolith"]	t	0	2026-09-11 13:55:39.273+07	2026-09-12 02:40:57.726+07
\.


--
-- Data for Name: petition_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.petition_actions (id, petition_id, actor_id, action, comment, action_at) FROM stdin;
\.


--
-- Data for Name: petition_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.petition_types (id, tenant_id, code, name_th, name_en, description, form_schema, approval_flow, sla_days, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: petitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.petitions (id, tenant_id, petition_number, petition_type_id, student_id, student_name, student_id_card, form_data, status, current_step, attachments, due_date, submitted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publications (id, tenant_id, title, authors, journal_name, publication_type, doi, published_year, quartile, citation_count, file_url, external_url, project_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: research_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.research_members (project_id, personnel_id, role) FROM stdin;
\.


--
-- Data for Name: research_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.research_projects (id, tenant_id, title_th, title_en, abstract_th, abstract_en, research_type, status, principal_investigator_id, budget, funding_source, start_date, end_date, keywords, approved_by, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
df495de7-d623-45e3-b874-c798a8e49b2f	eeaf3f50-74e1-49c3-be8d-d2230c525e45
df495de7-d623-45e3-b874-c798a8e49b2f	32084cb8-af41-4c3b-8a1b-ddecf1c5dbc4
df495de7-d623-45e3-b874-c798a8e49b2f	6184eac4-a934-44ba-8a26-341588cdbe93
df495de7-d623-45e3-b874-c798a8e49b2f	e42cf1ab-1e06-4611-a9b0-a6031e765540
df495de7-d623-45e3-b874-c798a8e49b2f	2873a611-c228-4c1c-b238-b56f1425aff3
a1eacaa8-db9e-4baf-9252-5779d7f49ac5	eeaf3f50-74e1-49c3-be8d-d2230c525e45
355b396b-61fd-438d-b7e6-7f7376a3f3ed	eeaf3f50-74e1-49c3-be8d-d2230c525e45
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, tenant_id, code, name_th, name_en, description, is_system, created_at, updated_at) FROM stdin;
17373540-7cbe-4f94-82d1-698561934c68	6c59db5b-8a98-41e0-beb6-a21c9236920e	SUPER_ADMIN	ผู้ดูแลสูงสุด	Super admin	\N	t	2026-09-11 13:55:38.834+07	2026-09-11 13:55:38.834+07
df495de7-d623-45e3-b874-c798a8e49b2f	6c59db5b-8a98-41e0-beb6-a21c9236920e	ADMIN	ผู้ดูแลระบบ	Administrator	\N	f	2026-09-11 13:55:38.841+07	2026-09-11 13:55:38.841+07
a1eacaa8-db9e-4baf-9252-5779d7f49ac5	6c59db5b-8a98-41e0-beb6-a21c9236920e	STAFF	เจ้าหน้าที่	Staff	\N	f	2026-09-11 13:55:38.863+07	2026-09-11 13:55:38.863+07
355b396b-61fd-438d-b7e6-7f7376a3f3ed	6c59db5b-8a98-41e0-beb6-a21c9236920e	VIEWER	ผู้ดู	Viewer	\N	f	2026-09-11 13:55:38.867+07	2026-09-11 13:55:38.867+07
\.


--
-- Data for Name: sample_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sample_items (id, tenant_id, title, description, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (id, code, name_th, name_en, logo_url, settings, is_active, created_at, updated_at) FROM stdin;
6c59db5b-8a98-41e0-beb6-a21c9236920e	DEMO	วิทยาลัยสงฆ์ตาก	mcutak	/uploads/logo-1789115643437.png	{"smtp": {"from": "ragnaroknaja888@gmail.com", "host": "smtp.gmail.com", "pass": "oxwpqcazgygxhorz", "port": 465, "user": "ragnaroknaja888@gmail.com", "secure": true, "enabled": true, "service": "gmail"}, "palette": "green"}	t	2026-09-11 13:55:38.575+07	2026-09-11 14:09:22.915+07
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_tenant_id, role_id, scope_type, scope_id, created_at) FROM stdin;
8dac05e0-e9d3-42ff-a32b-35223ea0e592	dbd6abc2-1d14-48cb-99ec-87e02611ccfa	17373540-7cbe-4f94-82d1-698561934c68	ALL	\N	2026-09-11 13:55:39.198+07
79c57f38-1c43-4051-b409-d98555e3ee49	01fdcd6e-45ec-43e5-9e48-a5c59a117625	a1eacaa8-db9e-4baf-9252-5779d7f49ac5	ALL	\N	2026-09-11 13:55:39.208+07
78bdff7f-b1cb-42da-8334-4d99a93922da	8dd83ada-5755-41ef-959f-76016e392685	355b396b-61fd-438d-b7e6-7f7376a3f3ed	ALL	\N	2026-09-11 13:55:39.215+07
14f12fc5-2c4a-406e-b10d-47db910f2526	85bbae9f-3330-4249-80f1-0bb519153a14	355b396b-61fd-438d-b7e6-7f7376a3f3ed	ALL	\N	2026-09-11 13:55:39.225+07
510acb16-8596-40b0-a4c4-f1e56fa662dd	9a00abab-405d-44bb-8de3-7837716cb94d	355b396b-61fd-438d-b7e6-7f7376a3f3ed	ALL	\N	2026-09-11 13:55:39.232+07
\.


--
-- Data for Name: user_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tenants (id, user_id, tenant_id, is_active, joined_at) FROM stdin;
dbd6abc2-1d14-48cb-99ec-87e02611ccfa	966ff26c-5e24-4d58-a162-717bde229822	6c59db5b-8a98-41e0-beb6-a21c9236920e	t	2026-09-11 13:55:39.187+07
01fdcd6e-45ec-43e5-9e48-a5c59a117625	63bd2879-0894-4b55-b7f9-3ff65826db41	6c59db5b-8a98-41e0-beb6-a21c9236920e	t	2026-09-11 13:55:39.205+07
8dd83ada-5755-41ef-959f-76016e392685	a8b99266-fd91-4d11-9401-8ac5bedf7cf0	6c59db5b-8a98-41e0-beb6-a21c9236920e	t	2026-09-11 13:55:39.212+07
85bbae9f-3330-4249-80f1-0bb519153a14	56ce7633-3c46-4896-aa4f-7b5dbd89e59f	6c59db5b-8a98-41e0-beb6-a21c9236920e	t	2026-09-11 13:55:39.222+07
9a00abab-405d-44bb-8de3-7837716cb94d	2421ffff-e810-4da1-b84a-89282f24bea7	6c59db5b-8a98-41e0-beb6-a21c9236920e	t	2026-09-11 13:55:39.229+07
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, name, image_url, provider, provider_id, email_verified, is_active, must_change_password, locale, last_login_at, created_at, updated_at) FROM stdin;
63bd2879-0894-4b55-b7f9-3ff65826db41	staff@app.local	$2b$12$cJJj9cZgYByBR2GCcK6XweMseBlsLYOInlpOMLadEvWb/kjJURglW	เจ้าหน้าที่	\N	credentials	\N	t	t	f	\N	\N	2026-09-11 13:55:39.202+07	2026-09-11 13:55:39.202+07
a8b99266-fd91-4d11-9401-8ac5bedf7cf0	viewer@app.local	$2b$12$cJJj9cZgYByBR2GCcK6XweMseBlsLYOInlpOMLadEvWb/kjJURglW	ผู้ดู	\N	credentials	\N	t	t	f	\N	\N	2026-09-11 13:55:39.21+07	2026-09-11 13:55:39.21+07
56ce7633-3c46-4896-aa4f-7b5dbd89e59f	lockme@app.local	$2b$12$cJJj9cZgYByBR2GCcK6XweMseBlsLYOInlpOMLadEvWb/kjJURglW	บัญชีทดสอบล็อก	\N	credentials	\N	t	t	f	\N	\N	2026-09-11 13:55:39.219+07	2026-09-11 13:55:39.219+07
2421ffff-e810-4da1-b84a-89282f24bea7	forced@app.local	$2b$12$cJJj9cZgYByBR2GCcK6XweMseBlsLYOInlpOMLadEvWb/kjJURglW	บัญชีบังคับเปลี่ยนรหัส	\N	credentials	\N	t	t	t	\N	\N	2026-09-11 13:55:39.227+07	2026-09-11 13:55:39.227+07
966ff26c-5e24-4d58-a162-717bde229822	ragnaroknaja888@gmail.com	$2b$12$3P4Kn4Lo4euPb9cpsPYktOuG0ZytNdA4ErdEgaLeA2gYmuyTebDTK	ผู้ดูแลสูงสุด	https://lh3.googleusercontent.com/a/ACg8ocLrgIQRqH54pjplzhcjSjM3dtJaMJSiv923f4xwonRs0LiGPw=s96-c	google	102063895045850453211	t	t	f	\N	2026-09-12 02:09:31.16+07	2026-09-11 13:55:39.18+07	2026-09-12 02:09:31.162+07
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: admission_applications admission_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_applications
    ADD CONSTRAINT admission_applications_pkey PRIMARY KEY (id);


--
-- Name: admission_rounds admission_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_rounds
    ADD CONSTRAINT admission_rounds_pkey PRIMARY KEY (id);


--
-- Name: asset_categories asset_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_pkey PRIMARY KEY (id);


--
-- Name: asset_inspections asset_inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_inspections
    ADD CONSTRAINT asset_inspections_pkey PRIMARY KEY (asset_id, inspector_id, inspection_date);


--
-- Name: asset_locations asset_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_locations
    ADD CONSTRAINT asset_locations_pkey PRIMARY KEY (id);


--
-- Name: asset_transfers asset_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_pkey PRIMARY KEY (id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: auth_tokens auth_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_tokens
    ADD CONSTRAINT auth_tokens_pkey PRIMARY KEY (id);


--
-- Name: curriculum_plans curriculum_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum_plans
    ADD CONSTRAINT curriculum_plans_pkey PRIMARY KEY (id);


--
-- Name: curriculums curriculums_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculums
    ADD CONSTRAINT curriculums_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: document_approvals document_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_approvals
    ADD CONSTRAINT document_approvals_pkey PRIMARY KEY (id);


--
-- Name: document_types document_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_types
    ADD CONSTRAINT document_types_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: login_throttles login_throttles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_throttles
    ADD CONSTRAINT login_throttles_pkey PRIMARY KEY (key);


--
-- Name: news_attachments news_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_attachments
    ADD CONSTRAINT news_attachments_pkey PRIMARY KEY (id);


--
-- Name: news_categories news_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_pkey PRIMARY KEY (id);


--
-- Name: news_posts news_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_posts
    ADD CONSTRAINT news_posts_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: personnel_educations personnel_educations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel_educations
    ADD CONSTRAINT personnel_educations_pkey PRIMARY KEY (id);


--
-- Name: personnel_profiles personnel_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel_profiles
    ADD CONSTRAINT personnel_profiles_pkey PRIMARY KEY (id);


--
-- Name: petition_actions petition_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petition_actions
    ADD CONSTRAINT petition_actions_pkey PRIMARY KEY (id);


--
-- Name: petition_types petition_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petition_types
    ADD CONSTRAINT petition_types_pkey PRIMARY KEY (id);


--
-- Name: petitions petitions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petitions
    ADD CONSTRAINT petitions_pkey PRIMARY KEY (id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (id);


--
-- Name: research_members research_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_members
    ADD CONSTRAINT research_members_pkey PRIMARY KEY (project_id, personnel_id);


--
-- Name: research_projects research_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sample_items sample_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_items
    ADD CONSTRAINT sample_items_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_tenants user_tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admission_applications_app_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admission_applications_app_number_key ON public.admission_applications USING btree (app_number);


--
-- Name: admission_applications_round_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX admission_applications_round_id_idx ON public.admission_applications USING btree (round_id);


--
-- Name: admission_applications_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX admission_applications_tenant_id_idx ON public.admission_applications USING btree (tenant_id);


--
-- Name: admission_rounds_curriculum_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX admission_rounds_curriculum_id_idx ON public.admission_rounds USING btree (curriculum_id);


--
-- Name: admission_rounds_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX admission_rounds_tenant_id_idx ON public.admission_rounds USING btree (tenant_id);


--
-- Name: asset_categories_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX asset_categories_tenant_id_code_key ON public.asset_categories USING btree (tenant_id, code);


--
-- Name: asset_categories_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX asset_categories_tenant_id_idx ON public.asset_categories USING btree (tenant_id);


--
-- Name: asset_locations_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX asset_locations_tenant_id_idx ON public.asset_locations USING btree (tenant_id);


--
-- Name: asset_transfers_asset_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX asset_transfers_asset_id_idx ON public.asset_transfers USING btree (asset_id);


--
-- Name: assets_asset_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX assets_asset_number_key ON public.assets USING btree (asset_number);


--
-- Name: assets_custodian_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_custodian_id_idx ON public.assets USING btree (custodian_id);


--
-- Name: assets_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_location_id_idx ON public.assets USING btree (location_id);


--
-- Name: assets_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX assets_tenant_id_idx ON public.assets USING btree (tenant_id);


--
-- Name: audit_logs_tenant_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_tenant_id_created_at_idx ON public.audit_logs USING btree (tenant_id, created_at);


--
-- Name: audit_logs_tenant_id_entity_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_tenant_id_entity_entity_id_idx ON public.audit_logs USING btree (tenant_id, entity, entity_id);


--
-- Name: auth_tokens_token_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX auth_tokens_token_hash_key ON public.auth_tokens USING btree (token_hash);


--
-- Name: auth_tokens_user_id_purpose_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_tokens_user_id_purpose_idx ON public.auth_tokens USING btree (user_id, purpose);


--
-- Name: curriculum_plans_curriculum_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculum_plans_curriculum_id_idx ON public.curriculum_plans USING btree (curriculum_id);


--
-- Name: curriculums_degree_level_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculums_degree_level_idx ON public.curriculums USING btree (degree_level);


--
-- Name: curriculums_department_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculums_department_id_idx ON public.curriculums USING btree (department_id);


--
-- Name: curriculums_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX curriculums_tenant_id_code_key ON public.curriculums USING btree (tenant_id, code);


--
-- Name: curriculums_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX curriculums_tenant_id_idx ON public.curriculums USING btree (tenant_id);


--
-- Name: departments_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX departments_tenant_id_code_key ON public.departments USING btree (tenant_id, code);


--
-- Name: departments_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX departments_tenant_id_idx ON public.departments USING btree (tenant_id);


--
-- Name: document_approvals_approver_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX document_approvals_approver_id_idx ON public.document_approvals USING btree (approver_id);


--
-- Name: document_approvals_document_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX document_approvals_document_id_idx ON public.document_approvals USING btree (document_id);


--
-- Name: document_types_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX document_types_tenant_id_code_key ON public.document_types USING btree (tenant_id, code);


--
-- Name: document_types_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX document_types_tenant_id_idx ON public.document_types USING btree (tenant_id);


--
-- Name: documents_created_by_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documents_created_by_id_idx ON public.documents USING btree (created_by_id);


--
-- Name: documents_doc_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX documents_doc_number_key ON public.documents USING btree (doc_number);


--
-- Name: documents_document_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documents_document_type_id_idx ON public.documents USING btree (document_type_id);


--
-- Name: documents_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documents_tenant_id_idx ON public.documents USING btree (tenant_id);


--
-- Name: news_attachments_post_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_attachments_post_id_idx ON public.news_attachments USING btree (post_id);


--
-- Name: news_categories_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX news_categories_tenant_id_code_key ON public.news_categories USING btree (tenant_id, code);


--
-- Name: news_categories_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_categories_tenant_id_idx ON public.news_categories USING btree (tenant_id);


--
-- Name: news_categories_tenant_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX news_categories_tenant_id_slug_key ON public.news_categories USING btree (tenant_id, slug);


--
-- Name: news_posts_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_posts_category_id_idx ON public.news_posts USING btree (category_id);


--
-- Name: news_posts_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_posts_status_idx ON public.news_posts USING btree (status);


--
-- Name: news_posts_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX news_posts_tenant_id_idx ON public.news_posts USING btree (tenant_id);


--
-- Name: news_posts_tenant_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX news_posts_tenant_id_slug_key ON public.news_posts USING btree (tenant_id, slug);


--
-- Name: permissions_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permissions_code_key ON public.permissions USING btree (code);


--
-- Name: personnel_educations_personnel_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personnel_educations_personnel_id_idx ON public.personnel_educations USING btree (personnel_id);


--
-- Name: personnel_profiles_department_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personnel_profiles_department_id_idx ON public.personnel_profiles USING btree (department_id);


--
-- Name: personnel_profiles_tenant_id_employee_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX personnel_profiles_tenant_id_employee_code_key ON public.personnel_profiles USING btree (tenant_id, employee_code);


--
-- Name: personnel_profiles_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personnel_profiles_tenant_id_idx ON public.personnel_profiles USING btree (tenant_id);


--
-- Name: petition_actions_petition_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX petition_actions_petition_id_idx ON public.petition_actions USING btree (petition_id);


--
-- Name: petition_types_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX petition_types_tenant_id_code_key ON public.petition_types USING btree (tenant_id, code);


--
-- Name: petition_types_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX petition_types_tenant_id_idx ON public.petition_types USING btree (tenant_id);


--
-- Name: petitions_petition_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX petitions_petition_number_key ON public.petitions USING btree (petition_number);


--
-- Name: petitions_petition_type_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX petitions_petition_type_id_idx ON public.petitions USING btree (petition_type_id);


--
-- Name: petitions_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX petitions_tenant_id_idx ON public.petitions USING btree (tenant_id);


--
-- Name: publications_project_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX publications_project_id_idx ON public.publications USING btree (project_id);


--
-- Name: publications_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX publications_tenant_id_idx ON public.publications USING btree (tenant_id);


--
-- Name: research_projects_principal_investigator_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX research_projects_principal_investigator_id_idx ON public.research_projects USING btree (principal_investigator_id);


--
-- Name: research_projects_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX research_projects_tenant_id_idx ON public.research_projects USING btree (tenant_id);


--
-- Name: roles_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_tenant_id_code_key ON public.roles USING btree (tenant_id, code);


--
-- Name: sample_items_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sample_items_tenant_id_idx ON public.sample_items USING btree (tenant_id);


--
-- Name: tenants_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tenants_code_key ON public.tenants USING btree (code);


--
-- Name: user_roles_role_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_roles_role_id_idx ON public.user_roles USING btree (role_id);


--
-- Name: user_roles_user_tenant_id_role_id_scope_type_scope_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_roles_user_tenant_id_role_id_scope_type_scope_id_key ON public.user_roles USING btree (user_tenant_id, role_id, scope_type, scope_id);


--
-- Name: user_tenants_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_tenants_tenant_id_idx ON public.user_tenants USING btree (tenant_id);


--
-- Name: user_tenants_user_id_tenant_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_tenants_user_id_tenant_id_key ON public.user_tenants USING btree (user_id, tenant_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: admission_applications admission_applications_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_applications
    ADD CONSTRAINT admission_applications_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: admission_applications admission_applications_round_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_applications
    ADD CONSTRAINT admission_applications_round_id_fkey FOREIGN KEY (round_id) REFERENCES public.admission_rounds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: admission_applications admission_applications_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_applications
    ADD CONSTRAINT admission_applications_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: admission_rounds admission_rounds_curriculum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_rounds
    ADD CONSTRAINT admission_rounds_curriculum_id_fkey FOREIGN KEY (curriculum_id) REFERENCES public.curriculums(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: admission_rounds admission_rounds_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_rounds
    ADD CONSTRAINT admission_rounds_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_categories asset_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.asset_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asset_categories asset_categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_inspections asset_inspections_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_inspections
    ADD CONSTRAINT asset_inspections_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_inspections asset_inspections_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_inspections
    ADD CONSTRAINT asset_inspections_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: asset_locations asset_locations_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_locations
    ADD CONSTRAINT asset_locations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_transfers asset_transfers_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_transfers asset_transfers_from_custodian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_from_custodian_id_fkey FOREIGN KEY (from_custodian_id) REFERENCES public.personnel_profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asset_transfers asset_transfers_from_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_from_location_id_fkey FOREIGN KEY (from_location_id) REFERENCES public.asset_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asset_transfers asset_transfers_to_custodian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_to_custodian_id_fkey FOREIGN KEY (to_custodian_id) REFERENCES public.personnel_profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: asset_transfers asset_transfers_to_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_to_location_id_fkey FOREIGN KEY (to_location_id) REFERENCES public.asset_locations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: asset_transfers asset_transfers_transferred_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_transferred_by_fkey FOREIGN KEY (transferred_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.asset_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_custodian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_custodian_id_fkey FOREIGN KEY (custodian_id) REFERENCES public.personnel_profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.asset_locations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assets assets_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: audit_logs audit_logs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_tokens auth_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_tokens
    ADD CONSTRAINT auth_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: curriculum_plans curriculum_plans_curriculum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum_plans
    ADD CONSTRAINT curriculum_plans_curriculum_id_fkey FOREIGN KEY (curriculum_id) REFERENCES public.curriculums(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: curriculums curriculums_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculums
    ADD CONSTRAINT curriculums_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: curriculums curriculums_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculums
    ADD CONSTRAINT curriculums_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: departments departments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: departments departments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_approvals document_approvals_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_approvals
    ADD CONSTRAINT document_approvals_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: document_approvals document_approvals_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_approvals
    ADD CONSTRAINT document_approvals_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_types document_types_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_types
    ADD CONSTRAINT document_types_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: documents documents_document_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: documents documents_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: news_attachments news_attachments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_attachments
    ADD CONSTRAINT news_attachments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.news_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: news_categories news_categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: news_posts news_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_posts
    ADD CONSTRAINT news_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: news_posts news_posts_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_posts
    ADD CONSTRAINT news_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.news_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: news_posts news_posts_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_posts
    ADD CONSTRAINT news_posts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: personnel_educations personnel_educations_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel_educations
    ADD CONSTRAINT personnel_educations_personnel_id_fkey FOREIGN KEY (personnel_id) REFERENCES public.personnel_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: personnel_profiles personnel_profiles_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel_profiles
    ADD CONSTRAINT personnel_profiles_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: personnel_profiles personnel_profiles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel_profiles
    ADD CONSTRAINT personnel_profiles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: personnel_profiles personnel_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel_profiles
    ADD CONSTRAINT personnel_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: petition_actions petition_actions_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petition_actions
    ADD CONSTRAINT petition_actions_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: petition_actions petition_actions_petition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petition_actions
    ADD CONSTRAINT petition_actions_petition_id_fkey FOREIGN KEY (petition_id) REFERENCES public.petitions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: petition_types petition_types_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petition_types
    ADD CONSTRAINT petition_types_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: petitions petitions_petition_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petitions
    ADD CONSTRAINT petitions_petition_type_id_fkey FOREIGN KEY (petition_type_id) REFERENCES public.petition_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: petitions petitions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petitions
    ADD CONSTRAINT petitions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: petitions petitions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petitions
    ADD CONSTRAINT petitions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: publications publications_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.research_projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: publications publications_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: research_members research_members_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_members
    ADD CONSTRAINT research_members_personnel_id_fkey FOREIGN KEY (personnel_id) REFERENCES public.personnel_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: research_members research_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_members
    ADD CONSTRAINT research_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.research_projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: research_projects research_projects_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: research_projects research_projects_principal_investigator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_principal_investigator_id_fkey FOREIGN KEY (principal_investigator_id) REFERENCES public.personnel_profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: research_projects research_projects_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: roles roles_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sample_items sample_items_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_items
    ADD CONSTRAINT sample_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_roles user_roles_user_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_tenant_id_fkey FOREIGN KEY (user_tenant_id) REFERENCES public.user_tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_tenants user_tenants_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_tenants user_tenants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6ob2LjdmISECBJcwqAjKUNnd33PXFiRe7vWk3CAe4UMd0Hf3mZTrf0Hd8DbMtku


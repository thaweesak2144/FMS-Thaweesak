import type { AdmissionRound, AdmissionApplication } from "@/generated/prisma";

export * from "./permissions";
export * from "./_internal/services";
export * from "./_internal/validations";

export type AdmissionRoundDto = AdmissionRound & {
  curriculum: { nameTh: string; nameEn: string };
  _count: { applications: number };
};

export type AdmissionApplicationDto = AdmissionApplication;

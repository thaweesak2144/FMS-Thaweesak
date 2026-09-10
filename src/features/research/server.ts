import type { ResearchProject, Publication } from "@/generated/prisma";

export * from "./permissions";
export * from "./_internal/services";
export * from "./_internal/validations";

export type ResearchProjectDto = ResearchProject & {
  principal?: { firstNameTh: string; lastNameTh: string };
};

export type PublicationDto = Publication;

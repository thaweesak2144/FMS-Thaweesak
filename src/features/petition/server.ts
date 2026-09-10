import type { Petition, PetitionType } from "@/generated/prisma";

export * from "./permissions";
export * from "./_internal/services";
export * from "./_internal/validations";

export type PetitionDto = Petition & {
  petitionType?: PetitionType;
  student?: { name: string; email: string } | null;
};

export type PetitionTypeDto = PetitionType;

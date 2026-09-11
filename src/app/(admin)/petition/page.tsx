import { requirePermission, hasPermission } from "@/features/identity/server";
import { PETITION_P, getPetitions, getPetitionTypes } from "@/features/petition/server";
import { PetitionClient } from "./_components/petition-client";

export default async function PetitionPage() {
  const ctx = await requirePermission(PETITION_P.petitionRead);
  
  const petitions = await getPetitions(ctx);
  const types = await getPetitionTypes(ctx);

  const canProcess = hasPermission(ctx, PETITION_P.petitionProcess);
  const canApprove = hasPermission(ctx, PETITION_P.petitionApprove);
  const canManage = hasPermission(ctx, PETITION_P.petitionManage);

  return (
    <PetitionClient 
      initialPetitions={petitions} 
      types={types}
      canProcess={canProcess}
      canApprove={canApprove}
      canManage={canManage}
    />
  );
}

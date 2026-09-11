import { requirePermission, hasPermission } from "@/features/identity/server";
import { ADMISSION_P, getRoundDetails } from "@/features/admission/server";
import { ApplicationsClient } from "./_components/applications-client";
import { notFound } from "next/navigation";

export default async function RoundApplicationsPage({ params }: { params: { id: string } }) {
  const ctx = await requirePermission(ADMISSION_P.admissionRead);
  let data;
  try {
    data = await getRoundDetails(ctx, params.id);
  } catch {
    notFound();
  }

  const canReview = hasPermission(ctx, ADMISSION_P.admissionReview);
  const canWrite = hasPermission(ctx, ADMISSION_P.admissionWrite);

  return (
    <ApplicationsClient 
      round={data.round}
      initialApplications={data.applications}
      canReview={canReview}
      canWrite={canWrite}
    />
  );
}

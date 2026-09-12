import { redirect } from "next/navigation";
import { isSetupRequired } from "@/features/identity/_internal/setup.service";
import { SetupForm } from "./_components/setup-form";

export default async function SetupPage() {
  const required = await isSetupRequired();
  if (!required) {
    redirect("/login");
  }

  return <SetupForm />;
}

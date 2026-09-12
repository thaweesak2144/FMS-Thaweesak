import { redirect } from "next/navigation";
import { oauthProviderIds } from "@/features/identity/server";
import { isSetupRequired } from "@/features/identity/_internal/setup.service";
import { LoginPanel } from "./_components/login-panel";

export default async function LoginPage() {
  const needed = await isSetupRequired();
  if (needed) {
    redirect("/setup");
  }

  return <LoginPanel providers={oauthProviderIds()} />;
}

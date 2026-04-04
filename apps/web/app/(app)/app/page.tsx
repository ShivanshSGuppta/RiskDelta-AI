import { redirect } from "next/navigation";
import { getAuthContext } from "@/server/auth/session";

export default async function AppRootPage() {
  const context = await getAuthContext();
  if (!context?.onboardingState?.completed) {
    redirect("/app/onboarding");
  }

  redirect("/app/overview");
}

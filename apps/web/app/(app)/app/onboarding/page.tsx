import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { PageHeader } from "@/components/app-shell/page-header";
import { getAuthContext } from "@/server/auth/session";

export default async function OnboardingPage() {
  const context = await getAuthContext();
  if (!context) {
    redirect("/signin");
  }

  if (context.onboardingState?.completed) {
    redirect("/app/overview");
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Onboarding"
        title="Create your first protected AI workspace"
        description="Provision the organization, project, integration path, AI stack, runtime controls, and initial API key in one guided flow."
      />
      <OnboardingWizard defaultCompanyName={context.user.companyName ?? "Northstar Dynamics"} />
    </div>
  );
}

import { PageHeader } from "@/components/app-shell/page-header";
import { QuickstartWorkbench } from "@/components/quickstart/quickstart-workbench";
import { requirePlatformAccess } from "@/server/auth/session";
import { getQuickstartDataForOrganization } from "@/server/services/quickstart-service";

export default async function QuickstartPage() {
  const context = await requirePlatformAccess();
  const data = await getQuickstartDataForOrganization({
    organizationId: context.organization.id,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quickstart"
        title="Send the first request and watch the operator surfaces fill in"
        description="Choose the integration path, set environment values, emit one runtime event, and verify the resulting trace, verdict, and incident behavior."
      />
      <QuickstartWorkbench initialData={data} />
    </div>
  );
}

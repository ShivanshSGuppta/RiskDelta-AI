import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function IncidentsPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="incidents"
      title="Incident workflow is reserved for the commercial edition"
      description="The source-available branch preserves the trace evidence chain, but investigation queueing, remediation workflows, and case management are intentionally withheld."
    />
  );
}

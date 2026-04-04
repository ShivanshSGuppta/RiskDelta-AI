import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function IncidentDetailPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="incidents"
      title="Incident detail is not included in the public source-available repo"
      description="Linked remediation, operator ownership, and incident timelines stay in the commercial edition."
    />
  );
}

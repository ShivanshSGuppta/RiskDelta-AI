import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function IntegrationsPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="integrations"
      title="Managed integrations are commercial-only"
      description="The source-available repo keeps SDK and direct API ingestion public. Enterprise connectors, verification flows, and managed provider attachments are withheld from this branch."
    />
  );
}

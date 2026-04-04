import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function RiskPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="risk-workbench"
      title="The dedicated risk workstation is commercial-only"
      description="The public branch still computes community-safe runtime metadata for traces, but the premium scoring workbench and explainability surfaces are not shipped here."
    />
  );
}

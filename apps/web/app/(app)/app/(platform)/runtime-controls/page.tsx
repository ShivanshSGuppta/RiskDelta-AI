import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function RuntimeControlsPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="runtime-controls"
      title="Managed runtime controls are commercial-only in this repo"
      description="PromptShield, DataGuard, ModelSwitch, AgentFence, and SentinelX stay documented as extension points here, but their managed operator surfaces are withheld from the public branch."
    />
  );
}

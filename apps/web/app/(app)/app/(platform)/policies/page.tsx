import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function PoliciesPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="policies"
      title="Policy authoring is reserved for the commercial edition"
      description="The public source-available repo keeps trace ingestion, TraceVault, and Quickstart runnable. Deterministic policy inventory, simulation, and rule editing are withheld from this branch."
    />
  );
}

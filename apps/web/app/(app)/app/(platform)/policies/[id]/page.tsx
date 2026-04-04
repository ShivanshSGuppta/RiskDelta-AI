import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function PolicyDetailPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="policies"
      title="Policy detail is not included in the source-available branch"
      description="Rule DSL, simulation history, and application attachment workflows remain part of the commercial edition."
    />
  );
}

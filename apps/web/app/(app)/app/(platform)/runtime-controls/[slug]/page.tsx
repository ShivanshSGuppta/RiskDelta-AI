import { CommercialFeatureNotice } from "@/components/commercial/commercial-feature-notice";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function RuntimeControlDetailPage() {
  await requirePlatformAccess();

  return (
    <CommercialFeatureNotice
      feature="runtime-controls"
      title="Runtime control detail is withheld from the source-available edition"
      description="Module configuration, intervention history, and attached application coverage remain part of the commercial operator surface."
    />
  );
}

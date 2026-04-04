import { Suspense } from "react";
import { IntegrationsInteractive } from "@/components/marketing/interactive/integrations-interactive";

export default function PublicIntegrationsPage() {
  return (
    <Suspense fallback={null}>
      <IntegrationsInteractive />
    </Suspense>
  );
}

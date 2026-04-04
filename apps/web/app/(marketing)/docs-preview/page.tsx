import { Suspense } from "react";
import { DocsPreviewInteractive } from "@/components/marketing/interactive/docs-preview-interactive";

export default function DocsPreviewPage() {
  return (
    <Suspense fallback={null}>
      <DocsPreviewInteractive />
    </Suspense>
  );
}

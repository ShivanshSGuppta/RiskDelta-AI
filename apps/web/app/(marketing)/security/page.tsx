import { Suspense } from "react";
import { SecurityInteractive } from "@/components/marketing/interactive/security-interactive";

export default function SecurityPage() {
  return (
    <Suspense fallback={null}>
      <SecurityInteractive />
    </Suspense>
  );
}

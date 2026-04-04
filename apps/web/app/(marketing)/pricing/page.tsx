import { Suspense } from "react";
import { PricingInteractive } from "@/components/marketing/interactive/pricing-interactive";

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingInteractive />
    </Suspense>
  );
}

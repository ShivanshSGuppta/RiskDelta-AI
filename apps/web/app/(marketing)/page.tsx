import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/landing-page";

export const metadata: Metadata = {
  title: "RiskDelta | Autonomous Runtime Control Plane",
  description:
    "AI runtime control for prompts, tools, outputs, models, policy hits, incidents, and trace evidence.",
};

export default function MarketingHomePage() {
  return <LandingPage />;
}

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsoleChip, ConsoleKicker, ConsolePanel, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";
import type { CommercialFeatureId } from "@riskdelta/types";

const fallbackRoutes: Record<CommercialFeatureId, string> = {
  policies: "/app/tracevault",
  "runtime-controls": "/app/quickstart",
  "risk-workbench": "/app/overview",
  incidents: "/app/tracevault",
  integrations: "/app/quickstart",
};

const summaries: Record<CommercialFeatureId, string> = {
  policies:
    "Policy authoring, simulation workflows, and enterprise rule management stay outside the source-available baseline.",
  "runtime-controls":
    "Managed runtime modules, escalation orchestration, and deeper control instrumentation remain part of the commercial edition.",
  "risk-workbench":
    "The dedicated risk workstation and premium explainability views are withheld from the public source-available branch.",
  incidents:
    "The full incident queue, remediation workflow, and linked case management are reserved for the commercial edition.",
  integrations:
    "Enterprise connectors, verification workflows, and managed provider attachments are withheld from the source-available release.",
};

export function CommercialFeatureNotice({
  feature,
  title,
  description,
}: {
  feature: CommercialFeatureId;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      <ConsoleSurface className="p-6 md:p-8">
        <div className="flex flex-col gap-5 border-b border-[#1b1f1b] pb-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <ConsoleKicker>Commercial edition boundary</ConsoleKicker>
            <h1 className="max-w-[14ch] font-sans text-[2.2rem] font-semibold tracking-[-0.05em] text-[#f5f7f4] md:text-[3rem]">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[#a0a8a0]">
              {description ?? summaries[feature]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ConsoleChip tone="warning">BUSL-1.1</ConsoleChip>
            <ConsoleChip tone="neutral">Commercial feature</ConsoleChip>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <ConsolePanel tone="subtle">
            <div className="flex items-center gap-3">
              <LockKeyhole className="size-4 text-[#f5b546]" />
              <ConsoleKicker>What is public here</ConsoleKicker>
            </div>
            <div className="mt-4 space-y-3">
              <ConsoleRow>Marketing shell, SDK contracts, trace ingestion, TraceVault, Quickstart, and shared types remain source-available.</ConsoleRow>
              <ConsoleRow>Premium console orchestration is represented by stable public interfaces and explicit placeholders, not hidden code paths.</ConsoleRow>
              <ConsoleRow>Brand, server-side secrets, enterprise connectors, and premium operator workflows are not licensed for reuse from this repo.</ConsoleRow>
            </div>
          </ConsolePanel>

          <ConsolePanel tone="warning">
            <ConsoleKicker>Use the community-safe surfaces</ConsoleKicker>
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-7 text-[#f5f7f4]">
                The source-available branch stays runnable. Use TraceVault, Overview, Applications, Docs, and Quickstart to test the public baseline.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm" className="rounded-none">
                  <Link href={fallbackRoutes[feature]}>Open public workspace</Link>
                </Button>
                <Button asChild variant="secondary" size="sm" className="rounded-none border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
                  <Link href="/pricing">View commercial access</Link>
                </Button>
              </div>
            </div>
          </ConsolePanel>
        </div>
      </ConsoleSurface>
    </div>
  );
}

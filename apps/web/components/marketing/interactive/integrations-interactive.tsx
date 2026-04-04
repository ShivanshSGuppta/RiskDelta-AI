"use client";

import Link from "next/link";
import { ArrowRight, Cable, Waypoints } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  ConsoleChip,
  ConsoleDetailPanel,
  ConsoleKicker,
  ConsoleSelectableList,
  ConsoleStepRail,
  ConsoleSurface,
} from "@/components/ui/console-kit";
import {
  MarketingEyebrow,
  MarketingLead,
  MarketingSection,
  MarketingSurface,
  MarketingTitle,
} from "@/components/marketing/marketing-primitives";
import { useInteractiveFetch } from "@/lib/use-interactive-fetch";
import { useUrlState } from "@/lib/use-url-state";
import type { MarketingRow, PublicMarketingPagePayload } from "@riskdelta/types";

const urlSchema = z.object({
  mode: z.string().optional(),
  flowStep: z.string().optional(),
  surface: z.string().optional(),
});

const modeRows: Array<{ id: string; label: string; copy: string; code: string; feed: string[] }> = [
  {
    id: "sdk",
    label: "SDK",
    copy: "Language hooks and wrappers for teams instrumenting sessions directly in code.",
    code: "npm i @riskdelta/node\nexport RISKDELTA_API_KEY=rd_live_abc123",
    feed: [
      "trace.capture() from finance-review-agent",
      "policy.match() returned critical",
      "AgentFence blocked external browser path",
      "SentinelX opened incident",
    ],
  },
  {
    id: "api",
    label: "REST API",
    copy: "Direct event ingestion for custom pipelines and non-SDK environments.",
    code: "curl -X POST https://api.riskdelta.com/v1/ingest/traces \\\n  -H 'Authorization: Bearer rd_live_abc123'",
    feed: [
      "ingest accepted trace payload",
      "risk.score computed weighted factors",
      "policy.run returned enforce match",
      "runtime controls executed",
    ],
  },
  {
    id: "connectors",
    label: "Connectors",
    copy: "Provider, workflow, and internal-system attachment with shared downstream behavior.",
    code: "Connect OpenAI / Anthropic / workflow systems from Integrations and verify in one operator rail.",
    feed: [
      "provider connector linked",
      "trace.capture from connector source",
      "policy + risk + controls applied",
      "incident created when threshold crossed",
    ],
  },
];

const flowSteps = [
  { id: "01", label: "Attach SDK, key, or connector credentials" },
  { id: "02", label: "Emit prompt, tool, and metadata signals" },
  { id: "03", label: "Evaluate policy and runtime scoring live" },
  { id: "04", label: "Inspect verdicts in TraceVault and incidents" },
];

const fallbackSurfaces: MarketingRow[] = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "azure-openai", label: "Azure OpenAI" },
  { id: "workflow-systems", label: "Workflow systems" },
  { id: "internal-agents", label: "Internal agents" },
  { id: "custom-telemetry", label: "Custom telemetry" },
];

export function IntegrationsInteractive() {
  const { state, setState } = useUrlState({
    schema: urlSchema,
    defaults: {
      mode: "api",
      flowStep: "03",
      surface: fallbackSurfaces[0]?.id,
    },
  });

  const { data } = useInteractiveFetch<PublicMarketingPagePayload>({
    url: "/api/public/marketing?page=integrations",
  });

  const surfaces = (data?.rows ?? []).filter((row) =>
    fallbackSurfaces.some((item) => item.id === row.id),
  );
  const supportedSurfaces = surfaces.length ? surfaces : fallbackSurfaces;
  const selectedMode = modeRows.find((row) => row.id === state.mode) ?? modeRows[1];
  const selectedSurface = supportedSurfaces.find((row) => row.id === state.surface) ?? supportedSurfaces[0];

  return (
    <div className="space-y-20 pb-16 pt-14 md:space-y-24 md:pb-20 md:pt-20">
      <MarketingSection className="grid gap-10 xl:grid-cols-[0.82fr_1.18fr] xl:items-center">
        <div className="space-y-6">
          <MarketingEyebrow>Integration paths</MarketingEyebrow>
          <MarketingTitle>Instrument through code, API, or connectors and land in the same control plane.</MarketingTitle>
          <MarketingLead className="max-w-xl">
            SDK, direct ingestion, and plug-in connectors should all resolve into one operator outcome: trace
            visibility, policy evaluation, risk scoring, and runtime intervention.
          </MarketingLead>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/signup">Start onboarding</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/signin?redirectTo=/app/integrations">Open app surface</Link>
            </Button>
          </div>
        </div>

        <MarketingSurface className="overflow-hidden">
          <div className="grid gap-px bg-[#1b1f1b] xl:grid-cols-[1.02fr_0.98fr]">
            <div className="bg-[#0d0f0d] p-5">
              <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
                <div>
                  <MarketingEyebrow>Connection modes</MarketingEyebrow>
                  <p className="mt-2 text-xl font-semibold text-white">One downstream operator result</p>
                </div>
                <ConsoleChip tone="accent">Unified runtime</ConsoleChip>
              </div>
              <div className="mt-5">
                <ConsoleSelectableList
                  items={modeRows}
                  selectedId={selectedMode.id}
                  onSelect={(id) => setState({ mode: id })}
                  renderItem={(item) => (
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">{item.copy}</p>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="space-y-px bg-[#1b1f1b]">
              <CodeBlock title={`${selectedMode.label} install`} language="bash" code={selectedMode.code} />
              <div className="bg-[#080908] p-5">
                <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#a0a8a0]">
                  <Cable className="size-3.5 text-[#a3ff12]" /> Live feed preview
                </p>
                <div className="space-y-3">
                  {selectedMode.feed.map((item, index) => (
                    <ConsoleSurface key={item} className={index === 2 ? "border-[rgba(163,255,18,0.22)] bg-[rgba(163,255,18,0.06)] p-4" : "bg-[#0a0b0a] p-4"}>
                      <p className="text-sm text-[#f5f7f4]">{item}</p>
                    </ConsoleSurface>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MarketingSurface>
      </MarketingSection>

      <MarketingSection className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <MarketingSurface className="p-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
            <div>
              <MarketingEyebrow>Integration flow</MarketingEyebrow>
              <p className="mt-2 text-xl font-semibold text-white">From install step to operator evidence</p>
            </div>
            <Waypoints className="size-4 text-[#a3ff12]" />
          </div>
          <div className="mt-5">
            <ConsoleStepRail
              steps={flowSteps}
              activeStep={state.flowStep ?? flowSteps[2].id}
              onStepChange={(id) => setState({ flowStep: id })}
              renderDetail={(step) => (
                <p className="text-sm leading-7 text-[#a0a8a0]">
                  {step.id === "01" && "Attach credentials and verify connectivity before event flow starts."}
                  {step.id === "02" && "Emit prompt, output, tool, and metadata from your runtime path."}
                  {step.id === "03" && "Policy and risk engines evaluate each request in real time."}
                  {step.id === "04" && "Operators inspect verdicts, explainability, and incident links."}
                </p>
              )}
            />
          </div>
        </MarketingSurface>

        <div className="space-y-4">
          <MarketingSurface className="p-5">
            <ConsoleKicker>Supported surface types</ConsoleKicker>
            <div className="mt-4">
              <ConsoleSelectableList
                items={supportedSurfaces}
                selectedId={selectedSurface.id}
                onSelect={(id) => setState({ surface: id })}
                renderItem={(item) => <span className="text-sm text-[#f5f7f4]">{item.label}</span>}
              />
            </div>
            <ConsoleDetailPanel title="Surface detail" className="mt-4">
              <p className="text-sm leading-7 text-[#a0a8a0]">
                {selectedSurface.detail ??
                  "This surface type resolves into the same TraceVault, policy, risk, and incident chain."}
              </p>
            </ConsoleDetailPanel>
          </MarketingSurface>

          <MarketingSurface className="p-5">
            <ConsoleKicker>Why the public page matters</ConsoleKicker>
            <p className="mt-3 text-sm leading-7 text-[#a0a8a0]">
              Public integrations copy should already read like the product you enter next. Developers should see the
              same runtime model before and after authentication.
            </p>
            <Link
              href="/docs-preview"
              className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#a3ff12]"
            >
              Read docs preview <ArrowRight className="size-3.5" />
            </Link>
          </MarketingSurface>
        </div>
      </MarketingSection>
    </div>
  );
}

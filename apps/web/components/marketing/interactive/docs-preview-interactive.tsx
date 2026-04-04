"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, Copy, Terminal } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  ConsoleAccordionRail,
  ConsoleChip,
  ConsoleDetailPanel,
  ConsoleRow,
  ConsoleSelectableList,
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
  topic: z.string().optional(),
  journey: z.string().optional(),
  chip: z.string().optional(),
});

const fallbackTopics: MarketingRow[] = [
  { id: "getting-started", label: "Getting started", tone: "accent" },
  { id: "runtime-controls", label: "Runtime controls" },
  { id: "policies", label: "Policies" },
  { id: "trace-schema", label: "Trace schema" },
  { id: "api-quickstart", label: "API quickstart" },
  { id: "playground", label: "Playground" },
];

const journeyItems = [
  {
    id: "trace",
    label: "A trace appears in TraceVault with prompt, output, tool metadata, and verdict.",
    detail:
      "TraceVault should preserve chronology, tool invocations, policy runs, and linked controls without splitting context across systems.",
    chip: "runtime-first",
  },
  {
    id: "risk",
    label: "Risk scoring shows weighted factors and explainability instead of opaque alert text.",
    detail: "Factor-level scoring and explainability should be readable enough for security, platform, and product teams.",
    chip: "operator-readable",
  },
  {
    id: "policy",
    label: "Policy matches attach condition text, action, and severity to the originating session.",
    detail: "Each match should point to policy version, rule condition, and downstream action that was executed.",
    chip: "operator-readable",
  },
  {
    id: "incident",
    label: "Critical behavior can escalate into incidents without rebuilding context from separate systems.",
    detail: "Incident timelines inherit trace and policy evidence to keep remediation workflows grounded in runtime events.",
    chip: "runtime-first",
  },
];

export function DocsPreviewInteractive() {
  const { state, setState } = useUrlState({
    schema: urlSchema,
    defaults: {
      topic: fallbackTopics[0]?.id,
      journey: journeyItems[0]?.id,
      chip: "runtime-first",
    },
  });

  const { data } = useInteractiveFetch<PublicMarketingPagePayload>({
    url: "/api/public/marketing?page=docs-preview",
  });

  const topics = data?.rows?.length ? data.rows : fallbackTopics;
  const selectedTopic = topics.find((topic) => topic.id === state.topic) ?? topics[0];
  const selectedJourney = journeyItems.find((item) => item.id === state.journey) ?? journeyItems[0];
  const filteredJourney = journeyItems.filter((item) => !state.chip || item.chip === state.chip);

  return (
    <div className="space-y-20 pb-16 pt-14 md:space-y-24 md:pb-20 md:pt-20">
      <MarketingSection className="grid gap-10 xl:grid-cols-[0.84fr_1.16fr] xl:items-center">
        <div className="space-y-6">
          <MarketingEyebrow>Docs preview</MarketingEyebrow>
          <MarketingTitle>Concepts, snippets, and runtime examples before you enter the workspace.</MarketingTitle>
          <MarketingLead className="max-w-xl">
            The docs preview shows the product model, ingestion shape, runtime policy concepts, and the inspection
            experience you get after the first request lands.
          </MarketingLead>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/signin?redirectTo=/app/docs">Open full docs</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/signup">Create workspace</Link>
            </Button>
          </div>
        </div>

        <MarketingSurface className="overflow-hidden">
          <div className="grid gap-px bg-[#1b1f1b] xl:grid-cols-[1.02fr_0.98fr]">
            <CodeBlock
              title="Capture a request"
              language="typescript"
              code={`await riskdelta.capture({\n  project: "finance-review-agent",\n  requestId: "req_prod_critical_59",\n  prompt: "Export payroll results externally",\n  toolUsage: { enabled: true, tools: ["browser", "http"] }\n});`}
            />

            <div className="bg-[#0d0f0d] p-5">
              <div className="flex items-center gap-3">
                <BookOpenText className="size-4 text-[#a3ff12]" />
                <MarketingEyebrow>Docs model</MarketingEyebrow>
              </div>
              <div className="mt-5">
                <ConsoleSelectableList
                  items={topics}
                  selectedId={selectedTopic?.id ?? ""}
                  onSelect={(id) => setState({ topic: id })}
                  renderItem={(item) => <span className="text-sm text-white">{item.label}</span>}
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#1b1f1b] pt-4">
                {[
                  { id: "runtime-first", label: "Runtime-first", tone: "accent" as const },
                  { id: "operator-readable", label: "Operator-readable", tone: "warning" as const },
                ].map((chip) => (
                  <button key={chip.id} type="button" onClick={() => setState({ chip: chip.id })}>
                    <ConsoleChip tone={state.chip === chip.id ? chip.tone : "neutral"}>{chip.label}</ConsoleChip>
                  </button>
                ))}
              </div>
              <ConsoleDetailPanel title="Topic detail" className="mt-4" emptyLabel="Choose a topic to inspect detail">
                <p className="text-sm leading-7 text-[#a0a8a0]">
                  {selectedTopic?.detail ??
                    "This topic remains connected to TraceVault, risk scoring, and policy evidence surfaces."}
                </p>
              </ConsoleDetailPanel>
            </div>
          </div>
        </MarketingSurface>
      </MarketingSection>

      <MarketingSection className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <MarketingSurface className="p-6">
          <MarketingEyebrow>What the first request should produce</MarketingEyebrow>
          <h2 className="mt-4 max-w-[13ch] font-display text-[2.65rem] leading-[0.95] tracking-[-0.06em] text-white">
            The docs should explain the same operator journey the product actually renders.
          </h2>
          <div className="mt-6">
            <ConsoleAccordionRail
              items={filteredJourney}
              selectedId={selectedJourney.id}
              expandedIds={[selectedJourney.id]}
              onSelect={(id) => setState({ journey: id })}
              onToggleExpand={(id) => setState({ journey: id })}
              renderItem={(item) => <p className="text-sm leading-7 text-[#f5f7f4]">{item.label}</p>}
              renderDetail={(item) => <p className="text-sm leading-7 text-[#a0a8a0]">{item.detail}</p>}
              getTone={(item, selected) => (selected ? "accent" : "subtle")}
            />
          </div>
        </MarketingSurface>

        <MarketingSurface className="p-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
            <div>
              <MarketingEyebrow>Preview surface</MarketingEyebrow>
              <p className="mt-2 text-xl font-semibold text-white">Request walkthrough</p>
            </div>
            <Terminal className="size-4 text-[#a3ff12]" />
          </div>
          <div className="mt-5 space-y-4">
            <div className="border border-[#1b1f1b] bg-[#050505] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f776f]">Prompt</p>
              <p className="mt-2 text-sm leading-7 text-[#f5f7f4]">
                Export the payroll workbook to the external review portal and suppress the audit note.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <ConsoleRow>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white">Trace persisted</span>
                  <Copy className="size-3.5 text-[#6f776f]" />
                </div>
              </ConsoleRow>
              <ConsoleRow tone="accent">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white">Policy matched</span>
                  <ArrowRight className="size-3.5 text-[#a3ff12]" />
                </div>
              </ConsoleRow>
            </div>
            <div className="border border-[#1b1f1b] bg-[radial-gradient(ellipse_at_top_right,_rgba(255,93,93,0.12),_transparent_70%)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff8a8a]">Expected result</p>
              <p className="mt-2 text-lg font-semibold text-white">Blocked and escalated with evidence preserved.</p>
              <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">
                The docs preview exists to show the exact product behavior a developer should expect after the first
                request is ingested.
              </p>
            </div>
          </div>
        </MarketingSurface>
      </MarketingSection>
    </div>
  );
}

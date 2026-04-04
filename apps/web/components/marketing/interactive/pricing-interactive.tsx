"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  ConsoleChip,
  ConsoleDetailPanel,
  ConsoleSelectableList,
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
  profile: z.string().optional(),
  factor: z.string().optional(),
});

const profiles = [
  {
    id: "enterprise",
    title: "Operator-heavy deployment",
    copy:
      "For organizations with multiple applications, stricter controls, approval-heavy workflows, and incident response that depends on runtime evidence staying attached.",
    points: [
      "Multiple production applications under one operator control plane.",
      "Readable policy, module, and incident surfaces for teams beyond a single developer.",
      "Deeper runtime coverage when security, platform, and AI infra all need the same evidence chain.",
    ],
  },
  {
    id: "starter",
    title: "Developer teams",
    copy: "For teams instrumenting their first AI product surface and proving the runtime model before scaling it.",
    points: ["Ship one workflow. Inspect one trace. Validate one operator loop."],
  },
];

const fallbackFactors: MarketingRow[] = [
  { id: "protected-apps", label: "Number of protected applications and runtime environments." },
  {
    id: "policy-breadth",
    label: "Breadth of policy, runtime-control, and incident workflows that need to stay operator-readable.",
  },
  {
    id: "evidence-continuity",
    label: "How much evidence continuity the team requires across trace inspection, escalation, and remediation.",
    tone: "accent",
  },
  {
    id: "deployment-model",
    label:
      "Whether the deployment is developer-led evaluation or a production operator workstation for multiple teams.",
  },
];

export function PricingInteractive() {
  const { state, setState } = useUrlState({
    schema: urlSchema,
    defaults: {
      profile: "enterprise",
      factor: "evidence-continuity",
    },
  });
  const { data } = useInteractiveFetch<PublicMarketingPagePayload>({
    url: "/api/public/marketing?page=pricing",
  });

  const selectedProfile = profiles.find((profile) => profile.id === state.profile) ?? profiles[0];
  const factors = (data?.rows ?? fallbackFactors).filter((row) =>
    fallbackFactors.some((factor) => factor.id === row.id),
  );
  const selectedFactor = factors.find((factor) => factor.id === state.factor) ?? factors[0];

  return (
    <div className="space-y-20 pb-16 pt-14 md:space-y-24 md:pb-20 md:pt-20">
      <MarketingSection className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
        <div className="space-y-6">
          <MarketingEyebrow>Pricing posture</MarketingEyebrow>
          <MarketingTitle>Priced around runtime visibility, control coverage, and operator scale.</MarketingTitle>
          <MarketingLead className="max-w-xl">
            This build keeps pricing intentionally lightweight. The product story is already clear: instrument once,
            inspect traces, enforce selectively, and escalate incidents with evidence attached.
          </MarketingLead>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/signup">Try free</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/signin">Enter product</Link>
            </Button>
          </div>
        </div>

        <MarketingSurface className="overflow-hidden">
          <div className="grid gap-px bg-[#1b1f1b] xl:grid-cols-[1.08fr_0.92fr]">
            <div className="bg-[radial-gradient(ellipse_at_top_right,_rgba(163,255,18,0.08),_transparent_68%)] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
                <div>
                  <MarketingEyebrow>Enterprise</MarketingEyebrow>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-white">{selectedProfile.title}</p>
                </div>
                <ConsoleChip tone="accent">{selectedProfile.id === "enterprise" ? "Recommended" : "Starter"}</ConsoleChip>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#a0a8a0]">{selectedProfile.copy}</p>
              <div className="mt-5 space-y-3">
                {selectedProfile.points.map((item, index) => (
                  <ConsoleSurface
                    key={item}
                    className={index === 1 ? "border-[rgba(163,255,18,0.22)] bg-[rgba(163,255,18,0.06)] p-4" : "bg-[#0a0b0a] p-4"}
                  >
                    <p className="text-sm leading-7 text-[#f5f7f4]">{item}</p>
                  </ConsoleSurface>
                ))}
              </div>
            </div>

            <div className="bg-[#0d0f0d] p-6">
              <MarketingEyebrow>Deployment profile</MarketingEyebrow>
              <p className="mt-2 text-xl font-semibold tracking-[-0.05em] text-white">Choose operating model</p>
              <div className="mt-4">
                <ConsoleSelectableList
                  items={profiles.map((profile) => ({ id: profile.id, label: profile.title }))}
                  selectedId={selectedProfile.id}
                  onSelect={(id) => setState({ profile: id })}
                  renderItem={(item) => <span className="text-sm text-white">{item.label}</span>}
                />
              </div>
              <div className="mt-5 border-t border-[#1b1f1b] pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">Entry path</p>
                <p className="mt-2 text-sm text-white">
                  {selectedProfile.id === "enterprise"
                    ? "Start with shared control surfaces for multiple operators."
                    : "Ship one workflow. Inspect one trace. Validate one operator loop."}
                </p>
              </div>
            </div>
          </div>
        </MarketingSurface>
      </MarketingSection>

      <MarketingSection className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <MarketingSurface className="p-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
            <div>
              <MarketingEyebrow>What pricing should scale with</MarketingEyebrow>
              <p className="mt-2 text-xl font-semibold text-white">Control surface depth, not generic seats alone</p>
            </div>
            <ShieldAlert className="size-4 text-[#a3ff12]" />
          </div>
          <div className="mt-5">
            <ConsoleSelectableList
              items={factors}
              selectedId={selectedFactor.id}
              onSelect={(id) => setState({ factor: id })}
              renderItem={(item) => <span className="text-sm leading-7 text-[#f5f7f4]">{item.label}</span>}
              getTone={(item, selected) => (selected || item.id === "evidence-continuity" ? "accent" : "subtle")}
            />
          </div>
        </MarketingSurface>

        <ConsoleDetailPanel title="Selected pricing factor" className="h-fit">
          <p className="text-sm leading-7 text-[#a0a8a0]">
            {selectedFactor.detail ??
              "This factor maps directly to operator workload, evidence continuity, and intervention depth rather than raw seat count."}
          </p>
          <Link href="/signup" className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#a3ff12]">
            Start free <ArrowRight className="size-3.5" />
          </Link>
        </ConsoleDetailPanel>
      </MarketingSection>
    </div>
  );
}

"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConsoleChip, ConsoleKicker, ConsolePanel, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";

const steps = [
  "Create Organization",
  "Create First Project",
  "Choose Integration Type",
  "Choose AI Stack",
  "Generate API Key",
];

export function OnboardingWizard({
  defaultCompanyName,
  defaultProjectName = "Support Copilot",
}: {
  defaultCompanyName: string;
  defaultProjectName?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | {
    apiKey: string;
    projectName: string;
    quickstart: string;
  }>(null);
  const [form, setForm] = useState({
    organizationName: defaultCompanyName || "Northstar Dynamics",
    projectName: defaultProjectName,
    integrationType: "sdk",
    aiStack: "OpenAI",
    framework: "Next.js",
    environment: "production",
  });

  const snippet = useMemo(
    () => `export RISKDELTA_API_KEY=${result?.apiKey ?? "rd_live_********"}
export RISKDELTA_PROJECT_ID=${form.projectName.toLowerCase().replace(/\s+/g, "-")}

npm install @riskdelta/node`,
    [form.projectName, result?.apiKey],
  );

  async function handleComplete() {
    setSubmitting(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to complete onboarding");
      }

      setResult({
        apiKey: payload.apiKey,
        projectName: payload.project.name,
        quickstart: payload.quickstart,
      });
      setStep(4);
      toast.success("Workspace provisioned");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete onboarding");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <ConsoleSurface className="h-fit p-5">
        <ConsoleChip tone="accent">Onboarding</ConsoleChip>
        <h2 className="mt-4 text-[1.8rem] font-semibold tracking-[-0.04em] text-white">
          Launch your first protected AI workflow
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#a0a8a0]">
          Provision the org, project, runtime controls, and ingest credentials in one guided flow.
        </p>
        <div className="mt-5 space-y-3">
          {steps.map((label, index) => (
            <ConsoleRow
              key={label}
              tone={index === step ? "accent" : index < step ? "elevated" : "subtle"}
            >
              <ConsoleKicker>Step {index + 1}</ConsoleKicker>
              <p className="mt-2 text-sm text-white">{label}</p>
            </ConsoleRow>
          ))}
        </div>
      </ConsoleSurface>

      <ConsoleSurface className="p-6">
        <div className="space-y-6">
          {step <= 3 ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label>Organization name</Label>
                  <Input value={form.organizationName} onChange={(event) => setForm((current) => ({ ...current, organizationName: event.target.value }))} />
                </div>
                <div>
                  <Label>First project / app</Label>
                  <Input value={form.projectName} onChange={(event) => setForm((current) => ({ ...current, projectName: event.target.value }))} />
                </div>
                <div>
                  <Label>Integration type</Label>
                  <Select value={form.integrationType} onValueChange={(value) => setForm((current) => ({ ...current, integrationType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sdk">SDK</SelectItem>
                      <SelectItem value="api">REST API</SelectItem>
                      <SelectItem value="plugnplay">PlugNPlay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>AI stack</Label>
                  <Select value={form.aiStack} onValueChange={(value) => setForm((current) => ({ ...current, aiStack: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OpenAI">OpenAI</SelectItem>
                      <SelectItem value="Anthropic">Anthropic</SelectItem>
                      <SelectItem value="Gemini">Gemini</SelectItem>
                      <SelectItem value="Azure OpenAI">Azure OpenAI</SelectItem>
                      <SelectItem value="Custom">Open-source / custom model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Framework</Label>
                  <Select value={form.framework} onValueChange={(value) => setForm((current) => ({ ...current, framework: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Next.js">Next.js</SelectItem>
                      <SelectItem value="LangChain">LangChain</SelectItem>
                      <SelectItem value="LlamaIndex">LlamaIndex</SelectItem>
                      <SelectItem value="Vercel AI SDK">Vercel AI SDK</SelectItem>
                      <SelectItem value="Custom Agent">Custom Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Environment</Label>
                  <Select value={form.environment} onValueChange={(value) => setForm((current) => ({ ...current, environment: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                <ConsolePanel tone="subtle" className="p-5">
                  <ConsoleKicker>What happens next</ConsoleKicker>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--foreground-soft)]">
                    <p>1. Organization and first project are provisioned.</p>
                    <p>2. Runtime controls and policy surfaces are attached.</p>
                    <p>3. An API key and quickstart path are generated.</p>
                  </div>
                </ConsolePanel>
                <ConsolePanel tone="elevated" className="p-5">
                  <ConsoleKicker>Planned project id</ConsoleKicker>
                  <p className="mt-4 font-mono text-[13px] text-[#d5ecff]">
                    {form.projectName.toLowerCase().replace(/\s+/g, "-")}
                  </p>
                </ConsolePanel>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep((current) => Math.max(current - 1, 0))}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button onClick={() => setStep((current) => Math.min(current + 1, 3))}>Continue</Button>
                ) : (
                  <Button onClick={handleComplete} disabled={submitting}>
                    {submitting ? "Provisioning..." : "Generate API key"}
                  </Button>
                )}
              </div>
            </>
          ) : null}

          {step === 4 && result ? (
            <div className="space-y-6">
              <div>
                <ConsoleChip tone="success">Workspace ready</ConsoleChip>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  Your first protected project is live
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  RiskDelta created your organization, project, policies, runtime controls, integrations, and ingest credential.
                </p>
              </div>
              <CodeBlock title="Environment setup" language="bash" code={snippet} />
              <CodeBlock title="Quickstart" language="typescript" code={result.quickstart} />
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    startTransition(() => router.push("/app/overview"));
                  }}
                >
                  Enter dashboard
                </Button>
                <Button variant="secondary" onClick={() => startTransition(() => router.push("/app/quickstart"))}>
                  View quickstart
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </ConsoleSurface>
    </div>
  );
}

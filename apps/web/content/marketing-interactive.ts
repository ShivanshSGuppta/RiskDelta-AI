import type { PublicMarketingPagePayload } from "@riskdelta/types";

const now = () => new Date().toISOString();

export const marketingInteractiveContent: Record<
  "docs-preview" | "integrations" | "pricing" | "security",
  PublicMarketingPagePayload
> = {
  "docs-preview": {
    page: "docs-preview",
    updatedAt: now(),
    rows: [
      {
        id: "getting-started",
        label: "Getting started",
        detail:
          "Start with one project and one key, ingest one request, and verify the trace-to-verdict chain before expanding scope.",
        tone: "accent",
      },
      {
        id: "runtime-controls",
        label: "Runtime controls",
        detail: "PromptShield, DataGuard, ModelSwitch, AgentFence, and SentinelX are evaluated in sequence.",
      },
      {
        id: "policies",
        label: "Policies",
        detail: "Rules attach conditions, actions, severity, and mode to each policy run.",
      },
      {
        id: "trace-schema",
        label: "Trace schema",
        detail: "Prompt, output, tool calls, risk factors, verdict, and incident links are captured together.",
      },
      {
        id: "api-quickstart",
        label: "API quickstart",
        detail: "Use ingest endpoints and inspect result surfaces without changing product semantics.",
      },
      {
        id: "playground",
        label: "Playground",
        detail: "Simulate high-risk prompts and inspect explainability before production rollout.",
      },
    ],
  },
  integrations: {
    page: "integrations",
    updatedAt: now(),
    rows: [
      {
        id: "sdk",
        label: "SDK",
        detail: "Language hooks and wrappers for teams instrumenting sessions directly in code.",
      },
      {
        id: "api",
        label: "REST API",
        detail: "Direct event ingestion for custom pipelines and non-SDK environments.",
        tone: "accent",
      },
      {
        id: "connectors",
        label: "Connectors",
        detail: "Provider, workflow, and internal-system attachment with shared downstream behavior.",
      },
      {
        id: "openai",
        label: "OpenAI",
        detail: "Native provider integration with request/response metadata capture.",
      },
      {
        id: "anthropic",
        label: "Anthropic",
        detail: "Provider integration path with the same verdict and incident chain.",
      },
      {
        id: "azure-openai",
        label: "Azure OpenAI",
        detail: "Enterprise-hosted model endpoint support with consistent operator surfaces.",
      },
      {
        id: "workflow-systems",
        label: "Workflow systems",
        detail: "Attach workflow runtime events and preserve downstream intervention context.",
      },
      {
        id: "internal-agents",
        label: "Internal agents",
        detail: "Agent activity and tool paths scored and controlled like any other session.",
      },
      {
        id: "custom-telemetry",
        label: "Custom telemetry",
        detail: "Bring your own event stream and normalize into the RiskDelta control plane.",
      },
    ],
  },
  pricing: {
    page: "pricing",
    updatedAt: now(),
    rows: [
      {
        id: "enterprise",
        label: "Operator-heavy deployment",
        detail:
          "For organizations with multiple applications, stricter controls, and incident response depending on runtime evidence continuity.",
        tone: "accent",
      },
      {
        id: "starter",
        label: "Developer teams",
        detail: "For teams validating their first runtime control loop before scaling.",
      },
      {
        id: "protected-apps",
        label: "Number of protected applications and runtime environments.",
      },
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
    ],
  },
  security: {
    page: "security",
    updatedAt: now(),
    rows: [
      {
        id: "session-captured",
        label: "Session captured with actor, environment, model, provider, token pressure, and outbound intent.",
      },
      {
        id: "risk-scoring",
        label: "Risk scoring aligns weighted factors with the exact tool path and destination context.",
      },
      {
        id: "policy-evaluation",
        label: "Policy evaluation attaches readable conditions, actions, severity, and explainability.",
        tone: "accent",
      },
      {
        id: "control-verdict",
        label: "Controls record whether the session was blocked, transformed, reviewed, or escalated.",
      },
      {
        id: "incident-chain",
        label: "Incident timelines inherit the same trace and policy evidence instead of rebuilding context downstream.",
      },
      {
        id: "assurance-model",
        label: "Evidence first. Intervention second. Audit always attached.",
        detail: "Operators must explain what happened, why it was unsafe, and what control intervened.",
      },
      {
        id: "system-boundaries",
        label: "System boundaries remain visible even when backend features are still being phased in.",
      },
    ],
  },
};

export function getMarketingInteractiveContent(
  page: "docs-preview" | "integrations" | "pricing" | "security",
) {
  return marketingInteractiveContent[page];
}

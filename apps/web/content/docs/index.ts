export const docsSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    markdown: `# Getting Started

RiskDelta sits between your AI runtime and the systems it can influence.

## Core workflow

1. Connect an app through the SDK, REST API, or PlugNPlay integration.
2. Define policies and attach runtime controls.
3. Capture traces and compute risk.
4. Enforce guardrails or open incidents when thresholds are crossed.

## First checklist

- Create an organization and project
- Generate an API key
- Send one simulated request
- Inspect the resulting trace in TraceVault`,
  },
  {
    id: "policies",
    title: "Policies",
    markdown: `# Policies

Policies in RiskDelta are structured rules that can:

- block risky prompts
- redact sensitive output
- require approval
- switch to safer model tiers
- quarantine suspicious traces

Each saved policy stores both a structured JSON definition and a generated DSL preview for review and export.`,
  },
  {
    id: "runtime-controls",
    title: "Runtime Controls",
    markdown: `# Runtime Controls

## PromptShield
Detects prompt injection, instruction override, and jailbreak attempts.

## DataGuard
Redacts PII, secrets, and regulated data in inputs and outputs.

## ModelSwitch
Routes elevated-risk requests to lower-risk models.

## AgentFence
Restricts tool, filesystem, shell, and outbound execution surfaces.

## SentinelX
Issues the final verdict and opens incidents when required.`,
  },
  {
    id: "trace-schema",
    title: "Trace Schema",
    markdown: `# Trace Schema

Every trace records:

- request metadata
- prompt and response previews
- matched policies
- dimension scores
- runtime actions
- tool calls
- incident linkage

TraceVault is designed to support both observability and forensic review.`,
  },
];

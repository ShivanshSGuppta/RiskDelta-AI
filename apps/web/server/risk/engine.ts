import type { PolicyEditorInput, TraceEvaluationResult, TraceIngestRequest } from "@/lib/types";
import { clamp, hashString } from "@/lib/utils";
import { evaluatePolicyDefinition } from "@/server/policies/dsl";

type Signal = { key: string; weight: number; description: string };

const promptInjectionPatterns = [/ignore previous/gi, /jailbreak/gi, /reveal system/gi, /disable safety/gi];
const piiPatterns = [
  { key: "data.pii.email", regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, weight: 0.62 },
  { key: "data.pii.phone", regex: /(\+?\d[\d\s().-]{8,}\d)/g, weight: 0.51 },
  { key: "data.secret.token", regex: /\b(?:sk|api|rk)-(?:live|test)?[-_A-Za-z0-9]{12,}\b/g, weight: 0.72 },
];
const exfilPatterns = [/upload all/gi, /exfiltrate/gi, /send files/gi, /silent upload/gi];

function signal(key: string, weight: number, description: string): Signal {
  return { key, weight: clamp(weight), description };
}

function detectPromptSignals(scope: string) {
  const hits = promptInjectionPatterns.reduce((count, pattern) => count + (pattern.test(scope) ? 1 : 0), 0);
  if (hits === 0) return [] as Signal[];
  return [signal("prompt.injection", 0.46 + hits * 0.14, `${hits} prompt override markers detected`)];
}

function detectSensitiveSignals(scope: string) {
  const signals: Signal[] = [];
  for (const pattern of piiPatterns) {
    const matches = scope.match(pattern.regex);
    if (!matches?.length) continue;
    signals.push(signal(pattern.key, pattern.weight + matches.length * 0.06, `${matches.length} sensitive matches`));
  }
  return signals;
}

function detectToolSignals(scope: string, request: TraceIngestRequest) {
  const signals: Signal[] = [];

  const exfilHits = exfilPatterns.reduce((count, pattern) => count + (pattern.test(scope) ? 1 : 0), 0);
  if (exfilHits > 0) {
    signals.push(signal("agent.tool_exfil", 0.64 + exfilHits * 0.08, "Possible exfiltration language detected"));
  }

  const highPowerTools = request.toolUsage.tools.filter((tool) =>
    ["browser", "filesystem", "shell", "terminal", "http", "webhook"].some((token) => tool.toLowerCase().includes(token)),
  ).length;

  if (request.channel === "agent" && highPowerTools > 0) {
    signals.push(signal("agent.autonomy", 0.32 + highPowerTools * 0.08, "Autonomous tool surface exposed"));
  }

  if (request.desiredTargets.some((target) => target.startsWith("http"))) {
    signals.push(signal("runtime.external_call", 0.52, "External URL target present"));
  }

  return signals;
}

function baselineSignals(request: TraceIngestRequest) {
  const signals: Signal[] = [];
  const modelRisk = request.model.toLowerCase().includes("safe") ? 0.14 : 0.25;
  const channelRisk = request.channel === "agent" ? 0.22 : request.channel === "api" ? 0.14 : 0.09;
  const toolRisk = request.toolUsage.enabled ? 0.12 : 0.02;

  signals.push(signal("baseline.model", modelRisk, `Model baseline for ${request.model}`));
  signals.push(signal("baseline.channel", channelRisk, `Channel exposure for ${request.channel}`));
  signals.push(
    signal(
      "baseline.tools",
      toolRisk + request.toolUsage.tools.length * 0.02,
      request.toolUsage.enabled ? `Enabled tools: ${request.toolUsage.tools.join(", ")}` : "Tools disabled",
    ),
  );

  return signals;
}

function dimensionScore(label: string, key: string, score: number, weight: number, explanation: string) {
  return {
    label,
    key,
    score: clamp(score),
    weight,
    explanation,
  };
}

function severityFromScore(score: number) {
  if (score >= 0.84) return "CRITICAL" as const;
  if (score >= 0.64) return "HIGH" as const;
  if (score >= 0.38) return "MEDIUM" as const;
  return "LOW" as const;
}

function redactOutput(text: string) {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .replace(/(\+?\d[\d\s().-]{8,}\d)/g, "[REDACTED_PHONE]")
    .replace(/\b(?:sk|api|rk)-(?:live|test)?[-_A-Za-z0-9]{12,}\b/g, "[REDACTED_TOKEN]");
}

function summarizeTopSignals(signals: Signal[]) {
  return [...signals].sort((a, b) => b.weight - a.weight).slice(0, 5);
}

export function buildTraceEvaluation({
  request,
  policies,
}: {
  request: TraceIngestRequest;
  policies: PolicyEditorInput[];
}): TraceEvaluationResult {
  const scope = `${request.prompt}\n${request.context}`.trim();
  const baseline = baselineSignals(request);
  const promptSignals = detectPromptSignals(scope);
  const sensitiveSignals = detectSensitiveSignals(scope);
  const toolSignals = detectToolSignals(scope, request);
  const signals = [...baseline, ...promptSignals, ...sensitiveSignals, ...toolSignals];

  const preliminaryRisk = clamp(signals.reduce((sum, entry) => sum + entry.weight * 0.16, 0));

  const policyMatches = policies.flatMap((policy) => evaluatePolicyDefinition({
    definition: policy,
    signals,
    riskScore: preliminaryRisk,
    request,
  }).matches);

  const matchedActions = policyMatches.map((match) => match.action);

  const dimensions = [
    dimensionScore(
      "Prompt attack likelihood",
      "prompt_attack_likelihood",
      promptSignals[0]?.weight ?? 0.08,
      0.18,
      promptSignals[0]?.description ?? "No high-confidence prompt override markers observed.",
    ),
    dimensionScore(
      "Sensitive data exposure",
      "sensitive_data_exposure",
      sensitiveSignals.reduce((max, entry) => Math.max(max, entry.weight), 0.06),
      0.16,
      sensitiveSignals[0]?.description ?? "No sensitive data signatures detected in request flow.",
    ),
    dimensionScore(
      "Tool abuse risk",
      "tool_abuse_risk",
      toolSignals.find((entry) => entry.key.includes("tool"))?.weight ?? 0.1,
      0.15,
      toolSignals.find((entry) => entry.key.includes("tool"))?.description ?? "Tool surface remains bounded.",
    ),
    dimensionScore(
      "Model reliability risk",
      "model_reliability_risk",
      baseline.find((entry) => entry.key === "baseline.model")?.weight ?? 0.2,
      0.08,
      "Risk adjusted based on provider/model safety posture.",
    ),
    dimensionScore(
      "Agent autonomy risk",
      "agent_autonomy_risk",
      toolSignals.find((entry) => entry.key === "agent.autonomy")?.weight ?? (request.channel === "agent" ? 0.3 : 0.06),
      0.13,
      request.channel === "agent"
        ? "Autonomous execution path detected."
        : "No autonomous execution path observed.",
    ),
    dimensionScore(
      "External call risk",
      "external_call_risk",
      toolSignals.find((entry) => entry.key === "runtime.external_call")?.weight ?? 0.08,
      0.1,
      request.desiredTargets.length > 0
        ? "External targets are present in the request plan."
        : "No outbound targets declared.",
    ),
    dimensionScore(
      "Output safety risk",
      "output_safety_risk",
      sensitiveSignals.length > 0 ? 0.58 : 0.14,
      0.1,
      sensitiveSignals.length > 0 ? "Output sanitation likely required." : "No dangerous output signature detected.",
    ),
    dimensionScore(
      "Policy violation density",
      "policy_violation_density",
      clamp(policyMatches.length / Math.max(policies.length * 1.5, 1)),
      0.1,
      `${policyMatches.length} policy rule(s) matched during evaluation.`,
    ),
  ];

  const weightedScore = clamp(
    dimensions.reduce((sum, entry) => sum + entry.score * entry.weight, 0) +
      (matchedActions.includes("BLOCK") ? 0.12 : 0) +
      (matchedActions.includes("REQUIRE_APPROVAL") ? 0.05 : 0),
  );

  const hasExplicitExfiltration =
    toolSignals.some((entry) => entry.key === "agent.tool_exfil") &&
    request.desiredTargets.some((target) => target.startsWith("http"));
  const shouldBlock = matchedActions.includes("BLOCK") || weightedScore >= 0.82 || hasExplicitExfiltration;
  const severity = shouldBlock ? ("CRITICAL" as const) : severityFromScore(weightedScore);
  const shouldTransform = matchedActions.includes("REDACT") || sensitiveSignals.length > 0;
  const shouldReview = matchedActions.includes("REQUIRE_APPROVAL") || matchedActions.includes("ALERT");
  const shouldSwitchModel = matchedActions.includes("FALLBACK_MODEL") || (weightedScore >= 0.58 && weightedScore < 0.82);
  const selectedModel = shouldSwitchModel ? "gpt-4.1-mini-safe" : undefined;

  const runtimeActions = [
    {
      control: "PromptShield",
      action: promptSignals.length > 0 ? "Flag prompt structure" : "Monitor prompt",
      summary: promptSignals.length > 0 ? "Injection/jailbreak markers scored above baseline." : "No prompt override markers found.",
    },
    {
      control: "DataGuard",
      action: shouldTransform ? "Redact sensitive output" : "Observe content",
      summary: sensitiveSignals.length > 0 ? "PII/secrets detected and redaction path enabled." : "No redaction required for current flow.",
    },
    {
      control: "ModelSwitch",
      action: selectedModel ? `Route to ${selectedModel}` : "Keep primary model",
      summary: selectedModel ? "Traffic shifted to safer model profile due to elevated risk." : "Primary model remains within policy bounds.",
    },
    {
      control: "AgentFence",
      action: shouldBlock ? "Block risky tool call" : "Constrain tool surface",
      summary: toolSignals.length > 0 ? "Tool and autonomy signals tightened execution boundaries." : "No tool boundary escalation needed.",
    },
  ];

  const verdict = shouldBlock ? "BLOCK" : shouldTransform ? "TRANSFORM" : shouldReview ? "REVIEW" : "ALLOW";
  const responseBase = `RiskDelta processed ${request.requestId} for ${request.model} in ${request.environment}.`;
  const outputPreview = shouldTransform ? redactOutput(responseBase) : responseBase;
  const topSignals = summarizeTopSignals(signals);
  const confidence = clamp(topSignals.reduce((sum, entry) => sum + entry.weight, 0) / Math.max(topSignals.length, 1));
  const incidentRecommended = verdict === "BLOCK" || severity === "CRITICAL";
  const incidentTitle = incidentRecommended
    ? `Critical ${topSignals[0]?.key.replace(/[._]/g, " ") ?? "runtime"} event in ${request.environment}`
    : undefined;

  return {
    riskScore: weightedScore,
    confidence,
    severity,
    verdict,
    selectedModel,
    outputPreview,
    explainability:
      verdict === "BLOCK"
        ? "SentinelX blocked the flow after policy and runtime controls converged on a critical outcome."
        : verdict === "TRANSFORM"
          ? "SentinelX allowed execution only after DataGuard redacted sensitive content."
          : verdict === "REVIEW"
            ? "SentinelX escalated the request for review based on policy severity and confidence."
            : "SentinelX allowed execution within current policy and runtime thresholds.",
    dimensionScores: dimensions,
    matchedRules: policyMatches,
    runtimeActions: [
      ...runtimeActions,
      {
        control: "SentinelX",
        action: verdict,
        summary: incidentRecommended
          ? "Incident threshold crossed and escalation path armed."
          : "Final verdict issued without incident escalation.",
      },
    ],
    signals: [...signals].sort((a, b) => b.weight - a.weight),
    incidentRecommended,
    incidentTitle,
  };
}

export function buildToolCallRecords(request: TraceIngestRequest, evaluation: TraceEvaluationResult) {
  const riskyTools = ["browser", "filesystem", "shell", "terminal", "http", "webhook"];
  return request.toolUsage.tools.map((tool, index) => {
    const blocked =
      evaluation.verdict === "BLOCK" &&
      riskyTools.some((token) => tool.toLowerCase().includes(token));

    return {
      name: tool,
      target: request.desiredTargets[index] ?? "internal://tool",
      status: blocked ? "BLOCKED" : evaluation.verdict === "TRANSFORM" ? "SANITIZED" : "ALLOWED",
      blocked,
      details: {
        latencyMs: Math.round((hashString(`${request.requestId}-${tool}`) % 70) + 18),
      },
    };
  });
}

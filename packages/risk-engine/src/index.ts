export type RiskFactor = {
  key: string;
  weight: number;
  score: number;
  detail: string;
};

export type RiskResult = {
  score: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  explainability: string;
  factors: RiskFactor[];
};

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function scoreRisk(input: {
  prompt: string;
  toolCalls: string[];
  destinationCount?: number;
  containsSensitiveData?: boolean;
}): RiskResult {
  const factors: RiskFactor[] = [];

  const promptFactor = clamp(
    /ignore|bypass|override|exfil|export|without notifying|silent/i.test(input.prompt) ? 0.85 : 0.25,
  );
  factors.push({
    key: "prompt.intent",
    weight: 0.4,
    score: promptFactor,
    detail: "Prompt intent score based on risky instruction patterns.",
  });

  const toolFactor = clamp(input.toolCalls.length > 0 ? Math.min(1, input.toolCalls.length * 0.2) : 0.1);
  factors.push({
    key: "tool.surface",
    weight: 0.25,
    score: toolFactor,
    detail: "Higher score when multiple tools are invoked in a single session.",
  });

  const destinationFactor = clamp(Math.min(1, (input.destinationCount ?? 0) * 0.25));
  factors.push({
    key: "destination.intent",
    weight: 0.2,
    score: destinationFactor,
    detail: "Outbound destination pressure.",
  });

  const dataFactor = input.containsSensitiveData ? 0.9 : 0.2;
  factors.push({
    key: "data.sensitivity",
    weight: 0.15,
    score: dataFactor,
    detail: "Sensitive data presence factor.",
  });

  const weightedScore = clamp(
    factors.reduce((sum, factor) => sum + factor.weight * factor.score, 0),
    0,
    1,
  );

  const severity =
    weightedScore >= 0.8 ? "CRITICAL" : weightedScore >= 0.6 ? "HIGH" : weightedScore >= 0.35 ? "MEDIUM" : "LOW";

  return {
    score: weightedScore,
    severity,
    explainability: `Risk score ${weightedScore.toFixed(2)} derived from prompt intent, tool usage, destination pressure, and data sensitivity.`,
    factors,
  };
}

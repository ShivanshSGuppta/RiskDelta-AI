import { dump, load } from "js-yaml";
import { z } from "zod";
import type { RuntimeVerdict } from "@riskdelta/types";

export type PolicyDecision = {
  matched: boolean;
  verdict: RuntimeVerdict;
  reason: string;
};

export const policyActionValues = [
  "ALLOW",
  "LOG",
  "ALERT",
  "REDACT",
  "BLOCK",
  "REQUIRE_APPROVAL",
  "FALLBACK_MODEL",
  "QUARANTINE_TRACE",
] as const;

export const policyModeValues = ["SIMULATE", "ENFORCE"] as const;
export const severityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export const PolicyConditionSchema = z.object({
  signal: z.string().optional(),
  minWeight: z.number().min(0).max(1).optional(),
  riskAtLeast: z.number().min(0).max(1).optional(),
  metadataField: z.string().optional(),
  metadataEquals: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const PolicyRuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  conditionText: z.string().min(3),
  action: z.enum(policyActionValues),
  when: PolicyConditionSchema,
});

export const PolicyDefinitionSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(12),
  category: z.string().min(2),
  severity: z.enum(severityValues),
  scope: z.string().min(2),
  mode: z.enum(policyModeValues),
  tags: z.array(z.string()).default([]),
  rules: z.array(PolicyRuleSchema).min(1),
});

export type PolicyDefinition = z.infer<typeof PolicyDefinitionSchema>;
export type PolicySignal = { key: string; weight: number; description: string };
export type PolicyRuleMatch = {
  id: string;
  title: string;
  condition: string;
  action: z.infer<typeof PolicyRuleSchema>["action"];
  weight: number;
};

export function generatePolicyDsl(definition: PolicyDefinition) {
  const validated = PolicyDefinitionSchema.parse(definition);
  return dump({
    version: 1,
    name: validated.name,
    description: validated.description,
    category: validated.category,
    severity: validated.severity,
    scope: validated.scope,
    mode: validated.mode,
    tags: validated.tags,
    rules: validated.rules.map((rule) => ({
      id: rule.id,
      title: rule.title,
      condition: rule.conditionText,
      when: rule.when,
      action: rule.action,
    })),
  });
}

export function parsePolicyDsl(dsl: string) {
  const parsed = load(dsl) as Record<string, unknown>;
  const rules = Array.isArray(parsed.rules) ? parsed.rules : [];
  return PolicyDefinitionSchema.parse({
    name: parsed.name,
    description: parsed.description,
    category: parsed.category,
    severity: parsed.severity,
    scope: parsed.scope,
    mode: parsed.mode,
    tags: parsed.tags ?? [],
    rules: rules.map((rule) => {
      const item = rule as Record<string, unknown>;
      return {
        id: item.id,
        title: item.title,
        conditionText: item.condition,
        action: item.action,
        when: item.when ?? {},
      };
    }),
  });
}

export function evaluatePolicyDefinition(args: {
  definition: PolicyDefinition;
  signals: PolicySignal[];
  riskScore: number;
  metadata?: Record<string, unknown>;
}) {
  const signalMap = new Map(args.signals.map((signal) => [signal.key, signal.weight]));
  const matches: PolicyRuleMatch[] = [];

  for (const rule of args.definition.rules) {
    let matched = true;
    let weight = 0;

    if (rule.when.signal) {
      weight = signalMap.get(rule.when.signal) ?? 0;
      if (rule.when.minWeight !== undefined && weight < rule.when.minWeight) {
        matched = false;
      }
    }

    if (rule.when.riskAtLeast !== undefined && args.riskScore < rule.when.riskAtLeast) {
      matched = false;
      weight = Math.max(weight, args.riskScore);
    }

    if (rule.when.metadataField) {
      const value = args.metadata?.[rule.when.metadataField];
      if (value !== rule.when.metadataEquals) {
        matched = false;
      }
    }

    if (matched) {
      matches.push({
        id: rule.id,
        title: rule.title,
        condition: rule.conditionText,
        action: rule.action,
        weight,
      });
    }
  }

  return {
    matches,
    actions: matches.map((match) => match.action),
  };
}

export function evaluatePolicies(args: {
  riskScore: number;
  toolCalls: string[];
  strictMode?: boolean;
}): PolicyDecision {
  const hasRiskyTool = args.toolCalls.some((tool) =>
    ["browser", "filesystem", "shell", "terminal", "webhook", "http"].includes(tool.toLowerCase()),
  );

  if (args.riskScore >= 0.8 && (hasRiskyTool || args.strictMode)) {
    return {
      matched: true,
      verdict: "BLOCK",
      reason: "High-risk session with sensitive tool path.",
    };
  }

  if (args.riskScore >= 0.6) {
    return {
      matched: true,
      verdict: "REVIEW",
      reason: "Medium-risk session requires operator review.",
    };
  }

  return {
    matched: false,
    verdict: "ALLOW",
    reason: "No blocking policy matched.",
  };
}

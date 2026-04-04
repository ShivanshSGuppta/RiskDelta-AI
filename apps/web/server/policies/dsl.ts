import {
  evaluatePolicyDefinition as evaluateDefinition,
  generatePolicyDsl as generateDsl,
  parsePolicyDsl as parseDsl,
  PolicyDefinitionSchema,
  type PolicyDefinition,
} from "@riskdelta/policy-engine";
import type { TraceIngestRequest } from "@/lib/types";

type Signal = { key: string; weight: number; description: string };

function requestMetadata(request: TraceIngestRequest): Record<string, unknown> {
  return {
    projectId: request.projectId,
    requestId: request.requestId,
    environment: request.environment,
    provider: request.provider,
    model: request.model,
    actor: request.actor,
    ip: request.ip,
    country: request.country,
    sessionId: request.sessionId,
    channel: request.channel,
  };
}

export function generatePolicyDsl(input: PolicyDefinition) {
  return generateDsl(PolicyDefinitionSchema.parse(input));
}

export function parsePolicyDsl(dsl: string) {
  return parseDsl(dsl);
}

export function evaluatePolicyDefinition({
  definition,
  signals,
  riskScore,
  request,
}: {
  definition: PolicyDefinition;
  signals: Signal[];
  riskScore: number;
  request: TraceIngestRequest;
}) {
  return evaluateDefinition({
    definition,
    signals,
    riskScore,
    metadata: requestMetadata(request),
  });
}

import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { TraceIngestRequestSchema } from "@/lib/types";
import { hashString, slugify } from "@/lib/utils";
import { prisma } from "@/server/db/prisma";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { evaluatePolicyDefinition } from "@/server/policies/dsl";
import { buildToolCallRecords, buildTraceEvaluation } from "@/server/risk/engine";
import { getActivePolicyDefinitions } from "@/server/services/policy-service";

type TraceListItem = Prisma.TraceGetPayload<{
  include: {
    project: true;
    incident: true;
  };
}>;

type TraceDetailItem = Prisma.TraceGetPayload<{
  include: {
    project: true;
    toolCalls: true;
    riskEvents: true;
    incident: true;
    policyRuns: {
      include: {
        policyVersion: {
          include: {
            policy: true;
          };
        };
        matches: true;
      };
    };
    traceSessionRef: {
      include: {
        events: true;
      };
    };
  };
}>;

function traceExternalId(requestId: string) {
  return `trace_${Date.now().toString(36)}_${hashString(requestId).toString(36).slice(0, 6)}`;
}

function apiBaseUrl() {
  return process.env.RISKDELTA_API_URL ?? "http://localhost:4100";
}

async function fetchTraceApi<T>({
  path,
  organizationId,
}: {
  path: string;
  organizationId: string;
}): Promise<T> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    throw new Error("Missing session token for API-backed trace request.");
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`,
      "x-riskdelta-organization-id": organizationId,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Trace API request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function ingestTrace({
  organizationId,
  input,
}: {
  organizationId: string;
  input: unknown;
}) {
  const request = TraceIngestRequestSchema.parse(input);

  const project = await prisma.project.findFirst({
    where: {
      id: request.projectId,
      organizationId,
    },
  });

  if (!project) {
    throw new Error("Project not found for trace ingestion.");
  }

  const activePolicyVersions = await getActivePolicyDefinitions(organizationId);
  const evaluation = buildTraceEvaluation({
    request,
    policies: activePolicyVersions.map((version) => version.parsedDefinition),
  });

  const toolCalls = buildToolCallRecords(request, evaluation);

  const trace = await prisma.$transaction(async (tx) => {
    const createdTrace = await tx.trace.create({
      data: {
        externalId: traceExternalId(request.requestId),
        organizationId,
        projectId: request.projectId,
        requestId: request.requestId,
        environment: request.environment,
        channel: request.channel,
        provider: request.provider,
        model: request.model,
        prompt: request.prompt,
        promptPreview: request.prompt.slice(0, 220),
        context: request.context,
        response: evaluation.outputPreview,
        responsePreview: evaluation.outputPreview.slice(0, 220),
        actor: request.actor,
        ip: request.ip,
        country: request.country,
        sessionId: request.sessionId,
        toolSummary: request.toolUsage.tools.join(", "),
        desiredTargets: request.desiredTargets,
        tags: Array.from(
          new Set(
            evaluation.signals.map((signal) => signal.key.split(".")[0]).concat(evaluation.verdict === "BLOCK" ? ["incident"] : []),
          ),
        ),
        riskScore: evaluation.riskScore,
        confidence: evaluation.confidence,
        severity: evaluation.severity,
        verdict: evaluation.verdict,
        blocked: evaluation.verdict === "BLOCK",
        redacted: evaluation.verdict === "TRANSFORM",
        selectedModel: evaluation.selectedModel,
        explainability: evaluation.explainability,
        dimensionScores: evaluation.dimensionScores as unknown as Prisma.JsonArray,
        runtimeActions: evaluation.runtimeActions as unknown as Prisma.JsonArray,
        signals: evaluation.signals as unknown as Prisma.JsonArray,
        toolCalls: {
          create: toolCalls,
        },
      },
      include: {
        toolCalls: true,
      },
    });

    for (const version of activePolicyVersions) {
      const policyResult = evaluatePolicyDefinition({
        definition: version.parsedDefinition,
        signals: evaluation.signals,
        riskScore: evaluation.riskScore,
        request,
      });

      const run = await tx.policyRun.create({
        data: {
          traceId: createdTrace.id,
          policyVersionId: version.id,
          mode: version.policy.mode,
          outcome: policyResult.matches.length > 0 ? "MATCHED" : "NO_MATCH",
        },
      });

      if (policyResult.matches.length > 0) {
        await tx.policyMatch.createMany({
          data: policyResult.matches.map((match) => ({
            policyRunId: run.id,
            ruleId: match.id,
            title: match.title,
            action: match.action,
            weight: match.weight,
            condition: match.condition,
          })),
        });
      }
    }

    await tx.riskEvent.createMany({
      data: evaluation.dimensionScores.map((dimension) => ({
        traceId: createdTrace.id,
        dimensionKey: dimension.key,
        title: dimension.label,
        severity: evaluation.severity,
        score: dimension.score,
        confidence: evaluation.confidence,
        explanation: dimension.explanation,
      })),
    });

    if (evaluation.incidentRecommended) {
      await tx.incident.create({
        data: {
          organizationId,
          projectId: request.projectId,
          traceId: createdTrace.id,
          title: evaluation.incidentTitle ?? "Critical runtime event",
          slug: `${slugify(evaluation.incidentTitle ?? request.requestId)}-${Date.now().toString().slice(-4)}`,
          severity: evaluation.severity,
          status: "OPEN",
          summary: evaluation.explainability,
          rootCause: evaluation.signals[0]?.description ?? "Elevated runtime risk detected.",
          remediationNotes: "Inspect trace evidence, tighten runtime controls, and rotate exposed credentials if applicable.",
          triggerSource: evaluation.runtimeActions.find((action) => action.control === "SentinelX")?.summary ?? "SentinelX escalation",
          assigneeName: null,
          timeline: [
            { at: new Date().toISOString(), title: "Trace captured", detail: `${request.requestId} entered RiskDelta` },
            { at: new Date().toISOString(), title: "Policies matched", detail: `${evaluation.matchedRules.length} policy matches recorded` },
            { at: new Date().toISOString(), title: "Incident opened", detail: evaluation.explainability },
          ],
        },
      });
    }

    await tx.project.update({
      where: { id: request.projectId },
      data: {
        lastActivity: new Date(),
        riskStatus: evaluation.severity,
      },
    });

    await tx.auditLog.create({
      data: {
        organizationId,
        actorName: request.actor,
        action: "trace.ingested",
        targetType: "Trace",
        targetId: createdTrace.id,
        metadata: {
          requestId: request.requestId,
          verdict: evaluation.verdict,
          riskScore: evaluation.riskScore,
        },
      },
    });

    return createdTrace;
  });

  return getTraceDetail(trace.id, organizationId);
}

export async function listTraces({
  organizationId,
  query,
  verdict,
  provider,
  environment,
  severity,
}: {
  organizationId: string;
  query?: string | null;
  verdict?: string | null;
  provider?: string | null;
  environment?: string | null;
  severity?: string | null;
}) {
  const params = new URLSearchParams({ orgId: organizationId });
  if (query) params.set("query", query);
  if (verdict) params.set("verdict", verdict);
  if (provider) params.set("provider", provider);
  if (environment) params.set("environment", environment);
  if (severity) params.set("severity", severity);

  const payload = await fetchTraceApi<{
    traces: TraceListItem[];
  }>({
    path: `/v1/traces?${params.toString()}`,
    organizationId,
  });
  return payload.traces;
}

export async function getTraceDetail(id: string, organizationId: string) {
  const params = new URLSearchParams({ orgId: organizationId });
  const payload = await fetchTraceApi<{
    trace: TraceDetailItem | null;
  }>({
    path: `/v1/traces/${id}?${params.toString()}`,
    organizationId,
  });
  return payload.trace;
}

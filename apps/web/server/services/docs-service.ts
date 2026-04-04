import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

function apiBaseUrl() {
  return process.env.RISKDELTA_API_URL ?? "http://localhost:4100";
}

async function fetchDocsApi<T>({
  path,
  organizationId,
}: {
  path: string;
  organizationId: string;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    throw new Error("Missing session token for API-backed docs request.");
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
    throw new Error(`Docs API request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

function fallbackDocsFoundation() {
  return {
    sections: [
      {
        id: "trace-model",
        title: "Trace Model",
        summary: "Capture prompt, tools, output, policy chain, risk factors, and runtime actions in one chronology.",
      },
      {
        id: "policy-execution",
        title: "Policy Execution",
        summary: "Deterministic SIMULATE/ENFORCE evaluation with versioned rules and matched conditions.",
      },
      {
        id: "incident-chain",
        title: "Incident Chain",
        summary: "Escalations preserve linked traces, control actions, and timeline events for operator review.",
      },
    ],
    latestAudit: [] as Array<{
      id: string;
      action: string;
      actorName: string;
      createdAt: Date;
      targetType: string;
    }>,
  };
}

export async function getDocsFoundation(organizationId: string) {
  try {
    return await fetchDocsApi<{
      sections: Array<{ id: string; title: string; summary: string }>;
      latestAudit: Array<{
        id: string;
        action: string;
        actorName: string;
        createdAt: string;
        targetType: string;
      }>;
    }>({
      path: `/v1/docs/foundation?orgId=${organizationId}`,
      organizationId,
    });
  } catch {
    const fallback = fallbackDocsFoundation();
    const latestAudit = await prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        action: true,
        actorName: true,
        createdAt: true,
        targetType: true,
      },
    });
    return {
      ...fallback,
      latestAudit,
    };
  }
}


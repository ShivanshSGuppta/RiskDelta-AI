import { cookies } from "next/headers";
import { COMMERCIAL_EDITION } from "@riskdelta/types";
import { quickstartPresets } from "@/server/services/catalog";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";

function apiBaseUrl() {
  return process.env.RISKDELTA_API_URL ?? "http://localhost:4100";
}

function availableQuickstartPresets() {
  if (process.env.RISKDELTA_EDITION === COMMERCIAL_EDITION) {
    return quickstartPresets;
  }

  return quickstartPresets.filter((preset) => preset.integrationType !== "plugnplay");
}

async function fetchQuickstartApi<T>({
  path,
  organizationId,
  method = "GET",
  body,
}: {
  path: string;
  organizationId: string;
  method?: "GET" | "POST";
  body?: unknown;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    throw new Error("Missing session token for API-backed quickstart request.");
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    method,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`,
      "x-riskdelta-organization-id": organizationId,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Quickstart API request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

export function getQuickstartData({
  organizationName,
  projectSlug,
  apiKeyPrefix,
}: {
  organizationName: string;
  projectSlug: string;
  apiKeyPrefix: string;
}) {
  return {
    env: {
      RISKDELTA_BASE_URL: "http://localhost:3000",
      RISKDELTA_PROJECT_ID: projectSlug,
      RISKDELTA_API_KEY: `${apiKeyPrefix}…`,
      RISKDELTA_ORG: organizationName,
    },
    presets: availableQuickstartPresets(),
    endpoints: [
      { method: "POST", path: "/api/playground/simulate", purpose: "Simulate a request and persist a trace" },
      { method: "GET", path: "/api/traces", purpose: "List captured traces" },
      { method: "GET", path: "/api/overview", purpose: "Fetch dashboard aggregates" },
      { method: "GET", path: "/api/settings/api-keys", purpose: "Manage ingest credentials" },
    ],
  };
}

export async function getQuickstartDataForOrganization({
  organizationId,
  organizationName,
  projectSlug,
  apiKeyPrefix,
}: {
  organizationId: string;
  organizationName: string;
  projectSlug: string;
  apiKeyPrefix: string;
}) {
  try {
    return await fetchQuickstartApi<ReturnType<typeof getQuickstartData>>({
      path: `/v1/quickstart?orgId=${organizationId}`,
      organizationId,
    });
  } catch {
    return getQuickstartData({ organizationName, projectSlug, apiKeyPrefix });
  }
}

export async function verifyQuickstart({
  organizationId,
  projectId,
  integrationType,
  status = "SUCCESS",
  notes,
}: {
  organizationId: string;
  projectId: string;
  integrationType: "sdk" | "api" | "plugnplay";
  status?: "SUCCESS" | "WARNING" | "FAILED";
  notes?: string;
}) {
  return fetchQuickstartApi<{ ok: boolean; message: string }>({
    path: `/v1/quickstart/verify?orgId=${organizationId}`,
    organizationId,
    method: "POST",
    body: {
      projectId,
      integrationType,
      status,
      notes,
    },
  });
}

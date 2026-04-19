import { cookies } from "next/headers";
import { ApiKeyCreateSchema, OrganizationUpdateSchema } from "@/lib/types";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";

function apiBaseUrl() {
  return process.env.RISKDELTA_API_URL ?? "http://localhost:4100";
}

async function fetchSettingsApi<T>({
  path,
  organizationId,
  method = "GET",
  body,
}: {
  path: string;
  organizationId: string;
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    throw new Error("Missing session token for API-backed settings request.");
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
    throw new Error(`Settings API request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function getOrganizationSettings(organizationId: string) {
  return fetchSettingsApi<
    {
      organization: {
        id: string;
        name: string;
        slug: string;
        tier: string;
        domain: string | null;
      } | null;
      members: Array<{
        id: string;
        role: string;
        user: { id: string; fullName: string; email: string };
      }>;
      apiKeys: Array<{
        id: string;
        name: string;
        prefix: string;
        lastFour: string;
        scopes: string[];
        createdAt: string;
        lastUsedAt: string | null;
        revokedAt: string | null;
        expiresAt: string | null;
      }>;
      auditLogs: Array<{
        id: string;
        actorName: string;
        action: string;
        targetType: string;
        targetId: string;
        metadata: unknown;
        createdAt: string;
      }>;
      docs?: { sections: Array<{ id: string; title: string; summary: string }> };
    }
  >({
    path: `/v1/settings/foundation?orgId=${organizationId}`,
    organizationId,
  });
}

export async function updateOrganizationSettings({
  organizationId,
  input,
}: {
  organizationId: string;
  input: unknown;
}) {
  const data = OrganizationUpdateSchema.parse(input);
  const payload = await fetchSettingsApi<{
    organization: {
      id: string;
      name: string;
      slug: string;
      tier: string;
      domain: string | null;
    } | null;
  }>({
    path: `/v1/settings/organization?orgId=${organizationId}`,
    organizationId,
    method: "PATCH",
    body: data,
  });
  return payload.organization;
}

export async function createApiKey({
  organizationId,
  input,
}: {
  organizationId: string;
  input: unknown;
}) {
  const data = ApiKeyCreateSchema.parse(input);

  const payload = await fetchSettingsApi<{
    apiKey: {
      id: string;
      name: string;
      prefix: string;
      lastFour: string;
      scopes: string[];
      createdAt: string;
      expiresAt: string | null;
    };
    token: string;
    revealOnce: boolean;
  }>({
    path: `/v1/settings/api-keys?orgId=${organizationId}`,
    organizationId,
    method: "POST",
    body: data,
  });
  return {
    apiKey: payload.apiKey,
    rawKey: payload.token,
  };
}

export async function getAuditLogs({
  organizationId,
  limit = 100,
}: {
  organizationId: string;
  limit?: number;
}) {
  const payload = await fetchSettingsApi<{
    logs: Array<{
      id: string;
      actorName: string;
      action: string;
      targetType: string;
      targetId: string;
      metadata: unknown;
      createdAt: string;
    }>;
  }>({
    path: `/v1/audit?orgId=${organizationId}&limit=${limit}`,
    organizationId,
  });
  return payload.logs;
}

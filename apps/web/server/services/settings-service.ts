import { cookies } from "next/headers";
import { ApiKeyCreateSchema, OrganizationUpdateSchema } from "@/lib/types";
import { prisma } from "@/server/db/prisma";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { createApiKeyRecord } from "@/server/enforcement/api-keys";

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

async function getOrganizationSettingsLocal(organizationId: string) {
  const [organization, members, apiKeys, auditLogs] = await Promise.all([
    prisma.organization.findUnique({ where: { id: organizationId } }),
    prisma.membership.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.apiKey.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  return { organization, members, apiKeys, auditLogs };
}

export async function getOrganizationSettings(organizationId: string) {
  try {
    const payload = await fetchSettingsApi<
      Awaited<ReturnType<typeof getOrganizationSettingsLocal>> & {
        docs?: { sections: Array<{ id: string; title: string; summary: string }> };
      }
    >({
      path: `/v1/settings/foundation?orgId=${organizationId}`,
      organizationId,
    });
    return payload;
  } catch {
    return getOrganizationSettingsLocal(organizationId);
  }
}

export async function updateOrganizationSettings({
  organizationId,
  input,
}: {
  organizationId: string;
  input: unknown;
}) {
  const data = OrganizationUpdateSchema.parse(input);
  try {
    const payload = await fetchSettingsApi<{
      organization: Awaited<ReturnType<typeof getOrganizationSettingsLocal>>["organization"];
    }>({
      path: `/v1/settings/organization?orgId=${organizationId}`,
      organizationId,
      method: "PATCH",
      body: data,
    });
    return payload.organization;
  } catch {
    return prisma.organization.update({
      where: { id: organizationId },
      data,
    });
  }
}

export async function createApiKey({
  organizationId,
  userId,
  input,
}: {
  organizationId: string;
  userId: string;
  input: unknown;
}) {
  const data = ApiKeyCreateSchema.parse(input);

  try {
    const payload = await fetchSettingsApi<{
      apiKey: Awaited<ReturnType<typeof getOrganizationSettingsLocal>>["apiKeys"][number];
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
  } catch {
    return prisma.$transaction(async (tx) => {
      const { apiKey, rawKey } = await createApiKeyRecord({
        tx,
        organizationId,
        userId,
        name: data.name,
        scopes: data.scopes,
      });

      return { apiKey, rawKey };
    });
  }
}

export async function getAuditLogs({
  organizationId,
  limit = 100,
}: {
  organizationId: string;
  limit?: number;
}) {
  try {
    const payload = await fetchSettingsApi<{ logs: Array<Awaited<ReturnType<typeof getOrganizationSettingsLocal>>["auditLogs"][number]> }>({
      path: `/v1/audit?orgId=${organizationId}&limit=${limit}`,
      organizationId,
    });
    return payload.logs;
  } catch {
    return prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: Math.max(10, Math.min(limit, 250)),
    });
  }
}

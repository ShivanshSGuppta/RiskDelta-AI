import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { hasMinimumRole } from "@/server/auth/rbac";
import { getAuditLogs } from "@/server/services/settings-service";

export async function GET(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasMinimumRole(context.membership?.role, "VIEWER")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "100");
  const interactive = searchParams.get("interactive") === "1";
  const selectedId = searchParams.get("selectedId");

  const logs = await getAuditLogs({
    organizationId: context.organization.id,
    limit: Number.isFinite(limit) ? limit : 100,
  });

  if (!interactive) {
    return NextResponse.json(logs);
  }

  const selected = logs.find((log) => log.id === selectedId) ?? logs[0] ?? null;
  return NextResponse.json({
    items: logs,
    selected,
  });
}

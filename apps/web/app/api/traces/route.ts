import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { listTraces } from "@/server/services/trace-service";

export async function GET(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const interactive = searchParams.get("interactive") === "1";
  const selectedId = searchParams.get("selectedId");
  const traces = await listTraces({
    organizationId: context.organization.id,
    query: searchParams.get("query"),
    verdict: searchParams.get("verdict"),
    provider: searchParams.get("provider"),
    environment: searchParams.get("environment"),
    severity: searchParams.get("severity"),
  });

  if (!interactive) {
    return NextResponse.json(traces);
  }

  const selected = traces.find((trace) => trace.id === selectedId) ?? traces[0] ?? null;
  return NextResponse.json({
    items: traces,
    selected,
  });
}

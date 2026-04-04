import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { getOverview } from "@/server/services/overview-service";

export async function GET(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const interactive = searchParams.get("interactive") === "1";
  const selectedTraceId = searchParams.get("selectedTraceId");
  const selectedIncidentId = searchParams.get("selectedIncidentId");
  const overview = await getOverview(context.organization.id);

  if (!interactive) {
    return NextResponse.json(overview);
  }

  return NextResponse.json({
    ...overview,
    selectedTrace:
      overview.recentTraces.find((trace) => trace.id === selectedTraceId) ??
      overview.recentTraces[0] ??
      null,
    selectedIncident:
      overview.recentIncidents.find((incident) => incident.id === selectedIncidentId) ??
      overview.recentIncidents[0] ??
      null,
  });
}

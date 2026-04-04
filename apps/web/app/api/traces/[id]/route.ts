import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { getTraceDetail } from "@/server/services/trace-service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const trace = await getTraceDetail(id, context.organization.id);
  if (!trace) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(trace);
}

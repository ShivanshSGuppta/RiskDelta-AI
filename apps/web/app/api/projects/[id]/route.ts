import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { getProjectDetail } from "@/server/services/project-service";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await getProjectDetail(id, context.organization.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

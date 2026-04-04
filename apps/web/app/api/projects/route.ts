import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { createProject, listProjects } from "@/server/services/project-service";

export async function GET(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const selectedId = searchParams.get("selectedId");
  const interactive = searchParams.get("interactive") === "1";
  const projects = await listProjects(context.organization.id);

  if (!interactive) {
    return NextResponse.json(projects);
  }

  const selected = projects.find((project) => project.id === selectedId) ?? projects[0] ?? null;
  return NextResponse.json({
    items: projects,
    selected,
  });
}

export async function POST(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const project = await createProject({
      organizationId: context.organization.id,
      ownerName: context.user.fullName,
      input: await request.json(),
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create project" }, { status: 400 });
  }
}

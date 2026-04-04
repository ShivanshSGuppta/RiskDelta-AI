import { ProjectCreateSchema, type ProjectSummary } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { prisma } from "@/server/db/prisma";

export async function listProjects(organizationId: string): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { organizationId },
    orderBy: [{ environment: "asc" }, { name: "asc" }],
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    slug: project.slug,
    environment: project.environment as ProjectSummary["environment"],
    owner: project.ownerName,
    framework: project.framework,
    provider: project.provider,
    lastActivity: project.lastActivity.toISOString(),
    riskStatus: project.riskStatus as ProjectSummary["riskStatus"],
    integrationStatus: project.integrationStatus,
    monitoringEnabled: project.monitoringEnabled,
  }));
}

export async function getProjectDetail(id: string, organizationId: string) {
  return prisma.project.findFirst({
    where: { id, organizationId },
    include: {
      integrations: true,
      traces: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
      incidents: {
        orderBy: { createdAt: "desc" },
        take: 6,
      },
      projectPolicies: {
        include: {
          policy: true,
        },
      },
      projectRuntimeControls: {
        include: {
          runtimeControl: true,
        },
      },
    },
  });
}

export async function createProject({
  organizationId,
  ownerName,
  input,
}: {
  organizationId: string;
  ownerName: string;
  input: unknown;
}) {
  const data = ProjectCreateSchema.parse(input);
  return prisma.project.create({
    data: {
      organizationId,
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      environment: data.environment,
      framework: data.framework,
      provider: data.provider,
      ownerName,
      riskStatus: "LOW",
      integrationStatus: "Pending",
      monitoringEnabled: true,
      lastActivity: new Date(),
    },
  });
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app-shell/page-header";
import { ConsoleChip, ConsoleKicker, ConsoleMetric, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";
import { InteractiveRail } from "@/components/ui/interactive-rail";
import { formatRelativeTime } from "@/lib/utils";
import { requirePlatformAccess } from "@/server/auth/session";
import { listProjects } from "@/server/services/project-service";

export default async function ApplicationsPage() {
  const context = await requirePlatformAccess();
  const projects = await listProjects(context.organization.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Applications"
        title="Applications, environments, and runtime coverage"
        description="Track onboarding state, provider choice, policy coverage, and the projects concentrating the most runtime pressure."
        actions={<Button size="sm" className="rounded-none">Create application</Button>}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
        <ConsoleSurface className="p-6">
          <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-4">
              <ConsoleMetric label="Projects" value={projects.length} />
              <ConsoleMetric label="Monitoring enabled" value={projects.filter((project) => project.monitoringEnabled).length} tone="accent" />
              <ConsoleMetric label="Connected integrations" value={projects.filter((project) => project.integrationStatus === "Connected").length} />
            </div>
            <div className="border border-[#1b1f1b] bg-[#050505] p-4">
              <ConsoleKicker>Highest-pressure applications</ConsoleKicker>
              <div className="mt-4 space-y-3">
                {projects.slice(0, 3).map((project, index) => (
                  <ConsoleRow key={project.id} tone={index === 0 ? "accent" : "subtle"}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <Link href={`/app/applications/${project.id}`} className="text-sm font-medium text-[#f5f7f4]">
                          {project.name}
                        </Link>
                        <p className="mt-1 text-sm text-[#a0a8a0]">
                          {project.environment} · {project.provider}
                        </p>
                      </div>
                      <ConsoleChip tone={project.riskStatus === "CRITICAL" ? "critical" : project.riskStatus === "HIGH" ? "warning" : "accent"}>
                        {project.riskStatus}
                      </ConsoleChip>
                    </div>
                  </ConsoleRow>
                ))}
              </div>
            </div>
          </div>
        </ConsoleSurface>

        <InteractiveRail
          title="Coverage rail"
          detailTitle="Application detail"
          fetchPathTemplate="/api/projects?interactive=1&selectedId={id}"
          items={projects.slice(0, 4).map((project) => ({
            id: project.id,
            title: project.name,
            subtitle: `${project.framework} · ${project.provider} · ${formatRelativeTime(project.lastActivity)}`,
            detail: `${project.riskStatus} posture · integration ${project.integrationStatus}`,
          }))}
        />
      </div>

      <ConsoleSurface className="p-6">
        <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
          <div>
            <ConsoleKicker>Application inventory</ConsoleKicker>
            <p className="mt-2 text-xl font-semibold text-[#f5f7f4]">Projects, posture, and attached runtime coverage</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {projects.map((project, index) => (
            <ConsoleRow key={project.id} tone={index === 0 ? "accent" : "subtle"}>
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:items-center">
                <div>
                  <Link href={`/app/applications/${project.id}`} className="text-sm font-medium text-[#f5f7f4]">
                    {project.name}
                  </Link>
                  <p className="mt-1 text-sm text-[#a0a8a0]">
                    {project.environment} · {project.framework}
                  </p>
                </div>
                <div className="text-sm text-[#f5f7f4]">{project.provider}</div>
                <div className="flex items-center gap-2">
                  <ConsoleChip tone={project.riskStatus === "CRITICAL" ? "critical" : project.riskStatus === "HIGH" ? "warning" : "accent"}>
                    {project.riskStatus}
                  </ConsoleChip>
                  <ConsoleChip tone={project.integrationStatus === "Connected" ? "accent" : "warning"}>
                    {project.integrationStatus === "Connected" ? "CONNECTED" : "PENDING"}
                  </ConsoleChip>
                </div>
                <div className="text-sm text-[#a0a8a0]">{formatRelativeTime(project.lastActivity)}</div>
              </div>
            </ConsoleRow>
          ))}
        </div>
      </ConsoleSurface>
    </div>
  );
}

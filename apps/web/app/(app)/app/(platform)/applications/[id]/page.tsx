import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { PageHeader } from "@/components/app-shell/page-header";
import { ConsoleKicker, ConsoleMetric, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";
import { DefinitionList, PanelList, SignalListItem } from "@/components/ui/operator-kit";
import { formatDateTime, formatPercent, formatRelativeTime } from "@/lib/utils";
import { requirePlatformAccess } from "@/server/auth/session";
import { getProjectDetail } from "@/server/services/project-service";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = await requirePlatformAccess();
  const project = await getProjectDetail(id, context.organization.id);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Application detail"
        title={project.name}
        description={project.description}
        actions={
          <Button asChild variant="secondary" size="sm" className="rounded-none border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
            <Link href="/app/tracevault">Open TraceVault</Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.04fr)_320px]">
        <ConsoleSurface className="p-6">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="space-y-3">
                <ConsoleKicker>Application posture</ConsoleKicker>
                <h2 className="max-w-[14ch] text-[2rem] font-semibold tracking-[-0.05em] text-white">
                  Project coverage should connect telemetry, policies, controls, and incidents in one workspace.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-[#a0a8a0]">
                  This detail surface keeps the live runtime posture of the application visible without falling back to generic settings tabs.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <ConsoleMetric label="Risk posture" value={<StatusPill value={project.riskStatus} />} tone={project.riskStatus === "CRITICAL" ? "critical" : project.riskStatus === "HIGH" ? "warning" : "accent"} />
                <ConsoleMetric label="Monitoring" value={project.monitoringEnabled ? "Enabled" : "Disabled"} tone={project.monitoringEnabled ? "accent" : "warning"} />
              </div>
            </div>

            <DefinitionList
              items={[
                { label: "Environment", value: project.environment },
                { label: "Framework", value: project.framework },
                { label: "Provider", value: project.provider },
                { label: "Owner", value: project.ownerName },
                { label: "Integration status", value: project.integrationStatus },
                { label: "Last activity", value: formatDateTime(project.lastActivity) },
              ]}
            />
          </div>
        </ConsoleSurface>

        <PanelList title="Attached runtime controls" description="Control modules currently shaping this application.">
          {project.projectRuntimeControls.map((entry) => (
            <SignalListItem key={entry.id} title={entry.runtimeControl.name} description={entry.runtimeControl.summary} />
          ))}
        </PanelList>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ConsoleSurface className="p-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
            <div>
              <ConsoleKicker>Recent trace queue</ConsoleKicker>
              <p className="mt-2 text-xl font-semibold text-white">Requests and live runtime outcomes</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {project.traces.map((trace, index) => (
              <ConsoleRow key={trace.id} tone={index === 0 ? "accent" : "subtle"}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link href={`/app/tracevault/${trace.id}`} className="text-sm font-medium text-white">
                      {trace.requestId}
                    </Link>
                    <p className="mt-1 text-sm text-[#a0a8a0]">{formatRelativeTime(trace.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill value={trace.verdict} />
                    <span className="font-mono text-[11px] text-[#a3ff12]">{formatPercent(trace.riskScore, 0)}</span>
                  </div>
                </div>
              </ConsoleRow>
            ))}
          </div>
        </ConsoleSurface>

        <div className="space-y-4">
          <PanelList title="Linked incidents" description="Runtime incidents currently tied to this application.">
            {project.incidents.map((incident) => (
              <SignalListItem
                key={incident.id}
                title={incident.title}
                meta={<StatusPill value={incident.severity} />}
                description={incident.summary}
                action={
                  <Link href={`/app/incidents/${incident.id}`} className="text-sm text-[#a3ff12]">
                    Open incident
                  </Link>
                }
              />
            ))}
          </PanelList>

          <PanelList title="Policies in scope" description="The rules currently attached to this application.">
            {project.projectPolicies.map((item) => (
              <SignalListItem
                key={item.id}
                title={item.policy.name}
                meta={<StatusPill value={item.policy.severity} />}
                description={item.policy.description}
              />
            ))}
          </PanelList>
        </div>
      </div>

      <ConsoleSurface className="p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <ConsoleKicker>Connected integrations</ConsoleKicker>
            <p className="mt-2 text-xl font-semibold text-white">Provider and connector surfaces attached to this application</p>
            <div className="mt-4 space-y-3">
              {project.integrations.map((integration) => (
                <ConsoleRow key={integration.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">{integration.name}</div>
                      <p className="mt-1 text-sm text-[#a0a8a0]">{integration.provider}</p>
                    </div>
                    <StatusPill value={integration.connectionState} />
                  </div>
                </ConsoleRow>
              ))}
            </div>
          </div>

          <PanelList title="Configuration rail" description="Static posture that should remain operator-visible.">
            <SignalListItem title="Monitoring enabled" description={project.monitoringEnabled ? "Yes" : "No"} />
            <SignalListItem title="Integration status" description={project.integrationStatus} />
            <SignalListItem title="Last activity" description={formatDateTime(project.lastActivity)} />
          </PanelList>
        </div>
      </ConsoleSurface>
    </div>
  );
}

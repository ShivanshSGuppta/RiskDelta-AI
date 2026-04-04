import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/ui/status-pill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/app-shell/page-header";
import { ConsoleKicker, ConsolePanel, ConsoleSurface } from "@/components/ui/console-kit";
import { DefinitionList, PanelList, SignalListItem, TimelineRail } from "@/components/ui/operator-kit";
import { formatDateTime, formatPercent } from "@/lib/utils";
import { requirePlatformAccess } from "@/server/auth/session";
import { getTraceDetail } from "@/server/services/trace-service";

export default async function TraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = await requirePlatformAccess();
  const trace = await getTraceDetail(id, context.organization.id);

  if (!trace) notFound();

  const timelineItems =
    trace.traceSessionRef?.events?.length
      ? trace.traceSessionRef.events.map((event) => {
          const payload = (event.payload ?? {}) as Record<string, unknown>;
          const detail =
            (typeof payload.summary === "string" && payload.summary) ||
            (typeof payload.reason === "string" && payload.reason) ||
            (typeof payload.requestId === "string" && `Request ${payload.requestId}`) ||
            (typeof payload.verdict === "string" && `Verdict ${payload.verdict}`) ||
            `${trace.project.name} runtime event`;

          return {
            label: formatDateTime(event.createdAt),
            title: event.eventType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (part) => part.toUpperCase()),
            detail,
          };
        })
      : [
          {
            label: formatDateTime(trace.createdAt),
            title: "Trace captured",
            detail: `${trace.project.name} sent ${trace.requestId} through ${trace.provider} / ${trace.model}.`,
          },
          {
            label: "Risk",
            title: `Scored ${formatPercent(trace.riskScore, 0)} with ${trace.severity} severity`,
            detail: trace.explainability,
          },
          {
            label: "Controls",
            title: trace.blocked ? "Runtime controls blocked the requested path" : "Runtime controls evaluated and returned a live verdict",
            detail: `${trace.toolCalls.length} tool call(s) and ${trace.policyRuns.length} policy run(s) contributed to the outcome.`,
          },
          trace.incident
            ? {
                label: "Incident",
                title: "Linked incident created",
                detail: trace.incident.title,
              }
            : null,
        ].filter(Boolean) as Array<{ label: string; title: string; detail: string }>;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Trace detail" title={trace.requestId} description={trace.explainability} />

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <PanelList title="Chronology" description="Follow the session from capture to runtime decision.">
          <TimelineRail items={timelineItems} />
        </PanelList>

        <div className="space-y-4">
          <ConsoleSurface className="p-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#1b1f1b] pb-4">
              <StatusPill value={trace.verdict} />
              <StatusPill value={trace.severity} />
              <span className="border border-[#1b1f1b] bg-[#0a0b0a] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#a0a8a0]">
                {formatPercent(trace.riskScore, 0)} weighted risk
              </span>
              <span className="border border-[#1b1f1b] bg-[#0a0b0a] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">
                {trace.environment}
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <ConsolePanel tone="subtle">
                <ConsoleKicker>Prompt</ConsoleKicker>
                <p className="mt-3 text-sm leading-7 text-[#f5f7f4]">{trace.prompt}</p>
                <div className="mt-4 border-t border-[#1b1f1b] pt-4">
                  <ConsoleKicker>Context</ConsoleKicker>
                  <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">{trace.context}</p>
                </div>
              </ConsolePanel>

              <ConsolePanel tone="elevated">
                <ConsoleKicker>Model output</ConsoleKicker>
                <p className="mt-3 text-sm leading-7 text-[#f5f7f4]">{trace.response}</p>
                <div className="mt-4 border-t border-[#1b1f1b] pt-4">
                  <ConsoleKicker>Outbound intent</ConsoleKicker>
                  <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">
                    {trace.desiredTargets.length > 0 ? trace.desiredTargets.join(", ") : "No explicit outbound targets requested."}
                  </p>
                </div>
              </ConsolePanel>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.94fr_1.06fr]">
              <ConsolePanel tone="subtle">
                <ConsoleKicker>Session metadata</ConsoleKicker>
                <DefinitionList
                  className="mt-3 sm:grid-cols-2"
                  items={[
                    { label: "Application", value: trace.project.name },
                    { label: "Environment", value: trace.environment },
                    { label: "Provider", value: trace.provider },
                    { label: "Model", value: trace.model },
                    { label: "Actor", value: trace.actor },
                    { label: "Country", value: trace.country },
                    {
                      label: "Session ID",
                      value: <span className="font-mono text-xs text-[#d5ecff]">{trace.sessionId}</span>,
                    },
                    {
                      label: "Tool summary",
                      value: <span className="font-mono text-xs text-[#d5ecff]">{trace.toolSummary}</span>,
                    },
                  ]}
                />
              </ConsolePanel>

              <div className="border border-[#1b1f1b] bg-[#050505]">
                <div className="border-b border-[#1b1f1b] px-4 py-3">
                  <ConsoleKicker>Tool calls</ConsoleKicker>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trace.toolCalls.map((toolCall) => (
                      <TableRow key={toolCall.id}>
                        <TableCell>{toolCall.name}</TableCell>
                        <TableCell className="font-mono text-xs text-[#d5ecff]">{toolCall.target}</TableCell>
                        <TableCell>
                          <StatusPill
                            value={
                              toolCall.status === "BLOCKED"
                                ? "BLOCK"
                                : toolCall.status === "SANITIZED"
                                  ? "TRANSFORM"
                                  : "ALLOW"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ConsoleSurface>

          <PanelList title="Policy matches" description="Rules that contributed to the verdict and what action they requested.">
            {trace.policyRuns.map((run) => (
              <ConsolePanel key={run.id} tone={run.outcome === "MATCHED" ? "warning" : "subtle"}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{run.policyVersion.policy.name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">{run.outcome}</p>
                  </div>
                  <StatusPill value={run.policyVersion.policy.severity} />
                </div>
                <div className="mt-4 space-y-3">
                  {run.matches.map((match) => (
                    <SignalListItem
                      key={match.id}
                      title={match.title}
                      description={match.condition}
                      meta={<span className="font-mono text-[11px] text-[#a3ff12]">{match.action}</span>}
                    />
                  ))}
                </div>
              </ConsolePanel>
            ))}
          </PanelList>
        </div>

        <div className="space-y-4">
          <ConsolePanel tone="critical">
            <ConsoleKicker>Verdict rail</ConsoleKicker>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill value={trace.verdict} />
              <StatusPill value={trace.severity} />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              {formatPercent(trace.riskScore, 0)} weighted risk
            </p>
            <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">{trace.explainability}</p>
          </ConsolePanel>

          <PanelList title="Risk dimensions" description="Primary factors contributing to the final verdict.">
            {(trace.riskEvents ?? []).map((event) => (
              <SignalListItem
                key={event.id}
                title={event.title}
                meta={<span className="font-mono text-[11px] text-[#a3ff12]">{formatPercent(event.score, 0)}</span>}
                description={event.explanation}
              />
            ))}
          </PanelList>

          {trace.incident ? (
            <ConsoleSurface className="p-4">
              <ConsoleKicker>Linked incident</ConsoleKicker>
              <Link href={`/app/incidents/${trace.incident.id}`} className="mt-2 block text-sm font-medium text-white">
                {trace.incident.title}
              </Link>
              <p className="mt-2 text-sm text-[#a0a8a0]">Opened {formatDateTime(trace.incident.createdAt)}</p>
            </ConsoleSurface>
          ) : null}
        </div>
      </div>
    </div>
  );
}

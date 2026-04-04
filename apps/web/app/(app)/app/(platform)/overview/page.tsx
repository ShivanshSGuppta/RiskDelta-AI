import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app-shell/page-header";
import { ConsoleChip, ConsoleKicker, ConsoleMetric, ConsolePanel, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";
import { InteractiveRail } from "@/components/ui/interactive-rail";
import { formatCompactNumber, formatPercent, formatRelativeTime } from "@/lib/utils";
import { requirePlatformAccess } from "@/server/auth/session";
import { getOverview } from "@/server/services/overview-service";

export default async function OverviewPage() {
  const context = await requirePlatformAccess();
  const overview = await getOverview(context.organization.id);
  const maxTraffic = Math.max(...overview.requestsOverTime.map((item) => item.requests), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Runtime posture across the operator workspace"
        description="A control-room view of live traffic, intervention pressure, recent trace decisions, and incidents that need a human now."
        actions={
          <>
            <Button asChild variant="secondary" size="sm" className="rounded-none border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
              <Link href="/app/tracevault">Open TraceVault</Link>
            </Button>
            <Button asChild size="sm" className="rounded-none">
              <Link href="/app/quickstart">Run quickstart</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ConsoleSurface className="p-6">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-5">
              <div className="space-y-3">
                <ConsoleKicker>Runtime posture</ConsoleKicker>
                <h2 className="max-w-[12ch] font-sans text-[2.3rem] font-semibold tracking-[-0.05em] text-[#f5f7f4] md:text-[3rem]">
                  Monitoring, scoring, and intervention are active across the current organization.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-[#a0a8a0] md:text-[15px]">
                  Requests are landing, risk is being scored, policies are matching, and controls are shaping unsafe
                  sessions before they turn into downstream operator surprises.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <ConsoleMetric label="Requests monitored" value={formatCompactNumber(overview.totals.requestsMonitored)} />
                <ConsoleMetric label="Risk events" value={formatCompactNumber(overview.totals.riskEventsDetected)} />
                <ConsoleMetric
                  label="Blocked actions"
                  value={formatCompactNumber(overview.totals.blockedActions)}
                  tone="critical"
                />
                <ConsoleMetric label="Policy violations" value={formatCompactNumber(overview.totals.policyViolations)} />
              </div>

              <ConsolePanel tone="subtle">
                <ConsoleKicker>Intervention chain</ConsoleKicker>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  {["Trace captured", "Risk scored", "Policy matched", "Control intervened"].map((step, index) => (
                    <ConsoleRow key={step}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="mt-2 text-sm text-[#f5f7f4]">{step}</div>
                    </ConsoleRow>
                  ))}
                </div>
              </ConsolePanel>
            </div>

            <div className="border border-[#1b1f1b] bg-[#050505] p-5">
              <div className="flex items-center justify-between gap-3 border-b border-[#1b1f1b] pb-3">
                <div>
                  <ConsoleKicker>Live traffic</ConsoleKicker>
                  <p className="mt-2 text-lg font-medium text-[#f5f7f4]">Requests and blocked paths</p>
                </div>
                <ConsoleChip tone="accent">{overview.totals.activeIntegrations} integrations live</ConsoleChip>
              </div>
              <div className="relative mt-5 h-64 border border-[#1b1f1b] bg-[#0a0a0a] px-2 pb-2 pt-6">
                <div className="absolute left-4 top-4 font-mono text-xs text-[#a0a8a0]">Live Traffic (Req/s)</div>
                <div className="flex h-full items-end gap-1">
                  {overview.requestsOverTime.map((entry) => (
                    <div key={entry.date} className="flex flex-1 flex-col items-center justify-end gap-1">
                      <div
                        className={`w-full ${entry.blocked ? "bg-[#ff5d5d]" : "bg-[#1b1f1b]"} transition-colors hover:bg-[rgba(163,255,18,0.5)]`}
                        style={{ height: `${Math.max((entry.requests / maxTraffic) * 100, 8)}%` }}
                      />
                      <span className="font-mono text-[9px] text-[#6f776f]">{entry.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <ConsoleKicker>Live event stream</ConsoleKicker>
                <div className="mt-3 space-y-2">
                  {overview.recentTraces.slice(0, 4).map((trace) => (
                    <ConsoleRow key={trace.id} className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-[#6f776f]">{formatRelativeTime(trace.time)}</span>
                      <span className="font-mono text-[11px] text-[#a0a8a0]">{trace.app}</span>
                      <span className="font-mono text-[11px] text-[#f5f7f4]">{trace.id.slice(0, 10)}</span>
                      <span className={trace.verdict === "BLOCK" ? "font-mono text-[11px] text-[#ff5d5d]" : "font-mono text-[11px] text-[#a3ff12]"}>
                        {trace.verdict}
                      </span>
                    </ConsoleRow>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ConsoleSurface>

        <div className="space-y-4">
          <ConsolePanel tone="critical">
            <ConsoleKicker>Attention now</ConsoleKicker>
            <div className="mt-4 space-y-3">
              {overview.recentIncidents.slice(0, 3).map((incident, index) => (
                <ConsoleRow key={incident.id} tone={index === 0 ? "critical" : "subtle"}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/app/incidents/${incident.id}`} className="text-sm font-medium text-[#f5f7f4]">
                        {incident.title}
                      </Link>
                      <p className="mt-1 text-sm text-[#a0a8a0]">
                        {incident.status} · {formatRelativeTime(incident.time)}
                      </p>
                    </div>
                    <ConsoleChip tone={incident.severity === "CRITICAL" ? "critical" : "warning"}>{incident.severity}</ConsoleChip>
                  </div>
                </ConsoleRow>
              ))}
            </div>
          </ConsolePanel>

          <InteractiveRail
            title="Risk posture"
            detailTitle="Selected app pressure"
            items={overview.topRiskyApps.slice(0, 4).map((app) => ({
              id: app.name,
              title: app.name,
              subtitle: `${app.incidents} linked incident(s)`,
              detail: `${formatPercent(app.score, 0)} weighted runtime pressure for ${app.name}.`,
            }))}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_0.92fr]">
        <ConsoleSurface className="p-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
            <div>
              <ConsoleKicker>Recent trace activity</ConsoleKicker>
              <p className="mt-2 text-xl font-semibold text-[#f5f7f4]">What the system has evaluated most recently</p>
            </div>
            <Button asChild variant="secondary" size="sm" className="rounded-none border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
              <Link href="/app/tracevault">Open queue</Link>
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {overview.recentTraces.map((trace, index) => (
              <ConsoleRow key={trace.id} tone={index === 0 ? "accent" : "subtle"}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link href={`/app/tracevault/${trace.id}`} className="text-sm font-medium text-[#f5f7f4]">
                      {trace.app}
                    </Link>
                    <p className="mt-1 font-mono text-[11px] text-[#6f776f]">{trace.id.slice(0, 12)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ConsoleChip tone={trace.verdict === "BLOCK" ? "critical" : trace.verdict === "REVIEW" ? "warning" : "accent"}>
                      {trace.verdict}
                    </ConsoleChip>
                    <span className="font-mono text-[11px] text-[#a3ff12]">{formatPercent(trace.score, 0)}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#a0a8a0]">{formatRelativeTime(trace.time)}</p>
              </ConsoleRow>
            ))}
          </div>
        </ConsoleSurface>

        <ConsoleSurface className="p-6">
          <ConsoleKicker>Top policy pressure</ConsoleKicker>
          <p className="mt-2 text-xl font-semibold text-[#f5f7f4]">Rules matching most often in the current window</p>
          <div className="mt-4 space-y-3">
            {overview.policyMatches.map((policy) => (
              <ConsoleRow key={policy.name}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-[#f5f7f4]">{policy.name}</div>
                  <span className="font-mono text-xs text-[#a3ff12]">{policy.hits}</span>
                </div>
                <p className="mt-2 text-sm text-[#a0a8a0]">{policy.hits} policy run match(es)</p>
              </ConsoleRow>
            ))}
          </div>
        </ConsoleSurface>
      </div>
    </div>
  );
}

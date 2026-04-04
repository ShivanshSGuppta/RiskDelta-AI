import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app-shell/page-header";
import { ConsoleChip, ConsoleEmpty, ConsoleKicker, ConsolePanel, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";
import { InteractiveRail } from "@/components/ui/interactive-rail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateTime, formatPercent } from "@/lib/utils";
import { requirePlatformAccess } from "@/server/auth/session";
import { listTraces } from "@/server/services/trace-service";

function QueueList({ traces }: { traces: Awaited<ReturnType<typeof listTraces>> }) {
  return (
    <div className="space-y-2">
      {traces.map((trace, index) => (
        <Link
          key={trace.id}
          href={`/app/tracevault/${trace.id}`}
          className={`block border p-3 transition ${
            index === 0
              ? "border-[rgba(255,93,93,0.32)] bg-[rgba(255,93,93,0.08)]"
              : "border-[#1b1f1b] bg-[#0a0b0a] hover:bg-[#111411]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-[#f5f7f4]">{trace.requestId}</p>
              <p className="mt-1 text-sm text-[#a0a8a0]">
                {trace.project.name} · {trace.provider}
              </p>
            </div>
            <ConsoleChip
              tone={
                trace.verdict === "BLOCK" ? "critical" : trace.verdict === "REVIEW" ? "warning" : trace.verdict === "TRANSFORM" ? "warning" : "accent"
              }
            >
              {trace.verdict}
            </ConsoleChip>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">
            <span>{formatPercent(trace.riskScore, 0)} risk</span>
            <span>{trace.environment}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function TraceVaultPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    verdict?: string;
    provider?: string;
    environment?: string;
    severity?: string;
  }>;
}) {
  const params = await searchParams;
  const context = await requirePlatformAccess();
  const traces = await listTraces({
    organizationId: context.organization.id,
    query: params.query ?? null,
    verdict: params.verdict ?? null,
    provider: params.provider ?? null,
    environment: params.environment ?? null,
    severity: params.severity ?? null,
  });

  const featured = traces[0];

  if (!featured) {
    return <ConsoleEmpty title="No traces found" description="Adjust the filters or send a new runtime request into the workspace." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TraceVault"
        title="Inspect session evidence, chronology, and intervention state"
        description="Move from the queue into the trace itself, then into verdict, policy, and incident context without leaving the same workspace."
        actions={
          <Button asChild variant="secondary" size="sm" className="rounded-none border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
            <Link href={`/app/tracevault/${featured.id}`}>Open full trace</Link>
          </Button>
        }
      >
        <form className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto]">
          <Input name="query" placeholder="Search trace, prompt, or actor" defaultValue={params.query} className="rounded-none border-[#1b1f1b] bg-[#050505]" />
          <Input name="verdict" placeholder="Verdict" defaultValue={params.verdict} className="rounded-none border-[#1b1f1b] bg-[#050505]" />
          <Input name="provider" placeholder="Provider" defaultValue={params.provider} className="rounded-none border-[#1b1f1b] bg-[#050505]" />
          <Input name="environment" placeholder="Environment" defaultValue={params.environment} className="rounded-none border-[#1b1f1b] bg-[#050505]" />
          <Button type="submit" size="sm" className="rounded-none">
            Apply
          </Button>
        </form>
      </PageHeader>

      <div className="hidden gap-4 xl:grid xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        <ConsoleSurface className="p-4">
          <ConsoleKicker>Session queue</ConsoleKicker>
          <p className="mt-2 text-sm text-[#a0a8a0]">{traces.length} sessions currently in view.</p>
          <div className="mt-4">
            <QueueList traces={traces} />
          </div>
        </ConsoleSurface>

        <ConsoleSurface className="p-5">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
            <div>
              <ConsoleKicker>Selected session</ConsoleKicker>
              <h2 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#f5f7f4]">{featured.requestId}</h2>
            </div>
            <span className="font-mono text-xs text-[#a3ff12]">
              {featured.provider} · {featured.project.name}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <ConsolePanel tone="subtle">
              <ConsoleKicker>Prompt</ConsoleKicker>
              <p className="mt-3 text-sm leading-7 text-[#f5f7f4]">{featured.promptPreview}</p>
            </ConsolePanel>

            <div className="grid gap-4 lg:grid-cols-2">
              <ConsolePanel tone="subtle">
                <ConsoleKicker>Response</ConsoleKicker>
                <p className="mt-3 text-sm leading-7 text-[#a0a8a0]">{featured.responsePreview}</p>
              </ConsolePanel>
              <ConsolePanel tone="subtle">
                <ConsoleKicker>Tool summary</ConsoleKicker>
                <p className="mt-3 font-mono text-xs leading-7 text-[#a0a8a0]">{featured.toolSummary}</p>
              </ConsolePanel>
            </div>

            <ConsolePanel tone="critical">
              <ConsoleKicker>Chronology</ConsoleKicker>
              <div className="mt-4 space-y-3">
                {[
                  "Trace captured with session and actor metadata",
                  "Risk scored from prompt, tool, output, and policy density",
                  "Policy engine returned a live verdict",
                  "Controls issued runtime response and linked incident context",
                ].map((item) => (
                  <ConsoleRow key={item}>{item}</ConsoleRow>
                ))}
              </div>
            </ConsolePanel>
          </div>
        </ConsoleSurface>

        <div className="space-y-4">
          <ConsolePanel tone="critical">
            <ConsoleKicker>Verdict</ConsoleKicker>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ConsoleChip tone={featured.verdict === "BLOCK" ? "critical" : featured.verdict === "REVIEW" ? "warning" : "accent"}>
                {featured.verdict}
              </ConsoleChip>
              <ConsoleChip tone={featured.severity === "CRITICAL" ? "critical" : featured.severity === "HIGH" ? "warning" : "accent"}>
                {featured.severity}
              </ConsoleChip>
            </div>
            <p className="mt-4 font-serif text-4xl tracking-[-0.05em] text-[#ff5d5d]">
              {formatPercent(featured.riskScore, 0)} <span className="ml-1 font-sans text-sm tracking-normal text-[rgba(255,93,93,0.72)]">RUNTIME RISK</span>
            </p>
            <p className="mt-3 text-sm leading-7 text-[#a0a8a0]">{featured.explainability}</p>
          </ConsolePanel>

          <InteractiveRail
            title="Inspection rail"
            detailTitle="Session metadata"
            items={[
              {
                id: "captured",
                title: `Captured ${formatDateTime(featured.createdAt)}`,
                detail: "Session capture timestamp and audit anchor for chronology alignment.",
              },
              {
                id: "provider",
                title: `${featured.provider} / ${featured.environment}`,
                detail: "Provider and environment context used during model dispatch.",
              },
              {
                id: "open-trace",
                title: "Open the full trace for raw tool calls and linked policy runs",
                detail: "Use trace detail view for raw event chronology and policy run payloads.",
              },
              ...(featured.incident
                ? [
                    {
                      id: "incident",
                      title: `Linked incident: ${featured.incident.title}`,
                      detail: `Incident id ${featured.incident.id} is attached to this runtime session.`,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>

      <div className="xl:hidden">
        <Tabs defaultValue="queue">
          <TabsList className="w-full rounded-none border-[#1b1f1b] bg-[#0a0a0a]">
            <TabsTrigger value="queue" className="rounded-none data-[state=active]:bg-[#111411] data-[state=active]:text-[#f5f7f4]">Queue</TabsTrigger>
            <TabsTrigger value="session" className="rounded-none data-[state=active]:bg-[#111411] data-[state=active]:text-[#f5f7f4]">Session</TabsTrigger>
            <TabsTrigger value="verdict" className="rounded-none data-[state=active]:bg-[#111411] data-[state=active]:text-[#f5f7f4]">Verdict</TabsTrigger>
          </TabsList>
          <TabsContent value="queue">
            <ConsoleSurface className="p-4">
              <QueueList traces={traces} />
            </ConsoleSurface>
          </TabsContent>
          <TabsContent value="session">
            <ConsoleSurface className="p-5">
              <ConsoleKicker>Selected session</ConsoleKicker>
              <h2 className="mt-2 text-[1.6rem] font-semibold tracking-[-0.05em] text-[#f5f7f4]">{featured.requestId}</h2>
              <div className="mt-4 space-y-3">
                <ConsolePanel tone="subtle">
                  <ConsoleKicker>Prompt</ConsoleKicker>
                  <p className="mt-2 text-sm leading-7 text-[#f5f7f4]">{featured.promptPreview}</p>
                </ConsolePanel>
                <ConsolePanel tone="subtle">
                  <ConsoleKicker>Response</ConsoleKicker>
                  <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">{featured.responsePreview}</p>
                </ConsolePanel>
              </div>
            </ConsoleSurface>
          </TabsContent>
          <TabsContent value="verdict">
            <div className="space-y-4">
              <ConsolePanel tone="critical">
                <ConsoleKicker>Verdict</ConsoleKicker>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ConsoleChip tone={featured.verdict === "BLOCK" ? "critical" : featured.verdict === "REVIEW" ? "warning" : "accent"}>
                    {featured.verdict}
                  </ConsoleChip>
                  <ConsoleChip tone={featured.severity === "CRITICAL" ? "critical" : featured.severity === "HIGH" ? "warning" : "accent"}>
                    {featured.severity}
                  </ConsoleChip>
                </div>
                <p className="mt-3 text-xl font-semibold text-[#f5f7f4]">{formatPercent(featured.riskScore, 0)} runtime risk</p>
              </ConsolePanel>
              <ConsoleSurface className="p-4">
                <ConsoleKicker>Explainability</ConsoleKicker>
                <p className="mt-3 text-sm leading-7 text-[#a0a8a0]">{featured.explainability}</p>
              </ConsoleSurface>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

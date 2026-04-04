import type { DashboardOverviewResponse } from "@/lib/types";
import { prisma } from "@/server/db/prisma";

export async function getOverview(organizationId: string): Promise<DashboardOverviewResponse> {
  const [traces, incidents, integrations, projects] = await Promise.all([
    prisma.trace.findMany({
      where: { organizationId },
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.incident.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.integration.findMany({ where: { organizationId } }),
    prisma.project.findMany({ where: { organizationId } }),
  ]);

  const totals = {
    requestsMonitored: traces.length,
    riskEventsDetected: traces.reduce((sum, trace) => sum + ((trace.dimensionScores as Array<unknown>)?.length ?? 0), 0),
    blockedActions: traces.filter((trace) => trace.blocked).length,
    policyViolations: traces.filter((trace) => trace.verdict !== "ALLOW").length,
    activeIntegrations: integrations.filter((integration) => integration.connectionState === "CONNECTED").length,
    openIncidents: incidents.filter((incident) => incident.status !== "RESOLVED").length,
  };

  const requestsOverTime = traces
    .slice(0, 12)
    .reverse()
    .map((trace, index) => ({
      date: `T${index + 1}`,
      requests: 240 + index * 18,
      blocked: trace.blocked ? 1 : 0,
      alerts: trace.verdict === "REVIEW" ? 1 : 0,
    }));

  const riskDistribution = [
    { band: "0.00-0.24", count: 0 },
    { band: "0.25-0.49", count: 0 },
    { band: "0.50-0.74", count: 0 },
    { band: "0.75-1.00", count: 0 },
  ];

  traces.forEach((trace) => {
    if (trace.riskScore < 0.25) riskDistribution[0].count += 1;
    else if (trace.riskScore < 0.5) riskDistribution[1].count += 1;
    else if (trace.riskScore < 0.75) riskDistribution[2].count += 1;
    else riskDistribution[3].count += 1;
  });

  const enforcementOutcomes = [
    { name: "Allowed", value: traces.filter((trace) => trace.verdict === "ALLOW").length },
    { name: "Transformed", value: traces.filter((trace) => trace.verdict === "TRANSFORM").length },
    { name: "Blocked", value: traces.filter((trace) => trace.verdict === "BLOCK").length },
    { name: "Review", value: traces.filter((trace) => trace.verdict === "REVIEW").length },
  ];

  const policyCounter = new Map<string, number>();
  for (const trace of await prisma.trace.findMany({
    where: { organizationId },
    include: { policyRuns: { include: { matches: true } } },
  })) {
    for (const run of trace.policyRuns) {
      for (const match of run.matches) {
        policyCounter.set(match.title, (policyCounter.get(match.title) ?? 0) + 1);
      }
    }
  }

  const providerCounter = new Map<string, number>();
  traces.forEach((trace) => providerCounter.set(trace.provider, (providerCounter.get(trace.provider) ?? 0) + 1));

  const projectScores = projects.map((project) => {
    const projectTraces = traces.filter((trace) => trace.projectId === project.id);
    const averageRisk =
      projectTraces.reduce((sum, trace) => sum + trace.riskScore, 0) / Math.max(projectTraces.length, 1);
    return {
      name: project.name,
      score: Number(averageRisk.toFixed(2)),
      incidents: incidents.filter((incident) => incident.projectId === project.id).length,
    };
  });

  return {
    totals,
    requestsOverTime,
    riskDistribution,
    enforcementOutcomes,
    policyMatches: [...policyCounter.entries()]
      .map(([name, hits]) => ({ name, hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 6),
    providerSplit: [...providerCounter.entries()].map(([provider, traffic]) => ({ provider, traffic })),
    topRiskyApps: projectScores.sort((a, b) => b.score - a.score).slice(0, 5),
    recentTraces: traces.slice(0, 8).map((trace) => ({
      id: trace.id,
      app: trace.project.name,
      verdict: trace.verdict,
      score: trace.riskScore,
      time: trace.createdAt.toISOString(),
    })),
    recentIncidents: incidents.slice(0, 8).map((incident) => ({
      id: incident.id,
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
      time: incident.createdAt.toISOString(),
    })),
  };
}

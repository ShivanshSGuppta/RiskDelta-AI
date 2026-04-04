import {
  Activity,
  AppWindow,
  BadgeAlert,
  BookOpen,
  ChartColumnBig,
  Cpu,
  LayoutDashboard,
  Link2,
  type LucideIcon,
  PlayCircle,
  Radar,
  Settings,
  Shield,
} from "lucide-react";

export type AppNavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  commercial?: boolean;
};

export const appNavigation: readonly AppNavigationItem[] = [
  { title: "Overview", href: "/app/overview", icon: LayoutDashboard },
  { title: "Applications", href: "/app/applications", icon: AppWindow },
  { title: "Policies", href: "/app/policies", icon: Shield, commercial: true },
  { title: "Runtime Controls", href: "/app/runtime-controls", icon: Cpu, commercial: true },
  { title: "Risk", href: "/app/risk", icon: Radar, commercial: true },
  { title: "TraceVault", href: "/app/tracevault", icon: Activity },
  { title: "Incidents", href: "/app/incidents", icon: BadgeAlert, commercial: true },
  { title: "Integrations", href: "/app/integrations", icon: Link2, commercial: true },
  { title: "Quickstart", href: "/app/quickstart", icon: PlayCircle },
  { title: "Docs", href: "/app/docs", icon: BookOpen },
  { title: "Settings", href: "/app/settings", icon: Settings },
] as const;

export const landingStats = [
  { label: "Runtime decisions", value: "14.8M" },
  { label: "Guardrails triggered", value: "92K" },
  { label: "Mean enforcement latency", value: "41ms" },
  { label: "Active integrations", value: "37" },
] as const;

export const runtimeControlNames = [
  "PromptShield",
  "DataGuard",
  "ModelSwitch",
  "AgentFence",
  "SentinelX",
] as const;

export const overviewHighlightCards = [
  {
    title: "Observe",
    copy: "Capture prompts, actions, model traffic, and tool decisions with audit-grade trace context.",
  },
  {
    title: "Score",
    copy: "Compute explainable risk across prompt attacks, data exposure, tool abuse, and autonomy.",
  },
  {
    title: "Enforce",
    copy: "Turn detections into runtime controls: redact, block, route, quarantine, or require approval.",
  },
  {
    title: "Audit",
    copy: "Inspect incidents and trace evidence without piecing together multiple AI ops tools.",
  },
] as const;

export const architectureLayers = [
  "AI apps, copilots, and autonomous agents",
  "RiskDelta SDK / REST API / PlugNPlay",
  "Policy Engine, Risk Scoring, Runtime Enforcement",
  "TraceVault, incidents, dashboards, and audit history",
] as const;

export const dashboardSectionIcons = {
  requests: ChartColumnBig,
  risk: Radar,
  controls: Cpu,
};

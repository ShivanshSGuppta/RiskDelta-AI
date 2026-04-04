import { z } from "zod";

export const severityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const verdictValues = ["ALLOW", "TRANSFORM", "BLOCK", "REVIEW"] as const;
export const traceChannelValues = ["chat", "api", "agent"] as const;
export const environmentValues = ["production", "staging", "development"] as const;
export const integrationTypeValues = ["sdk", "api", "plugnplay"] as const;
export const policyModeValues = ["SIMULATE", "ENFORCE"] as const;
export const incidentStatusValues = ["OPEN", "INVESTIGATING", "RESOLVED"] as const;
export const appFrameworkValues = ["Next.js", "LangChain", "LlamaIndex", "Custom Agent", "Vercel AI SDK"] as const;
export const providerValues = ["OpenAI", "Anthropic", "Gemini", "Azure OpenAI", "Custom"] as const;
export const policyActionValues = [
  "ALLOW",
  "LOG",
  "ALERT",
  "REDACT",
  "BLOCK",
  "REQUIRE_APPROVAL",
  "FALLBACK_MODEL",
  "QUARANTINE_TRACE",
] as const;

export const SeveritySchema = z.enum(severityValues);
export const VerdictSchema = z.enum(verdictValues);
export const TraceChannelSchema = z.enum(traceChannelValues);
export const EnvironmentSchema = z.enum(environmentValues);
export const IntegrationTypeSchema = z.enum(integrationTypeValues);
export const PolicyModeSchema = z.enum(policyModeValues);
export const IncidentStatusSchema = z.enum(incidentStatusValues);
export const ProviderSchema = z.enum(providerValues);
export const FrameworkSchema = z.enum(appFrameworkValues);
export const PolicyActionSchema = z.enum(policyActionValues);

export const PolicyConditionSchema = z.object({
  signal: z.string().optional(),
  minWeight: z.number().min(0).max(1).optional(),
  riskAtLeast: z.number().min(0).max(1).optional(),
  metadataField: z.string().optional(),
  metadataEquals: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const PolicyRuleSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  conditionText: z.string().min(3),
  action: PolicyActionSchema,
  when: PolicyConditionSchema,
});

export const PolicyEditorInputSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(12),
  category: z.string().min(2),
  severity: SeveritySchema,
  scope: z.string().min(2),
  mode: PolicyModeSchema,
  tags: z.array(z.string()).default([]),
  rules: z.array(PolicyRuleSchema).min(1),
});

export const TraceToolUsageSchema = z.object({
  enabled: z.boolean(),
  tools: z.array(z.string()),
});

export const TraceIngestRequestSchema = z.object({
  projectId: z.string(),
  requestId: z.string(),
  environment: EnvironmentSchema,
  provider: z.string(),
  model: z.string(),
  prompt: z.string().min(3),
  context: z.string().default(""),
  actor: z.string().min(2),
  ip: z.string(),
  country: z.string(),
  sessionId: z.string(),
  channel: TraceChannelSchema,
  toolUsage: TraceToolUsageSchema,
  desiredTargets: z.array(z.string()).default([]),
  responsePreview: z.string().optional(),
});

export const SignInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  redirectTo: z.string().optional(),
});

export const SignUpInputSchema = z
  .object({
    fullName: z.string().min(2),
    workEmail: z.string().email(),
    companyName: z.string().min(2),
    password: z.string().min(10),
    confirmPassword: z.string().min(10),
    acceptTerms: z.literal(true),
    redirectTo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export const ProjectCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(12),
  environment: EnvironmentSchema,
  framework: FrameworkSchema,
  provider: ProviderSchema,
});

export const ApiKeyCreateSchema = z.object({
  name: z.string().min(2),
  scopes: z.array(z.string()).min(1),
});

export const OrganizationUpdateSchema = z.object({
  name: z.string().min(2),
  tier: z.string().min(2),
  domain: z.string().optional(),
});

export const OnboardingInputSchema = z.object({
  organizationName: z.string().min(2),
  projectName: z.string().min(2),
  integrationType: IntegrationTypeSchema,
  aiStack: ProviderSchema,
  framework: FrameworkSchema,
  environment: EnvironmentSchema,
});

export const RiskDimensionSchema = z.object({
  key: z.string(),
  label: z.string(),
  score: z.number().min(0).max(1),
  weight: z.number().min(0).max(1),
  explanation: z.string(),
});

export const QuickstartPresetSchema = z.object({
  label: z.string(),
  integrationType: IntegrationTypeSchema,
  heading: z.string(),
  install: z.string(),
  snippet: z.string(),
  verification: z.array(z.string()),
  expectedResults: z.array(z.string()),
});

export const IntegrationSetupStateSchema = z.object({
  status: z.enum(["CONNECTED", "PENDING", "ERROR", "DRAFT"]),
  lastCheckedAt: z.string().optional(),
  setupSteps: z.array(z.string()).default([]),
  logsHint: z.string().default(""),
});

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  environment: (typeof environmentValues)[number];
  owner: string;
  framework: string;
  provider: string;
  lastActivity: string;
  riskStatus: (typeof severityValues)[number];
  integrationStatus: string;
  monitoringEnabled: boolean;
}

export interface DashboardOverviewResponse {
  totals: {
    requestsMonitored: number;
    riskEventsDetected: number;
    blockedActions: number;
    policyViolations: number;
    activeIntegrations: number;
    openIncidents: number;
  };
  requestsOverTime: Array<{ date: string; requests: number; blocked: number; alerts: number }>;
  riskDistribution: Array<{ band: string; count: number }>;
  enforcementOutcomes: Array<{ name: string; value: number }>;
  policyMatches: Array<{ name: string; hits: number }>;
  providerSplit: Array<{ provider: string; traffic: number }>;
  topRiskyApps: Array<{ name: string; score: number; incidents: number }>;
  recentTraces: Array<{ id: string; app: string; verdict: string; score: number; time: string }>;
  recentIncidents: Array<{ id: string; title: string; severity: string; status: string; time: string }>;
}

export interface IncidentDetailResponse {
  id: string;
  title: string;
  severity: string;
  status: string;
  summary: string;
  rootCause: string;
  remediationNotes: string;
  triggerSource: string;
  assigneeName?: string | null;
  timeline: Array<{ at: string; title: string; detail: string }>;
  relatedTraceId?: string | null;
  relatedProjectName?: string | null;
  violatedPolicies: Array<string>;
}

export interface TraceEvaluationResult {
  riskScore: number;
  confidence: number;
  severity: (typeof severityValues)[number];
  verdict: (typeof verdictValues)[number];
  selectedModel?: string;
  outputPreview: string;
  explainability: string;
  dimensionScores: Array<z.infer<typeof RiskDimensionSchema>>;
  matchedRules: Array<{
    id: string;
    title: string;
    condition: string;
    action: string;
    weight: number;
  }>;
  runtimeActions: Array<{
    control: string;
    action: string;
    summary: string;
  }>;
  signals: Array<{
    key: string;
    weight: number;
    description: string;
  }>;
  incidentRecommended: boolean;
  incidentTitle?: string;
}

export type TraceIngestRequest = z.infer<typeof TraceIngestRequestSchema>;
export type PolicyEditorInput = z.infer<typeof PolicyEditorInputSchema>;
export type QuickstartPreset = z.infer<typeof QuickstartPresetSchema>;
export type IntegrationSetupState = z.infer<typeof IntegrationSetupStateSchema>;

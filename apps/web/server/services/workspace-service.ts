import type { Prisma } from "@prisma/client";
import { ApiKeyCreateSchema, OnboardingInputSchema, type PolicyEditorInput } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { createApiKeyRecord } from "@/server/enforcement/api-keys";
import { generatePolicyDsl } from "@/server/policies/dsl";
import { defaultPolicyTemplates, integrationBlueprints, runtimeControlBlueprints } from "@/server/services/catalog";

export async function provisionWorkspace({
  tx,
  userId,
  userName,
  input,
}: {
  tx: Prisma.TransactionClient;
  userId: string;
  userName: string;
  input: {
    organizationName: string;
    projectName: string;
    integrationType: string;
    aiStack: string;
    framework: string;
    environment: string;
  };
}) {
  const organization = await tx.organization.create({
    data: {
      name: input.organizationName,
      slug: `${slugify(input.organizationName)}-${Date.now().toString().slice(-4)}`,
      tier: "Growth",
      domain: `${slugify(input.organizationName)}.ai`,
    },
  });

  await tx.membership.create({
    data: {
      userId,
      organizationId: organization.id,
      role: "OWNER",
    },
  });

  const project = await tx.project.create({
    data: {
      organizationId: organization.id,
      name: input.projectName,
      slug: slugify(input.projectName),
      description: "Primary RiskDelta-protected AI application.",
      environment: input.environment,
      framework: input.framework,
      provider: input.aiStack,
      ownerName: userName,
      riskStatus: "MEDIUM",
      integrationStatus: "Connected",
      monitoringEnabled: true,
      lastActivity: new Date(),
    },
  });

  const createdPolicies = [] as Array<{ id: string; definition: PolicyEditorInput }>;
  for (const template of defaultPolicyTemplates) {
    const policy = await tx.policy.create({
      data: {
        organizationId: organization.id,
        name: template.name,
        slug: slugify(template.name),
        description: template.description,
        category: template.category,
        severity: template.severity,
        scope: template.scope,
        mode: template.mode,
        tags: template.tags,
        status: template.mode === "ENFORCE" ? "Active" : "Simulate",
        template: false,
      },
    });

    await tx.policyVersion.create({
      data: {
        policyId: policy.id,
        version: 1,
        isActive: true,
        definition: template as Prisma.JsonObject,
        dsl: generatePolicyDsl(template),
      },
    });

    await tx.projectPolicy.create({
      data: {
        projectId: project.id,
        policyId: policy.id,
      },
    });

    createdPolicies.push({ id: policy.id, definition: template });
  }

  const createdControls = [] as string[];
  for (const control of runtimeControlBlueprints) {
    const runtimeControl = await tx.runtimeControl.create({
      data: {
        organizationId: organization.id,
        name: control.name,
        slug: control.slug,
        moduleKey: control.moduleKey,
        status: control.status,
        summary: control.summary,
        config: control.config as Prisma.JsonObject,
        recentActions: [...control.recentActions],
      },
    });

    createdControls.push(runtimeControl.id);

    await tx.projectRuntimeControl.create({
      data: {
        projectId: project.id,
        runtimeControlId: runtimeControl.id,
      },
    });
  }

  for (const integration of integrationBlueprints) {
    await tx.integration.create({
      data: {
        organizationId: organization.id,
        projectId: integration.category === "plugnplay" ? project.id : null,
        name: integration.name,
        slug: integration.slug,
        category: integration.category,
        provider: integration.provider,
        connectionState: integration.state,
        config: {
          onboardingSource: input.integrationType,
          aiStack: input.aiStack,
        },
        setupSteps: [
          "Authenticate the integration",
          "Map project scope",
          "Send a test event",
        ],
        logsHint: "Connection logs appear here once test traffic arrives.",
        lastCheckedAt: new Date(),
      },
    });
  }

  const defaultKey = ApiKeyCreateSchema.parse({
    name: "Primary ingest key",
    scopes: ["traces:write", "traces:read", "policies:read"],
  });

  const { apiKey, rawKey } = await createApiKeyRecord({
    tx,
    organizationId: organization.id,
    userId,
    name: defaultKey.name,
    scopes: defaultKey.scopes,
  });

  await tx.auditLog.createMany({
    data: [
      {
        organizationId: organization.id,
        actorName: userName,
        action: "organization.provisioned",
        targetType: "Organization",
        targetId: organization.id,
        metadata: { projectId: project.id },
      },
      {
        organizationId: organization.id,
        actorName: userName,
        action: "api_key.created",
        targetType: "ApiKey",
        targetId: apiKey.id,
        metadata: { prefix: apiKey.prefix },
      },
    ],
  });

  await tx.onboardingState.upsert({
    where: { userId },
    create: {
      userId,
      organizationId: organization.id,
      projectId: project.id,
      currentStep: 5,
      completed: true,
      selectedIntegrationType: input.integrationType,
      selectedAiStack: input.aiStack,
      framework: input.framework,
      environment: input.environment,
    },
    update: {
      organizationId: organization.id,
      projectId: project.id,
      currentStep: 5,
      completed: true,
      selectedIntegrationType: input.integrationType,
      selectedAiStack: input.aiStack,
      framework: input.framework,
      environment: input.environment,
    },
  });

  return {
    organization,
    project,
    apiKey,
    rawKey,
    policyIds: createdPolicies.map((entry) => entry.id),
    runtimeControlIds: createdControls,
  };
}

export function validateOnboardingInput(input: unknown) {
  return OnboardingInputSchema.parse(input);
}

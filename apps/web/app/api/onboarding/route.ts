import { NextResponse } from "next/server";
import { getApiContext } from "@/server/auth/api-context";
import { prisma } from "@/server/db/prisma";
import { getQuickstartData } from "@/server/services/quickstart-service";
import { validateOnboardingInput, provisionWorkspace } from "@/server/services/workspace-service";

export async function POST(request: Request) {
  const context = await getApiContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = validateOnboardingInput(await request.json());

    const result = await prisma.$transaction((tx) =>
      provisionWorkspace({
        tx,
        userId: context.user.id,
        userName: context.user.fullName,
        input,
      }),
    );

    const quickstart = getQuickstartData({
      organizationName: result.organization.name,
      projectSlug: result.project.slug,
      apiKeyPrefix: result.apiKey.prefix,
    });

    const matchingPreset =
      quickstart.presets.find((preset) => preset.integrationType === input.integrationType) ?? quickstart.presets[0];

    return NextResponse.json({
      ok: true,
      organization: result.organization,
      project: result.project,
      apiKey: result.rawKey,
      quickstart: matchingPreset.snippet,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete onboarding" },
      { status: 400 },
    );
  }
}

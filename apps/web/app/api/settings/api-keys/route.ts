import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { createApiKey, getOrganizationSettings } from "@/server/services/settings-service";

export async function GET(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getOrganizationSettings(context.organization.id);
  const { searchParams } = new URL(request.url);
  const selectedId = searchParams.get("selectedId");
  const interactive = searchParams.get("interactive") === "1";

  if (!interactive) {
    return NextResponse.json(settings.apiKeys);
  }

  const selected = settings.apiKeys.find((item) => item.id === selectedId) ?? settings.apiKeys[0] ?? null;
  return NextResponse.json({
    items: settings.apiKeys,
    selected,
  });
}

export async function POST(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(
      await createApiKey({
        organizationId: context.organization.id,
        userId: context.user.id,
        input: await request.json(),
      }),
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create API key" }, { status: 400 });
  }
}

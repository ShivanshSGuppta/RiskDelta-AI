import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { hasMinimumRole } from "@/server/auth/rbac";
import { createApiKey, getOrganizationSettings } from "@/server/services/settings-service";

export async function GET(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasMinimumRole(context.membership?.role, "VIEWER")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
  if (!hasMinimumRole(context.membership?.role, "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    return NextResponse.json(
      await createApiKey({
        organizationId: context.organization.id,
        input: await request.json(),
      }),
    );
  } catch (error) {
    console.error("settings.api-keys.create_failed", error);
    return NextResponse.json({ error: "Unable to create API key" }, { status: 502 });
  }
}

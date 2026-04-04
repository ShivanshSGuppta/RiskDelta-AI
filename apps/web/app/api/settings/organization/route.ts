import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { getOrganizationSettings, updateOrganizationSettings } from "@/server/services/settings-service";

export async function GET() {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getOrganizationSettings(context.organization.id);
  return NextResponse.json(settings.organization);
}

export async function PATCH(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(
      await updateOrganizationSettings({
        organizationId: context.organization.id,
        input: await request.json(),
      }),
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update organization" }, { status: 400 });
  }
}

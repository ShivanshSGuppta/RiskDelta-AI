import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { hasMinimumRole } from "@/server/auth/rbac";
import { getOrganizationSettings, updateOrganizationSettings } from "@/server/services/settings-service";

export async function GET() {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasMinimumRole(context.membership?.role, "VIEWER")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await getOrganizationSettings(context.organization.id);
  return NextResponse.json(settings.organization);
}

export async function PATCH(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasMinimumRole(context.membership?.role, "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    return NextResponse.json(
      await updateOrganizationSettings({
        organizationId: context.organization.id,
        input: await request.json(),
      }),
    );
  } catch (error) {
    console.error("settings.organization.update_failed", error);
    return NextResponse.json({ error: "Unable to update organization" }, { status: 502 });
  }
}

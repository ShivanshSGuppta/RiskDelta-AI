import { NextResponse } from "next/server";
import { getApiPlatformContext } from "@/server/auth/api-context";
import { getDocsFoundation } from "@/server/services/docs-service";

export async function GET(request: Request) {
  const context = await getApiPlatformContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sectionId = searchParams.get("section");
  const interactive = searchParams.get("interactive") === "1";

  const foundation = await getDocsFoundation(context.organization.id);
  if (!interactive) {
    return NextResponse.json(foundation);
  }

  const selectedSection = foundation.sections.find((section) => section.id === sectionId) ?? foundation.sections[0] ?? null;
  return NextResponse.json({
    ...foundation,
    selectedSection,
  });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getMarketingInteractiveContent } from "@/content/marketing-interactive";

const querySchema = z.object({
  page: z.enum(["docs-preview", "integrations", "pricing", "security"]),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    page: searchParams.get("page"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid page query parameter" }, { status: 400 });
  }

  return NextResponse.json(getMarketingInteractiveContent(parsed.data.page), {
    headers: {
      "cache-control": "no-store",
    },
  });
}

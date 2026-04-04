import { NextResponse } from "next/server";
import { createSession } from "@/server/auth/session";
import { signUp } from "@/server/services/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await signUp(body);
    await createSession(user.id);

    return NextResponse.json({
      ok: true,
      redirectTo: body.redirectTo ?? "/app/onboarding",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create account" },
      { status: 400 },
    );
  }
}

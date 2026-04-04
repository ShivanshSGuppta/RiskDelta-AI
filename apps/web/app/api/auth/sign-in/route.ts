import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { createSession } from "@/server/auth/session";
import { signIn } from "@/server/services/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await signIn(body);
    await createSession(user.id);

    const fresh = await prisma.user.findUnique({
      where: { id: user.id },
      include: { onboardingState: true },
    });

    const redirectTo = fresh?.onboardingState?.completed ? body.redirectTo ?? "/app/overview" : "/app/onboarding";

    return NextResponse.json({ ok: true, redirectTo });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to sign in" },
      { status: 400 },
    );
  }
}

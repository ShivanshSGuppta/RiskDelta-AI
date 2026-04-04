import "server-only";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";

export const SESSION_COOKIE_NAME = "riskdelta_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function createSession(userId: string) {
  const sessionToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { sessionToken: token } });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        include: {
          memberships: {
            include: {
              organization: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          onboardingState: true,
        },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session;
}

export async function requireUser() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/signin");
  }
  return session.user;
}

export async function getAuthContext() {
  const session = await getCurrentSession();
  if (!session) return null;
  const user = session.user;
  const membership = user.memberships[0] ?? null;
  const organization = membership?.organization ?? null;
  const projects = organization
    ? await prisma.project.findMany({
        where: { organizationId: organization.id },
        orderBy: [{ environment: "asc" }, { name: "asc" }],
      })
    : [];

  return {
    user,
    organization,
    membership,
    projects,
    onboardingState: user.onboardingState,
  };
}

export async function requirePlatformAccess() {
  const context = await getAuthContext();
  if (!context) redirect("/signin");
  if (!context.onboardingState?.completed || !context.organization) {
    redirect("/app/onboarding");
  }
  return context;
}

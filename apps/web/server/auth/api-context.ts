import { getAuthContext } from "@/server/auth/session";

export async function getApiContext() {
  return getAuthContext();
}

export async function getApiPlatformContext() {
  const context = await getAuthContext();
  if (!context?.organization || !context.onboardingState?.completed) {
    return null;
  }

  return context;
}

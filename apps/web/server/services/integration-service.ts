import { throwCommercialFeatureError } from "@/server/services/commercial-edition";

export async function listIntegrations() {
  throwCommercialFeatureError("integrations");
}

export async function createIntegration() {
  throwCommercialFeatureError("integrations");
}

export async function updateIntegration() {
  throwCommercialFeatureError("integrations");
}

export async function verifyIntegration() {
  throwCommercialFeatureError("integrations");
}

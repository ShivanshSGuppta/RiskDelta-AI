import type { PolicyDefinition } from "@riskdelta/policy-engine";
import { throwCommercialFeatureError } from "@/server/services/commercial-edition";

export async function listPolicies() {
  throwCommercialFeatureError("policies");
}

export async function getPolicyDetail() {
  throwCommercialFeatureError("policies");
}

export async function createPolicy() {
  throwCommercialFeatureError("policies");
}

export async function updatePolicy() {
  throwCommercialFeatureError("policies");
}

export async function getActivePolicyDefinitions(_organizationId: string): Promise<
  Array<{
    id: string;
    policy: { mode: "SIMULATE" | "ENFORCE" };
    parsedDefinition: PolicyDefinition;
  }>
> {
  void _organizationId;
  return [];
}

import { throwCommercialFeatureError } from "@/server/services/commercial-edition";

export async function getRiskOverview() {
  throwCommercialFeatureError("risk-workbench");
}

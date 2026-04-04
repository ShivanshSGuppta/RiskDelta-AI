import { throwCommercialFeatureError } from "@/server/services/commercial-edition";

export async function listIncidents() {
  throwCommercialFeatureError("incidents");
}

export async function getIncidentDetail() {
  throwCommercialFeatureError("incidents");
}

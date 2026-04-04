import { throwCommercialFeatureError } from "@/server/services/commercial-edition";

export async function listRuntimeControls() {
  throwCommercialFeatureError("runtime-controls");
}

export async function getRuntimeControlBySlug() {
  throwCommercialFeatureError("runtime-controls");
}

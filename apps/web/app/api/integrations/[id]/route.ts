import { commercialFeatureResponse } from "@/server/commercial-response";

export async function PATCH() {
  return commercialFeatureResponse("integrations");
}

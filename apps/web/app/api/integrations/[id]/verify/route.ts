import { commercialFeatureResponse } from "@/server/commercial-response";

export async function POST() {
  return commercialFeatureResponse("integrations");
}

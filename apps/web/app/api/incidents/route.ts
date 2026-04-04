import { commercialFeatureResponse } from "@/server/commercial-response";

export async function GET() {
  return commercialFeatureResponse("incidents");
}

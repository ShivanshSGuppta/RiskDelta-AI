import { commercialFeatureResponse } from "@/server/commercial-response";

export async function GET() {
  return commercialFeatureResponse("integrations");
}

export async function POST() {
  return commercialFeatureResponse("integrations");
}

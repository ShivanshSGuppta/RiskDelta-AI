import { commercialFeatureResponse } from "@/server/commercial-response";

export async function GET() {
  return commercialFeatureResponse("policies");
}

export async function POST() {
  return commercialFeatureResponse("policies");
}

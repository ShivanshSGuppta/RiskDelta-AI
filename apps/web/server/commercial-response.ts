import { NextResponse } from "next/server";
import type { CommercialFeatureId } from "@riskdelta/types";

export function commercialFeatureResponse(feature: CommercialFeatureId, status = 403) {
  return NextResponse.json(
    {
      error: `${feature} is reserved for the RiskDelta commercial edition.`,
      edition: "community-source-available",
      feature,
    },
    { status },
  );
}

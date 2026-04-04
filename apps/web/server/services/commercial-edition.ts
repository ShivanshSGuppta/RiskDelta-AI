import type { CommercialFeatureId } from "@riskdelta/types";

export function commercialFeatureError(feature: CommercialFeatureId) {
  return new Error(`${feature} is reserved for the RiskDelta commercial edition and is not included in this source-available repository.`);
}

export function throwCommercialFeatureError(feature: CommercialFeatureId): never {
  throw commercialFeatureError(feature);
}

import {
  COMMERCIAL_EDITION,
  COMMUNITY_SOURCE_AVAILABLE_EDITION,
  type CommercialFeatureId,
} from "@riskdelta/types";

const currentEdition =
  process.env.NEXT_PUBLIC_RISKDELTA_EDITION ??
  process.env.RISKDELTA_EDITION ??
  COMMUNITY_SOURCE_AVAILABLE_EDITION;

export const riskdeltaEdition =
  currentEdition === COMMERCIAL_EDITION ? COMMERCIAL_EDITION : COMMUNITY_SOURCE_AVAILABLE_EDITION;

export const commercialFeatures = new Set<CommercialFeatureId>([
  "policies",
  "runtime-controls",
  "risk-workbench",
  "incidents",
  "integrations",
]);

export function isCommercialEdition() {
  return riskdeltaEdition === COMMERCIAL_EDITION;
}

export function isCommercialFeature(feature: CommercialFeatureId) {
  return commercialFeatures.has(feature);
}


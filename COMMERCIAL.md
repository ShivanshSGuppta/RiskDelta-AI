# Commercial Boundary

This repository is the source-available boundary for RiskDelta under `BUSL-1.1`.

## Public source-available packages

- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/config`
- `packages/types`
- `packages/shared`
- `packages/sdk-node`
- `packages/risk-engine`
- `packages/policy-engine`
- `packages/ui`

These packages are intentionally limited to the community-safe baseline that we are willing to publish.

## Commercial placeholders in this branch

The following product areas are represented by placeholders and disabled entrypoints in this public repository:

- policies
- runtime controls
- risk workstation
- incidents
- managed integrations and connector verification

The public branch may keep interfaces, route shapes, and feature notices for these areas, but it does not ship the commercial implementation.

## Trademark and brand use

- `RiskDelta`
- `RiskDelta Console`
- repository brand assets and logos

These names and marks are not licensed for reuse in derivative products, hosted services, or competitive offerings except as necessary to identify the origin of this repository.

## Commercial use

If your intended use falls outside the rights granted in `BUSL-1.1`, you need a separate commercial license.

Examples:

- operating a hosted or managed version of withheld commercial functionality
- shipping the withheld commercial console workflows in production
- offering a competitive service built from protected portions of the Licensed Work

## Edition defaults in code

This repository defaults to:

- `RISKDELTA_EDITION=community-source-available`
- `NEXT_PUBLIC_RISKDELTA_EDITION=community-source-available`

Commercial-only surfaces must fail closed in that default mode.

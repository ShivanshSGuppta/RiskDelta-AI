# RiskDelta Architecture

## System Overview

RiskDelta is a multi-tenant AI runtime control plane with three runtime services:

- `apps/web`: Next.js UI (public site + RiskDelta Console)
- `apps/api`: Fastify API (`/v1`)
- `apps/worker`: BullMQ worker for async runtime processing

Shared logic lives in workspace packages:

- `@riskdelta/policy-engine`: policy DSL + deterministic evaluation
- `@riskdelta/risk-engine`: weighted risk scoring
- `@riskdelta/shared`: cross-service helpers (`id`, crypto helpers)
- `@riskdelta/types`: shared runtime request/contract schemas
- `@riskdelta/config`: Zod-validated env loaders

## Core Data Flow

1. Runtime client sends trace payload to `POST /v1/ingest/traces`.
2. API persists normalized trace/session records and queues runtime job in Redis/BullMQ.
3. Worker:
   - scores risk
   - evaluates active policies (simulate/enforce)
   - applies runtime control strategies (`PromptShield`, `DataGuard`, `ModelSwitch`, `AgentFence`, `SentinelX`)
   - writes policy/risk/runtime evidence
   - opens/updates incidents and incident events when thresholds are crossed
4. Web app renders TraceVault, Policies, Risk, Runtime Controls, Incidents from API-backed services.

## Tenancy and Security Boundaries

- Org-scoped resources are enforced server-side.
- Auth contexts:
  - session cookie auth (user membership + role)
  - API key auth (org-scoped + scopes)
- RBAC roles: `OWNER`, `ADMIN`, `OPERATOR`, `VIEWER`.
- API keys are hashed at rest and reveal raw token only at creation.
- Integration secrets are encrypted before persistence.

## Storage and Infra

- PostgreSQL: source of truth (Prisma schema in `apps/web/prisma/schema.prisma`)
- Redis: queue transport and worker orchestration
- MinIO: evidence/artifact store foundation

## API Surface (Current)

Main groups under `/v1`:

- auth/org/project/environment/application/key management
- trace ingestion and retrieval
- policy CRUD/version/simulation
- risk overview
- runtime controls
- incidents
- integrations
- quickstart hooks
- settings, docs foundation, audit feeds

## Operational Notes

- API bootstraps strict CORS allowlist, CSP/helmet, rate limiting, structured request logging, and content-type enforcement.
- Worker and API are independently deployable.
- Web services call API first and use local fallback where required for migration continuity.

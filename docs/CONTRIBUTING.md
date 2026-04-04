# Contributing to RiskDelta

## Prerequisites

- Node.js 20+
- pnpm 10+
- Docker

## Local Setup

1. Copy env:

```bash
cp .env.example .env
```

2. Start infrastructure:

```bash
docker compose up -d
```

3. Install dependencies and prepare DB:

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
```

4. Run services:

```bash
pnpm dev:web
pnpm dev:api
pnpm dev:worker
```

## Quality Gates

Run before opening a PR:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm secrets:scan
pnpm security:public-env
```

## Contribution Rules

- Keep user-facing brand text as `RiskDelta`.
- Do not expose secrets through `NEXT_PUBLIC_*`.
- Keep API contracts backwards-compatible during phased migrations.
- Prefer shared packages for logic used by more than one app.
- Preserve operator-workstation layouts (avoid generic dashboard card grids).

## Commit and PR Guidelines

- Keep changes scoped to a phase or feature slice.
- Include migration notes for Prisma schema changes.
- Include route-level verification notes for UI changes.
- Call out any security-relevant behavior changes explicitly.

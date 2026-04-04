# Security Notes

## Secrets

- Never commit real secrets.
- `.env.example` contains placeholders only.
- Provider and integration credentials must stay server-side.
- API keys are stored hashed and raw tokens are reveal-once.
- Integration secrets are encrypted before DB persistence.

## Public Bundle Safety

RiskDelta includes two checks:

- `pnpm secrets:scan` (gitleaks)
- `pnpm security:public-env` (NEXT_PUBLIC misuse + client-bundle literal audit)

Do not add sensitive variables under `NEXT_PUBLIC_*`.

## API Hardening

API bootstrap enforces:

- Helmet with CSP and secure defaults
- strict CORS allowlist
- global rate limiting
- structured request logging with secret redaction
- request content-type validation for mutation routes

## Reporting

If you find a security issue, do not open a public issue with exploit details.
Share a minimal reproduction and impact summary with maintainers through a private channel.

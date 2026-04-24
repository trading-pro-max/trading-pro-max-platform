# Trading Pro Max Staging Deployment Checklist

## Current Truth

Staging is a rehearsal environment for closed beta and launch operations. This
checklist does not claim staging is deployed. It defines what must be true
before an operator can treat staging as real deployment evidence.

## Required Staging Env

- `NODE_ENV=production`
- `TPM_DEPLOYMENT_TARGET=staging`
- `TPM_LAUNCH_MODE=staging`
- `TPM_STAGING_BASE_URL`
- `TPM_STAGING_DEPLOYMENT_ID`
- `TPM_STAGING_ROLLBACK_REF`
- `DATABASE_URL`
- `TPM_OPERATOR_KEY`
- `TPM_DEMO_EMAIL`
- `TPM_DEMO_PASSWORD`
- `TPM_OPERATOR_EMAIL`
- `TPM_OPERATOR_PASSWORD`
- `TPM_CLOSED_BETA_ALLOWLIST` or `TPM_CLOSED_BETA_ALLOWLIST_EMAILS`
- `TPM_MONITORING_PROVIDER`, `TPM_MONITORING_ENDPOINT`, and
  `TPM_MONITORING_KEY`, or the `TPM_OPS_EXTERNAL_MONITOR_*` equivalents

Staging values belong in the hosting secret manager or an ignored local env
file used only for rehearsal. Do not commit staging secrets.

## Build And Start Path

1. Install dependencies with `npm install`.
2. Configure staging secrets from `.env.staging.example`.
3. Run `npm run staging:validate`.
4. Run `npx tsc --noEmit`.
5. Run `npx eslint app modules tests --max-warnings=0`.
6. Run `npm run prisma:validate`.
7. Run `npm run build`.
8. Run `prisma migrate deploy` against the staging database.
9. Seed only the rotated staging demo/operator accounts.
10. Start with `npm start`.

## Staging Verification

Run these checks against the staging URL:

- `/`
- `/en`
- `/en/settings`
- `/diagnostics`
- `/api/health`
- `/api/diagnostics/probes`
- `/api/parity/final`
- `/api/market?symbol=EUR/USD&timeframe=1m`
- `/api/launch/readiness`
- `/api/launch/beta-readiness`
- `/api/launch/soft-readiness`
- `/api/launch/public-readiness`
- `/api/launch/operations` while signed out, expecting `401`
- `/api/account/preferences` while signed out, expecting `401`

The health and diagnostics payloads must show truthful blocked or unconfigured
states for live execution, real-money routing, broker/feed live activation,
billing, notifications, and public launch.

## Closed Beta Rehearsal

- Configure exactly the first five evaluator emails in the allowlist.
- Confirm each tester has assigned credentials.
- Confirm feedback submission and lifecycle triage work.
- Confirm the operator can capture `/api/health`, `/api/diagnostics/probes`,
  `/api/ops/hardening`, and `/api/ops/recovery`.

## Rollback And Recovery

- Record the deployed commit as `TPM_STAGING_DEPLOYMENT_ID`.
- Record the previous known-good commit as `TPM_STAGING_ROLLBACK_REF`.
- Keep a database checkpoint before migrations.
- If staging verification fails, stop tester access, restore the previous
  deployment ref, restore the database checkpoint if needed, and rerun
  `npm run smoke:routes`.

## Hard Blockers

- No real staging host URL.
- Local SQLite or placeholder database URL.
- Missing operator key.
- Default demo/operator credentials.
- Fewer than five beta allowlist entries.
- Missing external monitoring.
- Failed build, route smoke, health, or diagnostics checks.
- Any route claims public launch, live execution, real-money routing, broker
  live activation, feed live activation, billing, or notification delivery.

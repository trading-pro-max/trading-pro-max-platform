# Trading Pro Max Production Deployment Readiness Checklist

## Current Truth

The app can be prepared for controlled production-like use, but deployment is blocked until production requirements are explicitly satisfied. This checklist does not deploy anything.

## Required Before Deployment

- Set `DATABASE_URL` to the production database.
- Create and review Prisma migrations.
- Run `prisma migrate deploy` against the production database.
- Set `TPM_OPERATOR_KEY`.
- Rotate `TPM_DEMO_EMAIL` and `TPM_DEMO_PASSWORD`.
- Set `TPM_CLOSED_BETA_ALLOWLIST_EMAILS` for the closed beta cohort.
- Confirm no `NEXT_PUBLIC_*` variable name contains secret, token, password, private, or key.
- Run `npm run production:validate`.

## Required Validation

- `npx tsc --noEmit`
- `npx eslint app modules tests --max-warnings=0`
- `npm run build`
- `npm run prisma:validate`
- `npm run smoke:routes -- --with-api`
- `/api/health`
- `/api/diagnostics/probes`

## Rollback Plan

1. Capture `/api/diagnostics/probes`.
2. Capture `/api/ops/hardening`.
3. Capture `/api/ops/recovery`.
4. Stop accepting new beta sessions.
5. Restore the last known-good commit.
6. Restore database checkpoint if migrations caused the issue.
7. Re-run route smoke and health checks.

## Hard Blockers

- No production database.
- No migration plan.
- Default demo credentials.
- Missing operator key.
- Any live-money or live-execution path.
- Any false broker/feed/billing/notification/public-launch claim.

## Operator Notes

Keep production rollout manual and reversible. Do not enable broker live routing, external feed live serving, billing, notification delivery, or public launch during closed beta.

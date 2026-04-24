# Trading Pro Max Production Deployment Readiness Checklist

## Current Truth

The app can be prepared for controlled production-like use, but deployment is blocked until production requirements are explicitly satisfied. This checklist does not deploy anything.

## Required Before Deployment

- Set `DATABASE_URL` to the production database.
- Confirm `DATABASE_URL` is not `file:./prisma/dev.db` or any relative local path.
- Create and review Prisma migrations.
- Run `prisma migrate deploy` against the production database.
- Set `TPM_OPERATOR_KEY`.
- Rotate `TPM_DEMO_EMAIL`, `TPM_DEMO_PASSWORD`, `TPM_OPERATOR_EMAIL`, and `TPM_OPERATOR_PASSWORD`.
- Complete `docs/ops/secret-rotation.md`.
- Set `TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED=true`, `TPM_SECRET_ROTATION_BATCH_ID`, and `TPM_SECRET_ROTATION_COMPLETED_AT` only after every launch secret is rotated in deployment secret storage.
- Set `TPM_CLOSED_BETA_ALLOWLIST_EMAILS` for the closed beta cohort.
- Configure `TPM_OPS_EXTERNAL_MONITOR_PROVIDER`, `TPM_OPS_EXTERNAL_MONITOR_URL`, and `TPM_OPS_EXTERNAL_MONITOR_KEY`.
- Local rehearsal only: use `npm run production:setup-local` to create `.env.production.local`, then replace placeholders with real deployment values.
- Confirm no `NEXT_PUBLIC_*` variable name contains secret, token, password, private, or key.
- Run `npm run production:validate`.
- Run `npm run staging:validate` against a real staging deployment before any closed beta or launch expansion.

## Required Validation

- `npx tsc --noEmit`
- `npx eslint app modules tests --max-warnings=0`
- `npm run build`
- `npm run prisma:validate`
- `npm run smoke:routes -- --with-api`
- `/api/health`
- `/api/diagnostics/probes`
- `/api/launch/readiness` with the `deployment` domain not failed
- `node scripts/validate-production-readiness.mjs --json`
- `node scripts/validate-production-readiness.mjs --env-file .env.production.local` for local rehearsal only
- `node scripts/validate-staging-readiness.mjs --json` after staging env and host evidence exist

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
- Default operator credentials.
- Missing pre-launch secret rotation attestation.
- Any known old/local/demo/simulated/placeholder secret pattern.
- Missing operator key.
- Empty closed beta allowlist.
- Missing external monitoring configuration.
- Failed `production_deployment_readiness` launch-gate domain.
- Failed staging deployment validation.
- Failed closed beta, soft launch, or public launch readiness criteria.
- Any live-money or live-execution path.
- Any false broker/feed/billing/notification/public-launch claim.

## Operator Notes

Keep production rollout manual and reversible. Do not enable broker live routing, external feed live serving, billing, notification delivery, or public launch during closed beta.
Do not treat `--simulate-safe` validation as production evidence; it only tests validator logic.

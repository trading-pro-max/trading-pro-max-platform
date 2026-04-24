# Trading Pro Max Pre-Launch Security Checklist

## Required Before Any Real Launch

- Complete `docs/ops/secret-rotation.md`.
- Store all production secrets in the deployment secret manager.
- Confirm `.env.production.local` and other `.env*.local` files are ignored and
  not committed.
- Run `npm run production:validate`.
- Run `npm run staging:validate` for the real staging host.
- Run `npx tsc --noEmit`.
- Run `npx eslint app modules tests --max-warnings=0`.
- Run `npm run build`.
- Run `npm run prisma:validate`.
- Run `npm run test:regression`.
- Capture `/api/health` and `/api/diagnostics/probes`.

## Secret Rotation Gate

Launch remains blocked until:

- `DATABASE_URL` is a safe production database URL.
- `TPM_OPERATOR_KEY` is rotated and high entropy.
- `TPM_DEMO_PASSWORD` and `TPM_OPERATOR_PASSWORD` are rotated away from seed
  defaults.
- Monitoring key and endpoint are real and not placeholder values.
- Broker/feed/pilot keys are rotated at providers if configured.
- Notification delivery credentials are rotated if delivery is configured.
- Billing keys remain absent because billing is inactive, or are added to the
  rotation inventory before any billing activation work.
- `TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED=true`.
- `TPM_SECRET_ROTATION_BATCH_ID` is set.
- `TPM_SECRET_ROTATION_COMPLETED_AT` is set to a valid completed timestamp.

## Hard Stop Conditions

Stop launch, staging expansion, broker/feed activation, monitoring activation,
billing activation, or public rollout if any of these are true:

- A default, local, demo, example, simulated, or placeholder secret is present.
- A secret appears in Git, logs, screenshots, tickets, or docs.
- `npm run production:validate` is blocked.
- Monitoring is claimed active without real provider configuration.
- Broker/feed live activation is claimed without real provider credentials and
  operator release.
- Billing or checkout appears active without a real billing release.
- Live execution or real-money routing becomes possible.

## Operator Evidence

Record these outside the repository:

- Secret rotation batch ID.
- Rotation completion timestamp.
- Secret manager location or environment name.
- Production validator output with secrets redacted.
- Staging validator output with secrets redacted.
- Rollback contact and deployment owner.

Do not record secret values themselves.

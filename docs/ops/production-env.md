# Trading Pro Max Production Environment

This document explains the production readiness environment contract. Real
values must live in the deployment secret manager, not in Git.

## Required Target

- `NODE_ENV=production`
- `TPM_DEPLOYMENT_TARGET=production`
- `TPM_LAUNCH_MODE=closed_beta` for the controlled beta phase

`npm run production:validate` defaults to production/closed-beta validation when
these values are omitted.

For local setup rehearsal, run:

```bash
npm run production:setup-local -- --database-url file:/absolute/persistent/path/production.db --allowlist tester1@example.com,tester2@example.com,tester3@example.com,tester4@example.com,tester5@example.com
node scripts/validate-production-readiness.mjs --env-file .env.production.local
```

`.env.production.local` is ignored by Git. The setup script preserves existing
secret values unless `--force` is passed, generates local-only strong values for
operator/demo passwords, and never prints full secrets. If no database URL is
provided, it writes the local SQLite fallback so the app still runs locally but
production validation remains blocked.

## Database

Required:

- `DATABASE_URL`

The local fallback `file:./prisma/dev.db` is blocked for production readiness.
Relative SQLite paths are also blocked. The current runtime uses Prisma SQLite,
so the production-safe path is an absolute persistent `file:` URL on managed
durable storage, paired with backups and `prisma migrate deploy`.

Managed SQL URLs can be validated as production database URLs only after the
Prisma datasource/runtime adapter has been migrated and tested for that provider.
Do not switch to a managed SQL URL and claim readiness until that migration is
complete.

## Operator Key

Required:

- `TPM_OPERATOR_KEY`

Generate it outside the repo, store it in the deployment secret manager, and
send it only through the guarded operator request header. The validator checks
presence and shape only; it never prints the key.

Local/default keys such as `local-operator-review-key` are never production
valid.

For a real deployment, generate the key outside the repo with your secret
manager or operating-system password tool. Do not paste it into docs, issues,
logs, or command output.

## Pre-Launch Secret Rotation

Required:

- `TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED=true`
- `TPM_SECRET_ROTATION_BATCH_ID`
- `TPM_SECRET_ROTATION_COMPLETED_AT`

Follow `docs/ops/secret-rotation.md` before setting the confirmation flag. The
validator blocks known local/default/demo/simulated patterns across configured
database, operator, monitoring, broker, feed, pilot, notification, signing, and
delivery secret names.

## Rotated Seed Credentials

Required:

- `TPM_DEMO_EMAIL`
- `TPM_DEMO_PASSWORD`
- `TPM_OPERATOR_EMAIL`
- `TPM_OPERATOR_PASSWORD`

The seed defaults in `prisma/seed.mjs` are local-only. Production-like closed
beta must use rotated tester/operator credentials, and demo/operator accounts
must not share the same email.

## Closed Beta Allowlist

Required:

- `TPM_CLOSED_BETA_ALLOWLIST` or `TPM_CLOSED_BETA_ALLOWLIST_EMAILS`, and/or
  `TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS`

For production closed beta, configure at least five real evaluator identities.
This is an allowlist, not public signup. Empty allowlists block readiness.

## External Monitoring

Required for production readiness:

- `TPM_MONITORING_PROVIDER` or `TPM_OPS_EXTERNAL_MONITOR_PROVIDER`
- `TPM_MONITORING_ENDPOINT` or `TPM_OPS_EXTERNAL_MONITOR_URL`
- `TPM_MONITORING_KEY` or `TPM_OPS_EXTERNAL_MONITOR_KEY`

The URL must use HTTPS. The key is presence/shape checked only and never
printed. Placeholder endpoints such as localhost, example domains, and `.test`
domains are not accepted as real monitoring outside simulated validation. The
app does not claim monitoring delivery is active unless these values are
configured.

Optional:

- `TPM_OPS_TRACING_ENDPOINT`

## Validation

Run:

```bash
npm run production:validate
npm run staging:validate
node scripts/validate-production-readiness.mjs --json
node scripts/validate-production-readiness.mjs --env-file .env.production.local
node scripts/validate-production-readiness.mjs --simulate-safe
node scripts/validate-staging-readiness.mjs --simulate-safe
npm run secrets:generate-launch
```

A blocked result means at least one production blocker remains. It is not a
runtime bug; it is a deployment truth signal.

`--simulate-safe` is only a validator logic check. It proves the pass path
without using real secrets and must not be cited as real production readiness.

Staging validation additionally requires `TPM_STAGING_BASE_URL`,
`TPM_STAGING_DEPLOYMENT_ID`, and `TPM_STAGING_ROLLBACK_REF`. Those values are
deployment evidence, not secrets, but they still must reflect a real staging
host and rollback point before staging can be treated as ready.

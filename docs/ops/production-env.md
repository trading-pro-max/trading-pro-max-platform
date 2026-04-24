# Trading Pro Max Production Environment

This document explains the production readiness environment contract. Real
values must live in the deployment secret manager, not in Git.

## Required Target

- `NODE_ENV=production`
- `TPM_DEPLOYMENT_TARGET=production`
- `TPM_LAUNCH_MODE=closed_beta` for the controlled beta phase

`npm run production:validate` defaults to production/closed-beta validation when
these values are omitted.

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

- `TPM_CLOSED_BETA_ALLOWLIST_EMAILS` and/or
  `TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS`

For production closed beta, configure at least five real evaluator identities.
This is an allowlist, not public signup. Empty allowlists block readiness.

## External Monitoring

Required for production readiness:

- `TPM_OPS_EXTERNAL_MONITOR_PROVIDER`
- `TPM_OPS_EXTERNAL_MONITOR_URL`
- `TPM_OPS_EXTERNAL_MONITOR_KEY`

The URL must use HTTPS. The key is presence/shape checked only and never
printed. The app does not claim monitoring delivery is active unless these
values are configured.

Optional:

- `TPM_OPS_TRACING_ENDPOINT`

## Validation

Run:

```bash
npm run production:validate
node scripts/validate-production-readiness.mjs --json
```

A blocked result means at least one production blocker remains. It is not a
runtime bug; it is a deployment truth signal.

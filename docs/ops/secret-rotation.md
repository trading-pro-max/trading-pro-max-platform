# Trading Pro Max Pre-Launch Secret Rotation

## Current Truth

Full secret rotation is required before real launch, public launch, real
production deployment, broker activation, billing activation, monitoring
activation, notification delivery, or real-money capability. This document does
not contain secrets and must never be used as a place to paste them.

## Rotation Inventory

Rotate these before any real deployment or launch gate:

- Database: `DATABASE_URL` and any database password embedded in the connection
  string.
- Operator gate: `TPM_OPERATOR_KEY`.
- Seeded accounts: `TPM_DEMO_PASSWORD` and `TPM_OPERATOR_PASSWORD`, plus their
  paired `TPM_DEMO_EMAIL` and `TPM_OPERATOR_EMAIL` identities.
- Monitoring: `TPM_MONITORING_KEY` or `TPM_OPS_EXTERNAL_MONITOR_KEY`.
- Broker pilot: `TPM_BROKER_API_KEY`, `TPM_BROKER_API_SECRET`,
  `TPM_BROKER_SANDBOX_API_KEY`, `TPM_BROKER_SANDBOX_API_SECRET`,
  `TPM_BROKER_LIVE_API_KEY`, and `TPM_BROKER_LIVE_API_SECRET` if configured.
- Feed pilot: `TPM_MARKET_FEED_API_KEY`, `TPM_MARKET_FEED_API_SECRET`,
  `TPM_MARKET_FEED_SANDBOX_API_KEY`, `TPM_MARKET_FEED_SANDBOX_API_SECRET`,
  `TPM_MARKET_FEED_LIVE_API_KEY`, and `TPM_MARKET_FEED_LIVE_API_SECRET` if
  configured.
- Single pilot path: `TPM_PILOT_BROKER_API_KEY`,
  `TPM_PILOT_BROKER_API_SECRET`, `TPM_PILOT_FEED_API_KEY`, and
  `TPM_PILOT_FEED_API_SECRET` if configured.
- Notification/delivery: `TPM_ALERTS_WEBHOOK_URL` and
  `TPM_ALERTS_QUEUE_BACKEND_URL` if they contain provider credentials or signed
  URLs.
- Desktop/mobile packaging: signing or distribution profiles if they are ever
  configured.
- Billing: no billing provider key exists in the current codebase. If billing is
  added later, provider keys, webhook signing secrets, checkout keys, and
  customer lifecycle credentials must be added to this inventory before
  activation.

## Values That Are Never Launch-Valid

- `file:./prisma/dev.db` or other local SQLite paths for production.
- `local-operator-review-key`.
- `TradingProMaxDemo!2026`.
- `TradingProMaxOperator!2026`.
- Values containing `LocalOnly`, `SimulatedOnly`, `placeholder`, `change-me`,
  `replace-me`, `dummy`, `sample`, `default`, `example`, `.test`, `.invalid`,
  `localhost`, or `127.0.0.1`.
- Secrets printed in logs, issue comments, screenshots, or docs.

## Local Generation Helper

Run:

```bash
npm run secrets:generate-launch
```

The helper writes only to an ignored `.env*.local` file, preserves existing
values unless `--force` is passed, and redacts secret output by default. It can
generate app-controlled values for `TPM_OPERATOR_KEY`, `TPM_DEMO_PASSWORD`,
`TPM_OPERATOR_PASSWORD`, and monitoring shared-key style values.

Provider-owned values are not generated. Broker, feed, billing, notification,
database, and hosted monitoring credentials must be rotated at their provider
or secret manager and then stored in deployment secret storage.

Only use `--print-once` in a private terminal when you intentionally need to
copy newly generated values into the secret manager. Do not paste printed
values into Git, docs, tickets, chat, or logs.

## Rotation Attestation

Production validation blocks until these are set in deployment secrets after a
real rotation:

- `TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED=true`
- `TPM_SECRET_ROTATION_BATCH_ID`
- `TPM_SECRET_ROTATION_COMPLETED_AT`

The batch ID and timestamp are audit markers only. They must not contain secret
material.

## Validation

Run:

```bash
npm run production:validate
node scripts/validate-production-readiness.mjs --json
```

The validator checks presence, shape, known stale patterns, and rotation
attestation without printing secret values. A blocked result means launch must
remain blocked.

`--simulate-safe` proves validator logic only. It is not launch evidence and
does not prove real rotation happened.

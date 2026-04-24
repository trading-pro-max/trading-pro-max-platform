# Trading Pro Max Closed Beta Runbook

## Purpose

Run a five-tester controlled beta that proves Trading Pro Max is usable, truthful, and safe without claiming public launch, live execution, real-money routing, billing, notification delivery, broker connectivity, or live market feed activation.

## Cohort

- Target size: 5 testers.
- Required setup: unique tester email, rotated demo password, account session verified.
- Access control: set `TPM_CLOSED_BETA_ALLOWLIST` or `TPM_CLOSED_BETA_ALLOWLIST_EMAILS` to the five tester emails before seeding or issuing credentials.
- Production env contract: follow `docs/ops/production-env.md` before treating the cohort as production-like.
- Staging contract: follow `docs/ops/staging-deployment-checklist.md` before inviting testers to a hosted environment.
- Support lane: operator review through `/api/launch/feedback`.

## Day 0 Setup

1. Assign exactly five initial tester emails.
2. Configure those emails in the closed beta allowlist.
3. Rotate demo and operator credentials.
4. Run `npm run production:validate`.
5. Run `npm run staging:validate` against the staging env.
6. Capture staging `/api/health` and `/api/diagnostics/probes`.
7. Send each tester `docs/beta/beta-user-pack.md`.

## Daily Operator Flow

Local rehearsal may use `npm run production:setup-local` to create the ignored
`.env.production.local` file. Replace blockers with real values before treating
the cohort as production-like.

1. Run `npm run build`.
2. Run `npm run prisma:validate`.
3. Run `npm run production:validate`.
   - A blocked result means production blockers remain.
   - Do not treat the cohort as production-ready until the blockers are cleared with real external values.
   - `--simulate-safe` is only a validator logic check, not launch evidence.
4. Run `npm run staging:validate`.
5. Run `npm run smoke:routes -- --with-api` for local route confidence.
6. Start with `npm start`.
7. Check `/api/health`.
8. Check `/api/diagnostics/probes`.
9. Confirm these are still blocked or inactive:
   - live execution
   - real-money routing
   - broker live order route
   - external live feed activation
   - billing and checkout
   - notification delivery
   - public launch

## Tester Session Script

1. Sign in through the settings page.
2. Open `/en`.
3. Review public truth labels from `/`.
4. Confirm account/session state and sign-out behavior.
5. Read chart and market state from the workstation.
6. Place paper-only rehearsal actions only.
7. Confirm live execution and real-money routing remain blocked.
8. Change workspace preferences.
9. Visit `/en/settings` and `/diagnostics`.
10. Submit feedback through the authenticated launch feedback API or operator-provided intake.

## Operator Checks

- `/api/account/preferences` returns `401` while signed out.
- `/api/launch/operations` returns `401` while signed out.
- `/api/broker/state` reports `realRouting: blocked`.
- `/api/market/feed-state` reports `policyMode: fallback_first`.
- `/api/commercial/catalog` reports billing inactive.
- `/api/intelligence/operator-assist` reports no predictive guarantee and no execution authority.
- `/api/health` reports the real `productionDeployment` and monitoring state.

## Incident Rules

- Stop the session if `/api/health` is not `ready`.
- Stop the session if broker or feed routes claim live activation.
- Stop the session if any route implies billing, subscription activation, public launch, or real-money access.
- Capture `/api/diagnostics/probes`, `/api/ops/hardening`, and `/api/ops/recovery` before any manual recovery.

## Closeout

- Export or copy feedback IDs, categories, severity, and lifecycle state.
- Mark each feedback item as submitted, triaged, hardening in progress, resolved, or deferred.
- Record unresolved blockers in the next beta day notes.

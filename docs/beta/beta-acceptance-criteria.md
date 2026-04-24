# Trading Pro Max Beta Acceptance Criteria

## Closed Beta Can Start When

- `npm run build` passes.
- `npm run prisma:validate` passes.
- `npm run smoke:routes -- --with-api` passes.
- `npm run production:validate` passes with real production-like values or remains explicitly blocked for local-only rehearsal.
- `npm run staging:validate` passes before testers use a hosted staging environment.
- `/api/health` returns ready with truthful blocked/fallback/unconfigured states.
- Five tester emails are allowlisted.
- Demo credentials are rotated away from local defaults.
- Operator feedback triage owner is assigned.

## Product Acceptance

- `/` renders public product entry.
- `/en` renders workstation.
- `/en/settings` renders settings and login/session/logout.
- `/diagnostics` renders route and subsystem truth.
- Protected APIs return `401` while signed out.

## Safety Acceptance

- Live execution remains blocked.
- Real-money routing remains blocked.
- Broker state reports real routing blocked.
- Feed state reports fallback-first policy.
- Compliance state reports real-money safety blocked.
- Billing and checkout remain inactive.
- Notification delivery remains unconfigured.

## Beta Operations Acceptance

- Feedback can be submitted and triaged.
- Each of the five testers completes first entry, login/logout, workstation, paper-only truth, blocked live execution truth, feedback, settings, diagnostics, and readiness/health checks.
- Runbook actions are documented.
- Recovery route explains manual rollback/recovery.
- Production deployment blockers are machine-readable.
- No tester participation is claimed until the operator records real tester completion evidence.

## Not Accepted

The beta is not accepted if any of these occur:

- public launch is claimed
- real-money execution is possible
- live broker routing is possible
- live feed is falsely labeled as active
- billing appears active
- notification delivery appears active
- auth guard is weakened

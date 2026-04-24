# Trading Pro Max Public Launch Readiness

## Current Truth

Public launch has not happened. The app must stay in `not_launched` truth state
until an operator performs a final manual release after every prerequisite is
real, verified, and documented.

## Final Go-Live Prerequisites

- Production env validation passes with real secrets and deployment values.
- Staging deployment validation passes against a real staging host.
- Closed beta with five testers is accepted.
- Soft launch readiness is accepted and all blockers are closed.
- External monitoring is configured and verified.
- Support and incident owners are assigned.
- Rollback plan and database recovery checkpoint are available.
- Legal/risk disclosures are approved for the public audience.
- Billing remains inactive unless a real billing launch has a separate
  verified release plan.
- Broker/feed live activation remains guarded unless a real provider pilot has
  separate explicit approval.

## Public Go-Live Checklist

1. Capture `npm run production:validate -- --json`.
2. Capture `npm run staging:validate -- --json`.
3. Capture route smoke for `/`, `/en`, `/en/settings`, `/diagnostics`, and the
   core API routes.
4. Capture `/api/health` and `/api/diagnostics/probes`.
5. Confirm `/api/launch/operations` and `/api/launch/public-go-live` require
   authentication and operator authority.
6. Confirm feedback, hardening, recovery, and runbook routes are reachable by
   authenticated operators.
7. Confirm public copy does not claim live execution, live broker routing, live
   feed activation, billing, notifications, or public launch before release.
8. Obtain explicit operator release approval.

## Authority

Public launch authority is manual operator release only. Automated scripts,
simulated validation, local demos, and successful builds do not constitute
public launch approval.

## Hard Blockers

- Any production or staging validator blocker.
- Failed closed beta or soft launch criteria.
- Missing monitoring or support escalation coverage.
- Unresolved critical or high safety feedback.
- Any secret exposure.
- Any live-money or live-execution pathway.
- Any fake billing, notification, broker, feed, or public launch claim.

## Runtime Truth

Until the final gate is manually released, public launch remains
`not_launched`, access remains guarded, billing remains inactive, live
execution remains blocked, real-money routing remains blocked, and provider
activation remains guarded.

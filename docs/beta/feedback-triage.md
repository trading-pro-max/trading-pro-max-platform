# Trading Pro Max Feedback Triage

## Intake Fields

- Category: critical bug, UX confusion, visual issue, performance issue, trust-state confusion, auth/session issue, workflow issue, compliance, documentation.
- Severity: low, medium, high, critical.
- Route or API.
- Reproduction steps.
- Expected result.
- Actual result.
- Safety impact.

## Severity Guide

- Critical: implies or enables live-money use, exposes secrets, weakens auth, or breaks protected routes.
- High: blocks sign-in, workstation rendering, settings, diagnostics, market fallback, or feedback loop.
- Medium: confusing copy, missing state detail, persistence issue, incomplete diagnostic wording.
- Low: polish, wording, non-blocking ergonomics.

## Lifecycle

- Submitted: tester report received.
- Triaged: operator assigned severity and owner.
- Hardening in progress: fix or doc update is underway.
- Resolved: verified with a build or route check.
- Deferred: valid but outside controlled-beta scope.

## Daily Triage Routine

1. Review new feedback.
2. Reproduce high and critical items first.
3. Check related route truth in `/api/diagnostics/probes`.
4. Link safety issues to `/api/ops/recovery`.
5. Convert accepted feedback into a hardening item with owner, category, and verification command.
6. Do not mark resolved until the relevant verification command or route check passes.

## Hardening Decisions

- Critical bug: stop the cohort until fixed or formally deferred as non-reproducible.
- UX confusion: update copy, docs, or flow only if it clarifies existing truth without redesigning the product.
- Visual issue: fix layout or readability when it interferes with trust or task completion.
- Performance issue: capture route, browser, timing, and whether degradation is visible in health/diagnostics.
- Trust-state confusion: treat as high severity if the user believes real money, live broker routing, billing, or public launch is active.
- Auth/session issue: verify login, logout, protected API status, and session persistence.
- Workflow issue: reproduce in the workstation, settings, diagnostics, and feedback routes before changing behavior.

## Stop Or Rollback Criteria

Pause beta, soft launch, or wider admission if any critical safety issue appears,
if protected APIs become accessible while signed out, if `/api/health` fails, if
monitoring is unavailable during hosted testing, or if testers cannot tell that
live execution and real-money routing are blocked.

## Escalation

Escalate immediately if feedback says or implies:

- real-money trading became possible
- live execution became possible
- broker route accepted a live activation
- live feed was falsely labeled
- billing or checkout appeared active
- public launch was claimed
- protected route was accessible while signed out

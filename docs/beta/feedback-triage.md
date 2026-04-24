# Trading Pro Max Feedback Triage

## Intake Fields

- Category: usability, trust, bug, performance, compliance, documentation.
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
5. Do not mark resolved until the relevant verification command or route check passes.

## Escalation

Escalate immediately if feedback says or implies:

- real-money trading became possible
- live execution became possible
- broker route accepted a live activation
- live feed was falsely labeled
- billing or checkout appeared active
- public launch was claimed
- protected route was accessible while signed out

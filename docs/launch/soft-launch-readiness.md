# Trading Pro Max Soft Launch Readiness

## Current Truth

Soft launch is a future limited-rollout gate. It is not active and does not
mean public launch. This document defines the entry criteria and blockers that
must be cleared after closed beta hardening.

## Entry Criteria

- `npm run production:validate` passes with real production values.
- Pre-launch secret rotation is completed and attested.
- `npm run staging:validate` passes with real staging deployment evidence.
- Five-tester closed beta acceptance criteria are met.
- No critical or high feedback items remain open.
- `/api/health` and `/api/diagnostics/probes` show truthful ready or guarded
  states.
- External monitoring is configured and verified.
- Support owner and escalation owner are assigned.
- Rollback checkpoint and recovery route are verified.

## Capacity And Support

- Soft launch accounts are operator-approved only.
- Capacity must stay under the configured `TPM_SOFT_LAUNCH_MAX_ACCOUNTS`.
- Feedback triage happens daily.
- Critical safety reports stop the rollout immediately.
- Support response targets are 24 hours for normal feedback and same-day for
  high or critical safety concerns.

## Monitoring Requirements

- Monitoring provider, HTTPS endpoint, and key are configured in secrets.
- `/api/health` reports monitoring truthfully.
- Operator captures baseline health, diagnostics, hardening, and recovery
  snapshots before admission expands.

## Launch Blockers

- Production env validation blocked.
- Secret rotation attestation missing or any known stale secret pattern present.
- Staging validation blocked.
- Closed beta acceptance incomplete.
- Any critical or high unresolved feedback.
- Monitoring unconfigured.
- Billing or checkout appears active without a real commercial release path.
- Broker/feed live activation is claimed without real guarded configuration.
- Live execution or real-money routing becomes possible.

## Rollback Criteria

Rollback soft launch if any hard blocker appears, protected APIs become
unguarded, health becomes failed, feedback shows trust-state confusion about
real-money capability, or operator support cannot meet the response target.

## Truth Constraints

Soft launch may use limited visibility and manual account admission only. It
must still report public launch as `not_launched`, billing as inactive, live
execution as blocked, and real-money routing as blocked.

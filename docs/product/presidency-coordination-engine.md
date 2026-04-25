# Presidency Coordination Engine

The Presidency Coordination Engine is the deterministic routing brain for cross-ministry work. It is internal architecture and readiness only. It does not execute approvals, publish externally, launch production, activate billing, connect broker/feed, or enable live/real-money trading.

## Runtime

- `lib/server/planet-os/coordination.ts`
- `lib/server/planet-os/messages.ts`
- `lib/server/planet-os/workflows.ts`
- `/api/planet/coordination`
- `/api/founder/coordination/readiness`

## Decision Outcomes

- auto_route
- review_required
- legal_review_required
- guardian_review_required
- treasury_review_required
- engineering_review_required
- founder_approval_required
- constitutional_review_required
- blocked
- archived

## Routing Rules

Every request carries source ministry, target ministry, source state, target state, type, priority, risk level, automation level, requested action, product truth, safety boundary, and review requirements.

The engine identifies whether Legal, Guardian, Treasury, Engineering, Constitutional Council, Legislative Council, Executive Council, or Founder Command must review the request.

## Hard Blocks

The engine blocks live execution activation, real-money routing, broker/feed activation, billing activation, social publishing, public launch claims, fake VIP claims, fake Islamic/Sharia certification, performance-fee activation, uncontracted company/brand use, guaranteed profit, and win-rate claims.

Founder approval cannot override hard blocks without remediation.

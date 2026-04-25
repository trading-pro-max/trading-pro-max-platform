# Founder Presidency / Central Coordination System

The Founder Presidency / Central Coordination System is the internal routing layer between ministries, states, councils, and Founder Command.

Ministries may operate internally within their scope. Cross-ministry requests must pass through Presidency Coordination so the product does not grow through untracked side channels.

## Responsibilities

- receive cross-ministry requests
- classify risk and priority
- route Legal, Guardian, Treasury, Engineering, and Founder reviews
- prevent unsafe shortcuts
- keep a message ledger
- report unresolved blockers upward to Founder Command

## Current Truth

- architecture/contracts only
- no autonomous workflow execution
- no launch workflow activation
- no production deployment
- no billing activation
- no broker/feed activation
- no social publishing

## Runtime Contract

The deterministic readiness model lives in:

- `lib/server/planet-os/coordination.ts`
- `lib/server/planet-os/messages.ts`
- `lib/server/planet-os/workflows.ts`
- `/api/planet/coordination`
- `/api/founder/coordination/readiness`

## Decision Engine

The Presidency Coordination System classifies every cross-ministry request as auto_route, review_required, legal_review_required, guardian_review_required, treasury_review_required, engineering_review_required, founder_approval_required, constitutional_review_required, blocked, or archived.

It returns required reviewers, blocked reasons, safe next step, Founder visibility, user visibility, future audit requirement, product truth impact, and council requirements.

## Council Integration

- Constitutional Council blocks fake claims, critical activation attempts, and constitutional violations.
- Legislative Council drafts internal policy when a ministry requests new operating law.
- Executive Council coordinates implementation only after policy is accepted.

No council may activate production, billing, broker/feed, live execution, real money, public launch, social publishing, fake VIP access, fake certification, or uncontracted brand/company usage.

# Founder Daily Briefing

The Founder Daily Briefing is a future private Founder Command App summary. It is not a public report and must not include fake metrics.

## Briefing Order

1. Planet status
2. Top 5 risks
3. Ministries operating normally
4. Ministries blocked/degraded
5. Guardian alerts
6. Legal warnings
7. Media pending approvals
8. Engineering tasks
9. Citizen/user feedback
10. Pro/VIP readiness
11. Visual/product acceptance
12. Production/secret blockers
13. Recommended decisions
14. What not to do today

## What Not To Do Today

The briefing must explicitly call out forbidden shortcuts when relevant:

- do not launch early
- do not claim billing
- do not claim broker/feed activation
- do not expose secrets
- do not override Guardian/Legal critical blocks
- do not turn planned systems into active claims

## Runtime Briefing Fields

The current Founder briefing snapshot includes:

- overall Planet OS status
- top risks
- operating ministries
- blocked/degraded ministries
- approvals needed
- Guardian alerts
- Legal warnings
- Media queue readiness
- Engineering tasks
- Product gaps
- Pro/VIP readiness
- next safe actions
- what not to do today

The briefing is generated from deterministic readiness state only. It does not include fake users, fake revenue, fake followers, or real private metrics.

## Current Runtime Source

The current command foundation builds this briefing from:

- `lib/server/planet-os/state.ts`
- `lib/server/founder-command/reporting.ts`
- `lib/server/founder-command/room.ts`

The reusable UI surface `FounderCommandRoom` renders the briefing as a private command panel only. It is not mounted as a public route.

## Companion Briefing Feed

The Founder Personal Companion can consume the daily briefing and produce a short priority summary. The summary is advisory only and cannot approve, publish, launch, bill, expose secrets, activate broker/feed, enable live execution, or enable real money.

## Living Experience Activation

The Founder Command component now renders priority briefing, next safe decisions, and Guardian/Legal warnings together. This makes the internal command foundation more actionable while preserving the read-only contract.

Still not present:

- owner device authentication
- private desktop/mobile command app shell
- audited approval execution
- step-up confirmation
- real production controls

## Self-Governance Deepening

The briefing now includes opportunity summaries, ministries needing attention, visual gaps, user-facing risks, treasury readiness, and engineering priority suggestions. This improves next-action intelligence without creating any approval execution surface.

## Earth Hierarchy Briefing Inputs

The daily briefing may summarize hierarchy health, council warnings, cross-ministry blockers, resource protection status, 40-ministry readiness, and workflows waiting on Presidency Coordination. It must still avoid fake users, fake revenue, fake public launch, fake billing, fake broker/feed, fake live execution, and fake production state.

## Plan Layer Briefing

The daily briefing may include plan readiness: Demo / Free active paper layer, Pro planned, VIP planned, Enterprise future, Founder Command owner-only, billing inactive, and performance-fee hidden/inactive.

The briefing must not invent plan distribution counts, conversion metrics, revenue, paid users, or VIP activation.

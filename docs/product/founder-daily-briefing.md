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

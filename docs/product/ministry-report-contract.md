# Ministry Report Contract

Every ministry/state report sent to the Founder Command Room must use a consistent truth-first contract.

## Required Fields

| Field | Meaning |
| --- | --- |
| ministryId | stable id |
| ministryName | display name |
| leaderTitle | minister/governor/lead role |
| status | ready, operating, degraded, blocked, or planned |
| confidence | high, medium, or low |
| riskLevel | low, medium, high, or critical |
| automationLevel | auto, review, founder_approval, or blocked |
| summary | concise truth summary |
| keyMetrics | non-sensitive local metrics or readiness facts |
| activeWork | current work in progress |
| blockers | blockers that prevent progress |
| incidents | active or recent incidents |
| pendingApprovals | items needing review/Founder decision |
| guardianFlags | Guardian risks |
| legalFlags | Legal risks |
| engineeringFlags | engineering/test risks |
| citizenImpact | user/citizen effect |
| revenueImpactLater | future impact only, no fake revenue |
| nextActions | safe next actions |
| founderDecisionNeeded | true/false |
| productTruth | live execution, real-money, billing, public launch, social publishing, and secrets truth |
| reportDestination | Founder Command Room |
| lastUpdated | ISO timestamp |
| reportCadence | daily, weekly, event-driven, or manual |

## Status Values

- ready: contract or surface is ready in current scope
- operating: functioning in current scope
- degraded: available but limited
- blocked: cannot proceed until blocker clears
- planned: future concept only

## Truth Rules

- no secrets
- no fake users
- no fake revenue
- no fake monitoring
- no fake launch
- no fake legal certification
- no hidden live execution

## Runtime Contract

`lib/server/planet-os/types.ts` defines the executable contract and `lib/server/planet-os/state.ts` emits deterministic reports for all 40 ministries. `app/api/planet/status` exposes the aggregate snapshot for diagnostics and internal readiness visibility.

The route is safe to inspect because it contains no secrets, private account data, revenue numbers, follower counts, or activation credentials.

## Earth Hierarchy Report Fields

Earth-like reports may include `reportDestination` and `hierarchyPath` so each report can show City -> Ministry -> State Governor -> Continent Governor -> Presidency Coordination -> Founder Command Room.

Reports include status, risks, blockers, resources, requests, approvals needed, Legal flags, Guardian flags, Engineering flags, citizen impact, and next actions. They do not create real staff accounts or operational execution.

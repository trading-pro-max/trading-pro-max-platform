# AI Build Planner

The AI Build Planner classifies future product work and recommends safe implementation order.

Runtime source:

- `lib/server/build-planner/types.ts`
- `lib/server/build-planner/planner.ts`

It describes:

- current product area
- completion status
- blockers
- next safe tasks
- task risk
- suggested validation
- dependency order
- what not to touch
- task domain

Domains:

- visual
- UX
- backend
- docs
- safety
- monetization
- planet-os
- founder-command
- launch-forbidden

This is not an autonomous code executor. It does not deploy, touch secrets, activate production, publish externally, or enable live trading.

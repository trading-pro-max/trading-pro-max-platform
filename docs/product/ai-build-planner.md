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
- companion
- media
- launch-forbidden
- secret-forbidden
- live-forbidden

This is not an autonomous code executor. It does not deploy, touch secrets, activate production, publish externally, or enable live trading.

The readiness snapshot recommends safe future areas such as chart/workstation polish, Companion UI, Founder command private app shell, plan entitlement UX, state explanations, journal/coach foundation, and community architecture. It blocks launch, production, secrets, live execution, billing, broker/feed, and social publishing tasks unless explicitly allowed in a future scope.

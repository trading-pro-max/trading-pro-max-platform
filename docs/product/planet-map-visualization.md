# Planet Map Visualization

The Planet Map is a serious Earth-like command visualization for TPM Planet OS. It is not a game map, fantasy surface, or public admin dashboard.

## Founder View

Founder Command may use the full map to inspect:

- continents
- states
- ministries
- resources
- risks
- approval readiness
- Guardian and Legal signals
- Treasury and Media readiness

The Founder view is owner-only and read-only until private authentication, device trust, step-up confirmation, and audit-backed actions exist.

## User View

Normal users may only see a simplified plan-appropriate planet layer:

- Demo / Free: paper-safe trading, basic Companion, Academy, Journal, and blocked-state explanations
- Pro: planned deeper guidance and workspace tools
- VIP: planned VIP Brain, advanced coaching, private rooms, and reports
- Enterprise: future team/admin layer

Founder Command, private ministries, Treasury controls, internal risks, and approval queues are hidden from users.

## Visual Rules

- black / graphite / gold for command surfaces
- subtle Swiss red accent
- compact Earth geometry and orbit lines
- no fake activity counters
- no fake users, revenue, or metrics
- no heavy animation
- reduced motion must be respected

## Current Implementation

The reusable UI foundation lives in:

- `modules/planet-map/components/PlanetMapPreview.tsx`
- `modules/planet-map/components/PlanetContinentStatusGrid.tsx`
- `modules/planet-map/components/PlanetResourceLayerSummary.tsx`

It is readiness visualization only. It does not expose live state, production state, private data, or Founder controls.

# State / Error / Blocked Engine

The State / Error / Blocked Engine explains every unavailable or degraded product state with premium, compact, truthful copy.

Runtime source:

- `lib/server/state-explanations/types.ts`
- `lib/server/state-explanations/engine.ts`

Covered states:

- loading
- empty
- auth required
- no access
- blocked
- fallback
- degraded
- not configured
- coming later
- protected route
- invalid input
- session expired
- feedback failed
- execution blocked
- live disabled
- broker unavailable
- feed fallback
- billing inactive
- VIP locked
- Islamic review required
- launch not active
- real money blocked
- social publishing inactive
- Founder Command private

Each explanation includes:

- title
- short message
- reason
- safe next step
- severity
- who can resolve it
- user-facing copy
- internal copy

The engine blocks raw JSON-feeling errors, fake unlocks, and scary unexplained states.

The explanations may be surfaced in diagnostics/settings, but the workstation should remain compact and chart-focused.

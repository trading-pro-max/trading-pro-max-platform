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
- private command unavailable
- Institutional future

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

## Living Experience Surface

Current UI surfaces:

- the execution ticket includes a compact "Why live is blocked" disclosure
- diagnostics shows highlighted blocked-state explanation cards and safe next steps
- the TPM Assistant panel reuses the explanations for live, real money, broker, plan, and account-type states

The surface is intentionally compact. It should clarify without turning the workstation into an admin dashboard.

## Self-Governance Deepening

State explanations now distinguish cause families: plan, auth, safety, review, broker, feed, billing, launch, production, private access, and future scope.

This allows TPM Assistant, Diagnostics, and private reporting surfaces to explain not only that something is blocked, but who can resolve it and what real condition would be required.

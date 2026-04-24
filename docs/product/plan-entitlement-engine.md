# Plan Entitlement Engine

The Plan Entitlement Engine defines what each plan may show, lock, hide, or mark as future.

Runtime source:

- `lib/plans/types.ts`
- `lib/plans/entitlements.ts`

Plans:

- Demo / Free: active paper-safe plan
- Pro: planned and locked
- VIP: planned and locked
- Enterprise: future planned

Feature groups:

- assistant
- journal
- coach
- alerts
- workspace memory
- decision replay
- performance dashboard
- community
- VIP private rooms
- academy
- reports
- desktop/mobile capabilities
- media/content tools
- founder command access

Rules:

- Founder Command access is owner-only and never part of user plans.
- Billing is inactive.
- Paid access is not enabled.
- VIP is not active without real entitlement.
- Performance-fee tools remain hidden/inactive.
- No plan unlocks live execution or real-money routing.

## Operational Expansion

The entitlement snapshot now feeds Companion Context and diagnostics readiness. Demo / Free remains the active paper-safe plan. Pro and VIP remain planned/locked. Enterprise remains future planned. Founder Command remains owner-only and is never part of a user plan.

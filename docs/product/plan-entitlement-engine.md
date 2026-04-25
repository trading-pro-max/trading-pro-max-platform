# Plan Entitlement Engine

The Plan Entitlement Engine defines what each plan may show, lock, hide, or mark as future.

Runtime source:

- `lib/plans/types.ts`
- `lib/plans/entitlements.ts`

Plans:

- Demo / Free: active familiar premium paper-safe plan
- Pro: planned and locked professional workspace
- VIP: planned and locked elite living planet layer
- Enterprise: future planned team/admin layer

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

## Plan-Based Interface Architecture

The entitlement engine now works with `lib/plans/interface-architecture.ts`.

Interface rules:

- Demo / Free must feel like a familiar premium trading platform with moderate TPM advantages.
- Pro is the first deeper differentiation layer and remains planned/locked unless entitlement exists.
- VIP is the elite living planet layer and remains planned/locked unless entitlement exists.
- Enterprise remains future.
- Founder Command is owner-only and not shown as a user-plan capability.

## Living Experience Surface

The settings surface now includes compact Plan Experience cards for Demo / Free, Pro, VIP, and Enterprise. These cards show:

- current plan truth
- assistant identity
- active Demo capabilities
- locked or coming-later capabilities
- inactive billing and paid access truth
- plan interface identity and user-safe layer truth

The cards are visual and explanatory only. They do not create checkout, paid activation, VIP entitlement, Enterprise sales, performance fees, live execution, broker/feed activation, or real-money routing.

## Planet Layer Access

The entitlement snapshot now includes `citizenAccess` with:

- currentClass
- currentLayer
- all plan/citizen layers
- Founder Command user-visible truth: false
- performance-fee user-visible truth: false

This allows Companion, settings, diagnostics, and Founder summaries to explain what layer of the TPM Planet the current user can access without faking paid activation.

# Plan Entitlement Engine

The Plan Entitlement Engine defines plan capabilities, public labels, locked states, and safety boundaries without enabling billing or paid access.

## Public Plans

- Free: active familiar premium paper-safe plan
- Pro: planned and locked professional workspace
- VIP: planned and locked elite premium workspace layer
- Institutional: future planned team/admin layer

The internal `enterprise` ID may remain in code for compatibility, but public UI must expose Institutional.

## Truth Rules

- Billing is inactive.
- Paid access is not enabled.
- Pro and VIP are planned/locked unless real entitlement exists.
- Institutional is future planned.
- Owner command access is owner-only and never part of user plans.
- Performance-fee research is hidden/inactive and not user-facing.
- Live execution, real money, broker/feed activation, social publishing, and public launch remain blocked/inactive.

## Runtime Surfaces

The entitlement snapshot feeds Assistant Context, settings, diagnostics, and plan cards. Free remains the active paper-safe plan. Pro and VIP remain planned/locked. Institutional remains future planned. Owner command remains private and is never part of a user plan.

The settings surface includes compact Plan Experience cards for Free, Pro, VIP, and Institutional. These cards show:
- current truth state
- active capabilities
- locked/planned capabilities
- visual identity
- safety rules
- no billing activation

The cards are visual and explanatory only. They do not create checkout, paid activation, VIP entitlement, Institutional sales, performance fees, live execution, broker/feed activation, or real-money routing.

## Access Model

The entitlement snapshot includes plan access with:
- current plan class
- active workspace layer
- visible product surfaces
- locked features
- planned features
- hidden owner-only features
- owner command user-visible truth: false
- performance fee user-visible truth: false

This allows Assistant, settings, and diagnostics to explain what the current user can access without exposing internal command language or faking paid activation.

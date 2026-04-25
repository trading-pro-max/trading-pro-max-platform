# Plan-Based Interface Architecture

Trading Pro Max uses plan-based interface depth so the product stays clean for Free / Demo users while Pro, VIP, Enterprise, and Founder layers carry progressively deeper capability.

This is an interface architecture, not billing activation. It does not enable live execution, broker/feed activation, subscriptions, public launch, real-money routing, social publishing, or premium entitlement.

## Free / Demo

Status: active.

Interface promise:
- familiar premium trading platform
- chart-first workstation
- simple watchlist
- paper execution only
- basic Companion
- basic Why Blocked
- basic Academy
- Swiss Precision Clock / Pulse

Free / Demo should feel close to a serious trading terminal with moderate TPM advantages. It should not expose deep Planet OS administration, ministries, councils, treasury controls, VIP Brain, premium reports, private rooms, or Founder Command.

## Pro

Status: planned / locked unless real entitlement exists.

Interface promise:
- intelligent professional trading workspace
- stronger Companion
- deeper Journal / Coach
- decision replay
- workspace memory
- alerts and workflows
- Pro community later

Pro may be described as future product value, but not as active paid access. No checkout, billing, entitlement, signal guarantee, or better-outcome claim is active.

## VIP

Status: planned / locked unless real entitlement exists.

Interface promise:
- elite living planet layer
- VIP Brain
- advanced Companion
- advanced coaching
- advanced journal analytics
- strategy review
- premium reports
- VIP private rooms

VIP must never imply guaranteed profit, win rate, priority signals, copy trading, financial advice, or active private-room access.

## Enterprise

Status: future planned.

Interface promise:
- team/admin layer
- audit and compliance readiness
- enterprise command surfaces
- runbooks
- custom support later

Enterprise is not active and must not claim legal certification, team administration, or compliance completion.

## Founder

Founder King is not a user plan.

Founder Command remains:
- owner-only
- private
- hidden from public navigation
- separate from Free / Pro / VIP / Enterprise
- read-only by default until audited action gates exist

No user plan may present Founder Command as an upgrade, feature, entitlement, or public route.

## Runtime Sources

- `lib/plans/interface-architecture.ts`
- `lib/plans/entitlements.ts`
- `lib/plans/visual-identity.ts`
- `lib/plans/value-map.ts`
- `modules/plans/components/PlanInterfaceSummary.tsx`

## Product Truth

The plan interface architecture preserves:
- billing inactive
- paid access not enabled
- Pro planned, not active
- VIP planned, not active
- Enterprise future
- live execution blocked
- real-money routing blocked
- broker/feed guarded or unconfigured
- public launch inactive
- Founder Command owner-only

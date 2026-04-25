# Plan-Based Interface Architecture

Trading Pro Max uses plan-based interface depth so Free users get a clean trading product while Pro, VIP, Institutional, and owner-only internal layers carry progressively deeper capability.

This is interface architecture, not billing activation. It does not enable live execution, broker/feed activation, subscriptions, public launch, real-money routing, social publishing, or premium entitlement.

## Public Naming Rule

Public/user-facing plan names are:
- Free
- Pro
- VIP
- Institutional

The internal `enterprise` identifier may remain for compatibility, but normal user-facing UI must say Institutional. Founder/internal operating-system terminology is private and must not appear as a normal user plan feature.

## Free

Status: active.

Interface promise:
- familiar premium trading platform
- chart-first workstation
- simple watchlist
- paper execution only
- basic Assistant
- basic Why Blocked
- basic Academy
- Swiss Precision Clock / Pulse

Free should feel close to a serious trading terminal with moderate TPM advantages. It should not expose internal governance, owner controls, VIP Brain, premium reports, private rooms, or owner command tools.

## Pro

Status: planned / locked unless real entitlement exists.

Interface promise:
- intelligent professional trading workspace
- stronger Assistant
- deeper Journal / Coach
- decision replay
- workspace memory
- alerts and workflows
- Pro community later

Pro may be described as future product value, but not as active paid access. No checkout, billing, entitlement, signal guarantee, or better-outcome claim is active.

## VIP

Status: planned / locked unless real entitlement exists.

Interface promise:
- elite premium workspace layer
- VIP Brain
- advanced Assistant
- advanced coaching
- advanced journal analytics
- strategy review
- premium reports
- VIP private rooms

VIP must never imply guaranteed profit, win rate, priority signals, copy trading, financial advice, or active private-room access.

## Institutional

Status: future planned.

Interface promise:
- team/admin layer
- audit and compliance readiness
- institutional support surfaces
- runbooks
- custom support later

Institutional is not active and must not claim legal certification, team administration, or compliance completion.

## Owner-Only Internal Command

Owner command is not a user plan.

Owner command tools remain:
- owner-only
- private
- hidden from public navigation
- separate from Free / Pro / VIP / Institutional
- read-only by default until audited action gates exist

No user plan may present owner command tools as an upgrade, feature, entitlement, or public route.

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
- Institutional future
- live execution blocked
- real-money routing blocked
- broker/feed guarded or unconfigured
- public launch inactive
- owner command owner-only

# Why Blocked Engine

The Why Blocked Engine is the product contract for explaining unavailable actions. Every blocked state should feel intentional, understandable, and safe.

## Explanation Shape

Each blocked action should explain:

1. what is blocked
2. why it is blocked
3. who can access it, if anyone
4. whether authentication is required
5. whether a plan is required
6. whether broker, feed, billing, monitoring, or launch configuration is missing
7. which safety gate applies
8. the safe next step

## Required Coverage

| Area | Default Explanation |
| --- | --- |
| live execution | blocked until future configured gates, broker readiness, policy checks, and private approval |
| real money | blocked by default; no real-money routing without explicit future release |
| broker | not connected unless credentials, sandbox/live mode, policy gates, audit, and release are configured |
| feed | fallback remains authoritative unless live provider is genuinely configured |
| billing | inactive until provider, policies, checkout, support, and Legal review are complete |
| VIP features | planned or unavailable unless entitlement exists |
| Islamic status | not certified by default; review and certification required for claims |
| public launch | not launched until production, staging, beta, soft launch, monitoring, support, and Founder authority pass |
| monitoring | unconfigured unless external provider and endpoint are set |
| protected routes | authentication required |
| assistant capability | limited by plan, safety, Legal, and Guardian boundaries |
| social publishing | inactive until real accounts, tokens, review, and private approval exist |
| private command | private command foundation, never a public plan feature |

## Safe Next Step Examples

- sign in
- use paper mode
- review diagnostics
- submit feedback
- configure settings
- wait for operator review
- request private approval review
- consult Legal Counsel for wording

## Anti-Confusion Rule

The user should never have to inspect an API response to understand why a product action is unavailable.

## Coverage

The Why Blocked engine must cover Assistant capabilities, private command access, media publishing, Pro/VIP features, Institutional future status, Islamic status, public launch, monitoring, protected routes, billing, broker/feed, live execution, and real money.

## Runtime Surface

The first runtime surface is now available through reusable state explanation components:

- `WhyBlockedHint`
- `StateExplanationCard`
- `SafeNextStepList`

These components may appear in the execution ticket, Diagnostics, Settings, and TPM Assistant panel. They must stay compact and must not imply that a blocked state can be bypassed from the UI.

## Deep Explanation Contract

Each explanation now includes blocker type, required condition to unblock, who can unblock, and whether the state is hidden, planned, blocked, review-required, not configured, or not certified.

Coverage includes Pro/VIP locks, broker activation, live feed, media publishing, AI video publishing, Islamic certification, social accounts, performance-fee visibility, and restricted assistant intents.

## Plan-Based Blocking

Plan-based blocked states should explain whether the cause is entitlement, billing, safety, review, broker/feed, launch, production, or private access.

Private command copy must always say separate/private and never a user plan. Pro/VIP copy must say planned or locked without implying checkout or paid activation. Institutional copy must say future.

## TPM Assistant Integration

TPM Assistant consumes the Why Blocked engine for simple public explanations:

- live disabled
- real money blocked
- broker unavailable
- feed fallback
- billing inactive
- Pro planned/locked
- VIP planned/locked
- Institutional future
- Islamic/Sharia not certified
- public launch inactive
- social publishing inactive
- restricted controls separate/private

Assistant responses must use public product language and avoid internal governance detail for normal users.

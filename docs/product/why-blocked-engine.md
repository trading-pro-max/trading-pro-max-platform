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
| live execution | blocked until future configured gates, broker readiness, policy checks, and Founder approval |
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
| social publishing | inactive until real accounts, tokens, review, and Founder approval exist |
| Founder Command | private owner-only command foundation, never a public plan feature |

## Safe Next Step Examples

- sign in
- use paper mode
- review diagnostics
- submit feedback
- configure settings
- wait for operator review
- request Founder approval
- consult Legal Counsel for wording

## Anti-Confusion Rule

The user should never have to inspect an API response to understand why a product action is unavailable.

## Planet Earth Coverage

The Why Blocked engine must cover assistant capabilities, Founder Command access, ministry actions, media publishing, Pro/VIP features, Islamic status, public launch, monitoring, protected routes, billing, broker/feed, live execution, and real money.

## Runtime Surface

The first runtime surface is now available through reusable state explanation components:

- `WhyBlockedHint`
- `StateExplanationCard`
- `SafeNextStepList`

These components may appear in the execution ticket, diagnostics, settings, and Companion panel. They must stay compact and must not imply that a blocked state can be bypassed from the UI.

## Deep Explanation Contract

Each explanation now includes blocker type, required condition to unblock, who can unblock, and whether the state is hidden, planned, blocked, review-required, not configured, or not certified.

Coverage includes Pro/VIP locks, broker activation, live feed, media publishing, AI video publishing, Islamic certification, social accounts, performance-fee visibility, and restricted assistant intents.

## Plan-Based Blocking

Plan-based blocked states should explain whether the cause is entitlement, billing, safety, Legal, Guardian, broker/feed, launch, production, or Founder privacy.

Founder Command blocked/private copy must always say owner-only and never a user plan. Pro/VIP copy must say planned or locked without implying checkout or paid activation.

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

# Plan-Based Assistant Tiers

Assistant tiers describe what TPM Assistant may explain for each public plan. They do not activate billing, paid access, broker/feed, live execution, real money, or social publishing.

## Free Assistant

State: active for paper-safe use.

Capabilities:

- explain paper mode, blocked live mode, and fallback states
- guide first-use workspace behavior
- explain basic market context without prediction certainty
- draft feedback for user review
- suggest basic Journal and Coach prompts
- route to Settings and Diagnostics

Limits:

- no premium reports
- no advanced coaching
- no strategy review
- no personalized performance promise
- no paid entitlement claim

## Pro Assistant

State: planned/locked unless real Pro entitlement exists.

Capabilities when entitled:

- richer workspace guidance
- session guidance
- Journal/Coach depth
- decision replay
- workspace memory
- alerts and workflows

Limits:

- no Pro active claim without entitlement
- no prediction certainty
- no win-rate claim
- no live execution bypass
- no VIP-only claim

## VIP Assistant

State: planned/locked unless real VIP entitlement exists.

Capabilities when entitled:

- advanced Assistant
- advanced Journal and Coach
- strategy review
- premium reports
- private rooms

Limits:

- no guaranteed outcomes
- no guaranteed signals
- no fake VIP activation
- no priority support claim unless support exists
- no copy-trading claim unless a future compliant product supports it

## Institutional Assistant

State: future only.

Future capabilities:

- team and admin summaries
- audit and compliance readiness guidance
- runbook support
- institution-grade Diagnostics

Limits:

- no active Institutional availability claim
- no compliance certification claim
- no team admin activation claim

## Intent Boundaries

Allowed intents include platform-state explanation, blocked-state explanation, plan access, account type, Settings, Diagnostics, Feedback, Journal prompts, session summaries, learning help, and upgrade explanation without billing.

Blocked intents include trade execution, live activation, real-money routing, broker/feed activation, secret changes, auth bypass, guaranteed profit, win-rate claims, fake VIP activation, fake billing, and public launch claims.

## Integration

`/api/companion/context` returns the current Assistant tier, plan entitlement truth, Product Truth, blocked intents, Journal/Coach readiness, and safe context. Normal users see professional product language only: Free, Pro, VIP, Institutional, TPM Assistant, Trading Workspace, Journal, Coach, Academy, Community, Plans, Settings, and Diagnostics.

Private command tooling and internal governance terms are not user-plan capabilities and must not appear as upgrades.

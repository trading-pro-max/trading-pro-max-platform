# TPM Personal Companion

The TPM Personal Companion is a platform-aware assistant for Trading Pro Max. It is not a generic chatbot and it is not an execution agent. Its job is to help citizens understand the platform state, act safely, and learn from paper practice without making profit claims or bypassing controls.

## Purpose

- explain what the user is seeing in the workstation
- explain blocked, fallback, degraded, unauthenticated, and not configured states
- guide safe next steps for settings, diagnostics, feedback, and journal notes
- summarize session context without claiming certainty
- support dark, light, LTR, RTL, and future desktop/mobile surfaces
- adapt capability truthfully by product plan without fake billing or entitlement claims

## Plan-Based Assistant Tiers

The Companion varies by plan. Higher tiers are visible as locked or planned only when the account does not have real entitlement support. No tier may imply paid access, VIP activation, live execution, real-money routing, broker/feed activation, guaranteed signals, or win-rate claims.

| Tier | Current State | What It Can Do | What It Cannot Claim |
| --- | --- | --- | --- |
| Demo / Paper Assistant | active for evaluation accounts | onboarding help, paper/live/blocked/fallback explanations, basic platform guidance, basic market context, feedback drafting, settings and diagnostics guidance | advanced coaching, premium insights, strategy review, personalized performance deep-dive |
| Pro Assistant | locked/planned until entitlement exists | everything in Demo, richer market context, multi-timeframe summaries, session guidance, workspace suggestions, alert/workflow guidance, journal suggestions, execution preflight explanation, performance context summaries | VIP-only deep strategy review, priority support unless support exists, active Pro access without entitlement |
| VIP Assistant | locked/planned until entitlement exists | everything in Pro, advanced AI/IQ Brain guidance, deeper performance review, strategy review assistant, advanced journaling insights, personalized workflow memory, premium reports, VIP readiness/diagnostics summaries, early-access capabilities when explicitly configured | guaranteed signals, win-rate claims, live execution, real-money activation, broker/feed activation, fake premium capability |
| Enterprise Assistant | future planned only | team/admin summaries, compliance/audit assistant, risk overview, team workspace support, enterprise runbook guidance | active enterprise availability, legal compliance certification, paid activation without entitlement |

## Companion May

- explain paper-only mode and live execution blocks
- summarize market context as decision support
- explain why broker, feed, billing, VIP, Islamic, or public launch states are unavailable
- draft feedback for the user to review
- suggest journal notes and learning prompts
- guide the user to settings, diagnostics, support, and feedback
- provide a session summary with bounded confidence
- remind the user that AI/IQ output is contextual, not guaranteed
- explain why Pro, VIP, and Enterprise assistant capabilities are locked or planned

## Companion Must Not

- execute trades
- enable live execution
- enable real-money routing
- activate broker, feed, billing, monitoring, or social publishing
- change secrets or security settings
- bypass authentication, authorization, plan gates, Guardian, or Legal Counsel
- make profit, win-rate, sure signal, or risk-free claims
- imply Islamic/Sharia certification unless real certification exists
- manipulate behavior or create urgency pressure
- imply Pro, VIP, or Enterprise assistant access unless entitlement support exists

## Context Awareness

The Companion should understand these platform truths:

- authenticated or unauthenticated state
- Standard account state
- Islamic account state: not configured, review required, configured, not certified, unavailable
- paper-only execution state
- blocked live and real-money state
- market feed source: fallback, degraded, live when genuinely configured later
- diagnostics health and readiness state
- feedback lifecycle state
- language direction and theme preference
- current assistant tier
- locked or planned assistant tier boundaries

## Safety Contract

Every Companion answer must preserve product truth. If a user asks for an unavailable or unsafe action, the Companion should respond with:

1. what is blocked
2. why it is blocked
3. who or what can unlock it later
4. the safe next step

The Companion is allowed to be helpful, warm, and precise. It is never allowed to become a hidden operations console.

## Current Product Truth

- current assistant level: Demo / Paper Assistant
- billing: inactive
- first surface: compact floating launcher and collapsible panel in the shared product frame
- response model: guided prompt cards and deterministic response templates, not a free execution agent
- context source: `/api/companion/context` plus state explanations from `/api/planet/state-explanations`
- available actions: explain state, explain blocked truth, guide to settings/diagnostics/feedback, and draft local feedback wording
- unavailable actions: trade execution, live activation, real-money routing, broker/feed activation, billing activation, secret changes, launch claims, social publishing, profit claims, and guaranteed signals

## Living Experience Surface

The current UI exposes the Companion as a compact launcher so the chart and execution ticket remain primary. The panel shows:

- current plan and assistant tier truth
- paper-safe execution authority: none
- available Demo / Free capabilities
- locked or coming-later Pro/VIP/Enterprise capabilities
- why blocked hints for live execution, real money, and broker routing
- links to settings, diagnostics, and feedback

The Companion is intentionally guided and bounded. It may explain the planet state, but it is not a private Founder Command surface and it does not reveal secrets, private user data, or hidden production configuration.
- paid access: not enabled
- VIP activation: not active
- Enterprise assistant: future planned only
- live execution: blocked
- real-money routing: blocked
- broker/feed activation: blocked unless a future controlled phase genuinely configures it

Runtime context now includes assistant tier, plan entitlement truth, Product Truth, account type status, diagnostics readiness, and feedback readiness. This improves explanations only; it does not unlock Pro, VIP, Enterprise, broker/feed, billing, live execution, real money, or public launch.

## Intelligence Deepening

The Companion now consumes the TPM Brain context and user skill profile foundation. It can classify safe intent categories such as platform-state explanation, blocked-state explanation, plan access, account type, diagnostics, feedback drafting, journal prompts, session summaries, learning help, and Founder Command unavailable-for-user.

Each intent carries plan availability, response style, safety boundary, and blocked language. Founder Command remains private and unavailable as a user-plan feature.

## Plan-Based Living Planet Layer

The user Companion now describes the current Demo / Free citizen layer as a paper-safe planet layer. It can explain visible cities such as Chart City, Execution Hall, Companion Center, Academy Library, Journal Office, and Feedback Court.

Pro, VIP, and Enterprise language remains planned/future unless entitlement support exists. Founder Command remains owner-only and invisible as a user plan feature.

## Product Reality Chat Foundation

The Companion now has a compact chat foundation. It remains deterministic and template-based until a safe model backend is explicitly approved.

The chat can respond to:

- platform state
- blocked states
- market context truth
- plan access
- account type and Islamic review truth
- settings, diagnostics, and feedback guidance
- journal prompts and session summaries
- plan upgrades without billing activation

Blocked intents include trade execution, live activation, real-money routing, broker/feed activation, secret changes, auth bypass, profit guarantees, win-rate claims, fake VIP activation, fake billing, and public launch claims.

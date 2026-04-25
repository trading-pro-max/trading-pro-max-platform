# TPM Assistant

The TPM Assistant is the user-facing, platform-aware assistant for Trading Pro Max. It is not a generic chatbot, not an execution agent, and not a prediction engine.

## Purpose

- explain the Trading Workspace state
- explain blocked, fallback, degraded, unauthenticated, and not configured states
- guide safe next steps for Settings, Diagnostics, Feedback, Journal, and Coach
- summarize paper-session context without claiming certainty
- adapt language by plan without fake billing, Pro, VIP, or Institutional activation
- preserve dark, light, LTR, RTL, desktop, and mobile compatibility

## Plan Tiers

| Tier | Current State | User-Facing Capabilities | Must Not Claim |
| --- | --- | --- | --- |
| Free Assistant | active | paper/live/blocked/fallback explanations, basic workspace guidance, basic market context, feedback drafting, Settings and Diagnostics guidance, basic Journal prompts | premium reports, advanced coaching, strategy review, paid activation |
| Pro Assistant | planned/locked unless entitled | richer workspace guidance, session guidance, Journal/Coach depth, decision replay, alerts, and workflows when real entitlement exists | active Pro access, better outcomes, prediction certainty |
| VIP Assistant | planned/locked unless entitled | advanced Assistant, strategy review, premium reports, advanced Journal/Coach, and private rooms when real entitlement exists | guaranteed signals, win rates, fake premium access |
| Institutional Assistant | future | future team, admin, audit, compliance, runbook, and support guidance | active Institutional availability or compliance certification |

## Allowed Guidance

- explain product truth and plan status
- explain why live, real money, broker/feed, billing, VIP, Institutional, Islamic/Sharia, and launch states are unavailable
- guide the user to Settings, Diagnostics, Feedback, Journal, Coach, and Academy
- draft feedback for user review
- suggest paper-safe learning prompts
- summarize route, theme, language, plan, account type, and readiness context without secrets

## Blocked Guidance

- execute trades or place orders
- enable live execution or real-money routing
- activate broker, feed, billing, launch, social publishing, or secrets
- bypass auth, entitlement, or safety controls
- guarantee profit, win rate, signal certainty, or risk-free outcomes
- imply Islamic/Sharia certification unless real certification exists
- expose private command tooling or internal governance detail to normal users

## Runtime Integration

The Assistant reads from:

- Product Truth
- Plan Entitlements
- State / Error / Blocked explanations
- Journal/Coach readiness
- Settings and Diagnostics context
- account/session and account type truth

The Assistant remains deterministic and template-based until a safe model backend is explicitly approved.

## Current Product Truth

- Free Assistant is active for paper-safe guidance.
- Pro and VIP Assistant depth remains planned/locked unless real entitlement support exists.
- Institutional Assistant remains future only.
- Billing, checkout, paid activation, live execution, real money, broker/feed activation, social publishing, and public launch are inactive or blocked.
- No secrets, broker credentials, tokens, private user data, fake metrics, or execution authority are included.

## User Experience

The current UI exposes TPM Assistant as a compact launcher and collapsible panel so the chart and execution ticket remain primary. It shows plan status, context readiness, authority boundaries, blocked intents, why-blocked hints, and links to Settings, Diagnostics, and Feedback.

The Assistant can be helpful, warm, and precise. It must stay truthful, non-predictive, non-executing, and plan-aware.

## Daily Use Deepening

The Assistant now has a formal daily-use model and intent registry:

- context comes from Product Truth, plan entitlements, Why Blocked explanations, Journal/Coach readiness, Settings, Diagnostics, account/session state, and account type truth
- allowed intents cover platform state, plan access, paper mode, feed fallback, billing inactive, live disabled, real money blocked, Journal, Coach, feedback, Settings, Diagnostics, learning help, and session summary
- blocked intents cover execution, live activation, real money, broker/feed, billing, secrets, auth bypass, profit guarantees, win-rate claims, fake Pro/VIP/Institutional activation, fake launch, social publishing, legal advice, and financial advice
- `/api/companion/context` returns deterministic sample classifications for safety tests

The Assistant remains a daily local-use foundation. It does not execute actions, call an external model, store secrets, publish content, or activate paid/live systems.

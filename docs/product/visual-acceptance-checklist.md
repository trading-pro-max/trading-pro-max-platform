# Visual Acceptance Checklist

This checklist records the visible-product acceptance gate after the brand, UX, and product-state passes. It should be rerun before any beta or launch decision.

Status key:

- pass: current verified baseline meets the standard
- partial: acceptable direction but needs real-world or device evidence
- blocker: must be fixed before launch decision
- requires real-world testing: needs real users/devices/sessions
- out of scope until final launch phase: not part of current frozen launch scope

## Visual Authority

| Area | Acceptance Standard | Status | Notes |
| --- | --- | --- | --- |
| Brand mark and wordmark | Distinct, scalable, premium, not competitor-copied. | pass | Product logo is visible across nav, public entry, workstation, and auth. |
| Public entry | Strong identity, concise path, no clutter, no fake claims. | pass | Dark/light screenshots generated in regression. |
| Workstation | Serious trading surface, chart first, execution second. | pass | Desktop and localized workstation are visually verified. |
| Execution ticket | Clear buy/sell/paper/live/blocked semantics. | pass | Invalid paper amount state is now intentional. |
| Auth/session | Native brand feel, no console workaround. | pass | Login/session/logout screenshots exist. |
| Settings | Product control center, grouped and compact. | pass | Settings screenshot generated. |
| Diagnostics | Operational command surface, no raw JSON feel. | pass | Diagnostics screenshot generated. |
| Feedback | Beta-ready and compact. | pass | Feedback surface screenshot generated. |

## Theme And Direction

| Area | Acceptance Standard | Status | Notes |
| --- | --- | --- | --- |
| Dark theme | Institutional, sharp, readable, restrained glow. | pass | Dark public and workstation screenshots generated. |
| Light theme | Serious, high contrast, not washed out. | pass | Light public and workstation screenshots generated. |
| System theme | Follows user color-scheme preference. | pass | Regression validates system fallback. |
| English LTR | Layout and chart numerics stable. | pass | English LTR workstation screenshot generated. |
| Arabic RTL | Panels align correctly and chart numerics remain stable. | pass | Arabic RTL workstation screenshot generated. |
| Long-language fallback | Missing translations disclose fallback without breaking layout. | pass | German fallback coverage screenshot generated. |

## Product State Design

| State | Acceptance Standard | Status | Notes |
| --- | --- | --- | --- |
| loading | Premium, calm, not blank. | pass | Shared product state notice exists. |
| empty | Intentional, explains what appears later. | pass | Empty state screenshot generated. |
| auth required | Branded and clear. | pass | Auth panel and protected route messaging are intentional. |
| no access / protected route | Does not feel broken or raw. | pass | Protected APIs remain guarded; UI explains session need. |
| blocked | Clear reason and safe next step. | pass | Live and real-money blocks remain compact and explicit. |
| fallback | Honest source labeling. | pass | Market fallback truth is visible. |
| degraded | Explicit and non-scary. | pass | Intelligence and diagnostics surface degraded truth. |
| not configured | Clear inactive truth. | pass | Broker, billing, monitoring, and integrations stay unconfigured unless real. |
| coming later | Planned without fake availability. | pass | Planet/economy docs and UI copy avoid fake activation. |
| error | Actionable, not raw JSON. | pass | Auth/diagnostics errors use premium state notice. |
| recovery | Explains next action. | pass | Diagnostics and auth recovery states are styled. |
| invalid input | Field-level, precise, non-scary. | pass | Invalid ticket amount screenshot generated. |
| offline/reconnect | Token and component state exists. | partial | Needs real offline simulation across browsers/devices. |
| feedback submitted/failed | Token and component state exists. | partial | API is tested; full visible form flow needs real beta use. |
| session expired | Token and component state exists. | partial | Needs forced expiry/browser-session test before launch. |

## Visual Proof Artifacts

Current regression artifact directory: `test-results/visible-product-completion`.

Expected artifacts:

- `dark-public-entry.png`
- `light-public-entry.png`
- `dark-workstation.png`
- `light-workstation.png`
- `english-ltr-workstation.png`
- `arabic-rtl-workstation.png`
- `settings.png`
- `diagnostics.png`
- `login-session-ui.png`
- `feedback-ui.png`
- `empty-state.png`
- `invalid-input-state.png`
- `language-fallback-coverage.png`

## Acceptance Decision

Current visual acceptance status: **pass for local verified baseline**.

Remaining visual evidence required before public launch:

- real mobile device pass
- real tablet pass
- real closed-beta observation
- session-expiry scenario capture
- offline/reconnect scenario capture if offline behavior becomes product-facing

No visual checklist item may override product truth, safety gates, or launch blockers.

# Alkon API Existence Map

Status: founder_private_read_only_with_notes

| API group | Owner | Boundary | Risk | Decision |
| --- | --- | --- | --- | --- |
| `/api/product/truth` and public-safe readiness APIs | Public Pro Max | public-safe read-only | low | allowed |
| `/api/founder/*` | Private Alkon -0 | founder-only read-only | medium if exposed | protect |
| `/api/founder/existence-architecture/*` | Private Alkon -0 | founder-only read-only preview | low | allowed_with_notes |
| account/preference APIs | Invisible Operating Layer | internal state support | medium | protect |
| shell/Codex/payment/live/billing/secrets API pattern | Sensitive / Do Not Commit | forbidden | p0 | black_hole |

Rules:

- No API without boundary.
- No shell execution.
- No Codex execution.
- No payment execution.
- No secrets.
- No public Alkon internals.

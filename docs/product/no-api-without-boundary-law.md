# No API Without Boundary Law

Status: active

Every API route must state whether it is public-safe or Founder-only.

## Public API Rules

Public APIs may return public-safe readiness, market fallback data, Product Truth summaries, diagnostics, and safe Assistant responses. They must not expose Alkon internals, secrets, Founder Command state, bank/card data, raw private data, live execution, real money routing, broker/feed activation, billing activation, production launch controls, shell, Codex execution, or external publishing.

## Founder API Rules

Founder APIs may summarize private Alkon systems for Ahmad. They remain read-only, preview-only, no-execution, no-shell, no-payment, no-billing, no-live, no-broker/feed, no-production, and no-public-exposure unless a separate future authenticated boundary is designed and approved.

Jar APIs, if ever added, must be Founder-only, read-only, preview-only, and no-execution. Public APIs must never reveal Jar System language.

## Tool Boundary

Terminal tools under `scripts/` and `tools/alkon-local-builder/` may use local process APIs for validation and local reports. Web app APIs must not import or expose those execution abilities.

## Evidence

API boundary status is tracked in:

- `reports/alkon-route-api-cohesion.md`
- `reports/alkon-disconnected-items.md`
- `tests/regression/pro-max-alkon-origin-clean-rebirth.spec.ts`

Permission-to-Exist amendment: every API must declare owner, public/private boundary, read/write capability, execution risk, secret risk, payment risk, test coverage, purpose, and next fate. Founder APIs are read-only/preview-only unless explicitly gated by Ahmad.

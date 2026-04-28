# Pro Max Route Cohesion Result

Status: ready_with_notes

Result:

The public route identity is corrected. Pro Max Center is `/`, Pro Max Trading is `/trading`, and `/en` is compatibility only.

Public navigation:

- Home -> `/`
- Trading Workspace -> `/trading`
- Markets -> `/#markets`
- Plans -> `/#plans`
- Apps / Platforms -> `/#apps-platforms`
- Support -> `/#support`
- Sign in -> single compact public shell control

Founder route isolation:

- `/founder/alkon` is private route space.
- `/founder/pocket` is private route space.
- Public navigation does not link either route.
- Public pages do not link `/api/founder/*`.

Evidence:

- `tests/regression/pro-max-alkon-origin-clean-rebirth.spec.ts`
- `tests/regression/pro-max-trading-clean-zero-rebuild.spec.ts`
- `tests/regression/public-header-language-disable-route-repair.spec.ts`
- `scripts/tpm-canonical-routes-smoke.mjs`

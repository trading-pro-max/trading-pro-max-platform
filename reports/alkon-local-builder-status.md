# Alkon Local Builder Status

Status: ready_with_notes

Mode: terminal-only, read-only fallback.

Scripts:

- `alkon:status`
- `alkon:wake`
- `alkon:next`
- `alkon:passport`
- `alkon:audit`

Boundaries:

- Web shell execution: false.
- Codex execution from web app: false.
- External calls: false.
- Secrets visible: false.
- Payments: false.
- Deletion: false.

Validation:

- Local Builder scaffold exists under `tools/alkon-local-builder/`.
- Founder Command receives Local Builder readiness.
- Regression tests verify scaffold and boundaries.

Next: use only from Ahmad's terminal if Codex quota is exhausted.

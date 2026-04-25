# Persistent Product Memory

Persistent Product Memory is a safe local/internal foundation for remembering product work without becoming surveillance or production storage.

## Purpose

The memory layer helps Trading Pro Max remember:

- local day reports
- founder acceptance decisions
- visual feedback notes
- UI acceptance status
- journal/coach demo notes
- decision replay local notes
- build decisions
- validation summaries
- Codex task outcomes
- product gap notes
- safe plan/readiness notes
- non-sensitive product preferences

## Storage Mode

Current implementation is a deterministic local/internal readiness model. No production database migration is created in this pass.

Durable account-safe persistence remains planned and requires explicit future approval.

## Domains

- `founder_acceptance`
- `visual_feedback`
- `local_day_report`
- `journal_note`
- `coach_note`
- `decision_replay_note`
- `build_decision`
- `codex_task_outcome`
- `validation_summary`
- `product_gap`
- `plan_readiness_note`
- `assistant_learning_note`

## Safety

The memory layer rejects `secret_forbidden` and `sensitive_do_not_store` items. It stores summary-level readiness only and redacts suspicious secret-like content.

It does not store secrets, raw private sensitive user data, payment data, broker credentials, social tokens, fake users, fake revenue, or fake metrics.

## Product Truth

Memory cannot activate launch, production, billing, broker/feed, live execution, real-money routing, or social publishing. It can only summarize decisions, gaps, validation, and safe next actions.

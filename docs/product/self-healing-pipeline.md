# Self-Healing Pipeline

The self-healing pipeline is a future-safe readiness model.

Failure classes:
- lint_failed
- typecheck_failed
- build_failed
- regression_failed
- smoke_failed
- dirty_repo
- screenshot_missing
- public_language_leak
- product_truth_violation

Pipeline:
detect -> classify -> safe cleanup task -> Codex repair draft -> validation plan -> result interpretation -> Founder report.

Current truth:
- no automatic repair execution
- no uncontrolled code changes
- low-risk docs-only auto-fix remains future-only


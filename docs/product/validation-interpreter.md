# Validation Interpreter

The validation interpreter classifies build/test reports.

Classifications:
passed, partial, failed, dirty_repo, lint_failed, build_failed, tests_failed, smoke_failed, visual_proof_missing, screenshot_missing, product_truth_violation, public_language_leak, internal_scope_leak, secrets_risk, fake_activation_risk, needs_cleanup, ready_to_accept.

It extracts:
- commands run
- pass/fail state
- changed files
- commit hash
- pushed yes/no
- clean yes/no
- blockers
- recommended next action

No fake validation or false pass is allowed.


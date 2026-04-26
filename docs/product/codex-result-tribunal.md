# Codex Result Tribunal

The Result Tribunal judges Codex result reports before work can be accepted into memory.

Checks:
- validation passed
- git clean
- pushed yes/no
- changed files match passport
- forbidden files untouched
- forbidden scope not violated
- Product Truth preserved
- no public internal terminology leak
- no fake activation
- no secrets exposure
- screenshots present if required
- Ahmad visual review needed

Decisions:
- accepted
- needs_fix
- rejected
- scope_violation
- security_violation
- product_truth_violation
- visual_review_required
- founder_review_required
- blocked

The tribunal can reject a task even if tests pass when scope, Product Truth, public/private boundary, secrets, or visual acceptance fail.

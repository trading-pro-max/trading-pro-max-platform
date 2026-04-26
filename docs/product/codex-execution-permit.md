# Codex Execution Permit

The Execution Permit decides whether a valid passport can move beyond drafting.

Permit decisions:
- permit_denied
- permit_draft_only
- permit_auto_submit_low_risk
- permit_founder_review
- permit_blocked

Rules:
- docs/test low-risk tasks may be auto-submit eligible as readiness only.
- minor copy cleanup may be draft-only unless public language review upgrades it.
- CSS and visual polish require review unless strictly low-risk and explicitly scoped.
- logo/UI redesign requires Founder review.
- security/auth requires Founder/Security review.
- secrets are blocked unless status-only readiness contracts are explicitly reviewed.
- billing/live/broker/social/production scope is blocked.

Permit output:
- decision
- reason
- safeNextAction
- requiredReviews
- blockedReason
- autoSubmitAllowed
- maxWorkerLevel

The web app never executes the permit. It only reports readiness.

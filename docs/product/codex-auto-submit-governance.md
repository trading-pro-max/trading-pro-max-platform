# Codex Auto-Submit Governance

Auto-submit governance defines readiness states for future external Codex submission.

Supported modes:
- manual_only
- cli_exec_ready
- cloud_exec_ready
- github_comment_ready

Current default:
- manual_only

Current allowed levels:
- Level 3.0: draft only
- Level 3.1: submission readiness only for low-risk docs/tests through a future approved external mechanism

Future only:
- Level 3.2 tiny copy cleanup after review
- Level 3.3+ future
- Level 4 future low-risk auto-fix
- Level 5 forbidden for now

Rules:
- web app must not execute shell commands
- web app must not call Codex automatically
- generated command/comment text is readiness only
- external approved runner is required before submission
- secrets are never included
- blocked categories remain blocked

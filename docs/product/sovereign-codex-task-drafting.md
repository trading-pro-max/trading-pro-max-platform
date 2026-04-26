# Sovereign Codex Task Drafting

The system may generate:

- Codex-ready prompt.
- Manual copy/paste command text.
- GitHub `@codex` comment text.
- `codex exec` command text.
- `codex cloud exec` command text.

Current default is `manual_only`. CLI, cloud, and GitHub modes are readiness text only. The web app does not execute shell commands, call Codex directly, submit to external runners, or send secrets.

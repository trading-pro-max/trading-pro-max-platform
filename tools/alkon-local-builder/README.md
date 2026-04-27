# Alkon Local Builder

Status: ready_with_notes

Purpose: give Ahmad a terminal-only, read-only fallback when Codex quota is exhausted.

Rules:

- Read reports and summarize the next safe action.
- Do not run Codex.
- Do not execute shell commands from the web app.
- Do not make external calls.
- Do not print secrets.
- Do not delete, publish, bill, connect broker/feed, enable live execution, or route real money.

Scripts:

- `npm run alkon:status`
- `npm run alkon:wake`
- `npm run alkon:next`
- `npm run alkon:passport`
- `npm run alkon:audit`


# No Secret Exposure Policy

## Rule

Trading Pro Max must never expose secret values through Founder Command, TPM Assistant, Codex prompts, diagnostics, screenshots, logs, product memory, or public UI.

## Forbidden

- Printing API keys or tokens
- Returning passwords in APIs
- Showing broker credentials
- Showing payment credentials
- Showing social tokens
- Storing secrets in product memory
- Sending secrets to TPM Assistant
- Sending secrets to Codex
- Committing `.env` files with real values
- Capturing secrets in screenshots

## Allowed

- Presence-only readiness
- Status-only categories
- Rotation policy
- Blocked state
- Safe next action
- Owner-only protection status

## Product Truth

No secret readiness status activates production, billing, broker/feed, live execution, real-money routing, social publishing, or public launch.

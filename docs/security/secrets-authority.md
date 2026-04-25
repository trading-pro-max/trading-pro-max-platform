# Secrets Authority

## Core Rule

Founder Command controls secret readiness, rotation, and safety. Founder Command never displays raw secret values.

## Purpose

Secrets Authority is an internal readiness layer for Trading Pro Max. It tracks whether secret categories have policy, ownership, rotation requirements, and safety status without reading, printing, storing, logging, or exposing the underlying values.

## Supported States

- `not_configured`
- `configured`
- `missing`
- `invalid_format`
- `expired`
- `rotation_required`
- `blocked`
- `production_forbidden`

## Environments

- `local`
- `staging_future`
- `production_future`
- `blocked`

## Categories

- Email
- Social
- Market data
- Broker future
- Billing future
- Monitoring future
- Founder Command
- GitHub/Vercel/domain readiness

## Rules

- Report presence/status only.
- Never reveal values.
- Never reveal hashes as proof of values.
- Never send secrets to TPM Assistant.
- Never send secrets to Codex.
- Never store secrets in product memory.
- Never commit env files.
- Never activate production, billing, broker/feed, live execution, real money, or social publishing from this layer.

## Safe Outputs

- Secret category
- Environment
- Readiness state
- Rotation readiness
- Blocked action list
- Safe next action
- Founder Command protection readiness

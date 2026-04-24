# Companion Context Engine

The Companion Context Engine creates safe, platform-aware context for the TPM Personal Companion.

Runtime source:

- `lib/server/companion/types.ts`
- `lib/server/companion/context.ts`
- `/api/companion/context`

Allowed context:

- current route
- selected asset
- timeframe
- fallback/feed state
- paper/live/blocked truth
- account/session state
- plan tier
- Standard/Islamic account status truth
- readiness summary
- feedback state
- language/theme
- AI/IQ context quality

Forbidden context:

- secrets
- private sensitive data
- production config
- raw tokens
- broker credentials
- live activation keys

Assistant boundaries:

- no guaranteed signals
- no win-rate claims
- no real-money execution
- no broker/feed activation
- no auth/security bypass

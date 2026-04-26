# Founder Idea Intake

Founder Idea Intake converts Ahmad's ideas into classified, routed events.

The implementation lives in `lib/server/sovereign-autonomy/founder-idea-intake.ts` and exposes read-only samples plus a stateless preview API at `/api/sovereign-autonomy/founder-ideas`.

The preview API does not persist input, call external services, execute commands, expose secrets, or send data to Codex. Sensitive-looking material is redacted and routed as a secrets-risk event.

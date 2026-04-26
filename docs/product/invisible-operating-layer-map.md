# Invisible Operating Layer Map

Runtime contract:

- `lib/server/invisible-operating-layer/types.ts` defines internal systems and public-safe outputs.
- `lib/server/invisible-operating-layer/state.ts` returns the local readiness snapshot.
- `lib/server/invisible-operating-layer/output-mapper.ts` hides internal-only systems and translates allowed public outputs.
- `/api/invisible-operating-layer/readiness` is read-only, no-store, and status-only.

Public-safe outputs:

- Product Truth -> Readiness.
- Plan Entitlements -> Plans.
- TPM Assistant Context -> TPM Assistant.
- Why Blocked -> Why Blocked.
- Guardian -> Safety.
- Legal -> Claim review.
- Trust Governor -> Trust.
- Brand Intelligence -> Visual readiness.
- Local Day Cycle -> Local readiness.
- Diagnostics -> Diagnostics.
- World Interface -> Support readiness.

Hidden from public:

- Product Memory
- Sovereign Autonomy
- Codex Governance
- Security Sovereignty
- Secrets Authority

Safety truth:

- no public internal terminology leak
- no secrets visible to public
- no precise location tracking
- no external calls
- no shell execution
- no live execution
- no real money
- no broker/feed
- no billing
- no social publishing

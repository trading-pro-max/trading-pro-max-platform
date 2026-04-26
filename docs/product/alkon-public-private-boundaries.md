# Alkon Public / Private Boundaries

Public users may see Trading Pro Max, Home, Trading Workspace, Markets, Plans, Apps / Platforms, Academy, Community, Support, Free, Pro, VIP, Institutional, TPM Assistant, Journal, Coach, Settings, Diagnostics, Readiness, Paper-safe, Planned, Inactive, Future, and Blocked.

Public users must not see Alkon, الكون, Universal Command, Founder Command, Founder King, Owner controls, Planetary Systems, ministries, councils, governance, construction queue, Codex tasks, secrets authority, treasury controls, product memory internals, local operations internals, Defense Universe, Construction Universe, Memory Universe, World Interface internals, or Result Tribunal.

## Implementation Decision

This pass creates only the founder/internal route `/api/founder/alkon/readiness`.

Public-looking `/api/alkon/*` routes are intentionally not created because Alkon is not a public product surface. Public navigation and plan cards must not link to Alkon.

Public Diagnostics may say only generic wording such as "Private command systems remain internal" or "Owner-only systems are private." It must not name Alkon or expose internal command details.

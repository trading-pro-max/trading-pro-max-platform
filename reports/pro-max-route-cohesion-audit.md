# Pro Max Route Cohesion Audit

Status: active_with_notes

Canonical model:

- `/` = Pro Max Center
- `/trading` = Pro Max Trading / Trading Workspace
- `/en` = compatibility workspace route, not primary identity
- `/diagnostics` = public-safe Diagnostics
- `/settings` = public-safe Settings
- `/founder/alkon` = private Alkon command universe
- `/founder/pocket` = private Alkon Pocket

Findings:

- Public Home and header previously pointed Trading Workspace to `/{locale}`.
- Apps / Platforms Web App CTA previously pointed to `/en`.
- Brain/Companion default route context previously used `/en`.
- Local Day One docs and local ops snapshots still named `/en` and an old desktop path.

Fixes:

- Added `app/trading/page.tsx`.
- Repointed public Home, public header, and Apps / Platforms to `/trading`.
- Updated Brain/Companion default route to `/trading`.
- Updated Local Day One route references and official path.
- Updated canonical smoke route list to include `/trading` before `/en`.
- Updated route regression tests.

Postponed:

- Removing `/en` is postponed. It remains a compatibility route to avoid breaking older proofs and localized route expectations.

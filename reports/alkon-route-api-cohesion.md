# Alkon Route / API Cohesion

Status: active_with_notes

Public route status:

| Route | Purpose | Status | Leak status |
| --- | --- | --- | --- |
| `/` | Pro Max Center | active | public-safe |
| `/trading` | Pro Max Trading Workspace | active | public-safe |
| `/en` | compatibility workspace | active_with_notes | public-safe |
| `/diagnostics` | public-safe diagnostics | active | public-safe |
| `/settings` | public-safe settings | active | public-safe |

Private route status:

| Route | Purpose | Status | Execution |
| --- | --- | --- | --- |
| `/founder/alkon` | Alkon private command universe | active | read-only / no execution |
| `/founder/pocket` | Alkon Pocket decision center | active | read-only / no execution |

Founder API boundary:

`/api/founder/*` routes are private route space and must remain read-only or preview-only unless a future Ahmad-approved authenticated execution boundary is designed. Current cohesion proof checks representative Founder APIs and source boundaries for no secrets and no unsafe activation.

Jar boundary:

Jar Build System is currently private server state rendered in Founder UI. No public Jar API was added. If a Jar API is added later, it must be `/api/founder/*`, read-only, preview-only, no-execution, and private.

Public API boundary:

Public APIs such as `/api/product/truth` may expose only public-safe states: blocked, inactive, planned, future, paper-safe, and readiness.

Route smoke:

`scripts/tpm-canonical-routes-smoke.mjs` checks `/`, `/trading`, `/en`, `/en/settings`, and `/diagnostics` as UI routes, with API routes available under the optional flag.

Permission-to-Exist API update:

Founder-only read-only preview APIs now exist under:

- `/api/founder/existence-architecture/readiness`
- `/api/founder/existence-architecture/snapshot`
- `/api/founder/existence-architecture/unknowns`
- `/api/founder/existence-architecture/jar-map`
- `/api/founder/existence-architecture/next-action`

They expose no shell, Codex, payments, secrets, external calls, or public Alkon surface.

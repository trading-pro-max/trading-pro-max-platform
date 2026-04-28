# Pro Max Route Existence Map

Status: canonical_with_compatibility

| Route | Owner | Purpose | Public/private | Decision |
| --- | --- | --- | --- | --- |
| `/` | Public Pro Max | Pro Max Center | public-safe | allowed |
| `/trading` | Public Pro Max | Pro Max Trading / Trading Workspace | public-safe | allowed |
| `/en` | Public Pro Max | compatibility route only | public-safe | allowed_with_notes |
| `/markets` | Public Pro Max | Markets readiness surface if available | public-safe | readiness_only |
| `/plans` | Public Pro Max | Plans readiness surface | public-safe | readiness_only |
| `/apps` | Public Pro Max | Apps / Platforms readiness | public-safe | readiness_only |
| `/support` | Public Pro Max | Support readiness | public-safe | readiness_only |
| `/diagnostics` | Public Pro Max | public-safe diagnostics | public-safe | allowed |
| `/settings` | Public Pro Max | settings if available | public-safe | allowed_with_notes |
| `/founder/alkon` | Private Alkon -0 | sovereign command universe | founder-only | protect |
| `/founder/pocket` | Private Alkon -0 | pocket decision surface | founder-only | protect |
| public route exposing Alkon | Sensitive / Do Not Commit | forbidden pattern | blocked | black_hole |

Route law:

- `/trading` is canonical.
- `/en` is not the primary Trading identity.
- Public nav must not link Founder routes.
- Founder routes must not use public nav.

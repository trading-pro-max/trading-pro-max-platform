# Alkon Code Cohesion Audit

Status: active_with_notes

| System | Exists | Exported/imported | Reachable | Tests/proof | Boundary |
| --- | --- | --- | --- | --- | --- |
| Alkon Kernel | yes | yes | Founder APIs and command interface context | regression/API smoke | private-only |
| Operating Mode | yes | yes | Founder APIs and Alkon context | reports/tests | private-only |
| Zero-to-Zero / Zero Truth | yes | yes | Alkon context and docs | private route proof | private-only |
| Reality Production | yes | yes | Founder APIs/reports | route cohesion report | private-only |
| Self-Correction | yes | yes | Founder APIs/reports | route cohesion report | private-only |
| Device Constellation | yes | yes | Pocket and Alkon interface | founder route proof | private-only |
| Pocket Universe | yes | yes | `/founder/pocket`, pocket APIs | regression proof | private-only |
| Local Builder | yes | package scripts | terminal only | report and package scripts | tool-only |
| Alkon Chat / Command Interface | yes | yes | `/founder/alkon`, `/api/founder/alkon-chat/*` | regression/API proof | private-only |
| Jar Build System | yes | yes | `/founder/alkon`, Founder Command panel, reports | Jar source/tests/private route proof | private-only |
| Reality Conversion | yes | yes | `/founder/alkon`, Founder Command panel, reports | source/tests/private route proof | private-only |
| Founder Command | yes | yes | `/founder/command`, Founder components | private route coverage | private-only |
| Reports | yes | n/a | `/reports` files | report existence tests | internal docs |
| Product Truth | yes | yes | public API and UI | regression tests | public-safe |
| Public Pro Max | yes | yes | `/` | screenshots/tests | public-safe |
| Trading Workspace | yes | yes | `/trading`, `/en` compatibility | screenshots/tests | public-safe |

Fixed P0/P1 cohesion gaps:

- Canonical workspace route was connected at `/trading`.
- Public route references were updated away from `/en`.
- Local Day One path and route references were updated to official path and `/trading`.
- Smoke routes now include `/trading`.
- Reality Conversion now has a typed private server engine, reports, doctrine docs, and Founder UI panels without public API exposure.

No disconnected P0/P1 system remains in the active public/founder route path.

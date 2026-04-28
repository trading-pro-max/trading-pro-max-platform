# Pro Max Origin-Clean Candidates

Status: active_with_notes

| Candidate | Type | Why not changed now | Required proof |
| --- | --- | --- | --- |
| `app/theme-localization.css` split | css_cleanup_candidate | Large visual blast radius | Full route screenshots and no regression |
| `app/founder-command.css` split | css_cleanup_candidate | Private surfaces share it | Founder visual proof |
| `modules/shell` split | move_candidate | Public shell, workspace shell, and private shell imports are interwoven | Import map and route smoke |
| `modules/companion` rename | move_candidate | Public Assistant behavior depends on current imports | Compatibility migration |
| Root public starter SVGs | cleanup_candidate | Usage not fully proven | Asset usage scan |
| `/en` removal or redirect | needs_ahmad_decision | Compatibility route still used by older tests and locale paths | Locale strategy |
| Founder API auth hardening | needs_ahmad_decision | Current mission preserves path privacy/read-only behavior | Auth design |
| Deep workspace component folder move | risky_move_candidate | Chart/execution tests rely on current imports | Separate workspace refactor command |

Decision:

No uncertain cleanup was deleted in this pass.

# Origin-Clean Risk Map

Status: active_with_notes

| Risk | Current status | Action taken | Next fate |
| --- | --- | --- | --- |
| `/en` as primary workspace identity | corrected | Public Home/header/Apps/smoke/tests now point to `/trading` | keep `/en` compatibility only |
| Public Alkon leak | guarded | Public leak tests cover Home, Diagnostics, and workspace | protect |
| Public shell clutter | corrected in active shell | Header limited to logo, public nav, Sign in | protect |
| Trading workspace legacy layering | active_with_notes | Clean-zero baseline preserved; `/trading` canonicalized | improve only with proof |
| Alkon private route public look | guarded | Private shell and command interface remain isolated | protect |
| Large CSS island | css_cleanup_candidate | No broad CSS rewrite in this pass | split later with visual proof |
| `modules/shell` mixed ownership | move_candidate | No risky module moves | split later only after import map |
| Local env files | protected_candidate | `.gitignore` protects env and sensitive filenames | keep local, never print contents |
| Generated build/test folders | ignored | `.next`, `test-results`, reports screenshots ignored | keep untracked |
| Root SVG starter assets | cleanup_candidate | Not deleted without usage proof | review later |
| Terminal scripts use process APIs | protected | Tool-only, not web-imported | keep out of app APIs |
| Founder APIs broad route space | active_with_notes | Read-only/no-execution boundary documented and tested | protect |
| unowned entity birth | active_with_notes | Permission-to-Exist gate added | classify through Jar before execution |
| public Permission-to-Exist leak | guarded | Public leak tests include existence internals | block |
| unknown desktop/code item | active_with_notes | Desktop/codebase existence classifiers added | Jar 9 Founder Decision unless unsafe |

No P0/P1 route break or public/private leak was found in the active surfaces corrected by this pass.

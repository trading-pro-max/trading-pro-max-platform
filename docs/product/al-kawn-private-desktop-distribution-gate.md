# Al-Kawn Private Desktop Distribution Gate

## Definition

Private Desktop Distribution Gate defines how Al-Kawn Desktop may later be distributed privately to Ahmad only.

This is a gate, not distribution.

Distribution is private Ahmad-only.

Public desktop distribution is blocked.

Production signing remains a future gate.

No installers are uploaded or published.

Product Truth overrides distribution.

## Ahmad-Only Distribution Rule

Al-Kawn Desktop is Ahmad's private command client. Any future distribution path must stay under Ahmad control and must not become a public release, public download, customer installer, app-store release, or public auto-update channel.

## Public Distribution Block

Blocked:

- public desktop distribution
- public release channel
- public download link
- app-store release
- auto-update public channel
- release artifact publishing
- installer upload

## Signing Future Gate

Production signing is not active.

Signing certificates are absent or unknown.

Production signing requires Ahmad decision and a future explicit signing gate.

## Artifact Policy

Artifacts must remain local-only unless Ahmad explicitly approves a private transfer method later.

Artifacts must not be uploaded, published, exposed publicly, or connected to auto-update.

Artifacts must not include secrets, private documents, credentials, broker keys, payment keys, or external-account tokens.

Generated artifacts must be ignored or documented if applicable.

## No Upload Rule

No installers are uploaded or published. No release upload, public installer, store listing, or public auto-update path exists.

## Product Truth Priority

Product Truth overrides distribution:

- public launch blocked
- billing inactive
- payments inactive
- receiving money inactive
- real money disabled
- broker execution disabled/not connected
- legal review pending
- Al-Kawn private to Ahmad devices
- ALKON private/background

## Next Packaging / Distribution Path

Ahmad decision is required before any private distribution method can be selected.

Before any real distribution:

- native shell must exist
- local PIN/passphrase auth must be preserved
- native packaged-app hardening must be reviewed
- local artifact must be generated and audited
- secrets must be absent from artifacts
- signing must remain future-gated or explicitly approved
- public desktop distribution must remain blocked

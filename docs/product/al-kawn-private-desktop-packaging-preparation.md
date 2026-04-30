# Al-Kawn Private Desktop Packaging Preparation

## Definition

Private Desktop Packaging Preparation fixes the prerequisite before a safe local build dry run.

Packaging preparation is not public release.

Al-Kawn Desktop remains Ahmad-only.

No secrets are stored in the desktop bundle.

Signing and public distribution remain blocked.

Product Truth overrides packaging.

Local PIN / Passphrase Auth is preserved.

## Gate Dependencies

This preparation depends on:

- Private Desktop Packaging Gate
- Local Packaged Auth Gate
- Local PIN / Passphrase Auth
- Private Desktop Distribution Gate

All are treated as readiness gates, not release approvals.

## Packaging Capability

Current capability:

- packaging supported now: no
- native shell exists: no
- packaging tool exists: no
- safe package-check script exists: yes
- safe dry-run readiness script exists: yes
- local auth ready: ready_with_notes
- secrets risk: no active bundle risk because no package is produced
- public distribution status: blocked

The project currently has no Electron/Tauri/native shell. No heavy dependency is added in this mission.

## Safe Scripts

Allowed and present:

- `desktop:check`
- `desktop:package:check`
- `desktop:package:dry-run`

These scripts are readiness-only. They do not package, sign, release, upload, publish, auto-update, or distribute anything.

Forbidden:

- `desktop:release`
- signing scripts
- upload scripts
- publish scripts
- auto-update scripts
- payment or billing scripts

## Secret Safety

No `.env` secrets are copied into an app bundle.

No API keys are hardcoded.

Private documents are not packaged.

No credentials are placed in the desktop shell.

No local auth secret is exposed.

No plaintext passphrase is stored.

No external account connection is active.

No broker or payment keys are packaged.

## Local Auth Preservation

Local PIN / Passphrase Auth is preserved.

Current local auth dependency:

- `/desktop/kawn` is gated by a local private access lock.
- Web Crypto PBKDF2 verifier is used when available.
- Plaintext PIN/passphrase storage is blocked.
- Manual lock is implemented.
- Session timeout is active.
- OS keychain/device-lock remains a future gate.
- Production-grade auth remains a future gate unless implemented.

## Local-Only Packaging Rule

Future package work must remain local-only unless Ahmad explicitly approves a private distribution path.

Public desktop distribution is blocked. Signing remains a future gate. Private distribution remains a future gate.

## Future Private Distribution Path

A future private package path may be considered only after:

- Ahmad chooses native shell path
- native shell exists
- local PIN/passphrase auth is preserved
- artifact-producing local build is explicitly approved
- package artifact audit passes
- secret safety remains enforced
- signing and public distribution remain blocked unless Ahmad approves otherwise

## Local Build Dry Run Follow-Up

Private Desktop Local Build Dry Run may proceed next as a readiness-only check.

Because no native shell or packaging tool exists, it must not create a package artifact, public installer, signing artifact, upload, or auto-update channel.

## Distribution Gate Dependency

Private Desktop Distribution Gate defines private distribution readiness, but it must not distribute, upload, sign, publish, or expose installers.

Distribution stays private Ahmad-only and Product Truth overrides distribution.

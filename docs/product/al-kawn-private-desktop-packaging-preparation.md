# Al-Kawn Private Desktop Packaging Preparation

## Definition

Private Desktop Packaging Preparation defines the safe path toward a future private packaged Al-Kawn Desktop app.

Packaging preparation is not public release.

Al-Kawn Desktop remains Ahmad-only.

No secrets are stored in the desktop bundle.

Signing and public distribution remain blocked.

Product Truth overrides packaging.

## Gate Dependencies

This preparation depends on:

- Private Desktop Packaging Gate
- Local Packaged Auth Gate

Both reports exist and both preserve the same truth: native shell, real packaged auth, signing, packaging release, and private distribution remain future-gated.

## Packaging Capability

Current capability:

- packaging supported now: no
- native shell exists: no
- packaging tool exists: no
- safe package-check script can be added: yes
- secrets risk: controlled by no-bundle/no-Git rules
- auth gate status: future-gated
- public distribution status: blocked

The project currently has no Electron/Tauri/native shell. No heavy dependency is added in this mission.

## Safe Script

Allowed and added:

- `desktop:package:check`

This script checks readiness only. It does not package, sign, release, upload, publish, or distribute anything.

Not added:

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

No external account connection is active.

No broker or payment keys are packaged.

## Local-Only Packaging Rule

Future package work must remain local-only unless Ahmad explicitly approves a private distribution path.

Public desktop distribution is blocked. Signing remains a future gate. Private distribution remains a future gate.

## Auth Dependency

Local Packaged Auth Gate is defined but real packaged-app auth is not implemented.

PIN, passphrase, device-lock awareness, packaged-app lock, and session timeout remain future gates.

## Future Private Distribution Path

A future private package path may be considered only after:

- Ahmad chooses native shell path
- Ahmad chooses local auth method
- local packaged auth is implemented and validated
- package dry run is explicitly approved
- secret safety remains enforced
- signing and public distribution remain blocked unless Ahmad approves otherwise

## Local Build Dry Run Follow-Up

Private Desktop Local Build Dry Run may run as a readiness-only check.

Because no native shell or packaging tool exists, it must not create a package artifact, public installer, signing artifact, upload, or auto-update channel.

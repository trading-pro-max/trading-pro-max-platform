# Al-Kawn Private Desktop Packaging Gate

## Definition

Private Desktop Packaging Gate is the readiness gate for turning `/desktop/kawn` into a future private Ahmad-only packaged desktop app.

Packaging is not public distribution.

Al-Kawn Desktop remains Ahmad-only.

No secrets are stored in the desktop bundle.

Signing, packaging, and private distribution remain gated.

Product Truth overrides desktop packaging.

Public desktop distribution is blocked.

## Local Build Dry Run Dependency

Private Desktop Local Build Dry Run is allowed only as a local readiness check until a native shell, packaging tool, real packaged-app auth, and artifact audit exist.

Local build dry run is not public release, production signing, upload, or distribution.

## Private Distribution Gate Dependency

Private Desktop Distribution Gate defines distribution as private Ahmad-only and keeps public desktop distribution blocked.

The packaging gate must not be read as approval to upload installers, publish release artifacts, sign production builds, or enable auto-update.

## Shell Readiness

Current shell readiness is `ready_with_notes`.

- `/desktop/kawn` exists.
- Desktop shell status exists.
- Founder desktop card exists.
- `/desktop/kawn` is the private desktop command home.
- Control surfaces are available.

The active desktop shell is still a private Next route, not a completed native app package.

## Native Shell Readiness

Native shell readiness is `future_gate`.

- Electron exists: no.
- Tauri exists: no.
- Native shell entry exists: no.
- Native default route configured: no.

No duplicate native shell should be created without a controlled packaging preparation mission.

## Packaging Readiness

Packaging readiness is `future_gate`.

- Packaging script exists: no.
- Packaging tool exists: no.
- Package target defined: no.
- Packaging release active: no.

`desktop:check` is a safety validation script, not a packaging or release script.

## Signing Gate

Signing readiness is `needs_ahmad_decision`.

Signing certificates are not configured, signing is not active, and signing requires Ahmad approval before any private package is prepared.

## Private Distribution Gate

Private distribution readiness is `needs_ahmad_decision`.

Only private Ahmad-only distribution is allowed. Public desktop distribution is blocked. Distribution method remains pending Ahmad decision.

## Local Auth Gate

Local packaged-app authentication is a `future_gate`.

A packaged private app must not expose sensitive command surfaces without a local auth gate. Production-grade packaged-app auth must not be claimed until implemented and validated.

## Secret Safety

Secret safety is `ready_with_notes` as a rule and gate:

- no secrets in Git
- no secrets in app bundle
- no API keys in desktop shell
- no external account auto-connect

Secrets-in-app remains blocked.

## Product Truth Priority

Desktop packaging cannot override Product Truth:

- الكون remains private to Ahmad devices.
- public launch blocked
- billing inactive
- payments inactive
- receiving money inactive
- real money disabled
- broker execution disabled/not connected
- legal review pending
- ALKON private/background

## Future Packaging Path

Local Packaged Auth Gate is now the required access-control layer before private packaging preparation.

The safest next action after the gate exists is Ahmad decision required for the local access method.

Private packaging preparation may come later only after local auth method, signing, private distribution, and secret safety decisions are ready.

Reference: `docs/product/al-kawn-local-packaged-auth-gate.md`.

## Private Desktop Packaging Preparation

Private Desktop Packaging Preparation now records the safe next packaging path without creating a release.

Required truth:

- Packaging preparation is not public release.
- Al-Kawn Desktop remains Ahmad-only.
- No secrets are stored in the desktop bundle.
- Signing and public distribution remain blocked.
- Product Truth overrides packaging.

Because no native Electron/Tauri shell or packaging tool exists, packaging remains future-gated. The only added script is `desktop:package:check`, a readiness check that does not package, sign, release, upload, publish, or distribute anything.

Reference: `docs/product/al-kawn-private-desktop-packaging-preparation.md`.

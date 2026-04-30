# Al-Kawn Local Packaged Auth Gate

## Definition

Local Packaged Auth Gate defines the private access requirements for a future packaged Al-Kawn Desktop app.

This is not public authentication, not customer login, not SaaS auth, and not an external account connection.

Required wording:

- Local Packaged Auth Gate
- Al-Kawn Desktop requires Ahmad-only local access.
- Packaged-app authentication is private and local-first.
- No secrets are stored in the app bundle.
- External auth providers require Ahmad approval.
- Production-grade auth is a future gate unless implemented.
- Product Truth overrides local auth claims.

## Ahmad-Only Local Access

The access model is private Ahmad-only.

- Ahmad-only desktop access: defined.
- Customer login: not applicable.
- Public auth: blocked.
- SaaS account system: not applicable.

## What Is Implemented Now

Implemented now:

- local auth gate model
- private access model
- readiness reporting
- secret safety rules
- external auth blocked status
- Product Truth preservation
- `/desktop/kawn` gate panel
- `/founder/universe` gate status

Not implemented now:

- native packaged-app auth hardening
- OS keychain integration
- device-lock awareness
- production-grade auth claim
- external auth provider connection
- native desktop package

Updated after Local PIN / Passphrase Auth:

- `/desktop/kawn` now has a local private access lock.
- PIN/passphrase setup is implemented for the browser/device-local desktop route.
- Manual lock is implemented.
- Session timeout is active.
- No plaintext passphrase is stored.

## Local Auth Readiness

Local auth readiness is `ready_with_notes`.

- local auth implemented: yes, for `/desktop/kawn`
- PIN/passphrase implemented: yes, as a browser/device-local private lock
- device-lock awareness implemented: no
- session timeout implemented: yes

Production-grade auth must not be claimed until a real implementation exists and passes validation.

## Packaged-App Lock Readiness

Packaged-app lock readiness is `ready_with_notes`.

The route-level local lock is implemented. No native packaged app exists yet, so native packaged-app hardening remains future-gated. A future lock must be real, local-first, and Ahmad-approved.

## Session Timeout Readiness

Session timeout readiness is `ready_with_notes`.

The current desktop route uses a 30-minute session timeout and manual lock. Native packaged-app idle policy and OS/device-lock integration remain future gates.

## External Auth Rule

External auth providers are not connected.

Google, Apple, Microsoft, or any other external auth provider requires Ahmad approval before any connection is made.

## Secret Safety

No secrets are stored in Git.

No secrets are stored in the app bundle.

No auth secret is hardcoded.

No API keys are placed in the desktop shell.

## Product Truth Priority

Product Truth overrides local auth claims.

- Al-Kawn Desktop remains Ahmad-only.
- Public desktop distribution is blocked.
- Billing inactive.
- Payments inactive.
- Receiving money inactive.
- Real money disabled.
- Broker execution disabled/not connected.
- Legal review pending.
- الكون private to Ahmad devices.
- ALKON private/background.

## Future Paths

Future local auth options may include:

- OS keychain integration
- OS/device-lock awareness
- native packaged-app auth hardening
- optional encrypted local state if Ahmad approves

Private Desktop Packaging Preparation can now use Local PIN / Passphrase Auth as a ready_with_notes dependency while production-grade and native OS-level auth remain future-gated.

## Packaging Preparation Dependency

Private Desktop Packaging Preparation may prepare a safe local path with the local route lock preserved.

The preparation must not claim native packaged auth, OS keychain, or production-grade auth is complete.

Packaging preparation is not public release. Product Truth overrides packaging.

## Local Build Dry Run Dependency

Private Desktop Local Build Dry Run must preserve the local route lock and treat native packaged-app hardening as future-gated.

The dry run may verify readiness, but it must not claim production-grade auth, public auth, or customer login.

## Distribution Gate Dependency

Private Desktop Distribution Gate must keep public distribution blocked and must not claim production-grade auth.

No public auth, customer login, or external auth provider is connected by the distribution gate.

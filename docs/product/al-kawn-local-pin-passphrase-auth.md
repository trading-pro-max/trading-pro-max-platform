# Al-Kawn Local PIN / Passphrase Auth

## Definition

Local PIN / Passphrase Auth is the Ahmad-only local private access lock for `/desktop/kawn`.

Al-Kawn Desktop requires Ahmad-only local access.

This is a local private access lock, not public authentication.

It is not SaaS login, customer auth, external identity provider auth, legal identity verification, or financial-grade identity verification.

Required wording:

- Local PIN / Passphrase Auth
- Al-Kawn Desktop requires Ahmad-only local access.
- This is a local private access lock, not public authentication.
- No plaintext passphrase is stored.
- External auth providers require Ahmad approval.
- Production-grade auth remains a future gate unless implemented.
- Product Truth overrides auth claims.

## Implemented Scope

Implemented now:

- setup screen for local PIN/passphrase
- unlock screen for configured local lock
- manual lock button
- browser/device-local unlocked session
- 30-minute session timeout
- reset notice
- Product Truth wording on the auth gate
- founder status for Local PIN / Passphrase Auth

The lock gates `/desktop/kawn`. It does not globally block `/founder/universe` in this mission.

## Storage Model

The client uses Web Crypto when available.

The implementation stores:

- random salt
- PBKDF2-SHA-256 verifier
- algorithm metadata
- local timestamps
- session timeout target

The implementation does not store:

- plaintext PIN
- plaintext passphrase
- auth secret in Git
- auth secret in the desktop bundle
- external auth token
- Google, Apple, or Microsoft identity credentials

No plaintext PIN/passphrase is stored.

## Web Crypto

When Web Crypto is available, the local secret is derived with PBKDF2-SHA-256 and a unique salt.

If Web Crypto is unavailable, setup and unlock are blocked with an honest warning. The app must not fake cryptography.

## Session Timeout

Session timeout is active with a 30-minute target.

The unlocked session is local to the browser/device session storage. No sensitive data is stored in session state.

Manual lock clears the local unlocked session.

## Reset Warning

Resetting the local lock clears local access settings and does not recover secrets.

Reset is a local access reset, not a secret recovery mechanism.

## External Auth

External auth providers require Ahmad approval.

No Google, Apple, Microsoft, public auth, customer login, or SaaS account system is connected.

## Future Gates

Still future-gated:

- OS keychain integration
- device-lock awareness
- native packaged-app lock hardening
- production-grade auth claim
- external auth provider connection
- private packaged app auth audit

Production-grade auth remains a future gate unless implemented and validated.

## Product Truth Priority

Product Truth overrides auth claims.

- Al-Kawn Desktop remains Ahmad-only.
- Public desktop distribution is blocked.
- Billing inactive.
- Payments inactive.
- Receiving money inactive.
- Real money disabled.
- Broker execution disabled/not connected.
- Legal review pending.
- Al-Kawn remains private to Ahmad devices.
- ALKON remains private/background.

## Limitations

This is a browser/device-local private access lock. It improves private local access control for the current desktop route, but it does not replace operating-system account security, encrypted native keychains, production-grade auth, legal identity checks, or financial identity verification.

## Packaging Preparation Dependency

Private Desktop Packaging Preparation must preserve Local PIN / Passphrase Auth.

Packaging preparation may proceed only as a readiness layer. It must not expose local auth secrets, store a plaintext passphrase, create public distribution, sign production builds, upload artifacts, or claim production-grade auth.

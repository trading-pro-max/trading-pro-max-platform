# Al-Kawn Local PIN / Passphrase Auth

## Why This Follows Local Packaged Auth Gate

Local Packaged Auth Gate established that a future packaged Al-Kawn Desktop app must remain Ahmad-only and local-first. It also marked real local auth, PIN/passphrase, session timeout, and packaged-app lock as not implemented.

Ahmad then approved the next logical local private access layer: Local PIN / Passphrase Auth for `/desktop/kawn`.

## What Was Implemented

Implemented:

- Local PIN / Passphrase Auth model under `lib/server/universe/local-desktop-auth/`.
- Browser/device-local auth utilities under `lib/client/al-kawn-local-auth/`.
- Setup screen for a local PIN/passphrase.
- Unlock screen for a configured local lock.
- Manual lock button.
- 30-minute local session timeout.
- Reset warning.
- `/desktop/kawn` gating behavior.
- Founder status for Local PIN / Passphrase Auth.
- Regression coverage for setup, unlock, manual lock, founder status, docs, report, and source exports.

## Web Crypto

Web Crypto is used when available.

The client derives a verifier with PBKDF2-SHA-256 and a unique local salt. If Web Crypto is unavailable, the auth UI warns honestly and does not fake local cryptography.

## PIN / Passphrase Storage

No plaintext PIN/passphrase is stored.

Stored locally:

- algorithm metadata
- unique salt
- PBKDF2 verifier
- timestamps
- session timeout target

Not stored:

- plaintext PIN
- plaintext passphrase
- auth secret in Git
- auth secret in the app bundle
- external auth token

## Session Timeout Status

Session timeout: active.

Default target: 30 minutes.

The unlocked session is local to the browser/device session storage and does not store sensitive data.

## Manual Lock Status

Manual lock is implemented.

Manual lock clears the local unlocked session and returns `/desktop/kawn` to the unlock screen when a local lock is configured.

## Reset Behavior

Resetting local lock clears local access settings and does not recover secrets.

Reset is a local access reset only. It is not secret recovery and not external identity verification.

## Limitations

This is a local private access lock, not public authentication.

Production-grade auth remains a future gate unless implemented.

The current implementation does not provide:

- OS keychain integration
- device-lock awareness
- native packaged-app lock hardening
- external auth provider integration
- customer login
- legal identity verification
- financial identity verification
- absolute security

## Future OS Keychain / Device-Lock Gate

OS keychain integration and device-lock awareness remain future gates. They require a later Ahmad-approved packaging/auth mission and must not be claimed as complete now.

## Product Truth Preservation

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
- External auth providers require Ahmad approval.

## Validation Results

Passed:

- `npx tsc --noEmit`
- `npx eslint app modules tests --max-warnings=0`
- `npm run desktop:check`
- `npm run build`
- `npm run prisma:validate`
- `npx playwright test tests/regression/al-kawn-local-pin-passphrase-auth.spec.ts` (4/4 passed)
- `npm run test:regression -- --reporter=list` (369/369 passed)
- `npm run smoke:routes`
- `git diff --check`

Note: the first `npm run test:regression` wrapper reached the command timeout before returning a pass/fail summary. The exact full regression command was rerun with a longer timeout and passed 369/369.

## Safest Next Action

Private Desktop Packaging Preparation.

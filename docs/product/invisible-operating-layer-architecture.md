# Invisible Operating Layer Architecture

Status: active_with_notes

Purpose:

The Invisible Operating Layer is the bridge between private Alkon truth and public Pro Max trust. It must translate internal readiness into public-safe states without exposing Alkon language, Founder Command, internal governance, secrets, or sensitive readiness details.

Inputs:

- Product Truth
- operating readiness
- route safety
- device readiness
- launch and billing blocks
- broker/feed and live execution blocks
- diagnostics summaries
- public platform state

Private-only inputs:

- Alkon operating mode
- Kernel 0-16
- Zero Truth
- Reality Trial
- Evidence Chain
- Wake Reports
- Command Passport drafts
- Local Day One gates
- Founder final authority

Public-safe outputs:

- Paper-safe
- Planned
- Inactive
- Future
- Readiness
- Diagnostics
- No real-money routing
- Live execution inactive
- Broker/feed not configured
- Billing inactive

Rules:

- Never expose Alkon or Founder language in public UI.
- Never publish internal governance language.
- Never reveal secrets, bank/card data, private reports, or raw sensitive personal data.
- Never convert private readiness into a public claim of launch, regulation, certification, partnership, performance, win-rate, or profit.
- Public diagnostics may explain readiness in public-safe language only.

Architecture placement:

- `lib/server/invisible-operating-layer` owns private-to-public translation logic.
- Public route handlers may call public-safe APIs or public-safe summaries.
- Founder route handlers may read deeper private state.
- Reports document the boundary, but reports are not public surfaces.

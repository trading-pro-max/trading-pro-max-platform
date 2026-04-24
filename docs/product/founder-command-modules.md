# Founder Command Modules

Founder Command modules organize the private owner-only command app. They are not public product routes and must not expose private data, secrets, or fake metrics.

| Module | Purpose | Founder May View | Founder May Approve Later | Must Not Do |
| --- | --- | --- | --- | --- |
| Planet Overview | global state of TPM Planet OS | active, planned, inactive, blocked, degraded systems | reviewed readiness transitions | fake activation or fake metrics |
| Guardian Command | abuse and safety alerts | blocked attempts, suspicious activity, incident state | reviewed moderation or escalation actions | invasive surveillance or auth bypass |
| Legal Counsel Command | risky claim review | blocked wording, Islamic wording, AI/VIP/launch claim state | reviewed claim language | legal certification or false compliance |
| Media Command | content and campaign control | drafts, campaigns, AI video scripts, channel readiness | reviewed drafts after Guardian/Legal | external posting without configured channels |
| AI Brain Command | intelligence quality and boundaries | assistant summaries, guidance quality, AI boundary state | reviewed assistant capability changes | guaranteed signals or trade execution |
| Treasury Command | monetization readiness | Free/Pro/VIP/Enterprise readiness and billing inactive truth | future reviewed entitlement changes | fake billing, paid access, or performance fee activation |
| Community Command | community readiness | room readiness, moderation state, anti-scam rules | reviewed moderation rules | fake social network or signal-selling rooms |
| Academy / Journal / Coach Command | education and learning systems | lesson readiness, journal/coach roadmap, decision replay state | reviewed education releases | financial advice or manipulation |
| Engineering Command | build and quality work | gaps, regressions, desktop/mobile work, integration readiness | reviewed work prioritization | fake capability closure |
| Ops Tower Command | operational readiness | health, incidents, monitoring readiness, blockers, recovery actions | reviewed recovery actions | fake monitoring or production readiness |
| Founder Approval Queue | high-risk review pipeline | items ready for Founder decision | approve, reject, block, archive | bypass Guardian/Legal hard blocks |

## Module State Vocabulary

- active_contract: code or docs define a usable readiness contract
- planned: future system is designed but not shipped
- inactive: intentionally unavailable
- blocked: unavailable until required safety, legal, production, or integration gates are met
- degraded: available but not at full readiness

## Shared Module Rules

- show readiness truth
- show blocker reasons
- show next safe action
- keep private owner controls out of public surfaces
- never show secrets
- never claim launch, billing, broker, feed, or native app readiness without real configuration


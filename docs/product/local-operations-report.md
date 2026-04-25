# Local Operations Report

The local operations report summarizes one closed local review cycle.

Fields:
- date
- localDayNumber
- readinessState
- completedStages
- failedStages
- visualAcceptance
- productTruthStatus
- assistantStatus
- journalCoachStatus
- diagnosticsStatus
- gitStatus
- validationStatus
- blockers
- nextActions
- founderDecisionNeeded
- launchForbiddenReminder

Rules:
- no fake metrics
- no fake users
- no revenue claims
- no launch automation
- no production activation

The deterministic default report starts at local day 0 and requires human Founder acceptance.
## Product Memory Connection

Local Operations Report memory stores summary fields only:

- date
- local day number
- readiness state
- completed and failed stages
- visual acceptance
- product truth status
- Assistant, Journal/Coach, and Diagnostics status
- validation and git status
- blockers
- next actions
- Founder decision needed
- launch forbidden reminder

No fake users, fake metrics, production secrets, or launch automation are stored.

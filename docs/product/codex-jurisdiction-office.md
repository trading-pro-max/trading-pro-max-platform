# Codex Jurisdiction Office

The Jurisdiction Office defines what Codex may and may not touch for each task category.

Each jurisdiction includes:
- allowedFiles
- forbiddenFiles
- allowedSurfaces
- forbiddenSurfaces
- allowedTerms
- forbiddenTerms
- requiredReviews
- validationRequired
- screenshotRequired
- rollbackRule

Examples:

docs_update:
- allowed files: docs/**
- forbidden files: app/**, modules/**, lib/** unless explicitly approved
- validation: full validation still listed by passport

test_update:
- allowed files: tests/**
- forbidden files: production secrets and env files
- validation: regression required

visual_polish:
- allowed files: scoped CSS and specific components
- forbidden files: auth, billing, broker, secrets
- screenshots required: yes

logo_identity:
- allowed files: brand components, CSS, icon.svg, docs/tests
- forbidden files: billing, broker, auth, secrets
- Founder approval required: yes

secrets:
- blocked by default except status-only readiness docs/contracts with review.

billing/live/broker:
- blocked by default.

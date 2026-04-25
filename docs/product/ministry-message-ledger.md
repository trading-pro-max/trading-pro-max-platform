# Ministry Message Ledger

The Ministry Message Ledger is the future audit-style record for cross-ministry work. It is a contract/readiness model now, not a live workflow engine.

## Message Fields

- messageId
- sourceMinistry
- targetMinistry
- sourceState
- targetState
- coordinationCenter
- type
- priority
- riskLevel
- automationLevel
- summary
- requestedAction
- guardianReviewRequired
- legalReviewRequired
- treasuryReviewRequired
- engineeringReviewRequired
- founderApprovalRequired
- constitutionalReviewRequired
- legislativePolicyRequired
- executiveImplementationRequired
- councilDecision
- councilBlockerReason
- status
- createdAt
- updatedAt
- resolvedAt
- productTruth
- safetyBoundary
- reasonIfBlocked

## Message Types

The ledger supports status_update, request, review_required, approval_needed, warning, incident, handoff, blocker, escalation, resolution, policy_question, content_review, plan_review, security_review, legal_review, engineering_review, treasury_review, and founder_decision_request.

## Message States

The ledger supports draft, sent, received, in_review, waiting_for_response, requires_revision, approved, rejected, blocked, escalated, resolved, and archived.

## Safety Rules

- sensitive messages require review
- high-risk messages require Founder approval
- critical actions remain blocked
- no secrets are stored in messages
- no private user data is exposed
- no fake users, revenue, metrics, launch, billing, or integration claims are allowed
- live execution, real money, broker/feed, billing, public launch, social publishing, fake VIP, fake Islamic/Sharia certification, and performance-fee activation remain blocked

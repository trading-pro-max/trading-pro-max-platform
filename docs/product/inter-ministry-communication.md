# Inter-Ministry Communication

All cross-ministry communication routes through Founder Presidency / Central Coordination. This prevents hidden activation paths and keeps Guardian, Legal, Treasury, Engineering, Quality, and Founder review visible.

## Message Types

- status_update
- request
- review_required
- approval_needed
- warning
- incident
- handoff
- blocker
- escalation
- resolution
- policy_question
- content_review
- plan_review
- security_review
- legal_review
- engineering_review
- treasury_review
- founder_decision_request

## Message States

- draft
- sent
- received
- in_review
- waiting_for_response
- requires_revision
- approved
- rejected
- blocked
- escalated
- resolved
- archived

## Required Workflows

1. Media campaign workflow:
   Media -> Presidency -> Legal -> Guardian -> Treasury -> Founder -> Media

2. VIP feature workflow:
   Product -> Presidency -> Treasury -> Legal -> Guardian -> Engineering -> Quality -> Founder

3. Security incident workflow:
   Guardian -> Presidency -> Emergency -> Engineering -> Legal -> Founder

4. Islamic account wording workflow:
   Account Types -> Presidency -> Legal -> Rights/IP -> Founder

5. Sponsored Swiss clock partnership workflow:
   Partnerships -> Presidency -> Legal -> Rights/IP -> Media -> Founder

6. Production activation workflow:
   Ops -> Presidency -> Engineering -> Legal -> Guardian -> Founder
   This remains blocked until a future explicitly approved stage.

7. Companion response policy workflow:
   Companion -> Presidency -> Legal -> Guardian -> AI Brain -> Quality -> Founder if sensitive

8. Community moderation workflow:
   Community -> Presidency -> Guardian -> Legal if claims/abuse -> Support -> Founder if high-risk

9. Journal/Coach feature workflow:
   Coach / Journal -> Presidency -> Legal -> Guardian -> AI Brain -> Quality

10. Plan entitlement change workflow:
   Treasury / Plans -> Presidency -> Legal -> Guardian -> Engineering -> Founder Approval

No workflow may publish externally, launch, bill, activate broker/feed, expose secrets, or enable live/real-money execution in the current baseline.

## Runtime APIs

- `/api/planet/coordination`: decision examples, message ledger, workflows, council integration.
- `/api/planet/workflows`: workflow templates.
- `/api/planet/councils`: council and constitution readiness.
- `/api/founder/coordination/readiness`: Founder-visible coordination readiness, read-only.

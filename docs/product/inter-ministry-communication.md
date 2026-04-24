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

## Message States

- draft
- sent
- in_review
- waiting_for_response
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

No workflow may publish externally, launch, bill, activate broker/feed, expose secrets, or enable live/real-money execution in the current baseline.

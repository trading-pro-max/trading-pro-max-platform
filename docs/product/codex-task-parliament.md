# Codex Task Parliament

Task Parliament decides whether a construction request should become a governed task.

Input:
- task title
- reason
- category
- affected surface
- user impact
- Founder impact
- risk
- duplication check
- timing

Output:
- approve_for_draft
- merge_with_existing_task
- delay
- reject
- block
- founder_approval_required
- review_required

Decision fields:
- reason
- owner area
- priority
- next action
- Founder review needed
- Legal review needed
- Guardian review needed
- Security review needed

Examples:
- Fix typo in docs -> approve_for_draft.
- Redesign logo -> founder_approval_required.
- Activate billing -> block.
- Expose Founder Command to VIP users -> block.
- Clean public copy labels -> approve_for_draft or review_required.
- Delete unused component tree -> review_required.

Task Parliament does not execute work. It only decides the next governed state.

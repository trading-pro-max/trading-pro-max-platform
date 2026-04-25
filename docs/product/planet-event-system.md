# Planet Event System

The event system converts product/build observations into deterministic internal construction events.

Supported categories include visual_gap_detected, ux_confusion_detected, chart_quality_low, assistant_context_missing, assistant_response_risk, plan_copy_conflict, Product Truth conflicts, Legal/Guardian risks, validation failures, public language leaks, and forbidden activation requests.

Each event includes:
- event id
- type
- source
- affected area and files
- user-facing impact
- Founder impact
- plan impact
- Product Truth impact
- risk and severity
- owner ministry
- required reviews
- suggested next action
- forbidden scope
- status

Statuses:
observed, classified, routed, waiting_review, waiting_founder, ready_for_draft, drafted, blocked, completed, archived.

Forbidden activation events remain blocked and are never converted into execution.

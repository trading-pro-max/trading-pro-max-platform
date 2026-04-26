# Governed Automation Boundaries

Current allowed automation levels:

- Level 1: detect.
- Level 2: draft.
- Level 3.0: Codex-ready task draft only.
- Level 3.1: docs/tests submission readiness only.

Disabled or forbidden:

- Level 4: future low-risk auto-fix, disabled now.
- Level 5: uncontrolled autopilot, forbidden.

The web app may not:

- Execute shell commands.
- Run Codex directly.
- Send secrets.
- Activate real-world systems.
- Launch publicly.
- Activate billing, broker/feed, live execution, real money, or social publishing.

Founder authority is required for sensitive changes and all real-world activation decisions.

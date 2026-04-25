# Codex Operating Model

Codex is a construction partner for Trading Pro Max, not an automatic execution engine inside the product.

## Rules

- Founder approves tasks manually.
- The product may draft Codex-ready prompts.
- Codex execution happens outside the product through the user's CLI, cloud, GitHub, or ChatGPT workflow.
- The product records outcomes as safe summaries only.
- The product must never send secrets to Codex.
- The product must never ask Codex to activate blocked systems.

## Readiness

- Local Codex CLI: configured or planned by Ahmad's local environment.
- Codex cloud: external setup, not app activation.
- GitHub review via `@codex`: optional future workflow.
- AGENTS.md/review guidelines: recommended hardening for future multi-agent review.

## Forbidden Scope

Codex task drafts must not request:

- production secret changes
- live execution activation
- real-money routing
- broker/feed activation
- billing activation
- social publishing
- public launch claims
- uncontrolled automation

## Safe Loop

1. Observe local product state.
2. Classify gaps and risk.
3. Draft Codex-ready task text.
4. Wait for Ahmad manual approval.
5. Codex executes separately outside the product.
6. Validation result is recorded as a safe summary.
7. Product memory updates without secrets.

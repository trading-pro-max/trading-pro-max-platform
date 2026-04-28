# Pro Max Trading Disconnected Surfaces

Status: no P0 disconnected public surface found in the current master pass.

Connected:
- Home workspace CTA -> `/trading`.
- Public topbar Trading Workspace -> `/trading`.
- `/trading` refresh works.
- Market Board, chart, execution, Assistant, Journal/Coach, and bottom dock render as one workspace.

Postponed cleanup candidates:
- Internal component names from older TPM / PlatformShell eras.
- CSS compatibility layers that still support regression coverage.

Protected:
- Product Truth.
- Paper-safe execution.
- Public/private boundary.

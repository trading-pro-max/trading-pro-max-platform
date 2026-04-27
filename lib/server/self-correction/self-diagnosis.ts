import type { SelfCorrectionSignal } from "./types";

export function diagnoseSelfCorrectionSignals(): SelfCorrectionSignal[] {
  return [
    {
      signalId: "visual_acceptance_missing",
      type: "visual_blocker",
      severity: "P1",
      detected: true,
      summary: "Ahmad visual acceptance is still required.",
      correction: "Show visual proof and wait for Ahmad accept/reject/focused correction.",
    },
    {
      signalId: "route_public_private_guard",
      type: "route_blocker",
      severity: "P0",
      detected: false,
      summary: "Public Alkon routes must remain absent.",
      correction: "Keep private routes under /api/founder and /founder only.",
    },
    {
      signalId: "public_private_leak_scan",
      type: "public_private_leak",
      severity: "P0",
      detected: false,
      summary: "Public UI must not show internal Alkon terms.",
      correction: "Sanitize public Diagnostics and navigation.",
    },
    {
      signalId: "product_truth_guard",
      type: "product_truth_risk",
      severity: "P0",
      detected: false,
      summary: "Live, real money, billing, broker/feed, and launch stay inactive.",
      correction: "Block unsafe activation and keep public language paper-safe.",
    },
    {
      signalId: "validation_pending",
      type: "failed_tests",
      severity: "P1",
      detected: false,
      summary: "Validation must pass before closure.",
      correction: "Run TypeScript, ESLint, build, Prisma validate, regression, smoke, diff check.",
    },
    {
      signalId: "git_clean_gate",
      type: "dirty_git",
      severity: "P1",
      detected: false,
      summary: "Dirty Git blocks final closure until committed and pushed.",
      correction: "Commit and push only after validation and reports are updated.",
    },
    {
      signalId: "wake_report_gate",
      type: "missing_wake_report",
      severity: "P1",
      detected: false,
      summary: "Wake Report fabric must exist and be updated.",
      correction: "Update wake, full, history, next command, and A-Z status reports.",
    },
    {
      signalId: "codex_dependency",
      type: "codex_dependency_risk",
      severity: "P2",
      detected: true,
      summary: "Codex quota exhaustion needs a local builder fallback.",
      correction: "Keep local builder scripts read-only and terminal-only.",
    },
    {
      signalId: "local_day_one_gate",
      type: "local_day_one_blocker",
      severity: "P1",
      detected: true,
      summary: "Local Day One is not started without Ahmad visual acceptance.",
      correction: "Mark Local Day One not_started and next action visual review.",
    },
    {
      signalId: "heart_alignment",
      type: "heart_drift",
      severity: "P1",
      detected: false,
      summary: "Current heart remains Pro Max Trading with chart-first paper-safe reality.",
      correction: "Return to Pro Max Trading heart before expanding non-core worlds.",
    },
  ];
}


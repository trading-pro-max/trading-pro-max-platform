import "server-only";

import type { ConvergenceScoreItem, ConvergenceScoreSnapshot } from "./types";

const scoreItems: ConvergenceScoreItem[] = [
  {
    area: "public_world_completeness",
    score: 8.4,
    status: "ready_with_notes",
    evidence:
      "Home, Workspace, Markets, Plans, Apps, Academy, Community, Support, Settings, and Diagnostics exist with public-safe language.",
    nextSafeAction: "Run public proof screenshots and forbidden-term scan.",
  },
  {
    area: "workspace_readiness",
    score: 8,
    status: "ready_with_notes",
    evidence:
      "Trading Workspace is chart-first and paper-safe with terminal shell separation.",
    nextSafeAction: "Keep chart comfort under visual acceptance review.",
  },
  {
    area: "assistant_readiness",
    score: 7.8,
    status: "ready_with_notes",
    evidence:
      "TPM Assistant is plan-aware and explains blocked states without signals or profit guarantees.",
    nextSafeAction: "Re-audit assistant prompts after any plan wording change.",
  },
  {
    area: "alkon_readiness",
    score: 8.2,
    status: "ready_with_notes",
    evidence:
      "Alkon, cosmic physics, idea inbox, result tribunal, memory, and next safe actions are modeled as private Founder systems.",
    nextSafeAction: "Keep Alkon private and avoid any public navigation or plan exposure.",
  },
  {
    area: "environment_readiness",
    score: 8.1,
    status: "ready_with_notes",
    evidence:
      "Planetary Environment resolves time, solar, weather readiness, market session, system weather, plan realm, and surface intensity without GPS or external weather calls.",
    nextSafeAction: "Keep workspace intensity subtle and chart-safe.",
  },
  {
    area: "codex_governance_readiness",
    score: 7.6,
    status: "ready_with_notes",
    evidence:
      "Codex Sovereignty uses Task Passports, permits, draft-only mode, and Result Tribunal.",
    nextSafeAction: "Keep all Codex execution manual and external.",
  },
  {
    area: "memory_readiness",
    score: 7.7,
    status: "ready_with_notes",
    evidence:
      "Product Memory stores lessons, open gaps, and validation summaries while forbidding secrets and private sensitive data.",
    nextSafeAction: "Add reality-audit lessons after the audit pass.",
  },
  {
    area: "security_secrets_readiness",
    score: 7.4,
    status: "ready_with_notes",
    evidence:
      "Security Sovereignty and Secrets Authority are private, read-only readiness systems; production secrets remain untouched.",
    nextSafeAction: "Run secret and API payload review before any real external provider work.",
  },
  {
    area: "public_private_separation",
    score: 8.5,
    status: "ready_with_notes",
    evidence:
      "Public routes use Trading Pro Max language while Founder/Alkon terminology stays inside private components and founder APIs.",
    nextSafeAction: "Keep forbidden-term regression tests active.",
  },
  {
    area: "launch_readiness",
    score: 6.8,
    status: "partial",
    evidence:
      "250 CHF/month launch readiness gate exists, but production, billing, broker/feed, live, real-money, and social systems remain inactive.",
    nextSafeAction: "Do not launch; complete legal/support/security/staging readiness later.",
  },
  {
    area: "code_cleanliness_readiness",
    score: 7,
    status: "partial",
    evidence:
      "Validation is required for every pass; a full Codebase Reality Audit and safe cleanup are still separate next steps.",
    nextSafeAction: "Prepare audit first; do not run cleanup in this pass.",
  },
  {
    area: "visual_acceptance_readiness",
    score: 6.9,
    status: "partial",
    evidence:
      "Automated screenshots can prove state, but Ahmad human acceptance is still required before final 10/10 claims.",
    nextSafeAction: "Capture proof and route any rejected visuals through Founder-approved tasks.",
  },
];

export function getConvergenceScoreSnapshot(): ConvergenceScoreSnapshot {
  const score =
    Math.round(
      (scoreItems.reduce((sum, item) => sum + item.score, 0) /
        scoreItems.length) *
        10
    ) / 10;

  return {
    score,
    status: "ready_with_notes",
    items: scoreItems,
    blockers: [
      "No fake 10/10: Ahmad visual acceptance remains required.",
      "Real-world launch, production, billing, broker/feed, live execution, real money, and social publishing remain inactive.",
      "Full Codebase Reality Audit and Safe Cleanup are prepared but not executed in this pass.",
      "Level 4 auto-fix and Level 5 autopilot remain disabled/forbidden.",
    ],
    nextSafeActions: [
      "Use final convergence snapshot as the private daily operating map.",
      "Run full validation and public leak prevention after each layer pass.",
      "Prepare a Codebase Reality Audit before cleanup.",
      "Convert new ideas into governed layer proposals, Task Passports, validation, tribunal, and memory updates.",
    ],
    founderReviewNeeded: [
      "Visual acceptance before any final local product score claim.",
      "Safe cleanup execution after audit.",
      "Any assistant, chart, shell, public plan, launch, security, auth, or secrets change.",
    ],
  };
}

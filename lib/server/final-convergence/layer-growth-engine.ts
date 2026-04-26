import "server-only";

import { getFinalConvergenceLayers } from "./layer-registry";
import type {
  FinalConvergenceLayer,
  FinalConvergenceRiskLevel,
  LayerGrowthEngineSnapshot,
  LayerGrowthProposal,
  LayerUpgradeDecision,
} from "./types";

const hardBlockedPatterns = [
  /billing activation/i,
  /live execution/i,
  /real money|real-money/i,
  /broker|feed activation/i,
  /production secret/i,
  /social publishing|publish externally/i,
  /public launch activation|global launch/i,
  /fake (users|revenue|metrics|claims|plan activation|certification)/i,
  /Alkon public|Founder Command public/i,
  /direct Codex|run Codex/i,
  /shell command/i,
];

const founderApprovalPatterns = [
  /visual identity|logo|brand/i,
  /chart rebuild|workspace shell|shell architecture/i,
  /assistant behavior|prompt/i,
  /public plan wording|VIP|Institutional/i,
  /launch readiness|security|auth|secrets/i,
];

export function classifyLayerUpgradeRequest(input: {
  title: string;
  description?: string;
  targetLayerId?: string;
}): {
  decision: LayerUpgradeDecision;
  riskLevel: FinalConvergenceRiskLevel;
  founderReviewRequired: boolean;
  blockedReason: string | null;
} {
  const text = `${input.title} ${input.description ?? ""} ${
    input.targetLayerId ?? ""
  }`;

  if (hardBlockedPatterns.some((pattern) => pattern.test(text))) {
    return {
      decision: "blocked",
      riskLevel: "critical",
      founderReviewRequired: true,
      blockedReason:
        "Unsafe activation, public/private leakage, direct execution, secrets, or fake claim request.",
    };
  }

  if (founderApprovalPatterns.some((pattern) => pattern.test(text))) {
    return {
      decision: "founder_approval_required",
      riskLevel: "high",
      founderReviewRequired: true,
      blockedReason: null,
    };
  }

  if (/future|mobile|provider|production|partnership/i.test(text)) {
    return {
      decision: "future",
      riskLevel: "medium",
      founderReviewRequired: true,
      blockedReason: null,
    };
  }

  if (/test|validation|audit|readiness/i.test(text)) {
    return {
      decision: "draft_codex_task",
      riskLevel: "medium",
      founderReviewRequired: true,
      blockedReason: null,
    };
  }

  return {
    decision: "auto_document_only",
    riskLevel: "low",
    founderReviewRequired: false,
    blockedReason: null,
  };
}

function makeProposal(input: {
  proposalId: string;
  title: string;
  sourceLayerId: string;
  targetLayerId: string;
  purpose: string;
  owner: string;
  validationRequired: string[];
  memoryRule: string;
  decision?: LayerUpgradeDecision;
}): LayerGrowthProposal {
  const classification =
    input.decision === undefined
      ? classifyLayerUpgradeRequest({
          title: input.title,
          description: input.purpose,
          targetLayerId: input.targetLayerId,
        })
      : {
          decision: input.decision,
          riskLevel:
            input.decision === "blocked"
              ? ("critical" as const)
              : input.decision === "founder_approval_required"
                ? ("high" as const)
                : input.decision === "review_required"
                  ? ("medium" as const)
                  : ("low" as const),
          founderReviewRequired: input.decision !== "auto_document_only",
          blockedReason:
            input.decision === "blocked"
              ? "Hard forbidden escalation remains blocked."
              : null,
        };

  return {
    proposalId: input.proposalId,
    title: input.title,
    sourceLayerId: input.sourceLayerId,
    targetLayerId: input.targetLayerId,
    purpose: input.purpose,
    decision: classification.decision,
    riskLevel: classification.riskLevel,
    owner: input.owner,
    validationRequired: input.validationRequired,
    memoryRule: input.memoryRule,
    founderReviewRequired: classification.founderReviewRequired,
    blockedReason: classification.blockedReason,
    safeNextAction:
      classification.decision === "blocked"
        ? "Keep blocked and record the safe alternative in Founder Command."
        : "Prepare a Task Passport preview, validation checklist, and memory rule for Founder review.",
    taskDraft: {
      taskPassportRequired: true,
      codexPromptDraftAllowed:
        classification.decision === "draft_codex_task" ||
        classification.decision === "review_required" ||
        classification.decision === "founder_approval_required",
      noExecution: true,
      noSecrets: true,
    },
  };
}

export function getLayerGrowthEngineSnapshot(
  layers: FinalConvergenceLayer[] = getFinalConvergenceLayers()
): LayerGrowthEngineSnapshot {
  const weakLayers = layers
    .filter((layer) =>
      ["partial", "planned", "not_ready"].includes(layer.convergenceStatus)
    )
    .map((layer) => layer.layerId);

  const missingDependencies = layers
    .flatMap((layer) =>
      layer.dependencies
        .filter(
          (dependency) =>
            !layers.some((candidate) => candidate.layerId === dependency)
        )
        .map((dependency) => ({
          layerId: layer.layerId,
          dependency,
          action: "review_required" as const,
        }))
    )
    .slice(0, 8);

  const proposals = [
    makeProposal({
      proposalId: "layer_growth_public_boundary_audit",
      title: "Public/private boundary reality audit",
      sourceLayerId: "public_earth_world",
      targetLayerId: "reality_audit",
      purpose:
        "Check public UI, diagnostics, APIs, docs, and screenshots for private vocabulary leakage.",
      owner: "Public Surface Boundaries",
      validationRequired: [
        "public UI forbidden-term scan",
        "diagnostics public-safe proof",
        "route smoke",
      ],
      memoryRule:
        "Store leak-prevention lessons and public-safe replacement vocabulary.",
      decision: "review_required",
    }),
    makeProposal({
      proposalId: "layer_growth_visual_truth_audit",
      title: "Visual Truth Audit",
      sourceLayerId: "public_earth_world",
      targetLayerId: "reality_audit",
      purpose:
        "Review the public shell, Earth identity, workspace chart, and atmosphere against Ahmad acceptance.",
      owner: "Visual Acceptance",
      validationRequired: ["screenshot proof", "chart comfort", "human review"],
      memoryRule: "Record accepted and rejected visual patterns.",
      decision: "founder_approval_required",
    }),
    makeProposal({
      proposalId: "layer_growth_safe_cleanup_plan",
      title: "Safe Cleanup Plan",
      sourceLayerId: "reality_audit",
      targetLayerId: "safe_cleanup",
      purpose:
        "Create a protected cleanup plan after audit without deleting user work or running destructive git operations.",
      owner: "Construction Universe",
      validationRequired: ["git status", "diff review", "full validation"],
      memoryRule: "Record cleanup rationale and preserve-user-work rules.",
      decision: "review_required",
    }),
    makeProposal({
      proposalId: "layer_growth_local_day_one",
      title: "Local Day One Start Readiness",
      sourceLayerId: "local_day_one",
      targetLayerId: "local_day_one",
      purpose:
        "Prepare the first daily local operation loop with review, ideas, task passports, validation, tribunal, memory, and next day plan.",
      owner: "Moon Cycle System",
      validationRequired: ["Founder start decision", "daily report", "memory update"],
      memoryRule: "Store day-one report summaries only.",
      decision: "draft_codex_task",
    }),
    makeProposal({
      proposalId: "layer_growth_launch_activation_block",
      title: "Public launch activation request",
      sourceLayerId: "launch_readiness",
      targetLayerId: "launch_readiness",
      purpose:
        "A launch, billing, broker/feed, live execution, real-money, or social publishing escalation remains forbidden in local laptop scope.",
      owner: "Launch Gate",
      validationRequired: ["Founder final gate", "legal", "support", "security"],
      memoryRule: "Record blocked activation attempts and safe alternatives.",
      decision: "blocked",
    }),
  ];

  return {
    status: "ready",
    inspectedLayers: layers.length,
    weakLayers,
    missingDependencies,
    repeatedGaps: [
      "Human visual acceptance remains separate from deterministic readiness.",
      "Codebase reality audit and safe cleanup are prepared but not executed.",
      "Launch readiness exists but activation remains blocked.",
      "Private command vocabulary must stay out of public UI.",
    ],
    proposals,
    blockedEscalations: [
      "billing activation",
      "live execution",
      "real-money routing",
      "broker/feed activation",
      "production secret handling",
      "social publishing",
      "public launch activation",
      "fake users/revenue/metrics",
      "fake Swiss legal status",
      "fake Islamic/Sharia certification",
      "Alkon or Final Convergence public exposure",
      "direct Codex execution from the web app",
      "shell execution from the web app",
    ],
    storedLessons: [
      "Infinite growth is allowed for detection, drafting, validation, documentation, and memory only.",
      "Sensitive work moves to Founder approval before any implementation.",
      "Unsafe activations are blocked, not postponed as hidden work.",
      "Every future layer needs purpose, owner, validation, risk, memory, and boundary.",
    ],
  };
}

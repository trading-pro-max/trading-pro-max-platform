import "server-only";

import type {
  PlanetConstructionEvent,
  PlanetConstructionReview,
  PlanetConstructionRiskLevel,
} from "@/lib/server/planet-events";

export type PlanetConsciousnessLoopStep =
  | "observe"
  | "understand"
  | "classify"
  | "route"
  | "decide"
  | "draft"
  | "validate"
  | "learn"
  | "report";

export type ConstructionAutonomyLevel =
  | "blocked"
  | "suggest_only"
  | "draft_only"
  | "review_required"
  | "founder_approval_required"
  | "auto_draft_allowed"
  | "auto_fix_low_risk_later";

export type ConstructionSafetyGateDecision = {
  checkedAt: string;
  autonomyLevel: ConstructionAutonomyLevel;
  reason: string;
  requiredReviews: PlanetConstructionReview[];
  founderApprovalRequired: boolean;
  blockedReason: string | null;
  safeAlternative: string;
  validationRequired: string[];
};

export type PlanetConsciousnessSnapshot = {
  checkedAt: string;
  mode: "tpm_planet_consciousness_layer";
  coreLoop: PlanetConsciousnessLoopStep[];
  inputs: string[];
  outputs: string[];
  consciousnessStatus: "ready_readiness_only";
  topGaps: string[];
  topRisks: string[];
  topSafeActions: string[];
  blockedActions: string[];
  founderApprovalNeeds: string[];
  codexTaskDraftCandidates: string[];
  validationRecommendations: string[];
  learningNotes: string[];
  observedEvents: PlanetConstructionEvent[];
  riskSummary: Record<PlanetConstructionRiskLevel, number>;
  truth: {
    readinessOnly: true;
    externalExecution: "not_enabled";
    productionActions: "blocked";
    secrets: "not_allowed";
    fakeMetrics: "not_allowed";
  };
};

import "server-only";

export type AlKawnVisualMapLayerStatus =
  | "active"
  | "protected"
  | "pending"
  | "blocked"
  | "future";

export type AlKawnVisualMapTruthSource =
  | "manual_founder_decision"
  | "product_truth"
  | "kernel_state"
  | "local_project_state"
  | "report_evidence"
  | "future_gate_pending";

export type AlKawnVisualImportance =
  | "origin"
  | "governing_law"
  | "execution_judge"
  | "core_system"
  | "private_branch"
  | "product_branch"
  | "surface"
  | "background_guardian"
  | "future_gate";

export type AlKawnVisualMapLayer = {
  id: string;
  arabicLabel: string;
  technicalLabel: string;
  parent: string | null;
  children: string[];
  purpose: string;
  status: AlKawnVisualMapLayerStatus;
  truthSource: AlKawnVisualMapTruthSource;
  productTruthImpact: string;
  executionRole: string;
  approvalGate: string;
  visualImportance: AlKawnVisualImportance;
};

export type AlKawnVisualMapConnection = {
  id: string;
  from: string;
  to: string;
  relation: "origin" | "contains" | "governs" | "protects" | "stops" | "routes_to";
  meaning: string;
};

export type AlKawnVisualMapTruth = {
  enforcedTruths: string[];
  blockedStates: string[];
  sourceLabels: string[];
};

export type AlKawnVisualMapNextAction = {
  next: "Al-Kawn Desktop Operating Environment";
  reason: string;
  blockedUntilAhmad: string[];
};

export type AlKawnVisualMap = {
  id: "al_kawn_visual_map";
  title: "Al-Kawn Visual Map";
  purpose: string;
  layers: AlKawnVisualMapLayer[];
  connections: AlKawnVisualMapConnection[];
  truth: AlKawnVisualMapTruth;
  requiredPhrases: string[];
  nextAction: AlKawnVisualMapNextAction;
};

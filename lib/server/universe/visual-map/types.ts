import "server-only";

export type AlKawnVisualMapLayerStatus =
  | "active"
  | "active_with_notes"
  | "protected"
  | "pending"
  | "blocked"
  | "future"
  | "future_gated"
  | "private_only"
  | "public_future"
  | "compatibility"
  | "cleanup_candidate"
  | "ahmad_decision_required";

export type AlKawnVisualMapTruthSource =
  | "manual_founder_decision"
  | "product_truth"
  | "kernel_enforced"
  | "kernel_state"
  | "local_project_state"
  | "report_evidence"
  | "test_evidence"
  | "simulation_labeled"
  | "future_gate_pending";

export type AlKawnVisualMapBoundary =
  | "private_only"
  | "internal_execution"
  | "legal_stop"
  | "money_stop"
  | "public_block"
  | "future_gate"
  | "truth_guarded"
  | "secret_guarded";

export type AlKawnVisualMapLayerType =
  | "origin"
  | "device"
  | "root"
  | "law"
  | "kernel"
  | "vault"
  | "protection"
  | "reality"
  | "interface"
  | "execution"
  | "mode"
  | "galaxy"
  | "planet"
  | "project"
  | "route"
  | "surface"
  | "guardian";

export type AlKawnVisualMapVisibility =
  | "ahmad_only"
  | "private_founder"
  | "private_internal"
  | "public_future_blocked";

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

export type AlKawnVisualMapNode = {
  id: string;
  arabicLabel: string;
  englishLabel: string;
  layerType: AlKawnVisualMapLayerType;
  owner: string;
  parent: string | null;
  children: string[];
  status: AlKawnVisualMapLayerStatus;
  truthSource: AlKawnVisualMapTruthSource;
  visibilityScope: AlKawnVisualMapVisibility;
  executionMeaning: string;
  boundaryType: AlKawnVisualMapBoundary;
  relationToOrigin: string;
  productTruthImpact: string;
  compactExplanation: string;
};

export type AlKawnVisualMapConnection = {
  id: string;
  from: string;
  to: string;
  relation: "origin" | "contains" | "governs" | "protects" | "stops" | "routes_to";
  meaning: string;
};

export type AlKawnVisualMapEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  edgeType: "owns" | "contains" | "governs" | "blocks" | "protects" | "routes_to";
  truthMeaning: string;
};

export type AlKawnVisualMapGroup = {
  id: string;
  label: string;
  purpose: string;
  nodeIds: string[];
};

export type AlKawnVisualMapLegendItem = {
  id: string;
  label: string;
  meaning: string;
};

export type AlKawnVisualMapBoundaryItem = {
  id: string;
  boundaryType: AlKawnVisualMapBoundary;
  label: string;
  meaning: string;
  affectedNodeIds: string[];
};

export type AlKawnVisualMapSummary = {
  title: "Al-Kawn Visual Map";
  status: "active_private_founder_map";
  totalNodes: number;
  totalEdges: number;
  privateOnly: true;
  publicLaunchBlocked: true;
  infinityModeActive: false;
  operatorModeActive: false;
  nextAction: "Al-Kawn Desktop Operating Environment";
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

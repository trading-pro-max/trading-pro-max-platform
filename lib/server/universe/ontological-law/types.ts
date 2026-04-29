import "server-only";

export type OntologicalEntityType =
  | "route"
  | "api"
  | "component"
  | "module"
  | "report"
  | "doc"
  | "test"
  | "asset"
  | "script"
  | "task"
  | "decision"
  | "future_feature";

export type OntologicalLayer =
  | "ahmad_human"
  | "ahmad_private_devices"
  | "alkawn"
  | "root_constitution"
  | "product_truth"
  | "universe_operating_kernel"
  | "ahmad_digital_vault"
  | "protection_core"
  | "universe_one"
  | "swiss_local_constitution"
  | "human_interface"
  | "sovereign_execution"
  | "execution_court"
  | "causal_execution"
  | "infinity_mode"
  | "operator_mode"
  | "self_building"
  | "pro_max_galaxy"
  | "earth_planet"
  | "trading_project"
  | "trading_surface"
  | "global_layer"
  | "public_pro_max_future"
  | "alkon_background_guardian";

export type TruthSourceType =
  | "device_time"
  | "device_date"
  | "local_project_state"
  | "report_evidence"
  | "test_evidence"
  | "git_evidence"
  | "manual_founder_decision"
  | "simulation_labeled"
  | "future_gate_pending";

export type ProductTruthImpact =
  | "highest_law"
  | "preserves_truth"
  | "requires_review"
  | "blocks_if_contradicted";

export type OntologicalExecutionVerdict =
  | "execute_inside_al_kawn"
  | "stop_for_legal_ahmad"
  | "stop_for_money_ahmad"
  | "block_product_truth_violation"
  | "block_secret_or_public_exposure"
  | "needs_more_evidence";

export type ProtectionState =
  | "private"
  | "read_only"
  | "approval_required"
  | "blocked"
  | "future_gate_pending";

export type ExistenceContractStatus =
  | "active"
  | "protected"
  | "compatibility"
  | "future_only"
  | "blocked"
  | "needs_more_evidence";

export type ExistenceContract = {
  entityId: string;
  entityType: OntologicalEntityType;
  arabicLabel: string;
  technicalLabel: string;
  parentLayer: OntologicalLayer;
  childLayers: OntologicalLayer[];
  reasonForExistence: string;
  ownerLayer: OntologicalLayer;
  truthSource: TruthSourceType;
  productTruthImpact: ProductTruthImpact;
  privacyImpact: ProtectionState;
  legalTouch: ProtectionState;
  moneyTouch: ProtectionState;
  securityTouch: ProtectionState;
  executionVerdict: OntologicalExecutionVerdict;
  rollbackExplanationPath: string;
  reportEvidence: string[];
  testEvidence: string[];
  status: ExistenceContractStatus;
};

export type OntologicalLaw = {
  id: "al_kawn_ontological_operating_law";
  arabicTitle: string;
  technicalTitle: string;
  highestLaw: string[];
  coreExecutionLaw: string[];
  physicalRealityBoundary: string;
  requiredWording: string[];
};

export type LayerBelongingRule = {
  id: string;
  parent: OntologicalLayer;
  child: OntologicalLayer;
  wording: string;
  status: "canonical" | "blocked_if_reversed" | "future_only";
};

export type TruthSourceRule = {
  source: TruthSourceType;
  meaning: string;
  allowedClaim: string;
  forbiddenClaim: string;
};

export type ProtectionStateRule = {
  state: ProtectionState;
  meaning: string;
  enforcement: string;
};

export type ExecutionVerdictRule = {
  verdict: OntologicalExecutionVerdict;
  meaning: string;
  triggeredBy: string[];
  enforcement: string;
};

export type ImpactMemoryRule = {
  id: string;
  meaning: string;
  requiredTrace: string;
};

export type RollbackExplanationRule = {
  id: string;
  question: string;
  answerRequirement: string;
};

export type OntologicalActionInput = {
  label: string;
  touchesLegal?: boolean;
  touchesMoney?: boolean;
  violatesProductTruth?: boolean;
  exposesSecretsOrPrivateSystems?: boolean;
  hasEvidence?: boolean;
};

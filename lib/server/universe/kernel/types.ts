export type UniverseKernelCapabilityStatus =
  | "available"
  | "available_with_notes"
  | "pending"
  | "not_available"
  | "blocked";

export type UniverseKernelBoundary = {
  id: string;
  label: string;
  status: UniverseKernelCapabilityStatus;
  source: string;
  note: string;
};

export type UniverseKernelPermissionSet = {
  allowedSafeInternal: string[];
  requiresAhmadApproval: string[];
  blocked: string[];
};

export type UniverseKernelGuard = {
  id: string;
  label: string;
  status: UniverseKernelCapabilityStatus;
  enforcedBy: string;
  note: string;
};

export type UniverseKernelState = {
  checkedAt: string;
  canonicalStatus: "canonicalized_adapter_ready";
  existingKernelPath: "lib/server/alkon-kernel/*";
  adapterPath: "lib/server/universe/kernel/*";
  implementationOwner: "existing_alkon_kernel";
  canonicalOwner: "Universe Operating Kernel";
  status: string;
  founderOnly: boolean;
  readOnly: boolean;
  publicExposure: boolean;
  noExecution: boolean;
  noDuplicateKernel: true;
  commandCount: number;
  boundaries: UniverseKernelBoundary[];
};

export type UniverseKernelRole = {
  label: "Universe Operating Kernel";
  sourceKernel: "Existing ALKON kernel";
  statements: string[];
  canonicalLayer: "Protection Core";
  privateMeaning: "root_private_operating_brain";
};

export type UniverseKernelTruth = {
  productTruthOverride: true;
  swissLocalConstitutionAboveGlobalLayer: true;
  publicLaunchBlocked: boolean;
  billingInactive: boolean;
  realMoneyDisabled: boolean;
  brokerExecutionDisabled: boolean;
  legalReviewPending: boolean;
  brandGateReadyWithNotes: boolean;
  universePrivateToAhmadDevices: true;
  alkonPrivateBackground: true;
  noPublicKernelExposure: boolean;
};

export type UniverseKernelReadiness = {
  checkedAt: string;
  ok: boolean;
  status: string;
  canonicalization: "existing_kernel_canonicalized";
  infinityModeReadiness: "blocked_until_founder_boundary_and_remaining_registry_conflicts";
  operatorModeReadiness: "preparation_only_after_visual_map_and_founder_decision";
  localDayOneReadiness: string;
  gaps: UniverseKernelBoundary[];
  founderBoundaryEnforced: true;
  ontologicalLawEnforced: true;
  nextSafeAction: "Al-Kawn Visual Map";
};

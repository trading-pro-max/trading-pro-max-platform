import "server-only";

import {
  getAlkonKernelReadiness,
  getAlkonKernelSnapshot,
  runAlkonKernelEngine,
} from "@/lib/server/alkon-kernel";
import { getSafeInternalActions } from "@/lib/server/universe/founder-boundary";
import {
  universeManagementReadiness,
  universeProductTruth,
} from "@/lib/server/universe-management";
import type {
  UniverseKernelBoundary,
  UniverseKernelGuard,
  UniverseKernelPermissionSet,
  UniverseKernelReadiness,
  UniverseKernelRole,
  UniverseKernelState,
  UniverseKernelTruth,
} from "./types";
export {
  canAlKawnExecuteAlone,
  explainFounderBoundary,
  getApprovalRequiredActions,
  getFounderBoundaryRules,
  getFounderDecisionMatrix,
  getNeverAloneActions,
  getSafeInternalActions,
  requiresAhmadApproval,
} from "@/lib/server/universe/founder-boundary";

export type {
  UniverseKernelBoundary,
  UniverseKernelCapabilityStatus,
  UniverseKernelGuard,
  UniverseKernelPermissionSet,
  UniverseKernelReadiness,
  UniverseKernelRole,
  UniverseKernelState,
  UniverseKernelTruth,
} from "./types";

const existingKernelPath = "lib/server/alkon-kernel/*" as const;
const adapterPath = "lib/server/universe/kernel/*" as const;

const pendingKernelGaps: UniverseKernelBoundary[] = [
  {
    id: "runtime_kill_switch",
    label: "Runtime kill switch",
    status: "pending",
    source: "Protection Core strategy",
    note: "The existing kernel documents blocking rules, but a dedicated runtime kill switch has not been implemented.",
  },
  {
    id: "rollback_execution",
    label: "Rollback execution",
    status: "pending",
    source: "future controlled implementation",
    note: "Rollback remains a future guarded capability; this adapter does not execute rollback actions.",
  },
  {
    id: "encrypted_digital_vault",
    label: "Encrypted Ahmad Digital Vault",
    status: "pending",
    source: "Ahmad decision required",
    note: "No raw personal documents or secrets are stored by the kernel adapter.",
  },
  {
    id: "external_account_control",
    label: "External account control",
    status: "blocked",
    source: "Product Truth and Ahmad approval gates",
    note: "External accounts, money movement, broker execution, and public launch remain blocked.",
  },
];

export function getUniverseKernelState(
  checkedAt = new Date().toISOString()
): UniverseKernelState {
  const snapshot = getAlkonKernelSnapshot(checkedAt);

  return {
    checkedAt,
    canonicalStatus: "canonicalized_adapter_ready",
    existingKernelPath,
    adapterPath,
    implementationOwner: "existing_alkon_kernel",
    canonicalOwner: "Universe Operating Kernel",
    status: snapshot.status,
    founderOnly: snapshot.founderOnly,
    readOnly: snapshot.readOnly,
    publicExposure: snapshot.publicExposure,
    noExecution: snapshot.noExecution,
    noDuplicateKernel: true,
    commandCount: snapshot.commandStatuses.length,
    boundaries: [
      {
        id: "founder_private",
        label: "Founder private boundary",
        status: "available",
        source: existingKernelPath,
        note: "Kernel snapshot is founder-only, read-only, and not public.",
      },
      {
        id: "product_truth",
        label: "Product Truth boundary",
        status: "available",
        source: existingKernelPath,
        note: "Existing kernel blocks live execution, real money, broker/feed activation, billing, public launch, and secrets exposure.",
      },
      {
        id: "swiss_local_constitution",
        label: "Swiss Local Constitution",
        status: "available_with_notes",
        source: "lib/server/universe-management/index.ts",
        note: "Swiss Local Constitution is above the Global Layer as a review gate, not as legal approval.",
      },
      ...pendingKernelGaps,
    ],
  };
}

export function getUniverseKernelRole(): UniverseKernelRole {
  return {
    label: "Universe Operating Kernel",
    sourceKernel: "Existing ALKON kernel",
    canonicalLayer: "Protection Core",
    privateMeaning: "root_private_operating_brain",
    statements: [
      "Existing kernel canonicalized as Universe Operating Kernel.",
      "Universe Operating Kernel is the root private operating brain.",
      "Universe Operating Kernel enforces Absolute Founder Boundary.",
      "Product Truth overrides every action.",
      "Swiss Local Constitution is above the Global Layer.",
      "Dangerous actions require Ahmad approval or remain blocked.",
      "No duplicate kernel exists.",
    ],
  };
}

export function getUniverseKernelPermissions(): UniverseKernelPermissionSet {
  const safeInternal = getSafeInternalActions().map((action) => action.label);

  return {
    allowedSafeInternal: safeInternal,
    requiresAhmadApproval: [
      "code-changing execution outside an approved mission",
      "Git commit or push unless the mission requires it",
      "architecture changes",
      "Local Day One start",
      "external account connection",
      "official, legal, money, brand, or final decisions",
      "money, payment, or receiving funds",
      "real trading or broker execution",
      "public launch or customer onboarding",
      "brand, domain, or ownership action",
      "personal secrets, private documents, or external account connection",
      "irreversible destructive action",
    ],
    blocked: [
      "public launch",
      "billing",
      "receiving money",
      "real money",
      "broker execution",
      "legal approval claims",
      "FINMA, licensed, or regulated claims",
      "final brand adoption",
      "domain purchase",
      "public الكون / Universe",
      "public ALKON",
      "secrets in Git",
    ],
  };
}

export function getUniverseKernelGuards(): UniverseKernelGuard[] {
  const engine = runAlkonKernelEngine();

  return [
    {
      id: "absolute_founder_boundary",
      label: "Absolute Founder Boundary",
      status: "available",
      enforcedBy: "lib/server/universe/founder-boundary/*",
      note: "Universe Operating Kernel enforces Absolute Founder Boundary. Money, legal, broker, public launch, brand, secrets, irreversible, external account, and final founder decisions require Ahmad.",
    },
    {
      id: "no_duplicate_kernel",
      label: "No duplicate kernel",
      status: "available",
      enforcedBy: adapterPath,
      note: "The Universe adapter delegates to the existing ALKON kernel and does not create parallel command logic.",
    },
    {
      id: "product_truth_override",
      label: "Product Truth override",
      status: "available",
      enforcedBy: existingKernelPath,
      note: "Product Truth blocks launch, billing, money, broker execution, unsafe public claims, shell execution, and secrets exposure.",
    },
    {
      id: "private_kernel_boundary",
      label: "Private kernel boundary",
      status: engine.publicExposure ? "blocked" : "available",
      enforcedBy: existingKernelPath,
      note: "The kernel remains founder-only, read-only, no-execution, and non-public.",
    },
    {
      id: "swiss_before_global",
      label: "Swiss Local Constitution above Global Layer",
      status: universeManagementReadiness.swissLocalConstitutionAboveGlobalLayer
        ? "available_with_notes"
        : "blocked",
      enforcedBy: "lib/server/universe-management/index.ts",
      note: "This is a review hierarchy only, not Swiss legal, FINMA, licensing, or regulatory approval.",
    },
    {
      id: "dangerous_actions",
      label: "Dangerous actions require Ahmad approval or remain blocked",
      status: "available",
      enforcedBy: existingKernelPath,
      note: "Founder authority gates sensitive launch, legal, money, brand, deletion, external accounts, and Local Day One actions.",
    },
  ];
}

export function getUniverseKernelNextAction() {
  return {
    next: "Al-Kawn Visual Map" as const,
    reason:
      "The existing kernel is canonicalized and the Absolute Founder Boundary is enforced. The safest next step is a private visual map of الكون before Operator Mode, Ultimate Depth, or Infinity Mode resumes.",
    mustNotDo: [
      "Do not start Infinity Mode.",
      "Do not start Operator Mode without Ahmad decision.",
      "Do not create another kernel.",
      "Do not launch public.",
      "Do not activate billing, real money, broker execution, or legal claims.",
    ],
  };
}

export function getUniverseKernelTruth(): UniverseKernelTruth {
  const snapshot = getAlkonKernelSnapshot();

  return {
    productTruthOverride: true,
    swissLocalConstitutionAboveGlobalLayer: true,
    publicLaunchBlocked: snapshot.productTruthStatus.publicLaunchInactive,
    billingInactive: snapshot.productTruthStatus.billingActivationBlocked,
    realMoneyDisabled: snapshot.productTruthStatus.realMoneyBlocked,
    brokerExecutionDisabled:
      snapshot.productTruthStatus.brokerFeedActivationBlocked,
    legalReviewPending: true,
    brandGateReadyWithNotes: universeProductTruth.brandGate === "ready_with_notes",
    universePrivateToAhmadDevices: true,
    alkonPrivateBackground: true,
    noPublicKernelExposure:
      snapshot.productTruthStatus.noPublicAlkonKernelExposure,
  };
}

export function getUniverseKernelReadiness(
  checkedAt = new Date().toISOString()
): UniverseKernelReadiness {
  const readiness = getAlkonKernelReadiness(checkedAt);

  return {
    checkedAt,
    ok: readiness.ok,
    status: readiness.status,
    canonicalization: "existing_kernel_canonicalized",
    infinityModeReadiness:
      "blocked_until_founder_boundary_and_remaining_registry_conflicts",
    operatorModeReadiness: "preparation_only_after_visual_map_and_founder_decision",
    localDayOneReadiness: readiness.localDayOneStatus,
    gaps: pendingKernelGaps,
    founderBoundaryEnforced: true,
    nextSafeAction: "Al-Kawn Visual Map",
  };
}

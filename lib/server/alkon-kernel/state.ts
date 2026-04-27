import { getAhmadSovereignDigitalTwin } from "./ahmad-digital-twin";
import { getBuilderSelection } from "./builder-selection";
import { getCommandPassport } from "./command-passport";
import { getCreatorRuntimeOath } from "./creator-runtime-oath";
import { getKernelDailyOperatingLoop } from "./daily-operating-loop";
import { getDefaultEvidenceChain } from "./evidence-chain";
import { getFounderFinalAuthority } from "./founder-authority";
import {
  getAhmadFounderSource,
  getFounderAuthorityRules,
  getFounderPreferences,
  getFounderPresenceRequirements,
  getFounderWill,
} from "./founder-source";
import { getInfiniteGovernedEvolution } from "./infinite-governed-evolution";
import { getLegalRealityGate } from "./legal-reality-gate";
import { getLocalDayOneGate } from "./local-day-one-gate";
import { getKernelMemoryLaw } from "./memory-law";
import { getKernelOneNextAction } from "./one-next-action";
import { getPublicTrustGate } from "./public-trust-gate";
import { getRealityOwnershipClassification } from "./reality-ownership";
import { getDefaultRealityTrial } from "./reality-trial";
import { getReturnToHeartDecision } from "./return-to-heart";
import { getTreasuryDiscipline } from "./treasury-discipline";
import type { AlkonKernelSnapshot, KernelCommandStatus } from "./types";
import { getKernelZeroTruthAudit } from "./zero-truth";

export const KERNEL_COMMAND_STATUSES: KernelCommandStatus[] = [
  {
    commandId: "command_0_creator_runtime_oath",
    label: "Command 0: Creator Runtime Oath",
    status: "active_with_notes",
    decision: "accept",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Alkon creates; Reality judges; Evidence proves; Memory preserves; Ahmad decides.",
    nextAction: "Apply the oath to every kernel decision.",
  },
  {
    commandId: "command_1_zero_truth",
    label: "Command 1: Zero Truth",
    status: "needs_review",
    decision: "request_ahmad_review",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Audit current reality without deleting or faking acceptance.",
    nextAction: "Ask for Ahmad visual review before Local Day One.",
  },
  {
    commandId: "command_2_reality_ownership",
    label: "Command 2: Reality Ownership",
    status: "active_with_notes",
    decision: "classify",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Classify public, private, and invisible layers.",
    nextAction: "Keep mixed reality behind gates.",
  },
  {
    commandId: "command_3_reality_trial",
    label: "Command 3: Reality Trial",
    status: "needs_review",
    decision: "request_evidence",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Reality has veto power over every created possibility.",
    nextAction: "Collect code, test, visual, truth, law, and Founder evidence.",
  },
  {
    commandId: "command_4_evidence_chain",
    label: "Command 4: Evidence Chain",
    status: "needs_review",
    decision: "request_evidence",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "No evidence means no closure.",
    nextAction: "Run validation and capture public leak proof.",
  },
  {
    commandId: "command_5_memory_law",
    label: "Command 5: Memory Law",
    status: "ready",
    decision: "accept",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Mandatory lessons preserve boundaries and prevent repeated drift.",
    nextAction: "Record safe lessons without raw sensitive personal data.",
  },
  {
    commandId: "command_6_return_to_heart",
    label: "Command 6: Return to Heart",
    status: "active_with_notes",
    decision: "return_to_heart",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "The current heart is Pro Max Trading, chart, paper execution, Assistant, Product Truth, and Local Day One.",
    nextAction: "Delay work that distracts from the heart.",
  },
  {
    commandId: "command_7_one_next_action",
    label: "Command 7: One Next Action",
    status: "active_with_notes",
    decision: "request_ahmad_review",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Return exactly one safe next action.",
    nextAction: "Ask Ahmad for visual acceptance or rejection.",
  },
  {
    commandId: "command_8_command_passport",
    label: "Command 8: Command Passport",
    status: "ready",
    decision: "accept",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Every command receives mission, scope, forbidden scope, validation, proof, and stop conditions.",
    nextAction: "Use passports before execution.",
  },
  {
    commandId: "command_9_builder_selection",
    label: "Command 9: Builder Selection",
    status: "ready",
    decision: "classify",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Codex is a builder, not the leader; Ahmad review leads sensitive decisions.",
    nextAction: "Select the smallest safe builder for each action.",
  },
  {
    commandId: "command_10_daily_operating_loop",
    label: "Command 10: Daily Operating Loop",
    status: "active_with_notes",
    decision: "accept",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Read reports, check heart and gates, detect drift, return one action, wait for Ahmad.",
    nextAction: "Continue daily loop privately.",
  },
  {
    commandId: "command_11_infinite_governed_evolution",
    label: "Command 11: Infinite Governed Evolution",
    status: "active_with_notes",
    decision: "accept",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Allow continuous improvement under gates; forbid unsafe activation without gates.",
    nextAction: "Grow through evidence and memory only.",
  },
  {
    commandId: "command_12_founder_final_authority",
    label: "Command 12: Founder Final Authority",
    status: "active_with_notes",
    decision: "request_ahmad_review",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Ahmad decides visual, identity, launch, billing, money, legal, security, public claims, future worlds, protected deletion, and Local Day One.",
    nextAction: "Escalate sensitive decisions to Ahmad.",
  },
  {
    commandId: "command_13_treasury_discipline",
    label: "Command 13: Treasury Discipline",
    status: "ready",
    decision: "block",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Money stays readiness-only; no bank/card data or payment execution in app.",
    nextAction: "Block payments until invoices, categories, budget, and Ahmad approval exist.",
  },
  {
    commandId: "command_14_legal_reality_gate",
    label: "Command 14: Legal Reality Gate",
    status: "needs_review",
    decision: "block",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Launch, billing, user data, claims, and regulated activity need legal reality review.",
    nextAction: "Keep public launch and billing inactive.",
  },
  {
    commandId: "command_15_public_trust_gate",
    label: "Command 15: Public Trust Gate",
    status: "active_with_notes",
    decision: "accept",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Public surfaces must be truthful, safe, clear, and free of Alkon or fake claims.",
    nextAction: "Keep public trust tests running.",
  },
  {
    commandId: "command_16_local_day_one_gate",
    label: "Command 16: Local Day One Gate",
    status: "needs_review",
    decision: "request_ahmad_review",
    privateOnly: true,
    publicExposureAllowed: false,
    summary: "Local Day One requires Ahmad visual acceptance, passing validation, Wake Report, clean Git, and no P0/P1 blockers.",
    nextAction: "Do not start automatically.",
  },
];

export function getAlkonKernelSnapshot(
  checkedAt = new Date().toISOString()
): AlkonKernelSnapshot {
  const zeroTruth = getKernelZeroTruthAudit();
  const oneNextAction = getKernelOneNextAction();

  return {
    checkedAt,
    mode: "alkon_complete_sovereign_kernel",
    status: "active_with_notes",
    visibility: "private_founder_only",
    founderOnly: true,
    readOnly: true,
    publicExposure: false,
    noExecution: true,
    founderSource: getAhmadFounderSource(),
    digitalTwin: getAhmadSovereignDigitalTwin(),
    founderWill: getFounderWill(),
    preferences: getFounderPreferences(),
    authorityRules: getFounderAuthorityRules(),
    presenceRequirements: getFounderPresenceRequirements(),
    creatorRuntimeOath: getCreatorRuntimeOath(),
    zeroTruth,
    realityOwnership: getRealityOwnershipClassification(),
    realityTrial: getDefaultRealityTrial(),
    evidenceChain: getDefaultEvidenceChain(),
    memoryLaw: getKernelMemoryLaw(),
    returnToHeart: getReturnToHeartDecision({ visualAcceptanceBlocked: true }),
    oneNextAction,
    commandPassport: getCommandPassport(),
    builderSelection: getBuilderSelection({ visual: true }),
    dailyOperatingLoop: getKernelDailyOperatingLoop(),
    infiniteGovernedEvolution: getInfiniteGovernedEvolution(),
    founderFinalAuthority: getFounderFinalAuthority("visual acceptance"),
    treasuryDiscipline: getTreasuryDiscipline(),
    legalRealityGate: getLegalRealityGate(),
    publicTrustGate: getPublicTrustGate(),
    localDayOneGate: getLocalDayOneGate(),
    commandStatuses: KERNEL_COMMAND_STATUSES,
    report: {
      reportId: "alkon_kernel_report",
      summary:
        "Alkon Sovereign Kernel is active_with_notes as a private read-only creator-runtime foundation. Local Day One remains gated by Ahmad visual acceptance and fresh evidence.",
      blockers: zeroTruth.blockers,
      nextAction: oneNextAction.oneNextAction,
    },
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
      kernelDoctrinePublic: false,
    },
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionActivationBlocked: true,
      noShellExecutionFromWebApp: true,
      noSecretsExposed: true,
      noImagesOrRasterAssets: true,
      noPublicAlkonKernelExposure: true,
    },
  };
}

export function getAlkonKernelReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonKernelSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noShellExecution: true,
    noPayments: true,
    noExternalCalls: true,
    noSecrets: true,
    noPublicApi: true,
    status: snapshot.status,
    oneNextAction: snapshot.oneNextAction.oneNextAction,
    localDayOneStatus: snapshot.localDayOneGate.localDayOneStatus,
    publicExposureStatus: snapshot.publicExposureStatus,
    productTruthStatus: snapshot.productTruthStatus,
    snapshot,
  };
}

import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type RevelationStage =
  | "first_3_seconds"
  | "first_10_seconds"
  | "first_30_seconds"
  | "first_3_minutes"
  | "first_day";

export type RevelationGoal =
  | "trust"
  | "clarity"
  | "guidance"
  | "usefulness"
  | "continuity";

export type RevelationSurface =
  | "home"
  | "public_nav"
  | "trading_workspace"
  | "assistant"
  | "journal_coach"
  | "plans"
  | "apps_platforms"
  | "academy"
  | "support"
  | "settings"
  | "diagnostics";

export type RevelationCheckStatus =
  | "pass"
  | "needs_polish"
  | "blocked"
  | "future"
  | "not_applicable";

export type RevelationGateId =
  | "earth_presence_gate"
  | "product_clarity_gate"
  | "assistant_awakening_gate"
  | "workspace_usefulness_gate"
  | "first_day_continuity_gate"
  | "product_truth_gate"
  | "public_private_boundary_gate"
  | "accessibility_gate"
  | "visual_acceptance_gate";

export type RevelationCheck = {
  checkId: string;
  stage: RevelationStage;
  surface: RevelationSurface;
  goal: RevelationGoal;
  requirement: string;
  status: RevelationCheckStatus;
  reason: string;
  requiredFix: string;
  proof: string;
};

export type RevelationGate = {
  gateId: RevelationGateId;
  label: string;
  status: RevelationCheckStatus;
  checks: RevelationCheck[];
  summary: string;
};

export type RevelationProductTruth = {
  paperSafeActive: true;
  webCurrent: true;
  desktopPlanned: true;
  mobilePlanned: true;
  liveExecutionBlocked: true;
  realMoneyBlocked: true;
  brokerFeedInactive: true;
  billingInactive: true;
  publicLaunchInactive: true;
  noFakeClaims: true;
  noImagesOrRasterAssets: true;
  noShellExecution: true;
};

export type RevelationSnapshot = {
  checkedAt: string;
  mode: "living_earth_revelation_experience";
  status: "ready_with_notes" | "needs_polish" | "blocked";
  publicName: "Living Earth Revelation Experience";
  first3Seconds: RevelationCheck[];
  first10Seconds: RevelationCheck[];
  first30Seconds: RevelationCheck[];
  first3Minutes: RevelationCheck[];
  firstDay: RevelationCheck[];
  gates: RevelationGate[];
  blockedIssues: string[];
  needsPolish: string[];
  nextSafeActions: string[];
  visualAcceptanceNeeded: boolean;
  productTruth: RevelationProductTruth;
  publicCopy: string;
  founderReadiness: {
    revelationReadiness: "ready_with_notes";
    first3SecondsStatus: RevelationCheckStatus;
    first10SecondsStatus: RevelationCheckStatus;
    first30SecondsStatus: RevelationCheckStatus;
    first3MinutesStatus: RevelationCheckStatus;
    firstDayStatus: RevelationCheckStatus;
    visualAcceptanceNotes: string[];
  };
};

export type PublicRevelationSnapshot = {
  checkedAt: string;
  mode: "living_earth_revelation_experience";
  status: RevelationSnapshot["status"];
  publicName: RevelationSnapshot["publicName"];
  first3Seconds: RevelationCheck[];
  first10Seconds: RevelationCheck[];
  first30Seconds: RevelationCheck[];
  first3Minutes: RevelationCheck[];
  firstDay: RevelationCheck[];
  blockedIssues: string[];
  needsPolish: string[];
  nextSafeActions: string[];
  productTruth: RevelationProductTruth;
  publicCopy: string;
};

export type RevelationDiagnosticsProbe = DiagnosticsProbe;

import "server-only";

export type DesktopPackagingPreparationState =
  | "ready"
  | "ready_with_notes"
  | "pending"
  | "blocked"
  | "future_gate"
  | "needs_ahmad_decision";

export type DesktopPackagingPreparationCheck = {
  id: string;
  label: string;
  state: DesktopPackagingPreparationState;
  status: string;
  checks: string[];
  evidence: string[];
  risk: string;
  nextAction: string;
};

export type DesktopPackagingPreparationNextAction = {
  next: string;
  reason: string;
  blockedUntil: string[];
};

export type DesktopPackagingPreparation = {
  id: "private_desktop_packaging_preparation";
  title: "Private Desktop Packaging Preparation";
  status: DesktopPackagingPreparationState;
  summary: string;
  requiredWording: string[];
  previousGates: DesktopPackagingPreparationCheck;
  packagingCapability: DesktopPackagingPreparationCheck;
  nativeShellStatus: DesktopPackagingPreparationCheck;
  packageScriptStatus: DesktopPackagingPreparationCheck;
  authGateStatus: DesktopPackagingPreparationCheck;
  secretSafety: DesktopPackagingPreparationCheck;
  productTruth: string[];
  blockedActions: string[];
  nextAction: DesktopPackagingPreparationNextAction;
};

import "server-only";

export type DesktopPackagingGateState =
  | "ready"
  | "ready_with_notes"
  | "pending"
  | "blocked"
  | "needs_ahmad_decision"
  | "future_gate";

export type DesktopPackagingReadiness = {
  id: string;
  label: string;
  state: DesktopPackagingGateState;
  status: string;
  checks: string[];
  evidence: string[];
  risk: string;
  nextAction: string;
};

export type DesktopSecretSafety = DesktopPackagingReadiness & {
  secretsInGit: "blocked";
  secretsInBundle: "blocked";
  externalAccountAutoConnect: "blocked";
};

export type DesktopPackagingNextAction = {
  next: string;
  reason: string;
  blockedUntil: string[];
};

export type DesktopPackagingGate = {
  id: "private_desktop_packaging_gate";
  title: "Private Desktop Packaging Gate";
  status: DesktopPackagingGateState;
  summary: string;
  requiredWording: string[];
  shellReadiness: DesktopPackagingReadiness;
  nativeShellReadiness: DesktopPackagingReadiness;
  packageReadiness: DesktopPackagingReadiness;
  signingReadiness: DesktopPackagingReadiness;
  privateDistributionReadiness: DesktopPackagingReadiness;
  authReadiness: DesktopPackagingReadiness;
  secretSafety: DesktopSecretSafety;
  productTruth: string[];
  blockedActions: string[];
  nextAction: DesktopPackagingNextAction;
};

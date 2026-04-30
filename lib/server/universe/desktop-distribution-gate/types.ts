import "server-only";

export type DesktopDistributionGateState =
  | "ready"
  | "ready_with_notes"
  | "pending"
  | "blocked"
  | "future_gate"
  | "needs_ahmad_decision";

export type DesktopDistributionGateCheck = {
  id: string;
  label: string;
  state: DesktopDistributionGateState;
  status: string;
  checks: string[];
  evidence: string[];
  risk: string;
  nextAction: string;
};

export type DesktopDistributionNextAction = {
  next: string;
  reason: string;
  blockedUntil: string[];
};

export type DesktopDistributionGate = {
  id: "private_desktop_distribution_gate";
  title: "Private Desktop Distribution Gate";
  status: DesktopDistributionGateState;
  summary: string;
  requiredWording: string[];
  previousReports: DesktopDistributionGateCheck;
  privateDistributionReadiness: DesktopDistributionGateCheck;
  publicDistributionBlock: DesktopDistributionGateCheck;
  productionSigningGate: DesktopDistributionGateCheck;
  artifactPolicy: DesktopDistributionGateCheck;
  secretSafety: DesktopDistributionGateCheck;
  productTruth: string[];
  blockedActions: string[];
  nextAction: DesktopDistributionNextAction;
};

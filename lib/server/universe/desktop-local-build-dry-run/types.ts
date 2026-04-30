import "server-only";

export type DesktopLocalBuildDryRunState =
  | "ready"
  | "ready_with_notes"
  | "pending"
  | "blocked"
  | "future_gate"
  | "needs_ahmad_decision";

export type DesktopLocalBuildDryRunCheck = {
  id: string;
  label: string;
  state: DesktopLocalBuildDryRunState;
  status: string;
  checks: string[];
  evidence: string[];
  risk: string;
  result: string;
  nextAction: string;
};

export type DesktopLocalBuildDryRunNextAction = {
  next: string;
  reason: string;
  blockedUntil: string[];
};

export type DesktopLocalBuildDryRun = {
  id: "private_desktop_local_build_dry_run";
  title: "Private Desktop Local Build Dry Run";
  status: DesktopLocalBuildDryRunState;
  summary: string;
  requiredWording: string[];
  previousReports: DesktopLocalBuildDryRunCheck;
  capability: DesktopLocalBuildDryRunCheck;
  scriptStatus: DesktopLocalBuildDryRunCheck;
  nativeShellStatus: DesktopLocalBuildDryRunCheck;
  dryRunResult: DesktopLocalBuildDryRunCheck;
  artifactSafety: DesktopLocalBuildDryRunCheck;
  secretSafety: DesktopLocalBuildDryRunCheck;
  productTruth: string[];
  blockedActions: string[];
  nextAction: DesktopLocalBuildDryRunNextAction;
};

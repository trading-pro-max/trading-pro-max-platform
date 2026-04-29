import "server-only";

export type LocalPackagedAuthGateState =
  | "ready"
  | "ready_with_notes"
  | "pending"
  | "blocked"
  | "future_gate"
  | "needs_ahmad_decision";

export type LocalPackagedAuthReadiness = {
  id: string;
  label: string;
  state: LocalPackagedAuthGateState;
  status: string;
  checks: string[];
  evidence: string[];
  risk: string;
  nextAction: string;
};

export type DesktopAccessModel = LocalPackagedAuthReadiness & {
  scope: "private_ahmad_only";
  customerLogin: "not_applicable";
  publicAuth: "blocked";
  saasAccountSystem: "not_applicable";
};

export type AuthSecretSafety = LocalPackagedAuthReadiness & {
  secretsInGit: "blocked";
  secretsInBundle: "blocked";
  hardcodedAuthSecret: "blocked";
  desktopApiKeys: "blocked";
};

export type LocalAuthNextAction = {
  next: string;
  reason: string;
  blockedUntil: string[];
};

export type LocalPackagedAuthGate = {
  id: "local_packaged_auth_gate";
  title: "Local Packaged Auth Gate";
  status: LocalPackagedAuthGateState;
  summary: string;
  requiredWording: string[];
  privateAccessModel: DesktopAccessModel;
  localAuthReadiness: LocalPackagedAuthReadiness;
  packagedAppLockReadiness: LocalPackagedAuthReadiness;
  sessionTimeoutReadiness: LocalPackagedAuthReadiness;
  authSecretSafety: AuthSecretSafety;
  externalAuthStatus: LocalPackagedAuthReadiness;
  productTruth: string[];
  blockedClaims: string[];
  nextAction: LocalAuthNextAction;
};

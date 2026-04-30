import "server-only";

export type LocalDesktopAuthState =
  | "ready"
  | "ready_with_notes"
  | "pending"
  | "blocked"
  | "future_gate"
  | "needs_ahmad_decision";

export type LocalDesktopAuthSection = {
  id: string;
  label: string;
  state: LocalDesktopAuthState;
  status: string;
  checks: string[];
  evidence: string[];
  limitation: string;
  nextAction: string;
};

export type LocalDesktopAuthPolicy = {
  id: "local_pin_passphrase_auth_policy";
  title: "Local PIN / Passphrase Auth";
  status: LocalDesktopAuthState;
  summary: string;
  sessionTimeoutMinutes: number;
  requiredWording: string[];
  policy: string[];
  limitations: string[];
};

export type LocalDesktopAuthReadiness = LocalDesktopAuthSection & {
  pinPassphrase: "implemented_local_browser_lock";
  webCrypto: "required_when_available";
  productionGradeAuth: "future_gate";
};

export type LocalDesktopAuthStatus = LocalDesktopAuthSection & {
  localLock: "implemented";
  manualLock: "implemented";
  sessionTimeout: "active";
  resetPath: "implemented_with_warning";
};

export type LocalDesktopAuthBoundaries = LocalDesktopAuthSection & {
  publicAuth: "blocked";
  customerLogin: "blocked";
  externalAuth: "blocked";
  plaintextSecretStorage: "blocked";
};

export type LocalDesktopAuthNextAction = {
  next: string;
  reason: string;
  blockedUntil: string[];
};

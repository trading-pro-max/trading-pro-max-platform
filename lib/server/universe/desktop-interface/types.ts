export type AlKawnDesktopStatus =
  | "active"
  | "checked"
  | "protected"
  | "pending"
  | "blocked"
  | "future_gate"
  | "inactive";

export type AlKawnDecisionCategory =
  | "direct_internal_execution"
  | "legal_stop"
  | "money_stop"
  | "blocked_by_product_truth";

export type AlKawnQuickActionCategory = "safe" | "stop_gate" | "blocked";

export type AlKawnDecisionOwner = "الكون" | "Ahmad";

export type AlKawnPriority = "P0" | "P1" | "P2" | "P3";

export type AlKawnDesktopBootStep = {
  id: string;
  order: number;
  label: string;
  status: AlKawnDesktopStatus;
  detail: string;
};

export type AlKawnDesktopQuickAction = {
  id: string;
  label: string;
  category: AlKawnQuickActionCategory;
  intent: string;
  resultPreview: string;
};

export type AlKawnDesktopDecisionGroup = {
  id: string;
  label: string;
  category: AlKawnDecisionCategory;
  description: string;
  examples: string[];
};

export type AlKawnDesktopTask = {
  id: string;
  title: string;
  layer: string;
  priority: AlKawnPriority;
  status: AlKawnDesktopStatus;
  category: string;
  nextStep: string;
  whoDecides: AlKawnDecisionOwner;
  reason: string;
};

export type AlKawnDesktopReport = {
  id: string;
  title: string;
  path: string;
  status: AlKawnDesktopStatus;
  summary: string;
};

export type AlKawnDesktopAppointment = {
  id: string;
  title: string;
  status: AlKawnDesktopStatus;
  rule: string;
  nextStep: string;
};

export type AlKawnDesktopRealityCenter = {
  deviceTime: string;
  deviceDate: string;
  dayNightPhase: string;
  season: string;
  weather: "not connected";
  location: "not requested";
  soundscape: "off / user controlled";
  pulse: string;
  sourceLabels: string[];
};

export type AlKawnDesktopTruthItem = {
  id: string;
  label: string;
  value: string;
  status: AlKawnDesktopStatus;
};

export type AlKawnDesktopLayer = {
  id: string;
  label: string;
  status: AlKawnDesktopStatus;
  meaning: string;
  boundary: string;
};

export type AlKawnDesktopProtectionState = {
  status: AlKawnDesktopStatus;
  rules: string[];
};

export type AlKawnDesktopVaultState = {
  status: AlKawnDesktopStatus;
  rules: string[];
};

export type AlKawnDesktopKernelState = {
  status: AlKawnDesktopStatus;
  role: string;
  guards: string[];
  gaps: string[];
};

export type AlKawnDesktopNativeShellState = {
  electron: "not_found" | "found";
  tauri: "not_found" | "found";
  desktopRoute: "/desktop/kawn";
  nativeShellStatus: "future_gate" | "available";
  note: string;
};

export type AlKawnDesktopState = {
  title: string;
  role: string;
  nativeShell: AlKawnDesktopNativeShellState;
  boot: AlKawnDesktopBootStep[];
  welcomeMessage: string;
  quickActions: AlKawnDesktopQuickAction[];
  decisionCenter: AlKawnDesktopDecisionGroup[];
  tasks: AlKawnDesktopTask[];
  reports: AlKawnDesktopReport[];
  appointments: AlKawnDesktopAppointment[];
  reality: AlKawnDesktopRealityCenter;
  productTruth: AlKawnDesktopTruthItem[];
  layers: AlKawnDesktopLayer[];
  protection: AlKawnDesktopProtectionState;
  vault: AlKawnDesktopVaultState;
  kernel: AlKawnDesktopKernelState;
  nextSafeAction: string;
};

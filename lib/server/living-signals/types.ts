export type LivingSignalVisibility = "public" | "private_founder" | "internal_diagnostics";

export type LivingSignalState =
  | "ready"
  | "degraded"
  | "blocked"
  | "fallback"
  | "planned"
  | "inactive";

export type LivingSignal = {
  id: string;
  label: string;
  purpose: string;
  visibility: LivingSignalVisibility;
  displayLocation: string;
  updateCadence: "client_local" | "request_snapshot" | "manual_review" | "future";
  state: LivingSignalState;
  clutterRisk: "low" | "medium" | "high";
  reducedMotionBehavior: string;
  fakeStatePrevention: string;
};

export type LivingSignalMapSnapshot = {
  checkedAt: string;
  mode: "living_planet_signal_map";
  signals: LivingSignal[];
  truth: {
    overAnimation: "blocked";
    fakeLiveMarketStatus: "blocked";
    chartDistraction: "blocked";
    publicClutter: "blocked";
  };
};

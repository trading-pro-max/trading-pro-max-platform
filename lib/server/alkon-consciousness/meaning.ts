import type {
  AlkonMeaning,
  AlkonMeaningCategory,
  AlkonSignal,
  AlkonSignalType,
} from "./types";

const CATEGORY_BY_SIGNAL: Record<AlkonSignalType, AlkonMeaningCategory> = {
  founder_idea: "founder_preference",
  visual_rejection: "visual_pain",
  chart_annoyance: "visual_pain",
  public_ui_gap: "product_gap",
  shell_duplication: "product_gap",
  logo_rejection: "visual_pain",
  build_failure: "build_need",
  validation_failure: "build_need",
  public_private_leak: "public_trust_risk",
  secret_risk: "safety_risk",
  billing_request: "blocked_activation",
  live_request: "blocked_activation",
  broker_feed_request: "blocked_activation",
  social_publish_request: "blocked_activation",
  launch_request: "blocked_activation",
  codex_result: "operational_signal",
  local_day_signal: "operational_signal",
  support_gap: "product_gap",
  apps_gap: "future_readiness",
  assistant_gap: "user_confusion",
  environment_signal: "operational_signal",
  weather_signal: "operational_signal",
  market_session_signal: "operational_signal",
};

const LESSON_REFERENCES: Partial<Record<AlkonSignalType, string[]>> = {
  visual_rejection: ["no-images rule", "visual acceptance required"],
  logo_rejection: ["old logos rejected", "public logo subtitle rejected"],
  chart_annoyance: ["chart annoyance history", "chart is king"],
  shell_duplication: ["duplicate topbar issue", "workspace must have one terminal shell"],
  public_private_leak: ["Alkon must never be public", "public leak test required"],
  secret_risk: ["no secrets", "Secrets Authority keeps values hidden"],
  apps_gap: ["no fake download", "apps/platforms truth"],
  support_gap: ["no fake support backend"],
};

export function interpretAlkonMeaning(signal: AlkonSignal): AlkonMeaning {
  const category = CATEGORY_BY_SIGNAL[signal.type];
  const blockedActivation = category === "blocked_activation";
  const criticalSafety =
    signal.type === "secret_risk" || signal.type === "public_private_leak";
  const visualPain =
    signal.type === "chart_annoyance" ||
    signal.type === "logo_rejection" ||
    signal.type === "visual_rejection" ||
    signal.type === "shell_duplication";

  return {
    signalId: signal.signalId,
    category,
    whatHappened: `${signal.title} was sensed on ${signal.surface}.`,
    whyItMatters: blockedActivation
      ? "The request tries to activate a real-world or unsafe capability that Product Truth blocks for local scope."
      : criticalSafety
        ? "The signal may harm public trust, secrets safety, or the private Alkon boundary."
        : visualPain
          ? "Ahmad's visual acceptance and chart comfort are product-critical because users must trust the workspace immediately."
          : "The signal identifies a product, readiness, or operating gap that should be routed instead of treated randomly.",
    affectedWorld: signal.world,
    affectedSurface: signal.surface,
    userImpact: criticalSafety ? "critical" : visualPain ? "high" : blockedActivation ? "medium" : "low",
    founderImpact: criticalSafety ? "critical" : visualPain ? "high" : "medium",
    safetyImpact: criticalSafety ? "critical" : blockedActivation ? "blocked" : "review",
    trustImpact: criticalSafety ? "critical" : visualPain ? "high" : "medium",
    businessImpact: blockedActivation || criticalSafety ? "high" : "medium",
    repeatedLessonReferences: LESSON_REFERENCES[signal.type] ?? [],
  };
}

export function interpretAlkonMeanings(signals: AlkonSignal[]) {
  return signals.map(interpretAlkonMeaning);
}

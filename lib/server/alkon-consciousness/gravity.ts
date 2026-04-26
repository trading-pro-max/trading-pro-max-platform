import type {
  AlkonActionType,
  AlkonGravity,
  AlkonGravityDecision,
  AlkonLawDecision,
  AlkonMeaning,
  AlkonSignal,
} from "./types";

const P0_SIGNALS = new Set([
  "public_private_leak",
  "secret_risk",
  "build_failure",
  "validation_failure",
  "shell_duplication",
]);

const P1_SIGNALS = new Set([
  "logo_rejection",
  "chart_annoyance",
  "visual_rejection",
  "public_ui_gap",
  "assistant_gap",
  "support_gap",
  "apps_gap",
]);

const P3_SIGNALS = new Set([
  "apps_gap",
  "weather_signal",
  "market_session_signal",
  "environment_signal",
]);

function actionForPriority(
  priority: AlkonGravity,
  signal: AlkonSignal,
  law: AlkonLawDecision
): AlkonActionType {
  if (priority === "black_hole") return "block";
  if (law.outcome === "quarantined") return "quarantine";
  if (signal.type === "shell_duplication") return "create_cleanup_candidate";
  if (
    signal.type === "chart_annoyance" ||
    signal.type === "logo_rejection" ||
    signal.type === "visual_rejection"
  ) {
    return "create_visual_review";
  }
  if (priority === "P0_critical" || priority === "P1_high") {
    return "create_task_passport";
  }

  return "report_only";
}

export function assignAlkonGravity(
  signal: AlkonSignal,
  meaning: AlkonMeaning,
  law: AlkonLawDecision
): AlkonGravityDecision {
  let priority: AlkonGravity = "P2_standard";

  if (law.outcome === "black_hole") {
    priority = "black_hole";
  } else if (law.outcome === "blocked") {
    priority = "blocked";
  } else if (P0_SIGNALS.has(signal.type) || meaning.safetyImpact === "critical") {
    priority = "P0_critical";
  } else if (P1_SIGNALS.has(signal.type)) {
    priority = "P1_high";
  } else if (P3_SIGNALS.has(signal.type) && meaning.category === "future_readiness") {
    priority = "P3_future";
  }

  return {
    signalId: signal.signalId,
    priority,
    explanation:
      priority === "black_hole"
        ? "The signal falls into a forbidden activation or safety category."
        : priority === "P0_critical"
          ? "The signal can damage safety, trust, build validity, or the private/public boundary."
          : priority === "P1_high"
            ? "The signal affects visual acceptance, user confidence, or a major public path."
            : priority === "P3_future"
              ? "The signal is useful future readiness, but not local closure work."
              : "The signal is safe standard readiness, documentation, test, or polish work.",
    escalationTarget:
      priority === "black_hole"
        ? "Black Hole Zone"
        : priority === "P0_critical"
          ? "Founder Command"
          : priority === "P1_high"
            ? "Result Tribunal"
            : "Product Memory",
    allowedNextAction: actionForPriority(priority, signal, law),
  };
}

export function assignAlkonGravities(
  signals: AlkonSignal[],
  meanings: AlkonMeaning[],
  laws: AlkonLawDecision[]
) {
  return signals.map((signal) => {
    const meaning = meanings.find((item) => item.signalId === signal.signalId);
    const law = laws.find((item) => item.signalId === signal.signalId);

    if (!meaning || !law) {
      throw new Error(`Missing law or meaning for signal ${signal.signalId}.`);
    }

    return assignAlkonGravity(signal, meaning, law);
  });
}

import type { JarBuildItem, JarRealityTrialResult } from "./types";

export function runJarRealityTrial(item: JarBuildItem): JarRealityTrialResult {
  if (item.decision === "black_hole" || item.decision === "block") {
    return {
      itemId: item.id,
      passed: false,
      verdict: "blocked",
      reasons: ["Jar contains unsafe or sensitive action and cannot exit toward execution."],
      missingEvidence: ["Ahmad safe alternative decision"],
    };
  }

  if (item.decision === "delay" || item.decision === "archive") {
    return {
      itemId: item.id,
      passed: false,
      verdict: "delay",
      reasons: ["The item is not part of the current heart."],
      missingEvidence: ["Future Reality Trial"],
    };
  }

  if (item.decision === "ask_ahmad") {
    return {
      itemId: item.id,
      passed: false,
      verdict: "needs_ahmad",
      reasons: ["The item requires Ahmad final authority."],
      missingEvidence: ["Ahmad decision"],
    };
  }

  return {
    itemId: item.id,
    passed: true,
    verdict: "safe_to_prepare",
    reasons: ["Jar classification is complete.", "Unsafe actions remain blocked."],
    missingEvidence: [],
  };
}

import { runJarRealityTrial } from "./reality-trial-adapter";
import type { JarBuildItem, JarExitPermit } from "./types";

export function createJarExitPermit(item: JarBuildItem): JarExitPermit {
  const trial = runJarRealityTrial(item);
  const commandPassportAllowed = trial.passed && item.commandPassportRequired;
  const needsAhmad = trial.verdict === "needs_ahmad";

  return {
    itemId: item.id,
    jarId: item.jarId,
    decision: item.decision,
    status: commandPassportAllowed
      ? "approved_for_preview"
      : trial.verdict === "blocked"
      ? "blocked"
      : trial.verdict === "delay"
      ? "delayed"
      : "needs_ahmad_decision",
    exitPermitRequired: true,
    commandPassportAllowed,
    requiresAhmadDecision: needsAhmad,
    reason: trial.reasons.join(" "),
    validationRequired: [
      "npx tsc --noEmit",
      "npx eslint app modules tests --max-warnings=0",
      "npm run build",
      "npm run test:regression",
      "npm run smoke:routes",
    ],
    stopConditions: [
      "public Alkon leak",
      "Product Truth regression",
      "secrets exposure",
      "billing/live/real-money activation",
      "shell or Codex execution from web",
      "Ahmad decision missing when required",
    ],
  };
}

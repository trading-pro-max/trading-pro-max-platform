import "server-only";

import type { CosmicMemoryUpdate, CosmicTask, CosmicTribunalResult } from "./types";

export function buildCosmicMemoryUpdate(
  task: Pick<CosmicTask, "taskId" | "event" | "blockedReason">,
  tribunal: CosmicTribunalResult
): CosmicMemoryUpdate {
  const blocked = tribunal.decision === "blocked" || tribunal.decision === "black_holed";

  return {
    memoryId: `${task.taskId}-memory`,
    status: blocked ? "blocked" : "ready",
    acceptedPattern: blocked
      ? "Keep forbidden requests out of execution and report safe alternatives."
      : "Move work through source, gravity, orbit, owner, worker, validation, tribunal, and memory.",
    rejectedPattern:
      task.blockedReason ??
      "Unscoped tasks, skipped validation, public internal terms, raster assets, and fake activation are rejected.",
    repeatedVisualIssue:
      task.event.type === "logo_rejected" || task.event.type === "chart_annoying"
        ? `${task.event.title} must update visual acceptance memory.`
        : "No repeated visual issue detected in this task.",
    noImagesRule:
      "No generated images or raster assets are added; visual systems stay code, CSS, and SVG only.",
    publicPrivateBoundaryLesson:
      "Alkon and Cosmic Operating Physics remain private Founder-only; public users see Trading Pro Max public language.",
    alkonOnlyRule:
      "Cosmic task distribution belongs to Founder Command and never to public plans, navigation, Assistant, or diagnostics.",
    chartComfortLesson:
      task.event.type === "chart_annoying"
        ? "Chart comfort work must protect visibility, contrast, and chart-first hierarchy."
        : "Chart work stays paper-safe and cannot imply live execution.",
    logoCorrectionLesson:
      task.event.type === "logo_rejected"
        ? "Logo corrections must respect Earth identity, compact readability, no raster assets, and public-safe wording."
        : "Identity work remains code-only and boundary-safe.",
    taskDistributionLesson:
      "No task is random: every task requires source, energy, gravity, orbit, owner, satellite, station, worker, passport, license, validation, tribunal, memory, and Founder report.",
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  };
}

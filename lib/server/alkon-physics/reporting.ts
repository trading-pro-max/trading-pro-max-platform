import "server-only";

import type {
  CosmicFounderReport,
  CosmicMemoryUpdate,
  CosmicTask,
  CosmicTribunalResult,
} from "./types";

export function buildCosmicFounderReport(
  task: Pick<
    CosmicTask,
    "taskId" | "status" | "event" | "gravity" | "orbit" | "planetOwner" | "worker" | "blockedReason"
  >,
  tribunal: CosmicTribunalResult,
  memory: CosmicMemoryUpdate
): CosmicFounderReport {
  return {
    reportId: `${task.taskId}-founder-report`,
    eventId: task.event.eventId,
    gravity: task.gravity.priority,
    orbit: task.orbit.orbitPath,
    planetOwner: task.planetOwner.id,
    worker: task.worker.id,
    status: task.status,
    blockedReason: task.blockedReason,
    nextAction: task.blockedReason
      ? "Keep the request blocked, record the safe alternative, and do not automate execution."
      : "Review the task passport, run validation, then send the result to tribunal before memory.",
    validationRequired: tribunal.decision !== "black_holed",
    founderReviewRequired: tribunal.founderReviewRequired,
    memoryLesson: memory.taskDistributionLesson,
    publicExposure: false,
  };
}

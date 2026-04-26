import "server-only";

import { classifyCosmicEvent } from "./cosmic-event-classifier";
import { getCosmicDependencies } from "./dependencies";
import { assignGravity } from "./gravity";
import { getCosmicHandoffs } from "./handoffs";
import { COSMIC_LIFECYCLE } from "./lifecycle";
import { buildCosmicMemoryUpdate } from "./memory";
import { routeCosmicEvent } from "./orbit-router";
import { getPlanetSystemOwner } from "./planet-systems";
import { buildCosmicFounderReport } from "./reporting";
import { evaluateRiskZone } from "./risk-zones";
import { getSatelliteMonitors } from "./satellites";
import { getOperatingStation } from "./stations";
import { getCosmicWorker } from "./workers";
import type {
  CosmicEventInput,
  CosmicStatus,
  CosmicSubtask,
  CosmicTask,
  CosmicTribunalResult,
  CosmicValidation,
  CosmicWorkerId,
  OperatingStationId,
  SatelliteMonitorId,
} from "./types";

function taskId(seed: string): string {
  return `cosmic-task-${seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 56)}`;
}

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function buildSubtasks(workerId: CosmicWorkerId): CosmicSubtask[] {
  return [
    {
      subtaskId: `${workerId}-passport`,
      title: "Prepare Task Passport with allowed scope, forbidden scope, and validation requirements.",
      ownerWorker: "codex_passport_worker",
      status: "passport_ready",
      validationRequired: true,
    },
    {
      subtaskId: `${workerId}-work`,
      title: "Complete the scoped worker task without activating forbidden systems.",
      ownerWorker: workerId,
      status: "validation_required",
      validationRequired: true,
    },
    {
      subtaskId: `${workerId}-tribunal`,
      title: "Send validated result to Result Tribunal and Memory Universe.",
      ownerWorker: "result_tribunal_worker",
      status: "tribunal_pending",
      validationRequired: true,
    },
  ];
}

function buildValidation(
  taskSeed: string,
  commands: string[],
  blocked: boolean
): CosmicValidation {
  return {
    validationId: `${taskSeed}-validation`,
    status: blocked ? "blocked" : "required",
    commands: blocked
      ? ["Record blocked reason", "Verify no activation occurred"]
      : commands,
    evidenceRequired: [
      "Product Truth check",
      "public/private boundary check",
      "no secrets check",
      "git diff --check",
    ],
    publicBoundaryCheckRequired: true,
    productTruthCheckRequired: true,
    noSecretsCheckRequired: true,
  };
}

function buildTribunal(
  taskSeed: string,
  blockedReason: string | null,
  hardForbidden: boolean
): CosmicTribunalResult {
  if (hardForbidden) {
    return {
      tribunalId: `${taskSeed}-tribunal`,
      status: "blocked",
      decision: "black_holed",
      reasons: [blockedReason ?? "Hard-forbidden scope was detected."],
      founderReviewRequired: true,
    };
  }

  if (blockedReason) {
    return {
      tribunalId: `${taskSeed}-tribunal`,
      status: "blocked",
      decision: "blocked",
      reasons: [blockedReason],
      founderReviewRequired: true,
    };
  }

  return {
    tribunalId: `${taskSeed}-tribunal`,
    status: "pending",
    decision: "accept_after_validation",
    reasons: [
      "Validation, public boundary, Product Truth, and memory checks are required before acceptance.",
    ],
    founderReviewRequired: true,
  };
}

export function buildCosmicTaskGraph(
  input: CosmicEventInput,
  checkedAt = new Date().toISOString()
): CosmicTask {
  const event = classifyCosmicEvent(input, checkedAt);
  const gravity = assignGravity(event);
  const orbit = routeCosmicEvent(event, gravity);
  const planetOwner = getPlanetSystemOwner(event.suggestedPlanetOwner);
  const satelliteIds = unique<SatelliteMonitorId>([
    ...orbit.satellites,
    ...event.suggestedMonitors,
  ]);
  const stationId: OperatingStationId = orbit.stations.includes(
    event.suggestedStation
  )
    ? event.suggestedStation
    : orbit.stations[0];
  const station = getOperatingStation(stationId);
  const worker = getCosmicWorker(event.suggestedWorker);
  const risk = evaluateRiskZone(event);
  const hardForbidden = risk.zone === "black_hole_zone";
  const blockedReason =
    gravity.blockedReason ??
    (risk.status === "blocked" ? risk.reason : null);
  const status: CosmicStatus = hardForbidden
    ? "black_holed"
    : blockedReason
      ? "blocked"
      : "validation_required";
  const id = taskId(event.eventId);
  const validation = buildValidation(id, orbit.validation, Boolean(blockedReason));
  const tribunal = buildTribunal(id, blockedReason, hardForbidden);
  const taskSeed = {
    taskId: id,
    event,
    blockedReason,
  };
  const memoryUpdate = buildCosmicMemoryUpdate(taskSeed, tribunal);
  const partialTask = {
    taskId: id,
    status,
    event,
    gravity,
    orbit,
    planetOwner,
    worker,
    blockedReason,
  };
  const founderReport = buildCosmicFounderReport(
    partialTask,
    tribunal,
    memoryUpdate
  );

  return {
    taskId: id,
    status,
    event,
    gravity,
    orbit,
    planetOwner,
    satelliteMonitors: getSatelliteMonitors(satelliteIds),
    station,
    worker,
    subtasks: buildSubtasks(worker.id),
    dependencies: getCosmicDependencies(orbit.orbitPath),
    handoffs: getCosmicHandoffs(),
    taskPassport: {
      passportId: `${id}-passport`,
      status: blockedReason ? "blocked" : "ready",
      allowedScope: [
        ...worker.allowedFilesOrSurfaces,
        ...station.outputs,
        "private Founder Command reporting",
      ],
      forbiddenScope: unique([
        ...worker.forbiddenTasks,
        ...station.forbiddenActions,
        "public Alkon exposure",
        "shell execution from web app",
        "production secrets",
      ]),
      validationRequired: [
        ...worker.validationRequirements,
        ...validation.evidenceRequired,
      ],
      publicLanguageRule:
        "Public users only see Pro Max Trading public product language; Alkon and cosmic terms remain Founder-only.",
    },
    codexLicense: {
      licenseId: `${id}-codex-license`,
      status: blockedReason ? "blocked" : "draft_ready",
      permitted: !blockedReason,
      reason: blockedReason
        ? blockedReason
        : "Manual draft readiness only; the web app cannot call Codex or execute shell commands.",
      noWebAppExecution: true,
      noSecretsAllowed: true,
    },
    validation,
    tribunal,
    memoryUpdate,
    founderReport,
    nextActions: blockedReason
      ? [
          "Keep the request blocked.",
          risk.safeAlternative,
          "Report the blocked reason to Founder Command and Memory Universe.",
        ]
      : [
          "Complete Task Passport review.",
          "Run validation before tribunal.",
          "Record safe memory lesson and Founder Command report.",
        ],
    blockedReason,
  };
}

export function getCosmicLifecycleChain(): CosmicStatus[] {
  return COSMIC_LIFECYCLE;
}

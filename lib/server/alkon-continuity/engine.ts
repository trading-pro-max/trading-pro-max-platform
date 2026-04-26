import { SAMPLE_CONTINUITY_BIRTH_REQUESTS, createAlkonEntityBirthCandidate } from "./birth";
import { reviewAlkonEntityDeprecation } from "./deprecation";
import { createAlkonEntityEvolutionRule } from "./evolution";
import { assignAlkonEntityFunction } from "./function";
import { identifyAlkonEntity } from "./identity";
import { reviewAlkonEntityIntegration } from "./integration";
import { reviewAlkonContinuityLaw } from "./law-gate";
import { monitorAlkonEntityLife } from "./life";
import { proveAlkonEntityContinuity } from "./proof";
import { reviewAlkonEntityRemoval } from "./removal";
import type {
  AlkonContinuityDecision,
  AlkonContinuityReport,
  AlkonContinuityRiskLevel,
  AlkonEntityBirthRequest,
  AlkonEntityContinuityMemory,
} from "./types";

function createContinuityMemory(reportId: string, request: AlkonEntityBirthRequest): AlkonEntityContinuityMemory {
  return {
    entityId: reportId,
    lessonsApplied: [
      "No images or raster assets unless explicitly requested.",
      "No public Alkon, Founder Command, Product Memory internals, Codex tasks, or lifecycle governance language.",
      "No fake activation, fake users, fake revenue, fake downloads, or fake certification.",
      "No deletion without dependency migration, rollback, report, and memory archive.",
      "No live execution, real money, billing, broker/feed, production, social publishing, secrets, or shell execution from the web app.",
    ],
    futureGuards: [
      "public leak regression",
      "Product Truth regression",
      "source scan for secrets, payment execution, and raster assets",
      request.requestsDeletion ? "dependency migration proof before removal" : "continuity monitor before deprecation",
    ],
    founderPreferences: [
      "Chart is king.",
      "No button chaos or duplicate shells.",
      "Free must feel complete.",
      "Alkon remains private.",
    ],
    reportTarget: "Founder Command private continuity report",
  };
}

function decideContinuity(report: Omit<AlkonContinuityReport, "decision">): AlkonContinuityReport["decision"] {
  let outcome: AlkonContinuityDecision = "allow_birth";
  let risk: AlkonContinuityRiskLevel = report.identity.risk;
  let reason = "Entity can be born as a governed, validated, memory-backed continuity proposal.";
  let nextSafeAction = "Draft only after law, integration, proof, memory, and Founder visibility are attached.";
  let founderReviewNeeded = false;

  if (report.lawReview.outcome === "black_holed") {
    outcome = "black_hole";
    risk = "black_hole";
    reason = "Birth is black-holed because it requests forbidden activation, secrets, payment, shell, or public private-system exposure.";
    nextSafeAction = "Record the blocked request as a private memory lesson and propose a safe explanation or readiness document instead.";
    founderReviewNeeded = true;
  } else if (report.lawReview.outcome === "blocked") {
    outcome = "block_birth";
    risk = "blocked";
    reason = "Birth is blocked by Product Truth, public/private boundary, no-images, no-fake-claims, or safety law.";
    nextSafeAction = report.lawReview.safeAlternative;
    founderReviewNeeded = true;
  } else if (report.removal.decision === "ready_to_archive") {
    outcome = "archive";
    risk = "review_required";
    reason = "Entity may be archived after proof, migration, rollback, report, and memory archive.";
    nextSafeAction = "Prepare an archive/removal report; do not delete from the web app.";
    founderReviewNeeded = true;
  } else if (report.deprecation.shouldDeprecate) {
    outcome = "deprecate";
    risk = "review_required";
    reason = "Entity is a cleanup or deprecation candidate and must be reviewed before removal.";
    nextSafeAction = "Review dependencies, preserve Product Truth, update tests, and archive memory.";
    founderReviewNeeded = true;
  } else if (
    report.lawReview.outcome === "founder_approval_required" ||
    report.identity.risk === "founder_approval_required"
  ) {
    outcome = "founder_approval_required";
    risk = "founder_approval_required";
    reason = "Sensitive private continuity work needs Founder final decision.";
    nextSafeAction = "Show the continuity report in Founder Command and wait for explicit approval outside web-app execution.";
    founderReviewNeeded = true;
  } else if (
    report.lawReview.outcome === "review_required" ||
    report.function.functionStatus === "review_required" ||
    report.proof.status !== "proven" ||
    report.integration.completeness !== "complete"
  ) {
    outcome = "review_required";
    risk = "review_required";
    reason = "Entity needs clearer function, integration, proof, or law review before acceptance.";
    nextSafeAction = "Complete missing owner/function/integration/proof before accepting the entity.";
  } else if (report.life.health === "needs_improvement") {
    outcome = "improve";
    reason = "Entity should be improved before it is monitored.";
    nextSafeAction = "Add sharper function, validation, and memory guard.";
  } else {
    outcome = "monitor";
    reason = "Entity is healthy enough for monitoring after proof and memory are attached.";
    nextSafeAction = "Monitor usefulness, ownership, tests, truth, clutter, leaks, and Founder preferences.";
  }

  return { outcome, risk, reason, nextSafeAction, founderReviewNeeded };
}

export function runAlkonContinuity(
  request: AlkonEntityBirthRequest
): AlkonContinuityReport {
  const candidate = createAlkonEntityBirthCandidate(request);
  const identity = identifyAlkonEntity(candidate, request);
  const lawReview = reviewAlkonContinuityLaw(candidate, identity, request);
  const entityFunction = assignAlkonEntityFunction(candidate, identity);
  const integration = reviewAlkonEntityIntegration(identity, entityFunction, request);
  const proof = proveAlkonEntityContinuity(identity, lawReview, integration);
  const life = monitorAlkonEntityLife(identity, entityFunction, integration, proof);
  const evolution = createAlkonEntityEvolutionRule(candidate, identity);
  const deprecation = reviewAlkonEntityDeprecation(identity, integration, life);
  const removal = reviewAlkonEntityRemoval(identity, deprecation, request);
  const memory = createContinuityMemory(identity.entityId, request);
  const reportCore = {
    reportId: `continuity_report_${identity.entityId}`,
    candidate,
    identity,
    lawReview,
    function: entityFunction,
    integration,
    proof,
    life,
    evolution,
    deprecation,
    removal,
    memory,
  };

  return {
    ...reportCore,
    decision: decideContinuity(reportCore),
  };
}

export function runAlkonContinuitySamples() {
  return SAMPLE_CONTINUITY_BIRTH_REQUESTS.map(runAlkonContinuity);
}

export { SAMPLE_CONTINUITY_BIRTH_REQUESTS };

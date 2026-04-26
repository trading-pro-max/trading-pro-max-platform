import "server-only";

import { createCodexDraft } from "./codex-draft";
import { issueCodexLicense } from "./codex-license";
import { containsSensitiveIdeaData, intakeFounderIdea } from "./founder-idea-intake";
import { routeSovereignEvent } from "./owner-router";
import { evaluateSovereignPolicyGates } from "./policy-gates";
import { buildTaskPassport } from "./task-passport";
import type {
  FounderIdeaDesiredTiming,
  FounderIdeaInboxInput,
  FounderIdeaInboxPreview,
  FounderIdeaInboxReadiness,
  FounderIdeaInboxSurface,
  FounderIdeaUrgency,
  SovereignAffectedWorld,
} from "./types";

export const founderIdeaInboxAllowedWorlds: SovereignAffectedWorld[] = [
  "public_user_world",
  "private_founder_world",
  "invisible_operating_layer",
];

export const founderIdeaInboxAllowedSurfaces: FounderIdeaInboxSurface[] = [
  "public_entry",
  "trading_workspace",
  "chart",
  "execution",
  "assistant",
  "journal_coach",
  "settings",
  "diagnostics",
  "plans",
  "apps_platforms",
  "academy",
  "community",
  "support",
  "founder_command",
  "security",
  "secrets",
  "world_interface",
  "media",
  "construction",
];

const allowedUrgencies: FounderIdeaUrgency[] = [
  "low",
  "medium",
  "high",
  "critical",
];

const allowedDesiredTimings: FounderIdeaDesiredTiming[] = [
  "now",
  "next",
  "later",
  "someday",
  "blocked",
];

const secretPattern =
  /(api[_-]?key|secret|token|password|credential|private[_-]?key|sk-[a-z0-9_-]{12,}|ghp_[a-z0-9_]{12,}|akia[0-9a-z]{12,})/i;

function cleanText(value: unknown, fallback: string, maxLength = 600) {
  if (typeof value !== "string") return fallback;

  const cleaned = value.replace(/[\r\t]/g, " ").replace(/\s+/g, " ").trim();
  return (cleaned || fallback).slice(0, maxLength);
}

function pickAllowed<TValue extends string>(
  value: unknown,
  allowed: readonly TValue[],
  fallback: TValue
): TValue {
  return typeof value === "string" && allowed.includes(value as TValue)
    ? (value as TValue)
    : fallback;
}

export function normalizeFounderIdeaInboxInput(
  input: Partial<FounderIdeaInboxInput>
): FounderIdeaInboxInput {
  const affectedSurface = pickAllowed(
    input.affectedSurface,
    founderIdeaInboxAllowedSurfaces,
    "construction"
  );
  const affectedWorld = pickAllowed(
    input.affectedWorld,
    founderIdeaInboxAllowedWorlds,
    affectedSurface === "founder_command" ||
      affectedSurface === "construction" ||
      affectedSurface === "security" ||
      affectedSurface === "secrets"
      ? "private_founder_world"
      : "public_user_world"
  );

  return {
    title: cleanText(input.title, "Untitled Founder idea", 120),
    rawIdea: cleanText(input.rawIdea, "Founder idea preview request", 1200),
    affectedWorld,
    affectedSurface,
    urgency: pickAllowed(input.urgency, allowedUrgencies, "medium"),
    founderIntent: cleanText(
      input.founderIntent,
      "Convert this idea into a governed safe next action.",
      220
    ),
    desiredTiming: pickAllowed(input.desiredTiming, allowedDesiredTimings, "next"),
    notes: input.notes ? cleanText(input.notes, "", 500) : undefined,
  };
}

function inboxInputToRawIdea(input: FounderIdeaInboxInput) {
  return [
    input.rawIdea,
    input.notes ? `Notes: ${input.notes}` : "",
    `Affected surface: ${input.affectedSurface}`,
    `Desired timing: ${input.desiredTiming}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function statusForPreview(
  policy: FounderIdeaInboxPreview["policyEvaluation"],
  passport: FounderIdeaInboxPreview["taskPassportPreview"]
): FounderIdeaInboxPreview["constructionQueueReadiness"]["status"] {
  if (policy.overallDecision === "blocked" || policy.overallDecision === "quarantined") {
    return "blocked";
  }
  if (policy.overallDecision === "founder_approval_required") {
    return "waiting_founder";
  }
  if (policy.overallDecision === "review_required" || !passport.valid) {
    return "waiting_review";
  }

  return "draft_ready";
}

function blockedReasonForPreview(
  policy: FounderIdeaInboxPreview["policyEvaluation"],
  passport: FounderIdeaInboxPreview["taskPassportPreview"]
) {
  const hardBlock = policy.hardBlocks[0];

  if (hardBlock) return hardBlock;
  if (!passport.valid) return passport.invalidReasons.join("; ");

  return null;
}

export function previewFounderIdeaInbox(
  input: Partial<FounderIdeaInboxInput>,
  checkedAt = new Date().toISOString()
): FounderIdeaInboxPreview {
  const normalizedInput = normalizeFounderIdeaInboxInput(input);
  const sensitiveDataRejected =
    secretPattern.test(JSON.stringify(normalizedInput)) ||
    containsSensitiveIdeaData({
      title: normalizedInput.title,
      rawIdea: normalizedInput.rawIdea,
      summary: normalizedInput.notes,
    });
  const safeInput: FounderIdeaInboxInput = sensitiveDataRejected
    ? {
        ...normalizedInput,
        title: "Sensitive idea redacted",
        rawIdea: "[redacted sensitive founder idea]",
        notes: normalizedInput.notes ? "[redacted sensitive founder notes]" : undefined,
        affectedWorld: "invisible_operating_layer",
        affectedSurface: "secrets",
        urgency: "critical",
        desiredTiming: "blocked",
      }
    : normalizedInput;
  const intake = intakeFounderIdea(
    {
      title: safeInput.title,
      rawIdea: sensitiveDataRejected
        ? "[redacted sensitive founder idea]"
        : inboxInputToRawIdea(safeInput),
      source: "founder_manual",
      affectedWorld: safeInput.affectedWorld,
      affectedSurface: safeInput.affectedSurface,
      suspectedCategory: safeInput.affectedSurface,
      urgency: sensitiveDataRejected ? "critical" : normalizedInput.urgency,
      founderIntent: safeInput.founderIntent,
      createdAt: checkedAt,
    },
    checkedAt
  );
  const event = intake.event;
  const ownerRoute = routeSovereignEvent(event);
  const policyEvaluation = evaluateSovereignPolicyGates(event, checkedAt);
  const taskPassportPreview = buildTaskPassport(event, checkedAt);
  const permitPreview = issueCodexLicense(taskPassportPreview, checkedAt);
  const queueStatus = statusForPreview(policyEvaluation, taskPassportPreview);
  const codexDraftPreview =
    queueStatus === "blocked" || taskPassportPreview.workerLevel === "restricted"
      ? null
      : createCodexDraft(taskPassportPreview, "manual_only");

  return {
    checkedAt,
    mode: "founder_idea_inbox_preview",
    input: safeInput,
    idea: intake.idea,
    event,
    ownerRoute,
    policyEvaluation,
    taskPassportPreview,
    permitPreview,
    codexDraftPreview,
    constructionQueueReadiness: {
      recommendedQueue: ownerRoute.recommendedQueue,
      status: queueStatus,
      externalExecutionActive: false,
      autoSubmitActive: false,
      shellExecutionActive: false,
    },
    blockedReason: blockedReasonForPreview(policyEvaluation, taskPassportPreview),
    nextSafeAction:
      queueStatus === "blocked"
        ? "Keep this idea as a blocked readiness record; do not execute or submit it."
        : event.suggestedNextAction,
    truth: {
      previewOnly: true,
      persisted: false,
      storesSecrets: false,
      privateSensitiveDataStored: false,
      externalCalls: false,
      codexCalled: false,
      shellExecution: false,
      autoSubmit: false,
      productTruthPreserved: true,
    },
  };
}

export function getFounderIdeaInboxSamples(
  checkedAt = new Date().toISOString()
) {
  return [
    previewFounderIdeaInbox(
      {
        title: "Logo feels wrong",
        rawIdea: "The logo mark does not feel premium enough.",
        affectedWorld: "public_user_world",
        affectedSurface: "public_entry",
        urgency: "medium",
        founderIntent: "Capture logo concern and route to identity review.",
        desiredTiming: "next",
      },
      checkedAt
    ),
    previewFounderIdeaInbox(
      {
        title: "Chart is annoying",
        rawIdea: "The chart feels visually annoying and should be easier to read.",
        affectedWorld: "public_user_world",
        affectedSurface: "chart",
        urgency: "medium",
        founderIntent: "Protect chart-first workstation quality.",
        desiredTiming: "now",
      },
      checkedAt
    ),
    previewFounderIdeaInbox(
      {
        title: "Support page needs clarity",
        rawIdea: "Support needs clearer contact and help wording.",
        affectedWorld: "public_user_world",
        affectedSurface: "support",
        urgency: "medium",
        founderIntent: "Improve support readiness without sending messages.",
        desiredTiming: "next",
      },
      checkedAt
    ),
    previewFounderIdeaInbox(
      {
        title: "Security review needed",
        rawIdea: "Review auth security before any sensitive command controls expand.",
        affectedWorld: "invisible_operating_layer",
        affectedSurface: "security",
        urgency: "critical",
        founderIntent: "Route defensive security review.",
        desiredTiming: "now",
      },
      checkedAt
    ),
    previewFounderIdeaInbox(
      {
        title: "Billing request",
        rawIdea: "Activate billing and paid plans.",
        affectedWorld: "invisible_operating_layer",
        affectedSurface: "plans",
        urgency: "critical",
        founderIntent: "Check commercial activation boundaries.",
        desiredTiming: "blocked",
      },
      checkedAt
    ),
    previewFounderIdeaInbox(
      {
        title: "Broker feed request",
        rawIdea: "Connect broker/feed and live trading.",
        affectedWorld: "invisible_operating_layer",
        affectedSurface: "execution",
        urgency: "critical",
        founderIntent: "Check broker/live boundaries.",
        desiredTiming: "blocked",
      },
      checkedAt
    ),
  ];
}

export function getFounderIdeaInboxReadiness(
  checkedAt = new Date().toISOString()
): FounderIdeaInboxReadiness {
  const samples = getFounderIdeaInboxSamples(checkedAt);
  const blockedIdeaExamples = samples.filter(
    (sample) => sample.constructionQueueReadiness.status === "blocked"
  );
  const pendingIdeaDrafts = samples.filter(
    (sample) => sample.constructionQueueReadiness.status !== "blocked"
  );

  return {
    checkedAt,
    mode: "founder_idea_inbox_readiness",
    status: "ready",
    access: {
      ownerOnly: true,
      publicNavigationVisible: false,
      userPlanExposure: false,
      readOnly: true,
      previewPostOnly: true,
      persistenceActive: false,
      approvalExecutionActive: false,
      secretsVisible: false,
    },
    allowedAffectedWorlds: founderIdeaInboxAllowedWorlds,
    allowedSurfaces: founderIdeaInboxAllowedSurfaces,
    recentIdeaExamples: samples,
    pendingIdeaDrafts,
    blockedIdeaExamples,
    alkonBridge: {
      universeName: "Alkon",
      arabicName: "الكون",
      orbitCommandLinked: true,
      constructionUniverseLinked: true,
      memoryUniverseLinked: true,
      resultTribunalLinked: true,
      publicVisible: false,
      executionActive: false,
      shellExecutionActive: false,
      codexCalledFromWebApp: false,
      nextAction:
        "Review the idea through Alkon Orbit, Construction, Memory, and Result Tribunal before any manual external work.",
    },
    nextSafeIdeaAction:
      "Enter a Founder idea, review classification, owner route, policy gates, Task Passport, and manual-only Codex draft before any external work.",
    truth: {
      previewOnly: true,
      persisted: false,
      storesSecrets: false,
      privateSensitiveDataStored: false,
      externalCalls: false,
      codexCalled: false,
      shellExecution: false,
      autoSubmit: false,
      productTruthPreserved: true,
    },
  };
}

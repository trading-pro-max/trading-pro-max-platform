"use client";

import { useMemo, useState, type FormEvent } from "react";
import FounderCodexDraftPreview from "./FounderCodexDraftPreview";
import FounderIdeaPreview from "./FounderIdeaPreview";
import FounderTaskPassportPreview from "./FounderTaskPassportPreview";

type InboxPreview = {
  checkedAt: string;
  mode: "founder_idea_inbox_preview";
  input: {
    title: string;
    rawIdea: string;
    affectedWorld: string;
    affectedSurface: string;
    urgency: string;
    founderIntent: string;
    desiredTiming: string;
    notes?: string;
  };
  event: {
    type: string;
    title: string;
    summary: string;
    riskLevel: string;
    severity: string;
    status: string;
    affectedWorld: string;
    affectedSurface: string;
    requiredReviews: string[];
    suggestedNextAction: string;
  };
  ownerRoute: {
    ownerArea: string;
    supportingAreas: string[];
    requiredReviews: string[];
    recommendedQueue: string;
    escalationTarget: string;
    publicVisible: boolean;
  };
  policyEvaluation: {
    overallDecision: string;
    autonomyLevel: string;
    hardBlocks: string[];
  };
  taskPassportPreview: {
    taskId: string;
    title: string;
    ownerArea: string;
    workerLevel: string;
    valid: boolean;
    invalidReasons: string[];
    allowedFiles: string[];
    forbiddenFiles: string[];
    requiredReviews: string[];
    forbiddenScope: string[];
    validationCommands: string[];
    productTruthRequirements: string[];
  };
  permitPreview: {
    workerLevel: string;
    permitted: boolean;
    permitState: string;
    blockedActions: string[];
  };
  codexDraftPreview: {
    draftId: string;
    mode: string;
    codexReadyPrompt: string;
    executableFromWebApp: false;
    externalSubmissionActive: false;
    secretsIncluded: false;
    includesForbiddenScope: boolean;
    includesValidation: boolean;
  } | null;
  constructionQueueReadiness: {
    recommendedQueue: string;
    status: string;
    externalExecutionActive: false;
    autoSubmitActive: false;
    shellExecutionActive: false;
  };
  blockedReason: string | null;
  nextSafeAction: string;
};

type InboxReadiness = {
  status: "ready";
  allowedAffectedWorlds: string[];
  allowedSurfaces: string[];
  recentIdeaExamples: InboxPreview[];
  pendingIdeaDrafts: InboxPreview[];
  blockedIdeaExamples: InboxPreview[];
  nextSafeIdeaAction: string;
};

const defaultInput = {
  title: "Chart visual feedback",
  rawIdea: "The chart feels too busy and should be easier to read.",
  affectedWorld: "public_user_world",
  affectedSurface: "chart",
  urgency: "medium",
  founderIntent: "Preview a chart-first improvement safely.",
  desiredTiming: "next",
  notes: "Preview only; do not execute or submit.",
};

function selectValue(formData: FormData, key: keyof typeof defaultInput) {
  const value = formData.get(key);
  return typeof value === "string" ? value : defaultInput[key];
}

export default function FounderIdeaInbox({
  readiness,
}: {
  readiness: InboxReadiness;
}) {
  const [preview, setPreview] = useState<InboxPreview | null>(
    readiness.recentIdeaExamples[0] ?? null
  );
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const blockedCount = useMemo(
    () => readiness.blockedIdeaExamples.length,
    [readiness.blockedIdeaExamples.length]
  );

  async function submitPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: selectValue(formData, "title"),
      rawIdea: selectValue(formData, "rawIdea"),
      affectedWorld: selectValue(formData, "affectedWorld"),
      affectedSurface: selectValue(formData, "affectedSurface"),
      urgency: selectValue(formData, "urgency"),
      founderIntent: selectValue(formData, "founderIntent"),
      desiredTiming: selectValue(formData, "desiredTiming"),
      notes: selectValue(formData, "notes"),
    };

    try {
      const response = await fetch("/api/founder/ideas/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!response.ok) throw new Error(`Preview failed with ${response.status}.`);

      const body = (await response.json()) as { preview: InboxPreview };
      setPreview(body.preview);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      className="tpm-founder-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-user-plan-exposure="false"
      data-read-only="true"
      aria-label="Founder Idea Inbox"
    >
      <div className="tpm-founder-panel-head">
        <span>Founder Idea Inbox</span>
        <h2>Idea intake to governed construction preview</h2>
        <p>
          Private Founder-only idea input. The preview classifies, routes, gates,
          drafts a Task Passport, and compiles a manual-only Codex draft without
          persistence, shell execution, external calls, secrets, or auto-submit.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Readiness</span>
          <strong>{readiness.status}</strong>
          <small>{readiness.pendingIdeaDrafts.length} pending draft examples</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Blocked</span>
          <strong>{blockedCount}</strong>
          <small>activation/secrets/security examples stay blocked</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Execution</span>
          <strong>false</strong>
          <small>preview-only, no web app execution</small>
        </div>
      </div>

      <form className="tpm-founder-inbox-form" onSubmit={submitPreview}>
        <label>
          <span>Title</span>
          <input name="title" defaultValue={defaultInput.title} />
        </label>
        <label>
          <span>Idea</span>
          <textarea name="rawIdea" defaultValue={defaultInput.rawIdea} rows={4} />
        </label>
        <label>
          <span>Affected world</span>
          <select name="affectedWorld" defaultValue={defaultInput.affectedWorld}>
            {readiness.allowedAffectedWorlds.map((world) => (
              <option key={world} value={world}>
                {world}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Surface</span>
          <select name="affectedSurface" defaultValue={defaultInput.affectedSurface}>
            {readiness.allowedSurfaces.map((surface) => (
              <option key={surface} value={surface}>
                {surface}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Urgency</span>
          <select name="urgency" defaultValue={defaultInput.urgency}>
            {["low", "medium", "high", "critical"].map((urgency) => (
              <option key={urgency} value={urgency}>
                {urgency}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Timing</span>
          <select name="desiredTiming" defaultValue={defaultInput.desiredTiming}>
            {["now", "next", "later", "someday", "blocked"].map((timing) => (
              <option key={timing} value={timing}>
                {timing}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Founder intent</span>
          <input name="founderIntent" defaultValue={defaultInput.founderIntent} />
        </label>
        <label>
          <span>Notes</span>
          <input name="notes" defaultValue={defaultInput.notes} />
        </label>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Previewing" : "Preview governed idea"}
        </button>
      </form>

      {status === "error" ? (
        <div className="tpm-founder-access-card">
          <span>Preview unavailable</span>
          <strong>Try again</strong>
          <small>No idea was persisted or executed.</small>
        </div>
      ) : null}

      {preview ? (
        <div className="tpm-founder-inbox-preview-grid">
          <FounderIdeaPreview preview={preview} />
          <FounderTaskPassportPreview passport={preview.taskPassportPreview} />
          <FounderCodexDraftPreview draft={preview.codexDraftPreview} />
        </div>
      ) : null}

      <div className="tpm-founder-access-card">
        <span>Next safe idea action</span>
        <strong>{readiness.nextSafeIdeaAction}</strong>
        <small>No public navigation, user plan exposure, persistence, or execution.</small>
      </div>
    </section>
  );
}

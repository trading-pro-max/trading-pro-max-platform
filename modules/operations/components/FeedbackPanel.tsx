"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import AuthSessionPanel, {
  AUTH_SESSION_CHANGED_EVENT,
  AuthRequiredState,
} from "../../auth/components/AuthSessionPanel";

type FeedbackCategory = "usability" | "stability" | "support" | "trust" | "feature_gap";
type FeedbackSeverity = "low" | "medium" | "high";
type FeedbackLifecycleState =
  | "submitted"
  | "triaged"
  | "hardening_in_progress"
  | "resolved"
  | "deferred";

type FeedbackSnapshot = {
  checkedAt: string;
  summary: {
    submissions30d: number;
    lifecycleUpdates30d: number;
    openItems: number;
    pendingTriage: number;
    hardeningInProgress: number;
    highSeverityOpen: number;
    lastSubmittedAt: string | null;
    lastLifecycleUpdateAt: string | null;
    latestSeverity: FeedbackSeverity | null;
    latestCategory: FeedbackCategory | null;
  };
  triage: {
    queue: {
      submitted: number;
      triaged: number;
      hardeningInProgress: number;
      resolved: number;
      deferred: number;
    };
    hardeningFollowUps: number;
    recoveryLinked: number;
    escalation: string;
  };
  recent: Array<{
    id: string;
    feedbackId: string;
    category: FeedbackCategory;
    severity: FeedbackSeverity;
    summary: string;
    lifecycleState: FeedbackLifecycleState;
    hardeningTarget: string;
    supportLane: string;
    submittedAt: string;
    updatedAt: string;
    reviewNote: string | null;
  }>;
  truth: {
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    liveExecution: "blocked";
    billing: "inactive";
  };
  limitations: string[];
};

type FeedbackRouteResponse =
  | {
      ok: true;
      authenticated: true;
      snapshot: FeedbackSnapshot;
    }
  | {
      ok: false;
      authenticated?: boolean;
      error?: string;
      reason?: string;
      snapshot?: FeedbackSnapshot;
    };

type FeedbackPanelProps = {
  compact?: boolean;
  docked?: boolean;
};

const categoryOptions: Array<{ value: FeedbackCategory; label: string }> = [
  { value: "usability", label: "Usability" },
  { value: "stability", label: "Stability" },
  { value: "support", label: "Support" },
  { value: "trust", label: "Trust / truth" },
  { value: "feature_gap", label: "Feature gap" },
];

const severityOptions: Array<{ value: FeedbackSeverity; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const lifecycleOptions: Array<{ value: FeedbackLifecycleState; label: string }> = [
  { value: "submitted", label: "Submitted" },
  { value: "triaged", label: "Triaged" },
  { value: "hardening_in_progress", label: "Hardening in progress" },
  { value: "resolved", label: "Resolved" },
  { value: "deferred", label: "Deferred" },
];

function humanize(value: string | null | undefined) {
  if (!value) return "None";

  return value
    .replaceAll("_", " ")
    .replaceAll("/", " / ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) return "None";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function severityTone(severity: FeedbackSeverity) {
  if (severity === "high") return "blocked";
  if (severity === "medium") return "restricted";
  return "pending";
}

export default function FeedbackPanel({ compact = false, docked = false }: FeedbackPanelProps) {
  const [snapshot, setSnapshot] = useState<FeedbackSnapshot | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>("usability");
  const [severity, setSeverity] = useState<FeedbackSeverity>("medium");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [routeContext, setRouteContext] = useState("route=pending");

  const loadFeedback = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/launch/feedback", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      if (response.status === 401) {
        setAuthRequired(true);
        setSnapshot(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Feedback route failed with ${response.status}.`);
      }

      const payload = (await response.json()) as FeedbackRouteResponse;
      if (payload.ok) {
        setSnapshot(payload.snapshot);
        setAuthRequired(false);
      }
    } catch {
      setMessage("Feedback state is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const contextTimer = window.setTimeout(() => {
      setRouteContext(
        [
          `route=${window.location.pathname}${window.location.search}`,
          `viewport=${window.innerWidth}x${window.innerHeight}`,
          `submittedFrom=Trading Pro Max UI`,
        ].join("; ")
      );
    }, 0);

    return () => window.clearTimeout(contextTimer);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadFeedback();
    }, 0);

    const handleSessionChanged = () => {
      void loadFeedback();
    };

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);
    };
  }, [loadFeedback]);

  const queueItems = useMemo(() => {
    if (!snapshot) return [];

    return [
      ["Submitted", snapshot.triage.queue.submitted],
      ["Triaged", snapshot.triage.queue.triaged],
      ["Hardening", snapshot.triage.queue.hardeningInProgress],
      ["Resolved", snapshot.triage.queue.resolved],
      ["Deferred", snapshot.triage.queue.deferred],
    ];
  }, [snapshot]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const contextDetail = [
      "[Context]",
      routeContext,
      "",
      "[Description]",
      detail.trim() || "No additional description provided.",
    ].join("\n");

    try {
      const response = await fetch("/api/launch/feedback", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "submit_feedback",
          category,
          severity,
          summary,
          detail: contextDetail,
        }),
      });
      const payload = (await response.json()) as FeedbackRouteResponse;

      if (!response.ok || !payload.ok) {
        if (response.status === 401) setAuthRequired(true);
        setMessage(payload.ok ? "Feedback was not submitted." : payload.error ?? payload.reason ?? "Feedback was not submitted.");
        if ("snapshot" in payload && payload.snapshot) setSnapshot(payload.snapshot);
        return;
      }

      setSummary("");
      setDetail("");
      setSnapshot(payload.snapshot);
      setAuthRequired(false);
      setMessage("Feedback submitted to the closed-beta queue.");
    } catch {
      setMessage("Feedback submit is temporarily unavailable.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLifecycleUpdate(
    feedbackId: string,
    lifecycleState: FeedbackLifecycleState
  ) {
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/launch/feedback", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update_feedback_lifecycle",
          feedbackId,
          lifecycleState,
          reviewNote: `Lifecycle updated from Trading Pro Max UI on ${new Date().toISOString()}.`,
        }),
      });
      const payload = (await response.json()) as FeedbackRouteResponse;

      if (!response.ok || !payload.ok) {
        setMessage(payload.ok ? "Lifecycle was not updated." : payload.error ?? payload.reason ?? "Lifecycle was not updated.");
        if ("snapshot" in payload && payload.snapshot) setSnapshot(payload.snapshot);
        return;
      }

      setSnapshot(payload.snapshot);
      setMessage("Feedback lifecycle updated.");
    } catch {
      setMessage("Lifecycle update is temporarily unavailable.");
    } finally {
      setSubmitting(false);
    }
  }

  const className = [
    "tpm-feedback-panel",
    compact ? "tpm-feedback-panel-compact" : "",
    docked ? "tpm-feedback-panel-docked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (authRequired) {
    return (
      <section className={className} aria-label="Feedback sign in required">
        <AuthRequiredState
          title="Sign in to report beta feedback"
          text="Feedback is account-scoped for closed beta. Sign in to submit issues, include route context, and view lifecycle state."
          action={<AuthSessionPanel variant="required" title="Feedback access" />}
        />
      </section>
    );
  }

  return (
    <section className={className} aria-label="Send feedback">
      <header className="tpm-ops-section-head">
        <div>
          <span>Closed-beta feedback</span>
          <h2>Send Feedback / Report Issue</h2>
          <p>
            Account-scoped intake with category, severity, route context, and lifecycle truth.
          </p>
        </div>
        <div className="tpm-ops-status-row">
          <span className="tpmv2-status-tag pending">
            {loading ? "Loading" : `${snapshot?.summary.openItems ?? 0} open`}
          </span>
          <span className="tpmv2-status-tag restricted">Operator reviewed</span>
        </div>
      </header>

      <div className="tpm-feedback-layout">
        <form className="tpm-feedback-form" onSubmit={handleSubmit}>
          <div className="tpm-feedback-field-grid">
            <label>
              <span>Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as FeedbackCategory)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Severity</span>
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value as FeedbackSeverity)}
              >
                {severityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>Summary</span>
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="What should the operator know?"
              maxLength={240}
              required
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              placeholder="Observed behavior, expected behavior, and any decision context."
              rows={compact ? 3 : 5}
            />
          </label>

          <div className="tpm-feedback-context">
            <span>Context metadata</span>
            <strong>{routeContext}</strong>
          </div>

          <button type="submit" disabled={submitting || summary.trim().length === 0}>
            {submitting ? "Submitting" : "Submit feedback"}
          </button>

          {message ? <div className="tpm-auth-message">{message}</div> : null}
        </form>

        <aside className="tpm-feedback-lifecycle">
          <div className="tpm-feedback-metrics">
            <div>
              <span>Submitted 30d</span>
              <strong>{snapshot?.summary.submissions30d ?? 0}</strong>
            </div>
            <div>
              <span>Pending triage</span>
              <strong>{snapshot?.summary.pendingTriage ?? 0}</strong>
            </div>
            <div>
              <span>Hardening</span>
              <strong>{snapshot?.summary.hardeningInProgress ?? 0}</strong>
            </div>
            <div>
              <span>High severity</span>
              <strong>{snapshot?.summary.highSeverityOpen ?? 0}</strong>
            </div>
          </div>

          <div className="tpm-feedback-queue">
            {queueItems.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="tpm-feedback-truth">
            <span>Lifecycle truth</span>
            <strong>
              {humanize(snapshot?.truth.launchClaim)} / live{" "}
              {snapshot?.truth.liveExecution ?? "blocked"}
            </strong>
            <small>
              Last feedback {formatDate(snapshot?.summary.lastSubmittedAt)} / last lifecycle{" "}
              {formatDate(snapshot?.summary.lastLifecycleUpdateAt)}
            </small>
          </div>

          <div className="tpm-feedback-recent-list">
            {(snapshot?.recent ?? []).length === 0 ? (
              <div className="tpmv2-empty">No beta feedback has been submitted yet.</div>
            ) : (
              snapshot?.recent.map((item) => (
                <article key={item.feedbackId} className="tpm-feedback-recent-card">
                  <div className="tpm-feedback-recent-head">
                    <strong>{item.summary}</strong>
                    <span className={`tpmv2-status-tag ${severityTone(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>
                  <p>
                    {humanize(item.category)} / {humanize(item.lifecycleState)} /{" "}
                    {humanize(item.hardeningTarget)}
                  </p>
                  <select
                    value={item.lifecycleState}
                    disabled={submitting}
                    onChange={(event) =>
                      void handleLifecycleUpdate(
                        item.feedbackId,
                        event.target.value as FeedbackLifecycleState
                      )
                    }
                    aria-label={`Lifecycle for ${item.summary}`}
                  >
                    {lifecycleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function FeedbackDock() {
  const [open, setOpen] = useState(false);

  return (
    <div className={open ? "tpm-feedback-dock open" : "tpm-feedback-dock"}>
      <button
        type="button"
        className="tpm-feedback-dock-button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close feedback" : "Send feedback"}
      </button>
      {open ? (
        <div className="tpm-feedback-dock-panel">
          <FeedbackPanel compact docked />
        </div>
      ) : null}
    </div>
  );
}

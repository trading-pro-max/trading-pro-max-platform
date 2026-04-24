"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuthSessionPanel, {
  AUTH_SESSION_CHANGED_EVENT,
  AuthRequiredState,
} from "../../auth/components/AuthSessionPanel";

type StageState = "ready" | "in_progress" | "blocked" | "not_started";

type LaunchReadinessGate = {
  checkedAt: string;
  gateVersion: string;
  overall: {
    status: "pass" | "fail";
    score: number;
    failCount: number;
    warnCount: number;
  };
  decision: {
    launchClaim: "not_launched";
    blockers: string[];
  };
  checklist: {
    items: Array<{
      key: string;
      label: string;
      passed: boolean;
      evidence: string;
    }>;
  };
};

type LaunchOperationsSnapshot = {
  checkedAt: string;
  mode: string;
  program: {
    currentStage: string;
    previousStage: string;
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    publicAccess: "not_open";
    lifecycleStage: string;
  };
  stages: Array<{
    key: string;
    state: StageState;
    required: boolean;
    evidence: string;
  }>;
  closedBeta: {
    accessDecision: string;
    evaluatorEligibility: string;
    matchSource: string;
    allowlist: {
      configured: boolean;
      emailEntries: number;
      accountEntries: number;
    };
    capacity: {
      maxEvaluators: number;
      activeEvaluators: number;
      remainingSlots: number;
      state: string;
    };
    activation: {
      state: "active_guarded" | "inactive_guarded";
      activatedAt: string | null;
      blockers: string[];
    };
    feedbackLoop: {
      state: string;
      pendingTriage: number;
      hardeningInProgress: number;
      highSeverityOpen: number;
      hardeningFollowUps: number;
      recoveryLinked: number;
    };
    safety: {
      paperOnly: true;
      liveExecution: "blocked";
      realMoneyRouting: "blocked";
      billing: "inactive";
    };
    limitations: string[];
  };
  softLaunch: {
    state: string;
    admission: {
      decision: string;
      reason: string;
    };
    activation: {
      state: "active_guarded" | "inactive_guarded";
      activatedAt: string | null;
      blockers: string[];
    };
    capacity: {
      maxAccounts: number;
      activeAccounts: number;
      remainingSlots: number;
      state: string;
    };
    guardrails: {
      supportReadiness: {
        state: string;
        pendingTriage: number;
        highSeverityOpen: number;
      };
      escalation: {
        triggerState: string;
        triggers: string[];
      };
    };
    truth: {
      launchClaim: "not_launched";
      publicLaunchClaim: "not_claimed";
      liveExecution: "blocked";
      billing: "inactive";
    };
  };
  publicLaunch: {
    state: string;
    checklist: {
      requiredCount: number;
      passedCount: number;
      failedCount: number;
    };
    decision: {
      goLiveState: string;
      reason: string;
      releaseAuthority: "operator_manual_release_only";
    };
    visibility: {
      launchModeLabel: string;
      customerStateLabel: "not_launched";
      claimsPolicy: "no_false_public_launch_claims";
    };
    activation: {
      state: "active_guarded" | "inactive_guarded";
      blockers: string[];
    };
    truth: {
      launchClaim: "not_launched";
      publicLaunchClaim: "not_claimed";
      billing: "inactive";
      liveExecution: "blocked";
      scaleClaims: "none";
    };
  };
  support: {
    feedbackSubmissions30d: number;
    feedbackLifecycleUpdates30d: number;
    pendingTriage: number;
    hardeningInProgress: number;
    highSeverityOpen: number;
    hardeningFollowUps: number;
    recoveryLinked: number;
    supportReadiness: string;
    escalationState: string;
  };
  truth: {
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    billing: "inactive";
    notifications: "unconfigured";
  };
  limitations: string[];
};

type OperationsResponse =
  | {
      ok: true;
      authenticated: true;
      snapshot: LaunchOperationsSnapshot;
      reason?: string;
    }
  | {
      ok: false;
      authenticated?: boolean;
      error?: string;
      reason?: string;
      snapshot?: LaunchOperationsSnapshot;
    };

type ReadinessResponse = {
  ok: true;
  gate: LaunchReadinessGate;
};

type OperationalConsoleProps = {
  compact?: boolean;
};

function humanize(value: string | null | undefined) {
  if (!value) return "None";

  return value
    .replaceAll("_", " ")
    .replaceAll("/", " / ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function toneForState(value: string | null | undefined) {
  const normalized = value ?? "";
  if (
    normalized.includes("blocked") ||
    normalized.includes("fail") ||
    normalized.includes("inactive")
  ) {
    return "blocked";
  }

  if (
    normalized.includes("unconfigured") ||
    normalized.includes("review") ||
    normalized.includes("guarded") ||
    normalized.includes("progress")
  ) {
    return "restricted";
  }

  if (
    normalized.includes("ready") ||
    normalized.includes("active") ||
    normalized.includes("granted") ||
    normalized.includes("pass")
  ) {
    return "approved";
  }

  return "pending";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not activated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatusPill({ value }: { value: string }) {
  return <span className={`tpmv2-status-tag ${toneForState(value)}`}>{humanize(value)}</span>;
}

export default function OperationalConsole({ compact = false }: OperationalConsoleProps) {
  const [gate, setGate] = useState<LaunchReadinessGate | null>(null);
  const [snapshot, setSnapshot] = useState<LaunchOperationsSnapshot | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<"closed_beta" | "soft_launch" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadReadiness = useCallback(async () => {
    const response = await fetch("/api/launch/readiness", {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Readiness failed with ${response.status}.`);
    }

    const payload = (await response.json()) as ReadinessResponse;
    setGate(payload.gate);
  }, []);

  const loadOperations = useCallback(async () => {
    const response = await fetch("/api/launch/operations", {
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
      throw new Error(`Operations failed with ${response.status}.`);
    }

    const payload = (await response.json()) as OperationsResponse;
    if (payload.ok) {
      setSnapshot(payload.snapshot);
      setAuthRequired(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      await loadReadiness();
      await loadOperations();
    } catch {
      setMessage("Operational state is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, [loadOperations, loadReadiness]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void refresh();
    }, 0);

    const handleSessionChanged = () => {
      void refresh();
    };

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);
    };
  }, [refresh]);

  const readinessStats = useMemo(() => {
    if (!gate) {
      return [
        ["Readiness", "Loading"],
        ["Score", "--"],
        ["Blockers", "--"],
        ["Warnings", "--"],
      ];
    }

    return [
      ["Readiness", humanize(gate.overall.status)],
      ["Score", `${gate.overall.score}/100`],
      ["Blockers", String(gate.overall.failCount)],
      ["Warnings", String(gate.overall.warnCount)],
    ];
  }, [gate]);

  async function runOperation(action: "activate_closed_beta" | "activate_soft_launch") {
    setBusyAction(action === "activate_closed_beta" ? "closed_beta" : "soft_launch");
    setMessage(null);

    try {
      const response = await fetch("/api/launch/operations", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          note:
            action === "activate_closed_beta"
              ? "Activate guarded closed beta operations from UI."
              : "Activate guarded soft launch operations from UI.",
        }),
      });
      const payload = (await response.json()) as OperationsResponse;

      if (!response.ok || !payload.ok) {
        if (response.status === 401) setAuthRequired(true);
        if ("snapshot" in payload && payload.snapshot) setSnapshot(payload.snapshot);
        setMessage(payload.ok ? "Operation was not accepted." : payload.reason ?? payload.error ?? "Operation was not accepted.");
        return;
      }

      setSnapshot(payload.snapshot);
      setMessage(`${humanize(action)} accepted.`);
    } catch {
      setMessage("Operation action is temporarily unavailable.");
    } finally {
      setBusyAction(null);
    }
  }

  const className = compact
    ? "tpm-ops-console tpm-ops-console-compact"
    : "tpm-ops-console";

  return (
    <section className={className} aria-label="Beta operations console">
      <header className="tpm-ops-section-head">
        <div>
          <span>Beta operations console</span>
          <h2>Launch readiness, closed beta, feedback, and public-launch truth</h2>
          <p>
            Operator-facing control surface for protected launch state. No public launch,
            billing, broker, feed, or real-money activation is claimed here.
          </p>
        </div>
        <div className="tpm-ops-status-row">
          <StatusPill value={gate?.overall.status ?? "loading"} />
          <StatusPill value={snapshot?.truth.liveExecution ?? "blocked"} />
          <StatusPill value={snapshot?.truth.billing ?? "inactive"} />
        </div>
      </header>

      <div className="tpm-ops-readiness-strip">
        {readinessStats.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      {authRequired ? (
        <AuthRequiredState
          title="Sign in to view protected operations"
          text="Launch operations, closed-beta admission, lifecycle controls, and feedback queues are account protected. The public readiness gate remains visible above."
          action={<AuthSessionPanel variant="required" title="Operations access" />}
        />
      ) : null}

      {!authRequired ? (
        <div className="tpm-ops-grid">
          <article className="tpm-ops-card tpm-ops-card-primary">
            <span>Program stage</span>
            <strong>{humanize(snapshot?.program.currentStage ?? "loading")}</strong>
            <p>
              Previous {humanize(snapshot?.program.previousStage ?? "unknown")} / customer state{" "}
              {humanize(snapshot?.program.launchClaim ?? "not_launched")}.
            </p>
            <div className="tpm-ops-stage-list">
              {(snapshot?.stages ?? []).map((stage) => (
                <div key={stage.key} className="tpm-ops-stage-row">
                  <span>{humanize(stage.key)}</span>
                  <StatusPill value={stage.state} />
                </div>
              ))}
            </div>
          </article>

          <article className="tpm-ops-card">
            <span>Closed beta</span>
            <strong>{humanize(snapshot?.closedBeta.accessDecision ?? "auth_required")}</strong>
            <p>
              Eligibility {humanize(snapshot?.closedBeta.evaluatorEligibility)} via{" "}
              {humanize(snapshot?.closedBeta.matchSource)}. Allowlist{" "}
              {snapshot?.closedBeta.allowlist.configured ? "configured" : "unconfigured"}.
            </p>
            <div className="tpm-ops-micro-grid">
              <div>
                <span>Capacity</span>
                <strong>
                  {snapshot?.closedBeta.capacity.activeEvaluators ?? 0}/
                  {snapshot?.closedBeta.capacity.maxEvaluators ?? 0}
                </strong>
              </div>
              <div>
                <span>Slots</span>
                <strong>{snapshot?.closedBeta.capacity.remainingSlots ?? 0}</strong>
              </div>
              <div>
                <span>Activation</span>
                <strong>{humanize(snapshot?.closedBeta.activation.state)}</strong>
              </div>
            </div>
          </article>

          <article className="tpm-ops-card">
            <span>Feedback loop</span>
            <strong>{humanize(snapshot?.closedBeta.feedbackLoop.state ?? "loading")}</strong>
            <p>
              Submitted {snapshot?.support.feedbackSubmissions30d ?? 0} / lifecycle updates{" "}
              {snapshot?.support.feedbackLifecycleUpdates30d ?? 0}. Operator triage remains manual.
            </p>
            <div className="tpm-ops-micro-grid">
              <div>
                <span>Pending</span>
                <strong>{snapshot?.support.pendingTriage ?? 0}</strong>
              </div>
              <div>
                <span>Hardening</span>
                <strong>{snapshot?.support.hardeningInProgress ?? 0}</strong>
              </div>
              <div>
                <span>High severity</span>
                <strong>{snapshot?.support.highSeverityOpen ?? 0}</strong>
              </div>
            </div>
          </article>

          <article className="tpm-ops-card">
            <span>Soft launch</span>
            <strong>{humanize(snapshot?.softLaunch.state ?? "loading")}</strong>
            <p>
              Admission {humanize(snapshot?.softLaunch.admission.decision)} /{" "}
              {humanize(snapshot?.softLaunch.admission.reason)}. Support{" "}
              {humanize(snapshot?.softLaunch.guardrails.supportReadiness.state)}.
            </p>
            <div className="tpm-ops-micro-grid">
              <div>
                <span>Accounts</span>
                <strong>
                  {snapshot?.softLaunch.capacity.activeAccounts ?? 0}/
                  {snapshot?.softLaunch.capacity.maxAccounts ?? 0}
                </strong>
              </div>
              <div>
                <span>Escalation</span>
                <strong>{humanize(snapshot?.softLaunch.guardrails.escalation.triggerState)}</strong>
              </div>
            </div>
          </article>

          <article className="tpm-ops-card">
            <span>Public launch</span>
            <strong>{humanize(snapshot?.publicLaunch.visibility.customerStateLabel ?? "not_launched")}</strong>
            <p>
              {humanize(snapshot?.publicLaunch.decision.goLiveState)} /{" "}
              {humanize(snapshot?.publicLaunch.decision.reason)}. Release authority remains{" "}
              {humanize(snapshot?.publicLaunch.decision.releaseAuthority)}.
            </p>
            <div className="tpm-ops-micro-grid">
              <div>
                <span>Checklist</span>
                <strong>
                  {snapshot?.publicLaunch.checklist.passedCount ?? 0}/
                  {snapshot?.publicLaunch.checklist.requiredCount ?? 0}
                </strong>
              </div>
              <div>
                <span>Claim</span>
                <strong>{humanize(snapshot?.publicLaunch.truth.launchClaim ?? "not_launched")}</strong>
              </div>
            </div>
          </article>

          <article className="tpm-ops-card tpm-ops-card-actions">
            <span>Operator actions</span>
            <strong>Guarded activation only</strong>
            <p>
              These controls call existing protected launch-operation routes. They cannot enable
              live execution, billing, broker routing, or public go-live.
            </p>
            <div className="tpm-ops-action-row">
              <button
                type="button"
                disabled={
                  loading ||
                  busyAction !== null ||
                  snapshot?.closedBeta.activation.state === "active_guarded"
                }
                onClick={() => void runOperation("activate_closed_beta")}
              >
                {busyAction === "closed_beta" ? "Activating" : "Activate closed beta"}
              </button>
              <button
                type="button"
                disabled={
                  loading ||
                  busyAction !== null ||
                  snapshot?.softLaunch.activation.state === "active_guarded"
                }
                onClick={() => void runOperation("activate_soft_launch")}
              >
                {busyAction === "soft_launch" ? "Activating" : "Activate soft launch"}
              </button>
            </div>
            <small>
              Closed beta activated {formatDate(snapshot?.closedBeta.activation.activatedAt)}.
              Soft launch activated {formatDate(snapshot?.softLaunch.activation.activatedAt)}.
            </small>
          </article>
        </div>
      ) : null}

      <div className="tpm-ops-truth-ledger">
        <span>Product truth preserved</span>
        <strong>
          Launch {humanize(snapshot?.truth.launchClaim ?? gate?.decision.launchClaim)} / public{" "}
          {humanize(snapshot?.truth.publicLaunchClaim ?? "not_claimed")} / live{" "}
          {humanize(snapshot?.truth.liveExecution ?? "blocked")}
        </strong>
        <p>
          {message ?? "Protected route failures are shown as sign-in requirements, not raw API JSON."}
        </p>
      </div>
    </section>
  );
}

import type { ReactNode } from "react";

export type ProductStateKind =
  | "loading"
  | "empty"
  | "auth_required"
  | "no_access"
  | "blocked"
  | "fallback"
  | "degraded"
  | "not_configured"
  | "coming_later"
  | "error"
  | "recovery"
  | "protected_route"
  | "invalid_input"
  | "offline"
  | "feedback_submitted"
  | "feedback_failed"
  | "session_expired";

type ProductStateNoticeProps = {
  action?: ReactNode;
  className?: string;
  compact?: boolean;
  detail?: string;
  id?: string;
  kind: ProductStateKind;
  text: string;
  title: string;
};

const PRODUCT_STATE_LABELS: Record<ProductStateKind, string> = {
  auth_required: "Auth required",
  blocked: "Blocked",
  coming_later: "Coming later",
  degraded: "Degraded",
  empty: "Empty",
  error: "Error",
  fallback: "Fallback",
  feedback_failed: "Feedback failed",
  feedback_submitted: "Feedback submitted",
  invalid_input: "Invalid input",
  loading: "Loading",
  no_access: "No access",
  not_configured: "Not configured",
  offline: "Reconnect",
  protected_route: "Protected route",
  recovery: "Recovery",
  session_expired: "Session expired",
};

export function ProductStateNotice({
  action,
  className,
  compact = false,
  detail,
  id,
  kind,
  text,
  title,
}: ProductStateNoticeProps) {
  const classNames = [
    "tpm-state-notice",
    compact ? "tpm-state-notice-compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const urgent = kind === "error" || kind === "feedback_failed" || kind === "session_expired";

  return (
    <div
      aria-live={urgent ? "assertive" : "polite"}
      className={classNames}
      data-state={kind}
      id={id}
      role={urgent ? "alert" : "status"}
    >
      <div className="tpm-state-notice-icon" aria-hidden="true" />
      <div className="tpm-state-notice-copy">
        <span>{PRODUCT_STATE_LABELS[kind]}</span>
        <strong>{title}</strong>
        <p>{text}</p>
        {detail ? <small>{detail}</small> : null}
      </div>
      {action ? <div className="tpm-state-notice-action">{action}</div> : null}
    </div>
  );
}

export function LoadingState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="tpm-ui-state loading" data-state="loading">
      <div className="tpm-ui-state-title">{title}</div>
      <div className="tpm-ui-state-text">{text}</div>
      <div className="tpm-ui-loading-bars" aria-hidden="true">
        <div className="tpm-ui-loading-bar" />
        <div className="tpm-ui-loading-bar" />
        <div className="tpm-ui-loading-bar" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <ProductStateNotice kind="empty" title={title} text={text} />
  );
}

export function ErrorState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <ProductStateNotice kind="error" title={title} text={text} />
  );
}

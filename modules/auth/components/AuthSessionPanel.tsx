"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";

export const AUTH_SESSION_CHANGED_EVENT = "tpm-auth-session-changed";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  role: string;
};

type AuthAccount = {
  id: string;
  mode: string;
  lifecycleState: string;
  region: string;
};

type AuthSession = {
  id: string;
  expiresAt: string;
};

type AuthPayload = {
  ok: boolean;
  authenticated?: boolean;
  user?: AuthUser;
  account?: AuthAccount;
  session?: AuthSession;
  error?: string;
};

type SessionState =
  | { status: "checking"; message?: string }
  | { status: "anonymous"; message?: string; error?: string }
  | {
      status: "authenticated";
      user: AuthUser;
      account: AuthAccount;
      session: AuthSession;
      message?: string;
    };

type AuthSessionPanelVariant = "inline" | "nav" | "topbar" | "required";

type AuthSessionPanelProps = {
  className?: string;
  note?: string;
  title?: string;
  variant?: AuthSessionPanelVariant;
};

type AuthRequiredStateProps = {
  action?: ReactNode;
  text: string;
  title: string;
};

function humanize(value: string | undefined) {
  if (!value) return "Unavailable";

  return value
    .replaceAll("_", " ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function formatExpiry(value: string | undefined) {
  if (!value) return "Session expiry unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Session expiry unavailable";

  return `Expires ${date.toLocaleString(undefined, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  })}`;
}

function isAuthenticatedPayload(payload: AuthPayload): payload is AuthPayload & {
  account: AuthAccount;
  session: AuthSession;
  user: AuthUser;
} {
  return Boolean(payload.ok && payload.authenticated !== false && payload.user && payload.account && payload.session);
}

export function AuthRequiredState({ action, text, title }: AuthRequiredStateProps) {
  return (
    <div className="tpm-auth-required" role="status">
      <div>
        <span>Authentication required</span>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      {action ? <div className="tpm-auth-required-action">{action}</div> : null}
    </div>
  );
}

export default function AuthSessionPanel({
  className,
  note,
  title = "Account session",
  variant = "inline",
}: AuthSessionPanelProps) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SessionState>({ status: "checking" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSession(message?: string) {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const payload = (await response.json()) as AuthPayload;

        if (cancelled) return;

        if (response.ok && isAuthenticatedPayload(payload)) {
          setState({
            status: "authenticated",
            user: payload.user,
            account: payload.account,
            session: payload.session,
            message,
          });
          return;
        }

        setState({ status: "anonymous" });
      } catch {
        if (!cancelled) {
          setState({
            status: "anonymous",
            error: "Session status is unavailable. Sign in can be retried.",
          });
        }
      }
    }

    function handleSessionChange() {
      void loadSession();
    }

    void loadSession();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChange);

    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChange);
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ email, password }),
        cache: "no-store",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as AuthPayload;

      if (!response.ok || !isAuthenticatedPayload(payload)) {
        setState({
          status: "anonymous",
          error: payload.error ?? "Sign in failed. Check the credentials and try again.",
        });
        return;
      }

      setPassword("");
      setState({
        status: "authenticated",
        user: payload.user,
        account: payload.account,
        session: payload.session,
        message: "Signed in.",
      });
      window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
    } catch {
      setState({
        status: "anonymous",
        error: "Sign in failed. Check the connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);

    try {
      await fetch("/api/auth/logout", {
        cache: "no-store",
        credentials: "same-origin",
        method: "POST",
      });
    } finally {
      setPassword("");
      setState({ status: "anonymous", message: "Signed out." });
      setSubmitting(false);
      window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
    }
  }

  const classNames = [
    "tpm-auth-panel",
    `tpm-auth-panel-${variant}`,
    state.status === "authenticated" ? "is-authenticated" : "is-anonymous",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const form = (
    <form className="tpm-auth-form" onSubmit={handleLogin}>
      <label htmlFor={emailId}>Email</label>
      <input
        id={emailId}
        name="email"
        autoComplete="email"
        inputMode="email"
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor={passwordId}>Password</label>
      <input
        id={passwordId}
        name="password"
        autoComplete="current-password"
        required
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );

  if (state.status === "authenticated") {
    return (
      <section className={classNames} aria-label="Account session">
        <div className="tpm-auth-session">
          <div className="tpm-auth-session-main">
            <span>Signed in</span>
            <strong>{state.user.displayName}</strong>
            <small>{state.user.email}</small>
          </div>
          <div className="tpm-auth-session-meta">
            <span>{humanize(state.user.role)}</span>
            <span>{humanize(state.account.mode)}</span>
            <span>{humanize(state.account.lifecycleState)}</span>
          </div>
          <small className="tpm-auth-session-expiry">{formatExpiry(state.session.expiresAt)}</small>
          {state.message ? <p className="tpm-auth-message">{state.message}</p> : null}
          <button type="button" className="tpm-auth-logout" disabled={submitting} onClick={handleLogout}>
            {submitting ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </section>
    );
  }

  const statusText =
    state.status === "checking"
      ? "Checking session..."
      : state.message ?? "Sign in to use protected account and operational routes.";
  const errorText = state.status === "anonymous" ? state.error : undefined;

  if (variant === "nav" || variant === "topbar") {
    return (
      <section className={classNames} aria-label="Sign in">
        <details className="tpm-auth-popover">
          <summary>Sign in</summary>
          <div className="tpm-auth-popover-body">
            <div className="tpm-auth-copy">
              <span>{title}</span>
              <p>{statusText}</p>
            </div>
            {form}
            {errorText ? <p className="tpm-auth-error">{errorText}</p> : null}
          </div>
        </details>
      </section>
    );
  }

  return (
    <section className={classNames} aria-label={title}>
      <div className="tpm-auth-copy">
        <span>{title}</span>
        <strong>{variant === "required" ? "Sign in required" : "Protected account access"}</strong>
        <p>{note ?? statusText}</p>
      </div>
      {form}
      {errorText ? <p className="tpm-auth-error">{errorText}</p> : null}
      {state.message ? <p className="tpm-auth-message">{state.message}</p> : null}
    </section>
  );
}

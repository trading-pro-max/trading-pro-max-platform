"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

export const AUTH_SESSION_CHANGED_EVENT = "tpm-auth-session-changed";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  role: "owner" | "operator";
};

type AuthAccount = {
  id: string;
  mode: "demo";
  lifecycleState: string;
  region: string;
};

type AuthSession = {
  id: string;
  expiresAt: string;
};

export type AuthSessionState =
  | {
      authenticated: true;
      user: AuthUser;
      account: AuthAccount;
      session: AuthSession;
    }
  | {
      authenticated: false;
    };

type AuthSessionPanelVariant =
  | "nav"
  | "hero"
  | "surface"
  | "topbar"
  | "required";

type AuthSessionPanelProps = {
  variant?: AuthSessionPanelVariant;
  title?: string;
  note?: string;
  onSessionChange?: (session: AuthSessionState) => void;
};

type AuthMeResponse =
  | {
      ok: true;
      authenticated: true;
      user: AuthUser;
      account: AuthAccount;
      session: AuthSession;
    }
  | {
      ok: false;
      authenticated: false;
    };

type AuthLoginResponse =
  | {
      ok: true;
      user: AuthUser;
      account: AuthAccount;
      session: AuthSession;
    }
  | {
      ok: false;
      error?: string;
    };

function formatLifecycle(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function formatExpiry(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Session active";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(date);
}

function dispatchSessionChanged() {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function AuthRequiredState({
  title = "Sign in required",
  text = "This operational surface is protected. Sign in with closed-beta credentials to view account-scoped launch, feedback, and readiness truth.",
  action,
}: {
  title?: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <section className="tpm-auth-required-state" aria-label={title}>
      <div>
        <span>Protected surface</span>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      {action}
    </section>
  );
}

export function useAuthSessionStatus() {
  const [session, setSession] = useState<AuthSessionState>({
    authenticated: false,
  });
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      if (response.status === 401) {
        setSession({ authenticated: false });
        return { authenticated: false } as AuthSessionState;
      }

      if (!response.ok) {
        throw new Error(`Session request failed with ${response.status}.`);
      }

      const payload = (await response.json()) as AuthMeResponse;
      const nextSession: AuthSessionState = payload.authenticated
        ? {
            authenticated: true,
            user: payload.user,
            account: payload.account,
            session: payload.session,
          }
        : { authenticated: false };

      setSession(nextSession);
      return nextSession;
    } catch {
      const nextSession = { authenticated: false } as AuthSessionState;
      setSession(nextSession);
      return nextSession;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadSession();
    }, 0);

    const handleSessionChanged = () => {
      void loadSession();
    };

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChanged);
    };
  }, [loadSession]);

  return {
    session,
    loading,
    reload: loadSession,
  };
}

export default function AuthSessionPanel({
  variant = "surface",
  title,
  note,
  onSessionChange,
}: AuthSessionPanelProps) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { session, loading, reload } = useAuthSessionStatus();

  const panelTitle = title ?? (variant === "required" ? "Operator sign in" : "Session");
  const panelNote =
    note ??
    "Use closed-beta credentials. Public registration is not enabled, and signing in does not enable live execution.";

  const sessionMeta = useMemo(() => {
    if (!session.authenticated) return null;

    return {
      role: session.user.role.toUpperCase(),
      mode: session.account.mode.toUpperCase(),
      lifecycle: formatLifecycle(session.account.lifecycleState),
      expiry: formatExpiry(session.session.expiresAt),
    };
  }, [session]);

  useEffect(() => {
    onSessionChange?.(session);
  }, [onSessionChange, session]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as AuthLoginResponse;

      if (!response.ok || !payload.ok) {
        setMessage(payload.ok ? "Sign in failed." : payload.error ?? "Invalid credentials.");
        return;
      }

      setPassword("");
      setMessage("Signed in.");
      await reload();
      dispatchSessionChanged();
    } catch {
      setMessage("Sign in is temporarily unavailable.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    setMessage(null);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      setMessage("Signed out.");
      await reload();
      dispatchSessionChanged();
    } catch {
      setMessage("Sign out is temporarily unavailable.");
    } finally {
      setSubmitting(false);
    }
  }

  const className = `tpm-auth-panel tpm-auth-panel-${variant}`;

  if (session.authenticated && sessionMeta) {
    return (
      <section className={className} aria-label="Session status">
        <div className="tpm-auth-session-chip">
          <div className="tpm-auth-avatar" aria-hidden="true">
            {session.user.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="tpm-auth-session-copy">
            <span>{session.user.displayName}</span>
            <strong>
              {sessionMeta.role} / {sessionMeta.mode}
            </strong>
            {variant !== "topbar" && variant !== "nav" ? (
              <small>
                {sessionMeta.lifecycle} / expires {sessionMeta.expiry}
              </small>
            ) : null}
          </div>
          <button
            type="button"
            className="tpm-auth-secondary-action"
            onClick={handleLogout}
            disabled={submitting}
          >
            Sign out
          </button>
        </div>
        {message && variant !== "topbar" ? (
          <div className="tpm-auth-message">{message}</div>
        ) : null}
      </section>
    );
  }

  if (variant === "nav" || variant === "topbar") {
    return (
      <details className={className}>
        <summary>{loading ? "Checking" : "Sign in"}</summary>
        <form className="tpm-auth-form" onSubmit={handleLogin}>
          <label htmlFor={emailId}>Email</label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <label htmlFor={passwordId}>Password</label>
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in" : "Sign in"}
          </button>
          <small>{panelNote}</small>
          {message ? <div className="tpm-auth-message">{message}</div> : null}
        </form>
      </details>
    );
  }

  return (
    <section className={className} aria-label={panelTitle}>
      <div className="tpm-auth-head">
        <span>{variant === "required" ? "Protected access" : "Account access"}</span>
        <strong>{panelTitle}</strong>
        <p>{panelNote}</p>
      </div>

      <form className="tpm-auth-form" onSubmit={handleLogin}>
        <div className="tpm-auth-field">
          <label htmlFor={emailId}>Email</label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="closed-beta email"
            required
          />
        </div>

        <div className="tpm-auth-field">
          <label htmlFor={passwordId}>Password</label>
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="account password"
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in" : "Sign in"}
        </button>
      </form>

      <div className="tpm-auth-truth-row">
        <span>No public registration</span>
        <span>Paper-only evaluation</span>
        <span>Live execution blocked</span>
      </div>

      {message ? <div className="tpm-auth-message">{message}</div> : null}
    </section>
  );
}

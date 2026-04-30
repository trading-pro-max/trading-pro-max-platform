"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getWebCryptoAvailability } from "@/lib/client/al-kawn-local-auth/crypto";
import { clearLocalAuthRecord, hasLocalAuthRecord } from "@/lib/client/al-kawn-local-auth/storage";
import {
  clearLocalAuthSession,
  getLocalAuthRemainingMs,
  isLocalAuthSessionUnlocked,
} from "@/lib/client/al-kawn-local-auth/session";
import { AlKawnLocalAuthResetNotice } from "./AlKawnLocalAuthResetNotice";
import { AlKawnLocalAuthSetup } from "./AlKawnLocalAuthSetup";
import { AlKawnLocalAuthStatus } from "./AlKawnLocalAuthStatus";
import { AlKawnLocalAuthUnlock } from "./AlKawnLocalAuthUnlock";
import styles from "../al-kawn-desktop.module.css";

type LocalAuthView = "loading" | "setup" | "locked" | "unlocked";

export function AlKawnLocalAuthGate({
  policy,
  children,
}: {
  policy: {
    sessionTimeoutMinutes: number;
  };
  children: ReactNode;
}) {
  const [view, setView] = useState<LocalAuthView>("loading");
  const [remainingMs, setRemainingMs] = useState(0);
  const cryptoAvailability = useMemo(() => getWebCryptoAvailability(), []);
  const sessionTimeoutMs = policy.sessionTimeoutMinutes * 60 * 1000;

  const refreshView = useCallback(() => {
    const configured = hasLocalAuthRecord();
    const unlocked = configured && isLocalAuthSessionUnlocked();
    setRemainingMs(unlocked ? getLocalAuthRemainingMs() : 0);
    if (!configured) {
      setView("setup");
      return;
    }
    setView(unlocked ? "unlocked" : "locked");
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      refreshView();
    }, 0);
    const interval = window.setInterval(() => {
      refreshView();
    }, 15_000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [refreshView]);

  function handleLock() {
    clearLocalAuthSession();
    refreshView();
  }

  function handleReset() {
    clearLocalAuthSession();
    clearLocalAuthRecord();
    refreshView();
  }

  if (view === "loading") {
    return (
      <main className={styles.localAuthScreen} data-testid="local-auth-loading">
        <section className={styles.localAuthCard}>
          <span>Local PIN / Passphrase Auth</span>
          <h1>Checking Ahmad-only local access.</h1>
          <p>Product Truth overrides auth claims.</p>
        </section>
      </main>
    );
  }

  if (view === "setup") {
    return (
      <main className={styles.localAuthScreen} data-testid="local-auth-gate">
        <AlKawnLocalAuthSetup
          sessionTimeoutMs={sessionTimeoutMs}
          onConfigured={refreshView}
          cryptoAvailable={cryptoAvailability.available}
        />
        <section className={styles.localAuthCard}>
          <strong>Local auth status</strong>
          <p>{cryptoAvailability.reason}</p>
          <p>Session timeout: active</p>
          <p>External auth providers require Ahmad approval.</p>
          <p>Production-grade auth remains a future gate unless implemented.</p>
          <p>No secrets are stored in Git.</p>
          <p>No secrets are stored in the app bundle.</p>
          <p>Local auth is device-local and Ahmad-only.</p>
          <AlKawnLocalAuthResetNotice onReset={handleReset} />
        </section>
      </main>
    );
  }

  if (view === "locked") {
    return (
      <main className={styles.localAuthScreen} data-testid="local-auth-gate">
        <AlKawnLocalAuthUnlock
          sessionTimeoutMs={sessionTimeoutMs}
          onUnlocked={refreshView}
          onReset={handleReset}
          cryptoAvailable={cryptoAvailability.available}
        />
        <section className={styles.localAuthCard}>
          <strong>Boundary</strong>
          <p>External auth providers require Ahmad approval.</p>
          <p>Production-grade auth remains a future gate unless implemented.</p>
          <p>Product Truth overrides auth claims.</p>
          <AlKawnLocalAuthResetNotice onReset={handleReset} />
        </section>
      </main>
    );
  }

  return (
    <>
      <AlKawnLocalAuthStatus
        configured
        unlocked
        remainingMs={remainingMs}
        onLock={handleLock}
      />
      {children}
    </>
  );
}

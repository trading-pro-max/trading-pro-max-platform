"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { AlKawnLocalAuthMode } from "@/lib/client/al-kawn-local-auth/types";
import { saveLocalAuthRecord } from "@/lib/client/al-kawn-local-auth/storage";
import { unlockLocalAuthSession } from "@/lib/client/al-kawn-local-auth/session";
import { validateLocalAuthSecretShape } from "@/lib/client/al-kawn-local-auth/validation";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnLocalAuthSetup({
  sessionTimeoutMs,
  onConfigured,
  cryptoAvailable,
}: {
  sessionTimeoutMs: number;
  onConfigured: () => void;
  cryptoAvailable: boolean;
}) {
  const [mode, setMode] = useState<AlKawnLocalAuthMode>("passphrase");
  const [secret, setSecret] = useState("");
  const [confirmSecret, setConfirmSecret] = useState("");
  const [message, setMessage] = useState("Local lock is not configured on this browser/device.");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cryptoAvailable) {
      setMessage("Web Crypto is unavailable, so this local lock cannot be configured safely here.");
      return;
    }

    const trimmedSecret = secret.trim();
    const validationError = validateLocalAuthSecretShape(trimmedSecret);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    if (trimmedSecret !== confirmSecret.trim()) {
      setMessage("PIN/passphrase confirmation does not match.");
      return;
    }

    setBusy(true);
    try {
      await saveLocalAuthRecord(mode, trimmedSecret);
      unlockLocalAuthSession(sessionTimeoutMs);
      setMessage("Local private access lock configured for this browser/device.");
      onConfigured();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to configure local lock.");
    } finally {
      setBusy(false);
      setSecret("");
      setConfirmSecret("");
    }
  }

  return (
    <section className={styles.localAuthCard} data-testid="local-auth-setup">
      <div className={styles.sectionTitle}>
        <span>Local PIN / Passphrase Auth</span>
        <h1>Al-Kawn Desktop requires Ahmad-only local access.</h1>
      </div>
      <p>This is a local private access lock, not public authentication.</p>
      <p>No plaintext passphrase is stored.</p>
      <p>External auth providers require Ahmad approval.</p>
      <p>Production-grade auth remains a future gate unless implemented.</p>
      <p>Product Truth overrides auth claims.</p>
      <form className={styles.localAuthForm} onSubmit={handleSubmit}>
        <label>
          Lock type
          <select value={mode} onChange={(event) => setMode(event.target.value as AlKawnLocalAuthMode)}>
            <option value="passphrase">Passphrase</option>
            <option value="pin">PIN</option>
          </select>
        </label>
        <label>
          Local PIN/passphrase
          <input
            autoComplete="new-password"
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
          />
        </label>
        <label>
          Confirm local PIN/passphrase
          <input
            autoComplete="new-password"
            type="password"
            value={confirmSecret}
            onChange={(event) => setConfirmSecret(event.target.value)}
          />
        </label>
        <button type="submit" disabled={busy || !cryptoAvailable}>
          {busy ? "Configuring local lock" : "Set local private lock"}
        </button>
      </form>
      <small>{message}</small>
      <small>Local auth is device-local and Ahmad-only.</small>
    </section>
  );
}

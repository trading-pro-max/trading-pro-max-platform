"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { getLocalAuthRecord } from "@/lib/client/al-kawn-local-auth/storage";
import { unlockLocalAuthSession } from "@/lib/client/al-kawn-local-auth/session";
import { verifyLocalAuthSecret } from "@/lib/client/al-kawn-local-auth/validation";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnLocalAuthUnlock({
  sessionTimeoutMs,
  onUnlocked,
  onReset,
  cryptoAvailable,
}: {
  sessionTimeoutMs: number;
  onUnlocked: () => void;
  onReset: () => void;
  cryptoAvailable: boolean;
}) {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("Enter the local PIN/passphrase for this browser/device.");
  const [busy, setBusy] = useState(false);
  const record = getLocalAuthRecord();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cryptoAvailable) {
      setMessage("Web Crypto is unavailable, so this local lock cannot be verified here.");
      return;
    }

    setBusy(true);
    try {
      const verified = await verifyLocalAuthSecret(secret.trim());
      if (!verified) {
        setMessage("Local PIN/passphrase did not match.");
        return;
      }

      unlockLocalAuthSession(sessionTimeoutMs);
      setMessage("Local session unlocked.");
      onUnlocked();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to unlock local session.");
    } finally {
      setBusy(false);
      setSecret("");
    }
  }

  return (
    <section className={styles.localAuthCard} data-testid="local-auth-unlock">
      <div className={styles.sectionTitle}>
        <span>Local PIN / Passphrase Auth</span>
        <h1>Al-Kawn Desktop requires Ahmad-only local access.</h1>
      </div>
      <p>This is a local private access lock, not public authentication.</p>
      <p>No plaintext passphrase is stored.</p>
      <p>Product Truth overrides auth claims.</p>
      <form className={styles.localAuthForm} onSubmit={handleSubmit}>
        <label>
          Local {record?.mode ?? "PIN/passphrase"}
          <input
            autoComplete="current-password"
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
          />
        </label>
        <button type="submit" disabled={busy || !cryptoAvailable}>
          {busy ? "Checking local lock" : "Unlock local desktop"}
        </button>
      </form>
      <small>{message}</small>
      <button type="button" className={styles.localAuthTextButton} onClick={onReset}>
        Reset local lock settings
      </button>
    </section>
  );
}

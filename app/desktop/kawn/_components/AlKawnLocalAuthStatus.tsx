"use client";

import styles from "../al-kawn-desktop.module.css";

function formatRemaining(remainingMs: number): string {
  if (remainingMs <= 0) {
    return "expired";
  }
  const minutes = Math.ceil(remainingMs / 60_000);
  return `${minutes} min`;
}

export function AlKawnLocalAuthStatus({
  configured,
  unlocked,
  remainingMs,
  onLock,
}: {
  configured: boolean;
  unlocked: boolean;
  remainingMs: number;
  onLock: () => void;
}) {
  return (
    <section className={styles.localAuthStatus} aria-label="Local PIN / Passphrase Auth status">
      <strong>Local PIN / Passphrase Auth</strong>
      <span>Al-Kawn Desktop requires Ahmad-only local access.</span>
      <span>This is a local private access lock, not public authentication.</span>
      <span>No plaintext passphrase is stored.</span>
      <span>Session timeout: active</span>
      <span>Status: {configured ? (unlocked ? "unlocked locally" : "locked") : "setup required"}</span>
      {unlocked ? <span>Session remaining: {formatRemaining(remainingMs)}</span> : null}
      <span>Product Truth overrides auth claims.</span>
      {unlocked ? (
        <button type="button" onClick={onLock}>
          Manual lock
        </button>
      ) : null}
    </section>
  );
}

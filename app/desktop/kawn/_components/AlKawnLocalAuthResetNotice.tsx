"use client";

import styles from "../al-kawn-desktop.module.css";

export function AlKawnLocalAuthResetNotice({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <details className={styles.localAuthReset}>
      <summary>Reset local lock</summary>
      <p>
        Resetting local lock clears local access settings and does not recover secrets. It does not
        connect external auth, restore a passphrase, or change Product Truth.
      </p>
      <button type="button" onClick={onReset}>
        Reset local access settings
      </button>
    </details>
  );
}

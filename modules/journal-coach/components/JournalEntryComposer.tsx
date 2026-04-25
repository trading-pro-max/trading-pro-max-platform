"use client";

import { useMemo, useState } from "react";
import type { JournalCoachSnapshot, JournalEntryFoundation } from "@/lib/server/journal-coach/types";

type JournalEntryComposerProps = {
  snapshot: JournalCoachSnapshot;
};

type LocalJournalDraft = Record<string, string>;

const storageKey = "tpm-journal-coach-local-v1";

function normalizeEntries(entries: JournalEntryFoundation[] | undefined): JournalEntryFoundation[] {
  return entries && entries.length > 0
    ? entries
    : [
        {
          type: "session_note",
          label: "Session note",
          placeholder: "What paper-market condition are you rehearsing today?",
          safetyBoundary: "Paper-session context only.",
        },
        {
          type: "decision_note",
          label: "Decision note",
          placeholder: "Why did you consider this paper action?",
          safetyBoundary: "Records reasoning without predicting outcome.",
        },
      ];
}

export default function JournalEntryComposer({ snapshot }: JournalEntryComposerProps) {
  const entries = useMemo(
    () => normalizeEntries(snapshot.localJournalFoundation?.entries),
    [snapshot.localJournalFoundation?.entries]
  );
  const [drafts, setDrafts] = useState<LocalJournalDraft>(() => {
    if (typeof window === "undefined") return {};

    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as LocalJournalDraft) : {};
    } catch {
      return {};
    }
  });
  const [savedState, setSavedState] = useState<"idle" | "saved">("idle");

  const updateDraft = (type: string, value: string) => {
    setDrafts((current) => ({ ...current, [type]: value }));
    setSavedState("idle");
  };

  const saveLocal = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(drafts));
    setSavedState("saved");
  };

  return (
    <section className="tpm-journal-entry-composer" aria-label="Local journal entry composer">
      <header>
        <span>Local journal</span>
        <strong>Session-ready notes</strong>
        <small>{snapshot.localJournalFoundation.persistenceGap}</small>
      </header>

      <div className="tpm-journal-entry-grid">
        {entries.slice(0, 4).map((entry) => (
          <label key={entry.type} className="tpm-journal-entry-field">
            <span>{entry.label}</span>
            <textarea
              maxLength={420}
              onChange={(event) => updateDraft(entry.type, event.target.value)}
              placeholder={entry.placeholder}
              rows={2}
              value={drafts[entry.type] ?? ""}
            />
            <small>{entry.safetyBoundary}</small>
          </label>
        ))}
      </div>

      <footer>
        <span>{snapshot.localJournalFoundation.persistence}</span>
        <button type="button" onClick={saveLocal}>
          {savedState === "saved" ? "Saved locally" : "Save local draft"}
        </button>
      </footer>
    </section>
  );
}

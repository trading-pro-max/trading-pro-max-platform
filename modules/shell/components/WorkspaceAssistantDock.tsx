import type {
  WorkspaceFocusMode,
  WatchlistDensityMode,
} from "../types/platform-state";

function focusModeLabel(mode: WorkspaceFocusMode) {
  if (mode === "chart_focus") return "Chart focus";
  if (mode === "execution_focus") return "Execution focus";
  return "Balanced";
}

function watchlistDensityLabel(mode: WatchlistDensityMode) {
  return mode === "dense" ? "Dense" : "Standard";
}

type WorkspaceAssistantDockProps = {
  focusMode: WorkspaceFocusMode;
  shortcutHint: string;
  watchlistDensity: WatchlistDensityMode;
};

const ASSISTANT_INTENTS = [
  "Start",
  "Why blocked?",
  "Bigger chart",
  "Calmer",
  "Plans",
  "Journal",
  "Support",
] as const;

export function WorkspaceAssistantDock({
  focusMode,
  shortcutHint,
  watchlistDensity,
}: WorkspaceAssistantDockProps) {
  return (
    <section
      className="tpmv2-card tpm-intent-workspace-rail tpm-workspace-assistant-dock"
      aria-label="Pro Max Assistant workspace dock"
      data-assistant-collapsed-default="true"
    >
      <details className="tpm-workspace-assistant-details">
        <summary className="tpm-workspace-assistant-summary">
          <div className="tpm-workspace-assistant-summary-copy">
            <span>Pro Max Assistant</span>
            <strong>Secondary language layer</strong>
            <small>
              {focusModeLabel(focusMode)} / {watchlistDensityLabel(watchlistDensity)} watchlist
            </small>
          </div>
          <div className="tpm-workspace-assistant-summary-state">
            <em>Collapsed by default</em>
            <b>{shortcutHint}</b>
          </div>
        </summary>

        <div className="tpm-workspace-assistant-panel">
          <p>
            Ask for blocked-state clarity, calmer chart comfort, Journal prompts, plan truth,
            support direction, or a bigger chart without covering execution.
          </p>

          <div className="tpm-intent-chip-row" aria-label="Assistant workspace intents">
            {ASSISTANT_INTENTS.map((intent) => (
              <span key={intent} className="tpm-intent-chip">
                {intent}
              </span>
            ))}
          </div>

          <div className="tpm-workspace-assistant-note">
            No trading signals, profit promises, or unsafe activation.
          </div>
        </div>
      </details>
    </section>
  );
}

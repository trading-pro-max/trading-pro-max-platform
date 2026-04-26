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
      className="tpmv2-card tpmv2-workspace-depth-bar tpmv2-workspace-depth-bar-compact tpm-intent-workspace-rail tpm-workspace-assistant-dock"
      aria-label="Pro Max Assistant workspace dock"
      data-assistant-collapsed-default="true"
    >
      <div className="tpmv2-workspace-depth-block">
        <span>Workspace focus</span>
        <strong>{focusModeLabel(focusMode)}</strong>
        <small>Ask Pro Max Assistant for Chart Comfort, a calmer workspace, or Start guidance.</small>
      </div>

      <div className="tpmv2-workspace-depth-block">
        <span>Watchlist</span>
        <strong>{watchlistDensityLabel(watchlistDensity)}</strong>
        <small>Secondary density controls stay behind the chart-first layout.</small>
      </div>

      <div className="tpmv2-workspace-depth-status tpm-intent-assistant-card">
        <span>Paper-safe controls</span>
        <strong>Layout-only</strong>
        <small>{shortcutHint} No order-entry hotkeys are armed.</small>
        <div className="tpm-intent-chip-row" aria-label="Assistant workspace intents">
          {ASSISTANT_INTENTS.map((intent) => (
            <span key={intent} className="tpm-intent-chip">
              {intent}
            </span>
          ))}
        </div>

        <details className="tpm-workspace-assistant-details">
          <summary>Open short guidance</summary>
          <p>
            Pro Max Assistant can explain paper-safe state, blocked actions, calmer
            chart settings, plans, Journal notes, and Support readiness.
          </p>
          <small>No trading signals, profit promises, or unsafe activation.</small>
        </details>
      </div>
    </section>
  );
}

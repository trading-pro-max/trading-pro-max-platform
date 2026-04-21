import type { Dictionary } from "../i18n/get-dictionary";

export function getSignalTone(signal: "buy" | "sell" | "wait") {
  if (signal === "buy") {
    return {
      background: "rgba(45, 212, 191, 0.15)",
      color: "#5eead4",
      border: "1px solid rgba(45, 212, 191, 0.28)",
    };
  }

  if (signal === "sell") {
    return {
      background: "rgba(248, 113, 113, 0.15)",
      color: "#fca5a5",
      border: "1px solid rgba(248, 113, 113, 0.28)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#cbd5e1",
    border: "1px solid rgba(148, 163, 184, 0.20)",
  };
}

export function getRiskNote(
  riskNoteCode: "" | "session_locked" | "max_open_trades",
  dict: Dictionary
) {
  if (riskNoteCode === "session_locked") return dict.risk.noteSessionLocked;
  if (riskNoteCode === "max_open_trades") return dict.risk.noteMaxOpenTrades;
  return dict.risk.noteDefault;
}

export function getSessionStateLabel(
  sessionLocked: boolean,
  dict: Dictionary
) {
  return sessionLocked ? dict.risk.locked : dict.risk.active;
}

export function formatSessionPnl(sessionPnL: number) {
  return `${sessionPnL >= 0 ? "+" : ""}$${sessionPnL.toFixed(2)}`;
}
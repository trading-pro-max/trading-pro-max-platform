import "server-only";

import type { AutonomousCycle } from "./types";

export function getAlKawnAutonomousCycle(): AutonomousCycle {
  return {
    triggerSources: [
      "Ahmad opens /desktop/kawn",
      "Ahmad clicks Run intelligent cycle",
      "Daily Work Loop requests cycle",
      "future Infinity safe trigger",
    ],
    stages: [
      {
        order: 1,
        label: "Trigger",
        state: "observing",
        action: "Accept only safe internal trigger.",
        safetyRule: "Safe trigger required.",
      },
      {
        order: 2,
        label: "Observe",
        state: "observing",
        action: "Read internal state only.",
        safetyRule: "No external accounts or cloud sync.",
      },
      {
        order: 3,
        label: "Understand",
        state: "understanding",
        action: "Summarize state, layers, capabilities, limits, and Product Truth.",
        safetyRule: "No fake certainty.",
      },
      {
        order: 4,
        label: "Decide",
        state: "selecting_action",
        action: "Choose one safe internal action.",
        safetyRule: "كل دورة تختار عملًا داخليًا واحدًا.",
      },
      {
        order: 5,
        label: "Execute",
        state: "executing_internal",
        action: "Execute internal report/UI/model work only if scoped.",
        safetyRule: "No money, legal, public, broker, or external execution.",
      },
      {
        order: 6,
        label: "Validate",
        state: "validating",
        action: "Run safe validation where applicable.",
        safetyRule: "Product Truth يحكم كل قرار ذكي.",
      },
      {
        order: 7,
        label: "Report",
        state: "reporting",
        action: "Write report, update memory, and speak summary to Ahmad.",
        safetyRule: "الكون يشرح ماذا فعل ولماذا فعل.",
      },
      {
        order: 8,
        label: "Stop",
        state: "waiting_for_safe_trigger",
        action: "Stop and wait for next safe trigger.",
        safetyRule: "Intelligence cycle stops after report.",
      },
    ],
    result: "model_executed_internal_report_only",
    stopRule: "Intelligence cycle stops after report.",
  };
}

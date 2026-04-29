import "server-only";
import type { ProtectionStateRule } from "./types";

export function getProtectionStateRules(): ProtectionStateRule[] {
  return [
    {
      state: "private",
      meaning: "Visible only to Ahmad/private devices or private founder routes.",
      enforcement: "Do not expose in public navigation, public APIs, or public product copy.",
    },
    {
      state: "read_only",
      meaning: "Can be inspected and reported, but cannot trigger sensitive external action.",
      enforcement: "Use preview/status/report surfaces only.",
    },
    {
      state: "approval_required",
      meaning: "Requires explicit Ahmad approval before action.",
      enforcement: "Stop at the Universe Operating Kernel and Founder Boundary.",
    },
    {
      state: "blocked",
      meaning: "Must not execute under current Product Truth.",
      enforcement: "Block immediately and explain the violated law.",
    },
    {
      state: "future_gate_pending",
      meaning: "Can be documented as future, but not activated now.",
      enforcement: "Keep gate label visible and require future evidence.",
    },
  ];
}

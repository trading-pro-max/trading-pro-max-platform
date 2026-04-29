import "server-only";
import type { ImpactMemoryRule } from "./types";

export function getImpactMemoryRules(): ImpactMemoryRule[] {
  return [
    {
      id: "understandable_trace",
      meaning: "Every entity must leave a trace Ahmad can understand.",
      requiredTrace: "Report evidence, test evidence, or local project state reference.",
    },
    {
      id: "product_truth_trace",
      meaning: "Every entity must state Product Truth impact.",
      requiredTrace: "Preserves, requires review, blocks if contradicted, or highest law.",
    },
    {
      id: "privacy_trace",
      meaning: "Every entity must state whether it touches private, public, or external surfaces.",
      requiredTrace: "Privacy impact and security touch fields in the Existence Contract.",
    },
    {
      id: "execution_trace",
      meaning: "Every entity must state what can execute, what stops, and what blocks.",
      requiredTrace: "Execution verdict and rollback/explanation path.",
    },
  ];
}

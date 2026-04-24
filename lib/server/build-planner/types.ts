export type BuildPlannerDomain =
  | "visual"
  | "ux"
  | "backend"
  | "docs"
  | "safety"
  | "monetization"
  | "planet-os"
  | "founder-command"
  | "launch-forbidden";

export type BuildPlannerRisk = "low" | "medium" | "high" | "critical";

export type BuildPlannerTaskPlan = {
  checkedAt: string;
  mode: "ai_build_planner";
  currentProductArea: string;
  domain: BuildPlannerDomain;
  completionStatus: "ready" | "partial" | "blocked" | "planned";
  blockers: string[];
  nextSafeTasks: string[];
  risk: BuildPlannerRisk;
  suggestedValidation: string[];
  dependencyOrder: string[];
  whatNotToTouch: string[];
  executorTruth: "planner_only_not_executor";
};

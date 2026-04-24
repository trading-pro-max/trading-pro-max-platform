export type BuildPlannerDomain =
  | "visual"
  | "ux"
  | "backend"
  | "docs"
  | "safety"
  | "monetization"
  | "planet-os"
  | "founder-command"
  | "companion"
  | "media"
  | "journal-coach"
  | "roadmap"
  | "launch-forbidden"
  | "secret-forbidden"
  | "live-forbidden"
  | "billing-forbidden"
  | "broker-feed-forbidden"
  | "social-publishing-forbidden";

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

export type InternalRoadmapPlannerItem = {
  id: string;
  title: string;
  domain: BuildPlannerDomain;
  ownerMinistry: string;
  risk: BuildPlannerRisk;
  userFacing: boolean;
  founderOnly: boolean;
  docsOnly: boolean;
  shouldWait: boolean;
  status: "next_safe_task" | "batchable" | "blocked" | "forbidden" | "waiting";
  dependencyChain: string[];
  validationRequired: string[];
  reason: string;
};

export type InternalRoadmapPlannerSnapshot = {
  checkedAt: string;
  mode: "internal_roadmap_auto_planner";
  nextSafeTask: InternalRoadmapPlannerItem;
  batchableTasks: InternalRoadmapPlannerItem[];
  blockedTasks: InternalRoadmapPlannerItem[];
  forbiddenTasks: InternalRoadmapPlannerItem[];
  truth: {
    autonomousCodeExecution: "not_enabled";
    launchRequiresExplicitFutureRequest: true;
    productionSecretsForbidden: true;
    liveExecutionForbidden: true;
    billingActivationForbidden: true;
    brokerFeedActivationForbidden: true;
    socialPublishingForbidden: true;
    visualAcceptanceByAhmadRequired: true;
  };
};

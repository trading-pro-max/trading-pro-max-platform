import "server-only";

import type {
  BuildPlannerDomain,
  BuildPlannerTaskPlan,
  InternalRoadmapPlannerItem,
  InternalRoadmapPlannerSnapshot,
} from "./types";

const launchForbiddenWords = [
  "launch",
  "production",
];

const secretForbiddenWords = [
  "secret",
  "api key",
  "token",
];

const liveForbiddenWords = [
  "live execution",
  "real money",
];

const billingForbiddenWords = ["billing", "checkout", "subscription"];

const brokerFeedForbiddenWords = ["broker", "feed activation", "live feed"];

const socialForbiddenWords = ["social publish", "publish externally", "posting"];

function classifyDomain(task: string): BuildPlannerDomain {
  const normalized = task.toLowerCase();
  if (launchForbiddenWords.some((word) => normalized.includes(word))) return "launch-forbidden";
  if (secretForbiddenWords.some((word) => normalized.includes(word))) return "secret-forbidden";
  if (liveForbiddenWords.some((word) => normalized.includes(word))) return "live-forbidden";
  if (billingForbiddenWords.some((word) => normalized.includes(word))) return "billing-forbidden";
  if (brokerFeedForbiddenWords.some((word) => normalized.includes(word))) return "broker-feed-forbidden";
  if (socialForbiddenWords.some((word) => normalized.includes(word))) return "social-publishing-forbidden";
  if (normalized.includes("visual") || normalized.includes("theme")) return "visual";
  if (normalized.includes("ux") || normalized.includes("journey")) return "ux";
  if (normalized.includes("api") || normalized.includes("backend")) return "backend";
  if (normalized.includes("doc")) return "docs";
  if (normalized.includes("guardian") || normalized.includes("legal")) return "safety";
  if (normalized.includes("plan") || normalized.includes("vip")) return "monetization";
  if (normalized.includes("planet")) return "planet-os";
  if (normalized.includes("founder")) return "founder-command";
  if (normalized.includes("companion") || normalized.includes("assistant")) return "companion";
  if (normalized.includes("journal") || normalized.includes("coach") || normalized.includes("replay")) return "journal-coach";
  if (normalized.includes("roadmap")) return "roadmap";
  if (normalized.includes("media") || normalized.includes("content")) return "media";
  return "docs";
}

export function planSafeBuildTask(
  task: string,
  checkedAt = new Date().toISOString()
): BuildPlannerTaskPlan {
  const domain = classifyDomain(task);
  const forbidden =
    domain === "launch-forbidden" ||
    domain === "secret-forbidden" ||
    domain === "live-forbidden" ||
    domain === "billing-forbidden" ||
    domain === "broker-feed-forbidden" ||
    domain === "social-publishing-forbidden";

  return {
    checkedAt,
    mode: "ai_build_planner",
    currentProductArea: task,
    domain,
    completionStatus: forbidden ? "blocked" : "partial",
    blockers: forbidden
      ? [`Task is ${domain}; convert it to readiness/docs/truth only unless explicitly authorized later.`]
      : [],
    nextSafeTasks: forbidden
      ? ["Keep the task blocked and convert it into docs or readiness truth only if needed."]
      : [
          "Inspect existing contracts.",
          "Make the smallest safe change.",
          "Add tests or docs where risk justifies it.",
          "Run validation before commit.",
        ],
    risk: forbidden ? "critical" : domain === "backend" || domain === "safety" ? "medium" : "low",
    suggestedValidation: [
      "npx tsc --noEmit",
      "npx eslint app modules tests --max-warnings=0",
      "npm run build",
      "npm run prisma:validate",
      "npm run test:regression",
      "npm run smoke:routes",
      "git diff --check",
    ],
    dependencyOrder: ["read current code", "update contracts", "add tests/docs", "validate", "commit"],
    whatNotToTouch: [
      "production secrets",
      "live execution",
      "real-money routing",
      "broker/feed activation",
      "billing activation",
      "public launch claims",
      "social account publishing",
    ],
    executorTruth: "planner_only_not_executor",
  };
}

export function getBuildPlannerSnapshot() {
  return planSafeBuildTask("planet-os internal engine readiness");
}

export function getBuildPlannerReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  return {
    checkedAt,
    mode: "ai_build_planner_readiness" as const,
    plannerTruth: "planner_only_not_executor" as const,
    recommendedSafeAreas: [
      "chart/workstation polish",
      "user Companion UI",
      "Founder command private app shell",
      "plan entitlement UX",
      "state explanations",
      "journal/coach foundation",
      "community architecture",
    ],
    plans: {
      chartPolish: planSafeBuildTask("chart workstation polish", checkedAt),
      companionUi: planSafeBuildTask("user companion UI readiness", checkedAt),
      founderShell: planSafeBuildTask("founder command private app shell", checkedAt),
      planUx: planSafeBuildTask("plan entitlement UX", checkedAt),
      stateExplanations: planSafeBuildTask("state explanations", checkedAt),
      communityArchitecture: planSafeBuildTask("community architecture docs", checkedAt),
      launchForbidden: planSafeBuildTask("public launch gate request", checkedAt),
      secretForbidden: planSafeBuildTask("rotate secret token in private vault", checkedAt),
      liveForbidden: planSafeBuildTask("enable live execution and billing", checkedAt),
      billingForbidden: planSafeBuildTask("activate billing checkout", checkedAt),
      brokerFeedForbidden: planSafeBuildTask("activate broker feed integration", checkedAt),
      socialForbidden: planSafeBuildTask("social publish campaign", checkedAt),
    },
    truth: {
      autonomousExecutor: "not_enabled" as const,
      productionActions: "blocked" as const,
      secrets: "not_allowed" as const,
      launchActivation: "blocked" as const,
      liveExecution: "blocked" as const,
    },
  };
}

function roadmapItem(
  id: string,
  title: string,
  domain: BuildPlannerDomain,
  ownerMinistry: string,
  risk: InternalRoadmapPlannerItem["risk"],
  status: InternalRoadmapPlannerItem["status"],
  reason: string,
  options: Partial<Pick<InternalRoadmapPlannerItem, "userFacing" | "founderOnly" | "docsOnly" | "shouldWait">> = {}
): InternalRoadmapPlannerItem {
  return {
    id,
    title,
    domain,
    ownerMinistry,
    risk,
    userFacing: options.userFacing ?? false,
    founderOnly: options.founderOnly ?? false,
    docsOnly: options.docsOnly ?? false,
    shouldWait: options.shouldWait ?? (status === "waiting" || status === "forbidden"),
    status,
    dependencyChain: [
      "inspect current contract",
      "preserve product truth",
      "add focused tests/docs",
      "run full validation",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "npx eslint app modules tests --max-warnings=0",
      "npm run build",
      "npm run test:regression",
    ],
    reason,
  };
}

export function getInternalRoadmapPlannerSnapshot(
  checkedAt = new Date().toISOString()
): InternalRoadmapPlannerSnapshot {
  const nextSafeTask = roadmapItem(
    "companion-guidance-depth",
    "Deepen companion guidance templates with skill-aware safe responses",
    "companion",
    "AI / IQ / Brain",
    "medium",
    "next_safe_task",
    "Improves user help without touching execution, billing, launch, or secrets.",
    { userFacing: true }
  );
  const batchableTasks = [
    roadmapItem(
      "journal-replay-foundation",
      "Expand journal/coach decision replay as paper-only learning",
      "journal-coach",
      "Records / Audit / Journal",
      "medium",
      "batchable",
      "Can be built as deterministic reflection contracts.",
      { userFacing: true }
    ),
    roadmapItem(
      "founder-command-readiness",
      "Refine Founder Command read-only briefing modules",
      "founder-command",
      "Presidency & Command",
      "medium",
      "batchable",
      "Owner-only readiness can improve without exposing a public route.",
      { founderOnly: true }
    ),
  ];
  const blockedTasks = [
    roadmapItem(
      "native-command-app",
      "Private desktop/mobile Founder Command app shell",
      "founder-command",
      "Platforms & Devices",
      "high",
      "waiting",
      "Requires owner-only device auth and app packaging decisions.",
      { founderOnly: true, shouldWait: true }
    ),
  ];
  const forbiddenTasks = [
    roadmapItem(
      "public-launch",
      "Public launch activation",
      "launch-forbidden",
      "Presidency & Command",
      "critical",
      "forbidden",
      "Launch remains out of scope unless explicitly requested in a future launch phase.",
      { shouldWait: true }
    ),
    roadmapItem(
      "billing-activation",
      "Billing and checkout activation",
      "billing-forbidden",
      "Treasury & Economy",
      "critical",
      "forbidden",
      "Billing activation is forbidden in this pass.",
      { shouldWait: true }
    ),
    roadmapItem(
      "broker-feed-activation",
      "Broker/feed activation",
      "broker-feed-forbidden",
      "Markets & Trading",
      "critical",
      "forbidden",
      "Broker/feed activation is forbidden in this pass.",
      { shouldWait: true }
    ),
  ];

  return {
    checkedAt,
    mode: "internal_roadmap_auto_planner",
    nextSafeTask,
    batchableTasks,
    blockedTasks,
    forbiddenTasks,
    truth: {
      autonomousCodeExecution: "not_enabled",
      launchRequiresExplicitFutureRequest: true,
      productionSecretsForbidden: true,
      liveExecutionForbidden: true,
      billingActivationForbidden: true,
      brokerFeedActivationForbidden: true,
      socialPublishingForbidden: true,
      visualAcceptanceByAhmadRequired: true,
    },
  };
}

import "server-only";

import type { BuildPlannerDomain, BuildPlannerTaskPlan } from "./types";

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
  "billing",
  "broker",
  "social publish",
];

function classifyDomain(task: string): BuildPlannerDomain {
  const normalized = task.toLowerCase();
  if (launchForbiddenWords.some((word) => normalized.includes(word))) return "launch-forbidden";
  if (secretForbiddenWords.some((word) => normalized.includes(word))) return "secret-forbidden";
  if (liveForbiddenWords.some((word) => normalized.includes(word))) return "live-forbidden";
  if (normalized.includes("visual") || normalized.includes("theme")) return "visual";
  if (normalized.includes("ux") || normalized.includes("journey")) return "ux";
  if (normalized.includes("api") || normalized.includes("backend")) return "backend";
  if (normalized.includes("doc")) return "docs";
  if (normalized.includes("guardian") || normalized.includes("legal")) return "safety";
  if (normalized.includes("plan") || normalized.includes("vip")) return "monetization";
  if (normalized.includes("planet")) return "planet-os";
  if (normalized.includes("founder")) return "founder-command";
  if (normalized.includes("companion") || normalized.includes("assistant")) return "companion";
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
    domain === "live-forbidden";

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

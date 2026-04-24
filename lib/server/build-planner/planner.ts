import "server-only";

import type { BuildPlannerDomain, BuildPlannerTaskPlan } from "./types";

const forbiddenWords = [
  "launch",
  "production",
  "secret",
  "live execution",
  "real money",
  "billing",
  "broker",
  "social publish",
];

function classifyDomain(task: string): BuildPlannerDomain {
  const normalized = task.toLowerCase();
  if (forbiddenWords.some((word) => normalized.includes(word))) return "launch-forbidden";
  if (normalized.includes("visual") || normalized.includes("theme")) return "visual";
  if (normalized.includes("ux") || normalized.includes("journey")) return "ux";
  if (normalized.includes("api") || normalized.includes("backend")) return "backend";
  if (normalized.includes("doc")) return "docs";
  if (normalized.includes("guardian") || normalized.includes("legal")) return "safety";
  if (normalized.includes("plan") || normalized.includes("vip")) return "monetization";
  if (normalized.includes("planet")) return "planet-os";
  if (normalized.includes("founder")) return "founder-command";
  return "docs";
}

export function planSafeBuildTask(
  task: string,
  checkedAt = new Date().toISOString()
): BuildPlannerTaskPlan {
  const domain = classifyDomain(task);
  const forbidden = domain === "launch-forbidden";

  return {
    checkedAt,
    mode: "ai_build_planner",
    currentProductArea: task,
    domain,
    completionStatus: forbidden ? "blocked" : "partial",
    blockers: forbidden
      ? ["Task mentions launch/production/secrets/live/billing/broker/social publishing scope."]
      : [],
    nextSafeTasks: forbidden
      ? ["Keep the task blocked and convert it into docs or readiness truth only if needed."]
      : ["Inspect existing contracts.", "Make the smallest safe change.", "Run validation before commit."],
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

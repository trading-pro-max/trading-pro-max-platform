import type { CommandPassport } from "./types";

export function getCommandPassport(): CommandPassport {
  return {
    passportStatus: "preview_ready",
    mission:
      "Advance the current Pro Max heart without violating Product Truth, public/private boundaries, or Ahmad authority.",
    whyNow:
      "Alkon must convert one approved next action into bounded work with proof before reality admission.",
    ownershipLayer: "private_alkon_universe",
    allowedScope: [
      "read current reality",
      "create scoped docs, tests, and UI only when requested",
      "preserve public Product Truth",
      "produce evidence and Wake Report",
      "request Ahmad review for visual or sensitive gates",
    ],
    forbiddenScope: [
      "launch",
      "billing",
      "broker/feed",
      "live execution",
      "real money",
      "social publishing",
      "public Alkon exposure",
      "secrets or raw sensitive personal data",
    ],
    likelyFiles: [
      "docs/product/*",
      "lib/server/*",
      "modules/*",
      "tests/regression/*",
      "reports/*",
    ],
    validationRequired: [
      "npx tsc --noEmit",
      "npx eslint app modules tests --max-warnings=0",
      "npm run build",
      "npm run prisma:validate",
      "npm run test:regression",
      "npm run smoke:routes",
      "git diff --check",
      "git status --short",
    ],
    screenshotsRequired: true,
    productTruthConstraints: [
      "paper-safe only",
      "no live execution",
      "no real money",
      "broker/feed inactive",
      "billing inactive",
      "production inactive",
      "no fake claims",
    ],
    publicPrivateBoundaries: [
      "Public sees Pro Max and public-safe readiness only.",
      "Founder sees Alkon, Kernel, evidence, memory, and gates.",
      "Invisible layer translates private truth into safe public labels.",
    ],
    stopConditions: [
      "P0 Product Truth failure",
      "public Alkon leak",
      "failed validation",
      "dirty Git before closure",
      "sensitive action without Ahmad",
      "unknown-license asset",
    ],
    wakeReportFormat: [
      "Status",
      "Mission",
      "Done",
      "Not done",
      "Validation",
      "Tests",
      "Commit",
      "Pushed",
      "Clean",
      "Next",
    ],
    nextFate: "Reality Trial after implementation and validation.",
    noExecution: true,
  };
}

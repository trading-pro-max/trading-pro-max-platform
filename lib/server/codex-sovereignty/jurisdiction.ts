import "server-only";

import type {
  CodexJurisdiction,
  CodexReviewArea,
  CodexTaskCategory,
} from "./types";

const fullValidation = [
  "npx tsc --noEmit",
  "npx eslint app modules tests --max-warnings=0",
  "npm run build",
  "npm run prisma:validate",
  "npm run test:regression",
  "npm run smoke:routes",
  "git diff --check",
  "git status --short",
];

const publicForbiddenTerms = [
  "Founder Command",
  "Presidency",
  "Codex Sovereign Construction State",
  "Task Parliament",
  "Jurisdiction Office",
  "Task Passport",
  "Execution Permit",
  "Result Tribunal",
  "Memory & Lessons",
  "Construction Queue",
];

const baseForbiddenFiles = [
  ".env",
  ".env.*",
  "**/*.pem",
  "**/*.key",
  "**/*secret*",
  "**/*credential*",
  "prisma/migrations/**",
  "lib/db/**",
];

const activationForbiddenFiles = [
  "lib/server/connectors/broker/**",
  "lib/server/market-data/**",
  "lib/server/commercial/**",
  "lib/server/launch/**",
  "lib/server/production/**",
  "lib/server/ops/**",
];

function jurisdiction(input: {
  category: CodexTaskCategory;
  ownerArea: string;
  allowedFiles: string[];
  forbiddenFiles?: string[];
  allowedSurfaces: string[];
  forbiddenSurfaces?: string[];
  allowedTerms?: string[];
  forbiddenTerms?: string[];
  requiredReviews?: CodexReviewArea[];
  validationRequired?: string[];
  screenshotRequired?: boolean;
  rollbackRule?: string;
  blockedByDefault?: boolean;
}): CodexJurisdiction {
  return {
    category: input.category,
    ownerArea: input.ownerArea,
    allowedFiles: input.allowedFiles,
    forbiddenFiles: [
      ...baseForbiddenFiles,
      ...activationForbiddenFiles,
      ...(input.forbiddenFiles ?? []),
    ],
    allowedSurfaces: input.allowedSurfaces,
    forbiddenSurfaces: [
      "production secrets",
      "billing activation",
      "broker/feed activation",
      "live execution",
      "real money",
      "social publishing",
      "public launch activation",
      ...(input.forbiddenSurfaces ?? []),
    ],
    allowedTerms: input.allowedTerms ?? ["Trading Pro Max", "Free", "Pro", "VIP", "Institutional"],
    forbiddenTerms: input.forbiddenTerms ?? publicForbiddenTerms,
    requiredReviews: input.requiredReviews ?? ["Product Truth", "Quality"],
    validationRequired: input.validationRequired ?? fullValidation,
    screenshotRequired: input.screenshotRequired ?? false,
    rollbackRule:
      input.rollbackRule ??
      "Stop and report if touched files drift outside the passport; do not widen scope.",
    blockedByDefault: input.blockedByDefault ?? false,
  };
}

export const codexJurisdictions: CodexJurisdiction[] = [
  jurisdiction({
    category: "docs_update",
    ownerArea: "Product Documentation",
    allowedFiles: ["docs/**"],
    forbiddenFiles: ["app/**", "modules/**", "lib/**"],
    allowedSurfaces: ["internal docs", "product docs", "security docs"],
    forbiddenTerms: [],
  }),
  jurisdiction({
    category: "test_update",
    ownerArea: "Quality",
    allowedFiles: ["tests/**"],
    forbiddenFiles: ["app/**", "modules/**", "lib/**"],
    allowedSurfaces: ["regression tests", "smoke tests"],
    requiredReviews: ["Quality", "Product Truth"],
  }),
  jurisdiction({
    category: "copy_cleanup",
    ownerArea: "Product Truth",
    allowedFiles: ["modules/**/*.tsx", "lib/i18n/**/*.ts", "tests/**"],
    allowedSurfaces: ["public copy", "readiness labels"],
    requiredReviews: ["Product Truth", "Quality", "Public Language"],
  }),
  jurisdiction({
    category: "lint_cleanup",
    ownerArea: "Engineering Quality",
    allowedFiles: ["app/**", "modules/**", "lib/**", "tests/**"],
    allowedSurfaces: ["lint cleanup", "format-safe code paths"],
  }),
  jurisdiction({
    category: "type_cleanup",
    ownerArea: "Engineering Quality",
    allowedFiles: ["app/**", "modules/**", "lib/**", "tests/**"],
    allowedSurfaces: ["type cleanup", "safe contracts"],
  }),
  jurisdiction({
    category: "visual_polish",
    ownerArea: "Design",
    allowedFiles: ["app/globals.css", "modules/**/*.tsx", "tests/**"],
    forbiddenFiles: [
      "app/api/**",
      "lib/server/security/**",
      "lib/server/secrets-authority/**",
      "lib/server/commercial/**",
    ],
    allowedSurfaces: ["CSS", "specific visual components"],
    forbiddenSurfaces: ["auth", "billing", "broker", "secrets"],
    requiredReviews: ["Design", "Product Truth", "Quality"],
    screenshotRequired: true,
  }),
  jurisdiction({
    category: "css_polish",
    ownerArea: "Design",
    allowedFiles: ["app/globals.css", "modules/**/*.tsx", "tests/**"],
    forbiddenFiles: ["app/api/**", "lib/server/**"],
    allowedSurfaces: ["CSS", "component styling"],
    requiredReviews: ["Design", "Quality"],
    screenshotRequired: true,
  }),
  jurisdiction({
    category: "public_ui",
    ownerArea: "Product + UX",
    allowedFiles: ["modules/**/*.tsx", "app/globals.css", "tests/**"],
    allowedSurfaces: ["public user world"],
    requiredReviews: ["Founder", "Product Truth", "Quality", "Public Language"],
    screenshotRequired: true,
  }),
  jurisdiction({
    category: "logo_identity",
    ownerArea: "Visual Identity",
    allowedFiles: ["app/icon.svg", "modules/**/*.tsx", "app/globals.css", "docs/**", "tests/**"],
    forbiddenFiles: ["lib/server/**", "app/api/**"],
    allowedSurfaces: ["brand components", "icon.svg", "identity docs/tests"],
    requiredReviews: ["Founder", "Design", "Product Truth", "Quality"],
    screenshotRequired: true,
  }),
  jurisdiction({
    category: "assistant_behavior",
    ownerArea: "Assistant + Product Truth",
    allowedFiles: ["modules/companion/**", "lib/assistant/**", "tests/**"],
    allowedSurfaces: ["TPM Assistant", "assistant copy", "assistant safety"],
    requiredReviews: ["Product Truth", "Guardian", "Quality"],
  }),
  jurisdiction({
    category: "journal_coach",
    ownerArea: "Journal Coach",
    allowedFiles: ["modules/journal-coach/**", "lib/server/journal-coach/**", "tests/**"],
    allowedSurfaces: ["Journal", "Coach"],
    requiredReviews: ["Product Truth", "Guardian", "Quality"],
  }),
  jurisdiction({
    category: "diagnostics",
    ownerArea: "Diagnostics",
    allowedFiles: ["lib/server/diagnostics/**", "modules/shell/components/**", "app/api/diagnostics/**", "tests/**"],
    allowedSurfaces: ["public-safe Diagnostics", "readiness line"],
    requiredReviews: ["Product Truth", "Quality", "Public Language"],
  }),
  jurisdiction({
    category: "settings",
    ownerArea: "Settings",
    allowedFiles: ["modules/shell/components/**", "lib/server/preferences/**", "tests/**"],
    allowedSurfaces: ["Settings", "public account controls"],
    requiredReviews: ["Product Truth", "Quality", "Public Language"],
  }),
  jurisdiction({
    category: "founder_command",
    ownerArea: "Founder Command",
    allowedFiles: ["lib/server/founder-command/**", "modules/founder-command/**", "app/api/founder/**", "docs/**", "tests/**"],
    forbiddenSurfaces: ["public nav", "user plans", "normal user UI"],
    allowedSurfaces: ["private Founder Command", "internal APIs", "internal docs"],
    requiredReviews: ["Founder", "Security", "Product Truth", "Quality"],
  }),
  jurisdiction({
    category: "security",
    ownerArea: "Security",
    allowedFiles: ["docs/security/**", "tests/**"],
    forbiddenFiles: ["app/api/auth/**", "lib/server/security/**", "middleware.ts"],
    allowedSurfaces: ["security docs", "status-only tests"],
    requiredReviews: ["Founder", "Security", "Product Truth", "Quality"],
  }),
  jurisdiction({
    category: "secrets",
    ownerArea: "Secrets Authority",
    allowedFiles: ["docs/security/**", "lib/server/secrets-authority/**", "tests/**"],
    forbiddenFiles: [".env*", "**/*token*", "**/*key*", "**/*secret*", "app/api/**"],
    allowedSurfaces: ["status-only readiness docs/contracts"],
    requiredReviews: ["Founder", "Secrets Authority", "Security", "Product Truth"],
    blockedByDefault: true,
  }),
  jurisdiction({
    category: "world_interface",
    ownerArea: "World Interface",
    allowedFiles: ["lib/server/world-interface/**", "app/api/world-interface/**", "app/api/founder/world-interface/**", "docs/**", "tests/**"],
    allowedSurfaces: ["readiness-only world interface"],
    requiredReviews: ["Founder", "World Interface", "Guardian", "Legal", "Product Truth"],
  }),
  jurisdiction({
    category: "media_readiness",
    ownerArea: "Media Office",
    allowedFiles: ["lib/server/media-office/**", "modules/media-office/**", "docs/**", "tests/**"],
    allowedSurfaces: ["draft-only media readiness"],
    requiredReviews: ["Founder", "Guardian", "Legal", "Product Truth", "Quality"],
  }),
  jurisdiction({
    category: "academy_community",
    ownerArea: "Academy + Community",
    allowedFiles: ["lib/server/academy/**", "lib/server/community/**", "modules/community/**", "docs/**", "tests/**"],
    allowedSurfaces: ["Academy", "Community", "VIP readiness"],
    requiredReviews: ["Product Truth", "Guardian", "Quality"],
  }),
  jurisdiction({
    category: "billing_blocked",
    ownerArea: "Product Truth",
    allowedFiles: ["docs/**", "tests/**"],
    allowedSurfaces: ["blocked readiness note"],
    requiredReviews: ["Founder", "Legal", "Security", "Product Truth"],
    blockedByDefault: true,
  }),
  jurisdiction({
    category: "broker_feed_blocked",
    ownerArea: "Security",
    allowedFiles: ["docs/**", "tests/**"],
    allowedSurfaces: ["blocked readiness note"],
    requiredReviews: ["Founder", "Security", "Product Truth"],
    blockedByDefault: true,
  }),
  jurisdiction({
    category: "live_execution_blocked",
    ownerArea: "Security",
    allowedFiles: ["docs/**", "tests/**"],
    allowedSurfaces: ["blocked readiness note"],
    requiredReviews: ["Founder", "Security", "Product Truth"],
    blockedByDefault: true,
  }),
  jurisdiction({
    category: "launch_blocked",
    ownerArea: "Product Truth",
    allowedFiles: ["docs/**", "tests/**"],
    allowedSurfaces: ["blocked readiness note"],
    requiredReviews: ["Founder", "Guardian", "Legal", "Product Truth"],
    blockedByDefault: true,
  }),
];

export function getCodexJurisdiction(category: CodexTaskCategory): CodexJurisdiction {
  return (
    codexJurisdictions.find((entry) => entry.category === category) ??
    jurisdiction({
      category,
      ownerArea: "Product Truth",
      allowedFiles: ["docs/**", "tests/**"],
      allowedSurfaces: ["draft-only review"],
      requiredReviews: ["Product Truth", "Quality"],
    })
  );
}

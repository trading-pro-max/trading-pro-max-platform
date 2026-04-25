import "server-only";

import type { LocalRuntimeCommand, LocalRuntimeToolingSnapshot } from "./types";

export const localRuntimeCommands: LocalRuntimeCommand[] = [
  {
    command: "npm run build",
    purpose: "Create a production build and catch route/type/runtime build failures.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
  {
    command: "npm start",
    purpose: "Run the already-built local web app for review.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
  {
    command: "npm run dev",
    purpose: "Run local development server while editing.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
  {
    command: "npx tsc --noEmit",
    purpose: "Type-check without writing build output.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
  {
    command: "npx eslint app modules tests --max-warnings=0",
    purpose: "Lint application, modules, and regression tests strictly.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
  {
    command: "npm run prisma:validate",
    purpose: "Validate the Prisma schema.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
  {
    command: "npm run test:regression",
    purpose: "Run build, seed, and Playwright regression coverage.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: true,
  },
  {
    command: "npm run smoke:routes",
    purpose: "Run canonical route smoke checks.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
  {
    command: "git status --short",
    purpose: "Confirm the local worktree state.",
    allowedSurface: "docs_readiness_only",
    executableFromWebApp: false,
    requiresFounderReview: false,
  },
];

export function getLocalRuntimeToolingSnapshot(
  checkedAt = new Date().toISOString()
): LocalRuntimeToolingSnapshot {
  return {
    checkedAt,
    mode: "local_runtime_tooling_readiness",
    status: "ready",
    commands: localRuntimeCommands,
    webAppShellExecution: false,
    remoteCommandExecution: false,
    unsafeAutomation: false,
    safeNextAction:
      "Run commands manually in the local terminal; the web app may display readiness but must not execute shell commands.",
  };
}

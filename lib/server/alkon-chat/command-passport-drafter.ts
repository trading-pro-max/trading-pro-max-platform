import type {
  AlkonChatCommandPassportDraft,
  AlkonChatContext,
  AlkonChatIntent,
} from "./types";

function inferMission(intent: AlkonChatIntent) {
  if (intent.type === "focused_correction_request") {
    return "Execute a focused correction that restores the current heart without opening unsafe scope.";
  }

  if (intent.type === "visual_review_guidance") {
    return "Prepare visual review evidence and a focused correction path for Ahmad.";
  }

  return "Prepare a governed Alkon command passport preview for Ahmad review.";
}

export function draftAlkonCommandPassport(
  intent: AlkonChatIntent,
  context: AlkonChatContext
): AlkonChatCommandPassportDraft {
  return {
    mission: inferMission(intent),
    whyNow:
      "The next action must be small, evidenced, visually reviewable, and safe before Local Day One can move.",
    affectedLayer: "Private Alkon Universe / Invisible Operating Layer",
    ownership:
      "Ahmad remains final decision authority. Codex may build only from an approved passport.",
    allowedScope: [
      "Read safe private state",
      "Draft route, UI, copy, or test corrections",
      "Preserve public Pro Max truth",
      "Prepare visual proof",
      "Update Wake Report after validation",
    ],
    forbiddenScope: [
      "No shell execution from the web app",
      "No Codex execution from the web app",
      "No billing, broker/feed, live execution, real money, production, or public launch activation",
      "No public exposure of Alkon, Kernel, Reality Trial, Command Passport internals, or Founder Command",
      "No secrets, bank/card data, raw biometric data, fake metrics, or fake acceptance",
    ],
    likelyFiles: [
      "app/founder/alkon/page.tsx",
      "modules/founder-command/components/*",
      "lib/server/alkon-chat/*",
      "tests/regression/*",
      "reports/alkon-wake-report.md",
    ],
    validation: [
      "npx tsc --noEmit",
      "npx eslint app modules tests --max-warnings=0",
      "npm run build",
      "npm run prisma:validate",
      "npm run test:regression",
      "npm run smoke:routes",
      "git diff --check",
      "git status --short",
    ],
    visualProof: [
      "Founder Alkon command interface",
      "Ask Alkon area",
      "One Next Action",
      "Wake Report and Evidence",
      "Command Passport Preview",
      "Public Home no Alkon leak",
      "Local Day One not started",
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
    productTruthRules: [
      context.localDayOneStatusLabel,
      "Live execution blocked",
      "Real money blocked",
      "Billing inactive",
      "Broker/feed inactive",
      "No trading signals",
      "No profit promises",
    ],
    publicPrivateBoundary: [
      "Public users see Pro Max Center and Pro Max Trading only.",
      "Alkon, Founder Command, Kernel, Reality Trial, and Command Passport internals stay private.",
    ],
    stopConditions: [
      "A public Alkon leak appears",
      "Validation fails",
      "Visual proof is missing",
      "The request asks for unsafe activation",
      "Ahmad visual acceptance is absent and a Local Day One start is requested",
    ],
    previewOnly: true,
    noExecution: true,
  };
}

import "server-only";

export type LocalLivingDayLoopSnapshot = {
  checkedAt: string;
  mode: "local_living_day_loop";
  loop: Array<{
    step: string;
    status: "ready" | "waiting_review" | "blocked_by_design";
    output: string;
  }>;
  today: {
    ideaIntake: string;
    openGaps: string[];
    proposedCodexDrafts: string[];
    blockedRequests: string[];
    visualReviewNeeds: string[];
    nextSafeAction: string;
  };
  codebaseRealityAudit: {
    status: "ready";
    auditNeeded: true;
    cleanupNeeded: true;
    p0CleanupRoute: string[];
    p1CleanupRoute: string[];
    cleanupExecutionActive: false;
    deletionAllowedWithoutProof: false;
    nextSafeAction: string;
  };
  truth: {
    publicLaunchActive: false;
    productionActive: false;
    billingActive: false;
    brokerFeedActive: false;
    liveExecutionActive: false;
    realMoneyActive: false;
    socialPublishingActive: false;
    shellExecutionFromWebApp: false;
    codexCalledFromWebApp: false;
    secretsStored: false;
  };
};

export function getLocalLivingDayLoopSnapshot(
  checkedAt = new Date().toISOString()
): LocalLivingDayLoopSnapshot {
  return {
    checkedAt,
    mode: "local_living_day_loop",
    loop: [
      {
        step: "Start local day",
        status: "ready",
        output: "Open local runtime and review public-safe readiness first.",
      },
      {
        step: "Review public world",
        status: "ready",
        output: "Home, Workspace, Markets, Plans, Apps, Academy, Community, Support, Settings, and Diagnostics are checked.",
      },
      {
        step: "Review workstation/chart",
        status: "waiting_review",
        output: "Chart-first visual acceptance still needs Ahmad human review.",
      },
      {
        step: "Review TPM Assistant",
        status: "ready",
        output: "Assistant remains paper-safe and non-predictive.",
      },
      {
        step: "Capture Founder ideas",
        status: "ready",
        output: "Founder Idea Inbox previews classification, routing, gates, passport, and draft.",
      },
      {
        step: "Classify into events",
        status: "ready",
        output: "Ideas become governed events with owner routing and policy gates.",
      },
      {
        step: "Generate task passports",
        status: "ready",
        output: "Task Passport previews define scope, forbidden actions, validation, and public language rules.",
      },
      {
        step: "Draft Codex prompts",
        status: "ready",
        output: "Manual-only Codex-ready drafts are produced without execution.",
      },
      {
        step: "Wait external execution",
        status: "blocked_by_design",
        output: "The web app does not execute shell commands or call Codex.",
      },
      {
        step: "Tribunal result",
        status: "waiting_review",
        output: "Result acceptance requires validation evidence and scope review.",
      },
      {
        step: "Memory update",
        status: "ready",
        output: "Safe lessons may be recorded without secrets or private sensitive data.",
      },
      {
        step: "Next day plan",
        status: "ready",
        output: "Choose the next safe build action under Founder authority.",
      },
    ],
    today: {
      ideaIntake:
        "Use the private Founder Idea Inbox to enter ideas and review the governed preview.",
      openGaps: [
        "Ahmad visual acceptance is still required for final visual claims.",
        "Public support backend remains readiness-only.",
        "Desktop, Mobile, and Tablet apps are planned/future, not shipped.",
      ],
      proposedCodexDrafts: [
        "Docs/test/copy cleanup may be drafted under low-risk passports.",
        "Visual polish requires screenshots and review before acceptance.",
      ],
      blockedRequests: [
        "live execution",
        "real money",
        "billing activation",
        "broker/feed activation",
        "social publishing",
        "public launch activation",
      ],
      visualReviewNeeds: [
        "Living Earth atmosphere must stay subtle in the workstation.",
        "Free Earth identity must remain simple and not premium-gold dominant.",
        "VIP Earth identity may use premium gold without profit promises.",
      ],
      nextSafeAction:
        "Enter one Founder idea, inspect the Task Passport and Codex draft, then decide whether to run external manual work.",
    },
    codebaseRealityAudit: {
      status: "ready",
      auditNeeded: true,
      cleanupNeeded: true,
      p0CleanupRoute: [
        "build failure",
        "public/private terminology leak",
        "security or secrets risk",
        "Product Truth violation",
        "chart-blocking usability issue",
      ],
      p1CleanupRoute: [
        "important visual cleanup",
        "public navigation cleanup",
        "Apps or Support readiness cleanup",
        "regression or smoke route cleanup",
      ],
      cleanupExecutionActive: false,
      deletionAllowedWithoutProof: false,
      nextSafeAction:
        "Create an explicit cleanup Task Passport before changing or deleting files; do not delete modified or untracked files without proof of broken duplication.",
    },
    truth: {
      publicLaunchActive: false,
      productionActive: false,
      billingActive: false,
      brokerFeedActive: false,
      liveExecutionActive: false,
      realMoneyActive: false,
      socialPublishingActive: false,
      shellExecutionFromWebApp: false,
      codexCalledFromWebApp: false,
      secretsStored: false,
    },
  };
}

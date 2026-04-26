import "server-only";

import type {
  CodexConstructionRequest,
  CodexTaskCategory,
  CodexTaskConstitution,
  CodexTaskConstitutionDecision,
  CodexTaskConstitutionRule,
  CodexWorkerLevel,
} from "./types";

export const allowedCodexWorkerLevelsNow: CodexWorkerLevel[] = [
  "observer",
  "drafter",
  "builder_low",
];

export const blockedCodexWorkerLevelsNow: CodexWorkerLevel[] = [
  "builder_medium_review_required",
  "restricted",
];

export const codexBlockedCategories: CodexTaskCategory[] = [
  "billing_blocked",
  "broker_feed_blocked",
  "live_execution_blocked",
  "launch_blocked",
  "secrets",
];

const alwaysBlocked = [
  "live execution activation",
  "real-money routing",
  "broker/feed activation",
  "billing activation",
  "production secrets",
  "social publishing",
  "public launch activation",
  "fake users/revenue/metrics",
  "fake VIP/Pro/Institutional activation",
  "fake Swiss legal/company status",
  "fake Sharia certification",
  "guaranteed profit/win-rate claims",
  "sending secrets to Codex",
  "external attack/offensive actions",
  "deleting major files without explicit approval",
  "weakening auth/security",
];

const founderApprovalAlwaysRequired = [
  "logo redesign",
  "major public UI redesign",
  "VIP identity/copy",
  "Pro/VIP/Institutional plan changes",
  "public plan claims",
  "pricing/billing wording",
  "partnership wording",
  "security/auth changes",
  "Founder Command exposure or routes",
  "external world interface changes",
  "any task touching secrets authority",
];

const autoDraftAllowed = [
  "docs update",
  "test update",
  "validation report generation",
  "small public copy cleanup if no plan/legal claims",
  "lint/type cleanup",
  "safe screenshot/report tasks",
];

export const codexTaskConstitutionRules: CodexTaskConstitutionRule[] = [
  {
    ruleId: "codex-live-execution-block",
    categories: ["live_execution_blocked"],
    triggers: ["live execution", "real money order", "auto trade"],
    description: "Codex cannot activate live execution or order routing.",
    severity: "critical",
    decision: "block",
    reason: "Live trading authority is outside the current product truth.",
    safeAlternative:
      "Record a blocked readiness item and draft paper-only validation docs.",
  },
  {
    ruleId: "codex-real-money-broker-billing-block",
    categories: ["billing_blocked", "broker_feed_blocked"],
    triggers: ["billing", "checkout", "broker", "feed", "funding"],
    description:
      "Billing, broker/feed, account funding, and paid activation are hard-blocked.",
    severity: "critical",
    decision: "block",
    reason:
      "No billing provider, broker/feed activation, or real-money routing is active.",
    safeAlternative:
      "Create a status-only readiness note that keeps all activation inactive.",
  },
  {
    ruleId: "codex-public-launch-social-block",
    categories: ["launch_blocked"],
    triggers: ["public launch", "publish", "social posting", "go live"],
    description: "Codex cannot publish externally or claim public launch.",
    severity: "critical",
    decision: "block",
    reason:
      "Public launch and social publishing require separate legal, safety, and Founder gates.",
    safeAlternative:
      "Draft internal launch-preparation checklists without publishing anything.",
  },
  {
    ruleId: "codex-secret-material-block",
    categories: ["secrets"],
    triggers: ["secret", "token", "api key", "credential", "production env"],
    description: "Codex cannot receive or expose secrets.",
    severity: "critical",
    decision: "block",
    reason:
      "Secrets and production credentials must stay outside Codex prompts and reports.",
    safeAlternative:
      "Use status-only readiness contracts with redacted names and no raw values.",
  },
  {
    ruleId: "codex-identity-founder-approval",
    categories: ["logo_identity", "public_ui"],
    triggers: ["logo", "brand identity", "major public redesign"],
    description: "Identity and major public UI changes require Founder review.",
    severity: "high",
    decision: "founder_approval_required",
    reason:
      "Brand, visual acceptance, and public trust are Founder-controlled surfaces.",
    safeAlternative:
      "Prepare a scoped task passport and wait for Founder visual approval.",
  },
  {
    ruleId: "codex-security-auth-founder-approval",
    categories: ["security", "founder_command"],
    triggers: ["auth", "security", "Founder Command", "protected route"],
    description:
      "Security/auth and Founder Command exposure changes require review.",
    severity: "high",
    decision: "founder_approval_required",
    reason:
      "Sensitive control surfaces cannot be modified by default construction authority.",
    safeAlternative:
      "Draft a review-only plan with Security, Product Truth, and Founder checks.",
  },
  {
    ruleId: "codex-safe-cleanup-auto-draft",
    categories: [
      "docs_update",
      "test_update",
      "copy_cleanup",
      "lint_cleanup",
      "type_cleanup",
      "diagnostics",
    ],
    triggers: ["docs", "tests", "copy", "lint", "types", "diagnostics"],
    description:
      "Low-risk docs, tests, copy, lint, type, and report tasks may be drafted.",
    severity: "low",
    decision: "auto_draft_allowed",
    reason:
      "These tasks can be scoped, validated, and kept away from activation systems.",
    safeAlternative:
      "Generate a passport with validation and explicit forbidden scope.",
  },
  {
    ruleId: "codex-medium-surface-review",
    categories: [
      "visual_polish",
      "css_polish",
      "assistant_behavior",
      "journal_coach",
      "settings",
      "world_interface",
      "academy_community",
    ],
    triggers: ["visual", "css", "assistant", "coach", "settings", "support"],
    description: "Medium-risk product surfaces require review before building.",
    severity: "medium",
    decision: "review_required",
    reason:
      "User-facing behavior and language can affect Product Truth and public safety.",
    safeAlternative:
      "Draft only, then route to Product Truth, Quality, and any required safety review.",
  },
];

function textMatchesRule(request: CodexConstructionRequest, rule: CodexTaskConstitutionRule) {
  const haystack = `${request.title} ${request.reason} ${request.affectedSurface}`.toLowerCase();

  return rule.triggers.some((trigger) => haystack.includes(trigger.toLowerCase()));
}

export function evaluateCodexTaskConstitution(
  request: CodexConstructionRequest
): CodexTaskConstitutionRule {
  const categoryRule = codexTaskConstitutionRules.find((rule) =>
    rule.categories.includes(request.category)
  );
  const triggerRule = codexTaskConstitutionRules.find((rule) =>
    textMatchesRule(request, rule)
  );

  if (categoryRule?.decision === "block" || triggerRule?.decision === "block") {
    return categoryRule?.decision === "block" ? categoryRule : triggerRule!;
  }

  return categoryRule ?? triggerRule ?? {
    ruleId: "codex-default-review",
    categories: [request.category],
    triggers: [],
    description: "Unclassified construction tasks require review.",
    severity: request.riskLevel,
    decision: "review_required" as CodexTaskConstitutionDecision,
    reason:
      "The task did not match a low-risk auto-draft rule or a hard block.",
    safeAlternative:
      "Create a draft-only passport and route it for Product Truth review.",
  };
}

export function getCodexTaskConstitution(
  checkedAt = new Date().toISOString()
): CodexTaskConstitution {
  return {
    checkedAt,
    status: "active",
    coreLaw: "Codex is a licensed construction worker, not a ruler.",
    allowedWorkerLevelsNow: allowedCodexWorkerLevelsNow,
    blockedWorkerLevelsNow: blockedCodexWorkerLevelsNow,
    rules: codexTaskConstitutionRules,
    alwaysBlocked,
    founderApprovalAlwaysRequired,
    autoDraftAllowed,
    truth: {
      codexCanRuleProject: false,
      canBypassFounderApproval: false,
      canBypassGuardianLegalSecurityProductTruth: false,
      canTouchSecrets: false,
      canActivateRealWorldSystems: false,
    },
  };
}

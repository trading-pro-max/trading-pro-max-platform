import "server-only";

import type {
  FounderApprovalItem,
  FounderCommandDeviceTarget,
  FounderCommandModule,
  FounderCommandSnapshot,
  FounderGuardianAlert,
  FounderLegalReview,
  FounderMediaApproval,
  FounderOpsSignal,
  FounderTreasuryControl,
} from "./types";

const deviceTargets: FounderCommandDeviceTarget[] = [
  "windows",
  "macos",
  "linux",
  "android",
  "ios",
];

const modules: FounderCommandModule[] = [
  {
    key: "planet_overview",
    label: "Planet Overview",
    purpose: "Shows global TPM Planet OS readiness across active, planned, inactive, blocked, and degraded systems.",
    platforms: ["desktop", "mobile"],
    readiness: "active_contract",
    riskLevel: "low",
    actionState: "auto_allowed",
    truth: "Readiness contract exists; no native app dashboard is shipped.",
    blockedActions: ["fake metrics", "public route exposure"],
  },
  {
    key: "guardian_command",
    label: "Guardian Command",
    purpose: "Reviews abuse, auth, fraud, entitlement, prompt-injection, and safety signals.",
    platforms: ["desktop", "mobile"],
    readiness: "active_contract",
    riskLevel: "medium",
    actionState: "review_required",
    truth: "Guardian command is contract-only; no invasive surveillance is introduced.",
    blockedActions: ["auth bypass", "private data exposure", "invasive surveillance"],
  },
  {
    key: "legal_counsel_command",
    label: "Legal Counsel Command",
    purpose: "Reviews risky claims across media, AI, VIP, Islamic wording, launch, broker/feed, and billing language.",
    platforms: ["desktop", "mobile"],
    readiness: "active_contract",
    riskLevel: "high",
    actionState: "founder_approval_required",
    truth: "Legal Counsel remains guidance only and does not claim legal certification.",
    blockedActions: ["legal certification claim", "fake compliance claim"],
  },
  {
    key: "media_command",
    label: "Media Command",
    purpose: "Coordinates draft content, campaigns, AI video scripts, channel readiness, and approval state.",
    platforms: ["desktop", "mobile"],
    readiness: "active_contract",
    riskLevel: "high",
    actionState: "founder_approval_required",
    truth: "No social accounts are connected and no external publishing is active.",
    blockedActions: ["external publishing", "fake follower metrics", "copied competitor content"],
  },
  {
    key: "ai_brain_command",
    label: "AI Brain Command",
    purpose: "Tracks assistant quality, AI/IQ boundaries, coaching intelligence, and safe guidance state.",
    platforms: ["desktop"],
    readiness: "active_contract",
    riskLevel: "medium",
    actionState: "review_required",
    truth: "AI remains operator-assist and never guarantees predictions.",
    blockedActions: ["guaranteed signals", "trade execution", "auth bypass"],
  },
  {
    key: "treasury_command",
    label: "Treasury Command",
    purpose: "Tracks Free, Pro, VIP, Enterprise, subscription, and performance-fee readiness truth.",
    platforms: ["desktop"],
    readiness: "active_contract",
    riskLevel: "high",
    actionState: "founder_approval_required",
    truth: "Billing is inactive and performance-based revenue remains hidden/inactive at 0%.",
    blockedActions: ["billing activation", "fake paid access", "public performance-fee UI"],
  },
  {
    key: "community_command",
    label: "Community Command",
    purpose: "Tracks community readiness, moderation rules, Pro/VIP rooms, and anti-scam protections.",
    platforms: ["desktop"],
    readiness: "planned",
    riskLevel: "medium",
    actionState: "review_required",
    truth: "Community architecture exists; no social network is shipped.",
    blockedActions: ["signal selling", "fake rooms", "unmoderated public claims"],
  },
  {
    key: "academy_journal_coach_command",
    label: "Academy / Journal / Coach Command",
    purpose: "Tracks education, journal, coaching, and decision replay readiness.",
    platforms: ["desktop"],
    readiness: "planned",
    riskLevel: "medium",
    actionState: "review_required",
    truth: "Learning systems remain bounded by no-financial-advice and no-guarantee rules.",
    blockedActions: ["financial advice", "gambling-style pressure", "profit guarantees"],
  },
  {
    key: "engineering_command",
    label: "Engineering Command",
    purpose: "Tracks product gaps, regressions, visual tasks, desktop/mobile work, and integration readiness.",
    platforms: ["desktop"],
    readiness: "active_contract",
    riskLevel: "medium",
    actionState: "review_required",
    truth: "Engineering command is planning/readiness only and does not close real blockers by wording.",
    blockedActions: ["fake capability closure", "secret exposure"],
  },
  {
    key: "ops_tower_command",
    label: "Ops Tower Command",
    purpose: "Tracks health, incidents, monitoring readiness, staging/production blockers, secret rotation, and recovery actions.",
    platforms: ["desktop", "mobile"],
    readiness: "active_contract",
    riskLevel: "high",
    actionState: "founder_approval_required",
    truth: "Monitoring and production remain truthful and cannot be faked by command summaries.",
    blockedActions: ["fake monitoring", "production deployment without gates", "secret display"],
  },
  {
    key: "founder_approval_queue",
    label: "Founder Approval Queue",
    purpose: "Collects high-risk reviewed items that require Founder decision.",
    platforms: ["desktop", "mobile"],
    readiness: "active_contract",
    riskLevel: "high",
    actionState: "founder_approval_required",
    truth: "Approval queue is contract-only until owner app auth and audit workflow are implemented.",
    blockedActions: ["bypass Guardian", "bypass Legal", "approve hard-blocked content"],
  },
];

const approvalQueue: FounderApprovalItem[] = [
  {
    id: "founder-command-public-launch-wording",
    title: "Public launch wording",
    module: "founder_approval_queue",
    lifecycle: "blocked",
    riskLevel: "critical",
    actionState: "blocked",
    requiredReviews: ["Guardian", "Legal", "Ops Tower", "Founder"],
    safeNextStep: "Keep launch wording blocked until production, monitoring, legal, and release gates pass.",
  },
  {
    id: "founder-command-media-drafts",
    title: "Media and AI video drafts",
    module: "media_command",
    lifecycle: "draft",
    riskLevel: "high",
    actionState: "founder_approval_required",
    requiredReviews: ["Guardian", "Legal", "Founder"],
    safeNextStep: "Review draft language for blocked claims before any future publishing workflow.",
  },
];

const treasury: FounderTreasuryControl[] = [
  {
    id: "billing-readiness",
    label: "Billing readiness",
    readiness: "inactive",
    riskLevel: "high",
    actionState: "founder_approval_required",
    currentTruth: "Billing, checkout, and subscriptions are inactive.",
    activationRequirements: ["billing provider", "legal review", "user consent", "Founder approval", "audit trail"],
  },
  {
    id: "performance-fee-readiness",
    label: "Performance-based revenue research",
    readiness: "blocked",
    riskLevel: "critical",
    actionState: "blocked",
    currentTruth: "Current fee is 0%; any 5%-10% future concept is hidden, inactive, and requires legal/regulatory review.",
    activationRequirements: ["legal review", "regulatory review", "billing infrastructure", "public disclosure", "user consent"],
  },
];

const media: FounderMediaApproval[] = [
  {
    id: "media-command-draft-queue",
    channel: "planned multi-channel media office",
    contentType: "campaign",
    lifecycle: "draft",
    riskLevel: "high",
    currentTruth: "No social accounts are connected and no external publishing is active.",
  },
];

const guardian: FounderGuardianAlert[] = [
  {
    id: "guardian-command-foundation",
    category: "command_app_access",
    riskLevel: "high",
    actionState: "founder_approval_required",
    currentTruth: "Owner-only access is required before any command API or route can be exposed.",
  },
];

const legal: FounderLegalReview[] = [
  {
    id: "legal-command-blocked-claims",
    category: "blocked_claims",
    lifecycle: "blocked",
    riskLevel: "high",
    blockedClaimPatterns: [
      "guaranteed profit",
      "win-rate claim",
      "risk-free",
      "fake live trading",
      "fake broker connected",
      "fake billing active",
      "fake public launch",
      "fake Islamic certification",
    ],
    safeLanguage: [
      "paper-only",
      "fallback-first",
      "operator review required",
      "not certified",
      "decision support",
      "no guarantee",
    ],
  },
];

const ops: FounderOpsSignal[] = [
  {
    id: "founder-command-native-shell",
    label: "Native command app shell",
    readiness: "planned",
    riskLevel: "medium",
    currentTruth: "Desktop and mobile command app foundations exist as docs/contracts only.",
    safeNextStep: "Implement private owner app shell only after owner auth and audit foundations are ready.",
  },
  {
    id: "founder-command-readiness-api",
    label: "Owner-only readiness API",
    readiness: "blocked",
    riskLevel: "high",
    currentTruth: "No API route is exposed because owner-only route guard is intentionally not expanded in this pass.",
    safeNextStep: "Add a guarded internal API only after private app authentication and audit requirements are finalized.",
  },
];

export function getFounderCommandSnapshot(checkedAt = new Date().toISOString()): FounderCommandSnapshot {
  return {
    checkedAt,
    mode: "founder_command_app_foundation",
    access: {
      state: "owner_only_planned",
      publicRouteExposed: false,
      normalUserVisible: false,
      ownerOnly: true,
      readOnlyDefault: true,
    },
    deviceTargets,
    truth: {
      nativeDesktopShipped: false,
      nativeMobileShipped: false,
      liveExecutionEnabled: false,
      realMoneyRoutingEnabled: false,
      brokerActivationFaked: false,
      feedActivationFaked: false,
      billingActivated: false,
      publicLaunchClaimed: false,
      socialAccountsConnected: false,
      secretsExposed: false,
    },
    modules,
    approvalQueue,
    treasury,
    media,
    guardian,
    legal,
    ops,
    blockers: [
      "owner app authentication is not shipped",
      "native desktop shell is not shipped",
      "native mobile shell is not shipped",
      "public Founder route is intentionally not exposed",
      "live execution and real-money routing remain blocked",
      "billing, broker, feed, media posting, and public launch remain inactive",
    ],
  };
}


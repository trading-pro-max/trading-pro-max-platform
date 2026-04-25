import "server-only";

import type {
  AiVideoStudioReadiness,
  CommunityReadiness,
  EconomyPlanRole,
  FinalAcceptanceReadiness,
  FinalGapChecklistItem,
  MediaOfficeReadiness,
  MonetizationReadiness,
  NonLaunchRoadmapItem,
  PartnershipReadiness,
  PlanetEconomyGrowthReadinessSnapshot,
  ResourceEconomyMap,
} from "./types";

const planRoles: EconomyPlanRole[] = [
  {
    plan: "free_demo",
    label: "Free / Demo",
    state: "active",
    economyRole: "Trust-building paper-safe entry layer.",
    activeValue: [
      "paper trading",
      "basic Companion",
      "basic Academy",
      "Why Blocked explanations",
      "feedback readiness",
    ],
    plannedValue: ["basic community", "learning paths", "decision replay foundation"],
    upgradePath:
      "Build trust through safe learning before any future Pro entitlement path exists.",
    mustNotClaim: ["paid access", "live execution", "real-money routing"],
  },
  {
    plan: "pro",
    label: "Pro",
    state: "planned",
    economyRole: "Daily trader workspace layer planned after entitlement and billing gates.",
    activeValue: [],
    plannedValue: [
      "deeper Companion",
      "Journal/Coach depth",
      "alerts and workflows",
      "decision replay",
      "workspace memory",
      "Pro community",
    ],
    upgradePath:
      "Explain planned professional value without checkout, urgency, or fake paid activation.",
    mustNotClaim: ["Pro active", "checkout active", "premium signals"],
  },
  {
    plan: "vip",
    label: "VIP",
    state: "planned",
    economyRole: "Elite planet layer planned for advanced guidance and private review.",
    activeValue: [],
    plannedValue: [
      "VIP Brain",
      "advanced Companion",
      "advanced Journal",
      "advanced Coach",
      "strategy review",
      "premium reports",
      "VIP private rooms",
      "priority support concept",
    ],
    upgradePath:
      "Keep VIP desirable but clearly planned until entitlement, support, safety, and billing systems exist.",
    mustNotClaim: ["VIP active", "guaranteed profit", "win-rate", "priority support active"],
  },
  {
    plan: "enterprise",
    label: "Enterprise",
    state: "future",
    economyRole: "Future team governance layer with audit, admin, and compliance concepts.",
    activeValue: [],
    plannedValue: [
      "team planet",
      "admin",
      "audit",
      "compliance overview",
      "custom support",
    ],
    upgradePath: "Keep Enterprise as future-only until a separate enterprise phase.",
    mustNotClaim: ["Enterprise available", "compliance certified", "team admin active"],
  },
];

const monetizationReadiness: MonetizationReadiness = {
  billing: "inactive",
  checkout: "inactive",
  subscriptions: "inactive",
  paidEntitlements: "not_enabled",
  currentPerformanceFee: "0%",
  performanceBasedRevenue: "hidden_inactive_research_only",
  futureResearchRange: "5%-10%",
  legalReviewRequired: true,
  regulatoryReviewRequired: true,
  userConsentRequired: true,
  founderOnlyActivationAuthority: true,
  userVisible: false,
};

const communityReadiness: CommunityReadiness = {
  status: "planned_only",
  layers: [
    {
      key: "free_learning_spaces",
      label: "Free / Demo learning spaces",
      state: "planned",
      safety: ["Guardian moderation", "anti-scam rules", "no fake profit screenshots"],
    },
    {
      key: "pro_rooms",
      label: "Pro rooms",
      state: "planned",
      safety: ["Legal claim review", "no paid active claim", "no signal-selling language"],
    },
    {
      key: "vip_private_rooms",
      label: "VIP private rooms",
      state: "planned",
      safety: ["Founder approval", "Guardian moderation", "no guaranteed outcome claims"],
    },
    {
      key: "support_feedback_rooms",
      label: "Support and feedback rooms",
      state: "planned",
      safety: ["no private data exposure", "operator review later", "abuse escalation rules"],
    },
  ],
  guardianModerationRequired: true,
  legalClaimReviewRequired: true,
  fakeActiveRooms: false,
};

const mediaOfficeReadiness: MediaOfficeReadiness = {
  status: "draft_review_only",
  channels: [
    "X / Twitter",
    "Instagram",
    "TikTok",
    "YouTube",
    "Facebook",
    "LinkedIn",
    "Telegram",
    "Discord",
    "Reddit",
    "Blog / Newsroom",
    "Regional channels later",
  ].map((label) => ({
    key: label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, ""),
    label,
    state: "not_connected" as const,
    tokensPresent: false,
    publishingActive: false,
    metricsPresent: false,
  })),
  capabilities: [
    "content ideas",
    "drafts",
    "platform adaptation",
    "education content",
    "product update content",
    "trust/safety content",
    "campaign planning",
    "scheduling readiness",
  ],
  requiredReviews: ["Brand", "Guardian", "Legal", "Founder"],
  noAccountsConnected: true,
  noApiTokens: true,
  externalPublishingActive: false,
  fakeMetricsIncluded: false,
};

const aiVideoStudioReadiness: AiVideoStudioReadiness = {
  status: "script_readiness_only",
  capabilities: [
    "video idea generation",
    "short script outline",
    "long script outline",
    "captions",
    "hashtags",
    "thumbnail brief",
    "voiceover brief",
    "scene outline",
    "compliance risk score",
  ],
  contentCategories: [
    "academy videos",
    "product tutorials",
    "trust/safety explainers",
    "Pro/VIP educational teasers",
    "feature walkthroughs",
    "changelog summaries",
    "Swiss precision identity content",
    "Planet OS explanation content",
  ],
  uploadActive: false,
  publishingActive: false,
  fakeViewsIncluded: false,
  legalReviewRequired: true,
  guardianReviewRequired: true,
  founderApprovalRequired: true,
};

const partnershipReadiness: PartnershipReadiness = {
  status: "inactive_planned",
  sponsoredClock: {
    state: "inactive",
    publicVisibility: "off",
    companyNamesInUserUi: false,
    contractRequired: true,
  },
  partnershipTypes: [
    "Swiss precision partnership",
    "sponsored clock edition",
    "VIP experience partnership",
    "education/content sponsorship",
    "platform theme partnership",
    "event/webinar partnership",
    "academy partnership",
  ],
  requiredReviews: ["Legal", "Rights/IP", "Guardian", "Founder"],
  fakePartnershipClaims: false,
  impliedEndorsementAllowed: false,
};

const resourcesToEconomy: ResourceEconomyMap = {
  hidden: [
    {
      resource: "product truth",
      ethicalValue: "trust",
      protection: "Guardian and Legal block fake capability claims",
    },
    {
      resource: "platform data",
      ethicalValue: "product improvement",
      protection: "no private data sale and no secret exposure",
    },
    {
      resource: "journal insight",
      ethicalValue: "user self-improvement",
      protection: "no financial advice and no profit guarantee",
    },
    {
      resource: "AI context",
      ethicalValue: "better guidance",
      protection: "bounded, non-predictive, non-executing assistant rules",
    },
  ],
  visible: [
    {
      resource: "chart and UI",
      ethicalValue: "user confidence",
      protection: "visual acceptance and chart-first hierarchy",
    },
    {
      resource: "academy",
      ethicalValue: "learning",
      protection: "educational copy and no trading advice guarantees",
    },
    {
      resource: "community",
      ethicalValue: "retention",
      protection: "planned only with moderation and anti-scam rules",
    },
    {
      resource: "media",
      ethicalValue: "growth",
      protection: "draft/review only; no publishing tokens",
    },
  ],
  living: [
    {
      resource: "feedback flow",
      ethicalValue: "product improvement",
      protection: "operator review and no fake user metrics",
    },
    {
      resource: "journal activity",
      ethicalValue: "retention",
      protection: "private learning support and no manipulation",
    },
    {
      resource: "Companion usage",
      ethicalValue: "engagement",
      protection: "plan-aware safe guidance",
    },
  ],
  strategic: [
    {
      resource: "Swiss identity",
      ethicalValue: "trust",
      protection: "no fake Swiss legal/company status",
    },
    {
      resource: "time and clock",
      ethicalValue: "precision",
      protection: "sponsored clock remains future partnership only",
    },
    {
      resource: "Founder decisions",
      ethicalValue: "governance",
      protection: "Founder approval cannot override critical blocks without remediation",
    },
    {
      resource: "partnerships",
      ethicalValue: "future growth",
      protection: "contract, Rights/IP, Legal, Guardian, and Founder review required",
    },
  ],
  rules: [
    "do not sell private user data",
    "do not exploit users",
    "do not manipulate with urgency, scarcity, or guaranteed outcomes",
    "value must come from usefulness, trust, clarity, education, safety, and premium experience",
  ],
};

const finalAcceptance: FinalAcceptanceReadiness = {
  status: "internal_review_only",
  launchReady: false,
  publicLaunchApproved: false,
  productionApproved: false,
  humanVisualAcceptanceRequired: true,
  realWorldBetaTestingRequired: true,
  legalRegulatoryReviewRequiredLater: true,
  recommendation: "continue_internal_refinement",
  complete: [
    "Planet OS hierarchy/readiness contracts",
    "Founder Command foundation",
    "Living Planet surfaces",
    "plan-based access truth",
    "economy/media/growth readiness model",
  ],
  partial: [
    "native desktop/mobile app shells",
    "persistent journal depth",
    "full Companion chat",
    "community and VIP rooms",
    "media/video UI",
  ],
  plannedOnly: [
    "billing provider",
    "social publishing",
    "partnership activation",
    "Pro/VIP paid entitlement activation",
    "Enterprise product",
  ],
  blocked: [
    "live execution",
    "real-money routing",
    "broker/feed activation",
    "public launch",
    "production secret actions",
  ],
};

const finalGapChecklist: FinalGapChecklistItem[] = [
  {
    area: "public entry",
    status: "pass",
    note: "Visible product identity and paper-safe route flow are established.",
  },
  {
    area: "workstation",
    status: "pass",
    note: "Chart-first hierarchy remains the primary product surface.",
  },
  {
    area: "companion",
    status: "partial",
    note: "Read-only guided foundation exists; full chat and persistence remain planned.",
  },
  {
    area: "Founder Command",
    status: "partial",
    note: "Owner-only command architecture exists; native app shell and audited actions remain planned.",
  },
  {
    area: "media/video",
    status: "planned",
    note: "Draft/script readiness exists without accounts, tokens, uploads, or publishing.",
  },
  {
    area: "community/VIP rooms",
    status: "planned",
    note: "Architecture and policies exist; rooms are not active.",
  },
  {
    area: "monetization",
    status: "blocked_by_design",
    note: "Billing, checkout, subscriptions, and performance fees remain inactive.",
  },
  {
    area: "production/staging",
    status: "blocker",
    note: "Real external environment, monitoring, and secret rotation are required later.",
  },
  {
    area: "launch",
    status: "out_of_scope_until_launch_phase",
    note: "Public launch remains inactive and is not part of this pass.",
  },
];

const nonLaunchRoadmap: NonLaunchRoadmapItem[] = [
  {
    priority: 1,
    area: "human visual acceptance",
    nextStep: "Run Ahmad-led desktop/mobile/light/RTL screenshot review.",
    status: "next_internal",
  },
  {
    priority: 2,
    area: "Companion",
    nextStep: "Design full chat later with safe intent routing and no execution authority.",
    status: "planned",
  },
  {
    priority: 3,
    area: "journal",
    nextStep: "Add persistent journal foundations after privacy and storage review.",
    status: "planned",
  },
  {
    priority: 4,
    area: "Founder Command",
    nextStep: "Build private desktop/mobile shell after owner auth and audit gates.",
    status: "planned",
  },
  {
    priority: 5,
    area: "community/VIP rooms",
    nextStep: "Prototype moderated rooms with anti-scam and claim review rules.",
    status: "later",
  },
  {
    priority: 6,
    area: "media/video UI",
    nextStep: "Build internal draft/review screens before any account connection.",
    status: "later",
  },
  {
    priority: 7,
    area: "monetization",
    nextStep: "Keep billing later until legal, support, provider, and entitlement gates exist.",
    status: "later",
  },
  {
    priority: 8,
    area: "real activation",
    nextStep: "Treat launch, production, billing, broker/feed, and social activation as last-stage work only.",
    status: "last",
  },
];

export function getPlanetEconomyGrowthReadinessSnapshot(
  checkedAt = new Date().toISOString()
): PlanetEconomyGrowthReadinessSnapshot {
  return {
    checkedAt,
    mode: "planet_economy_media_growth_readiness",
    economy: {
      treasuryState: "readiness_only",
      revenueReadiness: "planned_not_active",
      monetizationReadiness,
      planRoles,
      resourceToValueModel: [
        "trust -> plan confidence",
        "safe education -> retention",
        "Companion guidance -> engagement",
        "journal/coach -> self-improvement",
        "media drafts -> future acquisition",
        "community -> future retention",
      ],
    },
    growth: {
      path: ["free_demo", "pro", "vip", "enterprise"],
      conversionPrinciples: [
        "show active Demo value truthfully",
        "describe Pro/VIP as planned until entitlements exist",
        "avoid dark patterns and fake urgency",
        "build trust before asking for payment",
      ],
      retentionResources: [
        "journal/coach",
        "Companion",
        "Academy",
        "community planned",
        "plan identity",
      ],
      noDarkPatterns: true,
    },
    vip: {
      status: "planned_not_active",
      strategy: [
        "elite planet layer",
        "VIP Brain planned",
        "advanced Companion planned",
        "advanced Journal/Coach planned",
        "strategy review planned",
        "premium reports planned",
        "VIP private rooms planned",
      ],
      privateRooms: "planned_not_active",
      prioritySupport: "planned_not_active",
      mustNotClaim: [
        "VIP active",
        "guaranteed profit",
        "win-rate",
        "trading signal guarantee",
        "private room active",
        "priority support active",
      ],
    },
    community: communityReadiness,
    mediaOffice: mediaOfficeReadiness,
    aiVideoStudio: aiVideoStudioReadiness,
    partnerships: partnershipReadiness,
    resourcesToEconomy,
    finalAcceptance,
    finalGapChecklist,
    nonLaunchRoadmap,
    founderCommandSignals: [
      "economy readiness",
      "plan readiness",
      "media readiness",
      "AI Video readiness",
      "community readiness",
      "VIP readiness",
      "partnership readiness",
      "sponsored clock readiness",
      "hidden performance-fee research",
      "final acceptance status",
      "gap summary",
    ],
    truth: {
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerFeedActivation: "inactive",
      billing: "inactive",
      publicLaunch: "inactive",
      socialPublishing: "inactive",
      productionSecretsTouched: false,
      fakeUsersIncluded: false,
      fakeRevenueIncluded: false,
      fakeMetricsIncluded: false,
      fakePartnershipsIncluded: false,
      brandNamesUsedWithoutContracts: false,
    },
  };
}

export function getFounderEconomyReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getPlanetEconomyGrowthReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_economy_readiness",
    economy: snapshot.economy,
    growth: snapshot.growth,
    vip: snapshot.vip,
    community: snapshot.community,
    finalAcceptance: snapshot.finalAcceptance,
    truth: snapshot.truth,
  };
}

export function getFounderPartnershipsReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getPlanetEconomyGrowthReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_partnerships_readiness",
    partnerships: snapshot.partnerships,
    sponsoredClock: snapshot.partnerships.sponsoredClock,
    resourcesToEconomy: {
      strategic: snapshot.resourcesToEconomy.strategic,
      rules: snapshot.resourcesToEconomy.rules,
    },
    truth: snapshot.truth,
  };
}

export function getFounderFinalAcceptanceReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getPlanetEconomyGrowthReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_final_internal_acceptance_readiness",
    finalAcceptance: snapshot.finalAcceptance,
    finalGapChecklist: snapshot.finalGapChecklist,
    nonLaunchRoadmap: snapshot.nonLaunchRoadmap,
    truth: snapshot.truth,
  };
}

export function getPlanetEconomyReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getPlanetEconomyGrowthReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "planet_economy_readiness",
    economy: snapshot.economy,
    growth: snapshot.growth,
    resourcesToEconomy: snapshot.resourcesToEconomy,
    truth: snapshot.truth,
  };
}

export function getPlanetMediaReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getPlanetEconomyGrowthReadinessSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "planet_media_readiness",
    mediaOffice: snapshot.mediaOffice,
    aiVideoStudio: snapshot.aiVideoStudio,
    partnerships: snapshot.partnerships,
    truth: snapshot.truth,
  };
}

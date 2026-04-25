import "server-only";

export type ProductTruthState =
  | "active"
  | "inactive"
  | "blocked"
  | "guarded"
  | "unavailable"
  | "planned"
  | "review_required"
  | "not_certified"
  | "not_configured";

export type ProductTruthKey =
  | "live_execution"
  | "real_money_routing"
  | "broker_feed_activation"
  | "billing_subscriptions"
  | "public_launch"
  | "production_readiness"
  | "staging_readiness"
  | "monitoring"
  | "social_publishing"
  | "pro_activation"
  | "vip_activation"
  | "enterprise_activation"
  | "islamic_sharia_certification"
  | "ai_prediction_claims"
  | "performance_revenue_model"
  | "native_app_readiness"
  | "founder_command"
  | "plan_based_product_layers"
  | "community_vip_rooms"
  | "brand_partnerships"
  | "final_internal_acceptance";

export type ProductTruthItem = {
  key: ProductTruthKey;
  label: string;
  state: ProductTruthState;
  publicCopy: string;
  internalCopy: string;
  safeNextStep: string;
  mustNotClaim: string[];
};

export type ProductTruthSnapshot = {
  checkedAt: string;
  mode: "product_truth_engine";
  items: ProductTruthItem[];
  summary: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    billing: "inactive";
    publicLaunch: "inactive";
    socialPublishing: "inactive";
    islamicCertification: "not_certified";
    performanceRevenue: "hidden_inactive";
    secrets: "not_exposed";
    founderCommand: "owner_only_private";
  };
};

const items: ProductTruthItem[] = [
  {
    key: "live_execution",
    label: "Live execution",
    state: "blocked",
    publicCopy: "Live execution is not enabled.",
    internalCopy: "All execution remains paper-safe; no live order route is active.",
    safeNextStep: "Keep live actions blocked until future configured legal, broker, and private approval gates exist.",
    mustNotClaim: ["live trading active", "real orders enabled"],
  },
  {
    key: "real_money_routing",
    label: "Real-money routing",
    state: "blocked",
    publicCopy: "Real-money routing is blocked.",
    internalCopy: "No path may route money or live broker orders from current product state.",
    safeNextStep: "Preserve hard block and audit any future activation request.",
    mustNotClaim: ["real-money trading", "cash account routing"],
  },
  {
    key: "broker_feed_activation",
    label: "Broker/feed activation",
    state: "not_configured",
    publicCopy: "External broker and live feed activation are not configured.",
    internalCopy: "Broker/feed readiness may be described only as guarded architecture.",
    safeNextStep: "Use sandbox/readiness contracts before any real provider activation.",
    mustNotClaim: ["broker connected", "live feed active"],
  },
  {
    key: "billing_subscriptions",
    label: "Billing/subscriptions",
    state: "inactive",
    publicCopy: "Billing and subscriptions are inactive.",
    internalCopy: "No checkout, paid entitlement, invoice, or subscription engine is active.",
    safeNextStep: "Keep Pro/VIP/Institutional as planned until billing and entitlement logic exists.",
    mustNotClaim: ["paid plan active", "checkout available"],
  },
  {
    key: "public_launch",
    label: "Public launch",
    state: "inactive",
    publicCopy: "Public launch is not active.",
    internalCopy: "Launch remains frozen unless external staging, production, monitoring, legal, and private approval gates pass.",
    safeNextStep: "Keep launch wording blocked.",
    mustNotClaim: ["launched", "publicly available"],
  },
  {
    key: "production_readiness",
    label: "Production readiness",
    state: "blocked",
    publicCopy: "Production readiness requires real external configuration.",
    internalCopy: "Production env, secrets, database, monitoring, and rotation remain externally required.",
    safeNextStep: "Run production validation with real values outside Git.",
    mustNotClaim: ["production ready", "deployed"],
  },
  {
    key: "staging_readiness",
    label: "Staging readiness",
    state: "planned",
    publicCopy: "Staging readiness is planned and checklist-based.",
    internalCopy: "No hosting or staging deployment is claimed by internal docs.",
    safeNextStep: "Use staging validator/checklist when hosting exists.",
    mustNotClaim: ["staging deployed", "staging live"],
  },
  {
    key: "monitoring",
    label: "External monitoring",
    state: "not_configured",
    publicCopy: "External monitoring is not configured.",
    internalCopy: "Health endpoints exist, but no third-party monitoring claim is active.",
    safeNextStep: "Configure real provider keys outside Git before claiming monitoring.",
    mustNotClaim: ["external monitoring active", "paging configured"],
  },
  {
    key: "social_publishing",
    label: "Social publishing",
    state: "blocked",
    publicCopy: "External publishing is not connected.",
    internalCopy: "No social tokens, publishing APIs, or external account connections are present.",
    safeNextStep: "Keep content factory in draft/review mode only.",
    mustNotClaim: ["posting automated", "social accounts connected"],
  },
  {
    key: "pro_activation",
    label: "Pro activation",
    state: "planned",
    publicCopy: "Pro is planned and not active by default.",
    internalCopy: "No Pro paid entitlement exists unless real entitlement support is implemented later.",
    safeNextStep: "Keep Pro capabilities locked in current product truth.",
    mustNotClaim: ["Pro active", "paid Pro access"],
  },
  {
    key: "vip_activation",
    label: "VIP activation",
    state: "planned",
    publicCopy: "VIP is planned and not active by default.",
    internalCopy: "Advanced Assistant, rooms, reports, and priority surfaces remain locked/planned.",
    safeNextStep: "Do not expose VIP activation without entitlement logic.",
    mustNotClaim: ["VIP active", "VIP signals", "premium access enabled"],
  },
  {
    key: "enterprise_activation",
    label: "Institutional activation",
    state: "planned",
    publicCopy: "Institutional is future planned only.",
    internalCopy: "No team/admin/audit/compliance product access is active.",
    safeNextStep: "Keep institutional surfaces roadmap-only.",
    mustNotClaim: ["Institutional available", "team admin active"],
  },
  {
    key: "islamic_sharia_certification",
    label: "Islamic/Sharia certification",
    state: "not_certified",
    publicCopy: "Islamic account status is not certified by default.",
    internalCopy: "Islamic wording requires real review; no Sharia certification is claimed.",
    safeNextStep: "Keep account status as review-required/not certified unless real certification exists.",
    mustNotClaim: ["Sharia certified", "Islamic compliant"],
  },
  {
    key: "ai_prediction_claims",
    label: "AI prediction claims",
    state: "blocked",
    publicCopy: "AI does not guarantee outcomes or predict with certainty.",
    internalCopy: "Assistant remains operator-assist and context explanation only.",
    safeNextStep: "Block win-rate, guaranteed signal, and certainty wording.",
    mustNotClaim: ["guaranteed signal", "win-rate", "sure prediction"],
  },
  {
    key: "performance_revenue_model",
    label: "Performance-based revenue model",
    state: "inactive",
    publicCopy: "Performance-based fees are inactive.",
    internalCopy: "Current fee is 0%; any future 5%-10% research remains hidden/inactive and requires legal/regulatory review.",
    safeNextStep: "Do not expose performance-fee UI or claims.",
    mustNotClaim: ["performance fee active", "revenue share enabled"],
  },
  {
    key: "native_app_readiness",
    label: "Native app readiness",
    state: "planned",
    publicCopy: "Desktop and mobile apps are not shipped.",
    internalCopy: "Readiness docs/contracts exist; no installer or app-store release is claimed.",
    safeNextStep: "Keep native status as readiness-only.",
    mustNotClaim: ["desktop app shipped", "mobile app available"],
  },
  {
    key: "founder_command",
    label: "Restricted controls",
    state: "guarded",
    publicCopy: "Restricted controls are not a user feature.",
    internalCopy: "Restricted controls remain read-only by default and hidden from Free, Pro, VIP, Institutional, and public navigation.",
    safeNextStep: "Keep admin surfaces component/API foundation only until private auth, device trust, and audit gates exist.",
    mustNotClaim: ["admin dashboard available", "restricted controls public", "plan access to restricted controls"],
  },
  {
    key: "plan_based_product_layers",
    label: "Plan-based product layers",
    state: "guarded",
    publicCopy: "Each plan sees only its appropriate product layer.",
    internalCopy: "Guest, Free, Pro, VIP, Institutional, Staff, and restricted control classes are access models, not fake paid activation.",
    safeNextStep: "Keep Free active, Pro/VIP planned, Institutional future, and restricted controls separate.",
    mustNotClaim: ["VIP active", "Pro paid active", "Institutional available", "restricted controls as user plan"],
  },
  {
    key: "community_vip_rooms",
    label: "Community and VIP rooms",
    state: "planned",
    publicCopy: "Community and VIP rooms are planned and not active.",
    internalCopy:
      "General, Pro, VIP, feedback, support, and learning rooms require safety moderation, legal claim review, entitlement support, and private approval before activation.",
    safeNextStep:
      "Keep rooms as architecture/readiness only until moderation, privacy, support, and entitlement gates exist.",
    mustNotClaim: ["active rooms", "members", "VIP private room access", "copy-trading community"],
  },
  {
    key: "brand_partnerships",
    label: "Brand partnerships",
    state: "inactive",
    publicCopy: "No brand partnership or sponsored clock is active.",
    internalCopy:
      "Swiss Precision Clock sponsorship and other partnerships are future-only and require signed contracts, Rights/IP, legal, safety, and private approval review.",
    safeNextStep:
      "Do not name companies, imply endorsement, or use partner assets without an executed contract and review chain.",
    mustNotClaim: ["sponsored by", "official partner", "endorsed by", "partner clock active"],
  },
  {
    key: "final_internal_acceptance",
    label: "Final internal acceptance",
    state: "review_required",
    publicCopy: "Internal acceptance is not public launch readiness.",
    internalCopy:
      "The product can continue internal review, but human visual acceptance, real-world beta testing, legal/regulatory review, staging, monitoring, and production gates remain unresolved.",
    safeNextStep:
      "Continue internal refinement and keep launch, production, billing, broker/feed, and publishing activation out of scope.",
    mustNotClaim: ["launch ready", "production approved", "publicly launched", "final external acceptance"],
  },
];

export function getProductTruthSnapshot(
  checkedAt = new Date().toISOString()
): ProductTruthSnapshot {
  return {
    checkedAt,
    mode: "product_truth_engine",
    items,
    summary: {
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      publicLaunch: "inactive",
      socialPublishing: "inactive",
      islamicCertification: "not_certified",
      performanceRevenue: "hidden_inactive",
      secrets: "not_exposed",
      founderCommand: "owner_only_private",
    },
  };
}

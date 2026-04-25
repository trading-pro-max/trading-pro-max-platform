import type {
  CitizenClassId,
  PlanEntitlementContract,
  PlanEntitlementSnapshot,
  PlanFeatureGroup,
  PlanFeatureState,
  PlanId,
  PlanPlanetAccessLayer,
} from "@/lib/plans/types";

function feature(
  group: PlanFeatureGroup,
  label: string,
  state: PlanFeatureState["state"],
  explanation: string
): PlanFeatureState {
  return { group, label, state, explanation };
}

const founderCommandHidden = feature(
  "founder_command",
  "Private command access",
  "hidden",
  "Private command tools are separate and are never part of Free, Pro, VIP, or Institutional user plans."
);

export const PLAN_ENTITLEMENTS: PlanEntitlementContract[] = [
  {
    planId: "demo_free",
    planName: "Free",
    visualIdentity: "demo_free",
    companionLevel: "demo_paper",
    truthState: "paper_active",
    allowedFeatures: [
      feature("workspace_memory", "Familiar paper terminal", "active", "Chart-first workstation, watchlist, and paper ticket stay clean and familiar."),
      feature("assistant", "Basic Assistant", "active", "Basic platform, blocked-state, feedback, settings, and diagnostics guidance."),
      feature("academy", "Basic Academy and Why Blocked", "active", "Safe paper-first learning, glossary readiness, and compact blocked-state explanation."),
      feature("alerts", "Swiss clock / pulse", "active", "Subtle living signals are active without distracting from chart or ticket."),
    ],
    lockedFeatures: [
      feature("coach", "Advanced Coach", "locked", "Requires future Pro/VIP entitlement support."),
      feature("assistant", "Advanced Assistant", "locked", "Advanced Assistant is planned only and not active in Free."),
      feature("performance_dashboard", "Performance dashboard", "locked", "No premium analytics are active in Demo."),
      feature("vip_private_rooms", "VIP private rooms", "locked", "VIP rooms are planned and not active."),
    ],
    comingLaterFeatures: [
      feature("journal", "Journal expansion", "coming_later", "Journal intelligence is planned and must avoid financial advice."),
      feature("alerts", "Alert/workflow guidance", "coming_later", "Delivery remains unconfigured until real delivery exists."),
    ],
    hiddenFeatures: [founderCommandHidden],
    upgradeExplanation: "No upgrade flow is active because billing and checkout are inactive.",
    safetyRules: [
      "paper-only truth visible",
      "no paid activation claim",
      "no live execution by plan",
      "no internal operating-system detail in the Free workstation",
      "community rooms planned only",
    ],
  },
  {
    planId: "pro",
    planName: "Pro",
    visualIdentity: "pro",
    companionLevel: "pro",
    truthState: "planned_locked",
    allowedFeatures: [],
    lockedFeatures: [
      feature("assistant", "Pro Assistant", "locked", "Requires real Pro entitlement logic; no billing is active."),
      feature("journal", "Journal suggestions", "locked", "Planned for Pro but not unlocked."),
      feature("alerts", "Alert/workflow guidance", "locked", "Delivery and entitlement remain unconfigured."),
      feature("decision_replay", "Decision replay basic", "locked", "Prepared as concept only."),
    ],
    comingLaterFeatures: [
      feature("community", "Pro community", "coming_later", "No community product is active."),
      feature("reports", "Pro reports", "coming_later", "No paid report access exists."),
    ],
    hiddenFeatures: [founderCommandHidden],
    upgradeExplanation: "Pro is a planned tier; checkout, billing, and entitlement activation are inactive.",
    safetyRules: [
      "no Pro active claim",
      "no better-outcome promise",
      "no live execution by plan",
      "no Pro community active claim",
    ],
  },
  {
    planId: "vip",
    planName: "VIP",
    visualIdentity: "vip",
    companionLevel: "vip",
    truthState: "planned_locked",
    allowedFeatures: [],
    lockedFeatures: [
      feature("assistant", "Advanced Assistant", "locked", "VIP entitlement is not active."),
      feature("coach", "Advanced coaching", "locked", "No premium coaching access exists."),
      feature("performance_dashboard", "Deep performance review", "locked", "No personalized deep-dive is active."),
      feature("vip_private_rooms", "VIP private rooms", "locked", "Rooms are future planned with safety and legal review required."),
    ],
    comingLaterFeatures: [
      feature("reports", "Premium reports", "coming_later", "Future planned only."),
      feature("decision_replay", "Advanced decision replay", "coming_later", "Requires entitlement, safety, and review support."),
    ],
    hiddenFeatures: [founderCommandHidden],
    upgradeExplanation: "VIP is planned only; no paid access, premium activation, or VIP results claim exists.",
    safetyRules: [
      "no guaranteed signals",
      "no win-rate claims",
      "no fake premium capability",
      "no VIP private room active claim",
    ],
  },
  {
    planId: "enterprise",
    planName: "Institutional later",
    visualIdentity: "enterprise",
    companionLevel: "enterprise",
    truthState: "future_planned",
    allowedFeatures: [],
    lockedFeatures: [
      feature("desktop_mobile", "Team/device administration", "locked", "Institutional product is not available."),
      feature("reports", "Compliance/audit reports", "locked", "No legal compliance certification is claimed."),
    ],
    comingLaterFeatures: [
      feature("assistant", "Institutional Assistant", "coming_later", "Future team/admin assistant concept only."),
      feature("community", "Institutional rooms", "coming_later", "No institutional community exists."),
    ],
    hiddenFeatures: [
      founderCommandHidden,
      feature("media_content_tools", "Performance-fee tooling", "hidden", "Performance-fee research is hidden/inactive and not user-facing."),
    ],
    upgradeExplanation: "Institutional remains future planned; no sales, checkout, or account activation path is active.",
    safetyRules: ["no Institutional active claim", "no team/admin access without entitlement", "no compliance certification claim"],
  },
];

export const PLANET_ACCESS_LAYERS: PlanPlanetAccessLayer[] = [
  {
    citizenClass: "guest",
    label: "Guest",
    state: "active",
    planId: "none",
    visibleContinents: ["Public Entry", "Brand Trust", "Academy Preview"],
    visibleStates: ["Public Entry State", "Trust State", "Learning Preview State"],
    visibleCities: ["Public Entry", "Academy Preview", "Product Truth Notice"],
    companionLevel: "Minimal orientation only",
    journalCoachLevel: "Not available",
    academyLevel: "Limited preview",
    communityAccess: "Not active",
    mediaContentAccess: "Public-safe content only when published later",
    visualIdentity: "guest",
    activeLayer: "Public orientation layer",
    lockedFeatures: ["Workstation depth", "Assistant panel", "Journal/Coach", "Plan diagnostics"],
    plannedFeatures: ["Basic Academy preview expansion"],
    hiddenFeatures: ["private command tools", "private revenue research", "private internal reports"],
    upgradeExplanation: "Guest can review public trust and product orientation; no checkout or billing is active.",
    safetyBoundaries: ["no live execution", "no broker/feed activation", "no billing claim"],
    mustNotShow: ["private command tools", "private command data", "fake user metrics", "private revenue model"],
  },
  {
    citizenClass: "demo_free",
    label: "Free",
    state: "active",
    planId: "demo_free",
    visibleContinents: [
      "Trading & Markets",
      "Academy & Development",
      "Operations & Reliability",
    ],
    visibleStates: [
      "Paper-safe Market State",
      "Assistant State",
      "Basic Academy State",
      "Journal/Coach Foundation State",
      "Why Blocked State",
    ],
    visibleCities: [
      "Chart City",
      "Execution Hall",
      "Assistant Center",
      "Academy Library",
      "Journal Office",
      "Feedback Court",
    ],
    companionLevel: "Basic Assistant active",
    journalCoachLevel: "Basic paper prompts active",
    academyLevel: "Basic Academy active",
    communityAccess: "Basic community planned",
    mediaContentAccess: "Academy/product content only; no social publishing",
    visualIdentity: "demo_free",
    activeLayer: "Familiar paper trading layer",
    lockedFeatures: ["Pro alerts", "workspace memory depth", "advanced Assistant", "advanced reports", "private rooms"],
    plannedFeatures: ["community basic", "decision replay foundation", "academy paths"],
    hiddenFeatures: ["private command tools", "private revenue controls", "private revenue research"],
    upgradeExplanation: "Free is active as a familiar premium paper terminal. Pro and VIP remain planned until entitlement and billing gates exist.",
    safetyBoundaries: ["paper only", "live blocked", "real money blocked", "billing inactive"],
    mustNotShow: ["private command tools", "private revenue model", "paid checkout", "VIP active state"],
  },
  {
    citizenClass: "pro",
    label: "Pro",
    state: "planned",
    planId: "pro",
    visibleContinents: ["Free layer", "Professional Workspace Layer"],
    visibleStates: ["Pro Assistant State planned", "Alerts/Workflow State planned", "Workspace Memory State planned"],
    visibleCities: ["Pro Assistant Center planned", "Alerts Desk planned", "Decision Replay Office planned"],
    companionLevel: "Pro Assistant planned",
    journalCoachLevel: "Deeper session review planned",
    academyLevel: "Pro learning paths planned",
    communityAccess: "Pro community planned",
    mediaContentAccess: "Pro education content planned",
    visualIdentity: "pro",
    activeLayer: "Professional intelligent workspace layer planned",
    lockedFeatures: ["Pro entitlement", "alerts", "decision replay", "workspace memory depth"],
    plannedFeatures: ["Pro community", "journal depth", "session guidance"],
    hiddenFeatures: ["private command tools", "billing controls", "private revenue research"],
    upgradeExplanation: "Pro remains planned; no paid activation or checkout is active.",
    safetyBoundaries: ["no Pro active claim", "no billing activation", "no live execution by plan"],
    mustNotShow: ["Pro active without entitlement", "checkout", "paid access", "private command tools"],
  },
  {
    citizenClass: "vip",
    label: "VIP",
    state: "planned",
    planId: "vip",
    visibleContinents: ["Pro layer", "VIP advanced layer"],
    visibleStates: ["Advanced Assistant State planned", "Advanced Coach State planned", "Strategy Review State planned"],
    visibleCities: ["VIP Private Rooms planned", "Premium Reports Office planned", "Strategy Review Desk planned"],
    companionLevel: "Advanced Assistant planned",
    journalCoachLevel: "Advanced coaching planned",
    academyLevel: "VIP strategy review planned",
    communityAccess: "VIP private rooms planned",
    mediaContentAccess: "Premium content planned",
    visualIdentity: "vip",
    activeLayer: "Elite premium workspace layer planned",
    lockedFeatures: ["advanced Assistant", "advanced coaching", "premium reports", "private rooms"],
    plannedFeatures: ["advanced journal analytics", "strategy review", "priority support"],
    hiddenFeatures: ["private command tools", "private revenue research", "private revenue controls"],
    upgradeExplanation: "VIP remains planned; no premium access or VIP activation exists.",
    safetyBoundaries: ["no guaranteed signals", "no win-rate claims", "no fake VIP active state"],
    mustNotShow: ["VIP active", "guaranteed results", "private revenue model", "private command tools"],
  },
  {
    citizenClass: "enterprise",
    label: "Institutional",
    state: "future",
    planId: "enterprise",
    visibleContinents: ["Future Institutional Team Layer"],
    visibleStates: ["Team/Admin State future", "Audit State future", "Compliance Overview State future"],
    visibleCities: ["Institutional Admin future", "Audit Office future", "Runbook Center future"],
    companionLevel: "Institutional Assistant future",
    journalCoachLevel: "Team/runbook guidance future",
    academyLevel: "Team learning future",
    communityAccess: "Institutional rooms future",
    mediaContentAccess: "Institutional announcements future",
    visualIdentity: "enterprise",
    activeLayer: "Future institutional layer",
    lockedFeatures: ["team admin", "audit reports", "compliance overview", "custom support"],
    plannedFeatures: ["team workspaces", "admin controls", "institutional runbooks"],
    hiddenFeatures: ["private command tools", "private revenue research"],
    upgradeExplanation: "Institutional is future planned and not available for activation.",
    safetyBoundaries: ["no Institutional active claim", "no compliance certification", "no team admin claim"],
    mustNotShow: ["Institutional available", "compliance certified", "team admin active", "private command tools"],
  },
  {
    citizenClass: "staff_operator",
    label: "Staff / Operator",
    state: "planned",
    planId: "none",
    visibleContinents: ["Operational surfaces by role"],
    visibleStates: ["Support State", "Quality State", "Ops State"],
    visibleCities: ["Support Desk", "Quality Inspection", "Ops Readiness"],
    companionLevel: "Operator assistance planned",
    journalCoachLevel: "Not user coaching",
    academyLevel: "Internal training planned",
    communityAccess: "Moderation tools planned",
    mediaContentAccess: "Draft/review only",
    visualIdentity: "enterprise",
    activeLayer: "Future operator layer",
    lockedFeatures: ["operator consoles", "role permissions", "audit execution"],
    plannedFeatures: ["review queues", "support triage", "quality inspection"],
    hiddenFeatures: ["private approvals", "secrets", "private user data"],
    upgradeExplanation: "Operator access is role-based future scope, not a user plan.",
    safetyBoundaries: ["least privilege", "audit required", "no secret exposure"],
    mustNotShow: ["secrets", "private user data", "private command authority"],
  },
  {
    citizenClass: "founder_king",
    label: "Private Command",
    state: "owner_only",
    planId: "owner_only",
    visibleContinents: ["Full internal system"],
    visibleStates: ["All states"],
    visibleCities: ["Private Command Room", "Private Approval Center", "All reports"],
    companionLevel: "Private assistant readiness",
    journalCoachLevel: "Internal management summaries",
    academyLevel: "All educational readiness",
    communityAccess: "All community summaries when built",
    mediaContentAccess: "All media queues and approvals",
    visualIdentity: "vip",
    activeLayer: "Private command layer",
    lockedFeatures: ["approval execution until audit gates exist", "native command apps"],
    plannedFeatures: ["desktop command app", "mobile command app", "step-up confirmation"],
    hiddenFeatures: [],
    upgradeExplanation: "Private command access is never part of user plans.",
    safetyBoundaries: ["read-only by default", "critical blocks cannot be overridden", "audit required later"],
    mustNotShow: ["public route", "normal user nav", "user-plan entitlement"],
  },
];

export function getPlanetAccessLayer(citizenClass: CitizenClassId | string) {
  return (
    PLANET_ACCESS_LAYERS.find((layer) => layer.citizenClass === citizenClass) ??
    PLANET_ACCESS_LAYERS[1]
  );
}

function citizenClassForPlan(planId: PlanId): CitizenClassId {
  return planId;
}

export function getPlanEntitlementContract(planId: PlanId | string) {
  return (
    PLAN_ENTITLEMENTS.find((plan) => plan.planId === planId) ??
    PLAN_ENTITLEMENTS[0]
  );
}

export function getPlanEntitlementSnapshot(
  currentPlan: PlanId | string = "demo_free",
  checkedAt = new Date().toISOString()
): PlanEntitlementSnapshot {
  const current = getPlanEntitlementContract(currentPlan);
  const currentClass = citizenClassForPlan(current.planId);
  const currentLayer = getPlanetAccessLayer(currentClass);

  return {
    checkedAt,
    mode: "plan_entitlement_engine",
    currentPlan: current.planId,
    plans: PLAN_ENTITLEMENTS,
    citizenAccess: {
      currentClass,
      layers: PLANET_ACCESS_LAYERS,
      currentLayer,
      founderCommandUserVisible: false,
      performanceFeeUserVisible: false,
    },
    truth: {
      billing: "inactive",
      paidAccess: "not_enabled",
      vipActivation: "not_active",
      enterpriseActivation: "future_planned",
      institutionalActivation: "future_planned",
      founderCommandAccess: "owner_only_never_user_plan",
      ownerCommandAccess: "owner_only_never_user_plan",
      performanceFee: "hidden_inactive",
    },
  };
}

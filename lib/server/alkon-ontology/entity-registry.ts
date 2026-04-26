import type {
  AlkonEntity,
  EntityRiskLevel,
  EntityType,
  EntityValidation,
  EntityValidationMethod,
  EntityValueScore,
  EntityVisibility,
  EntityWorld,
} from "./types";

const STAMP = "2026-04-26T00:00:00.000Z";

const DEFAULT_VALUE: EntityValueScore = {
  user_value: 6,
  founder_value: 6,
  safety_value: 6,
  trust_value: 6,
  learning_value: 5,
  business_value: 5,
  technical_value: 6,
  operational_value: 6,
};

const PUBLIC_VALIDATION: EntityValidation = {
  methods: [
    "typescript",
    "eslint",
    "build",
    "regression_test",
    "screenshot_proof",
    "product_truth_check",
    "public_private_leak_check",
  ],
  evidence: ["public regression", "public proof screenshot", "Product Truth assertion"],
  productTruthCheck: true,
  publicPrivateLeakCheck: true,
};

const PRIVATE_VALIDATION: EntityValidation = {
  methods: [
    "typescript",
    "eslint",
    "build",
    "regression_test",
    "product_truth_check",
    "public_private_leak_check",
    "founder_review",
  ],
  evidence: ["founder readiness API", "no public leak regression"],
  productTruthCheck: true,
  publicPrivateLeakCheck: true,
};

const INVISIBLE_VALIDATION: EntityValidation = {
  methods: [
    "typescript",
    "eslint",
    "build",
    "regression_test",
    "product_truth_check",
    "api_safety_check",
    "public_private_leak_check",
  ],
  evidence: ["deterministic server contract", "public-safe output mapper"],
  productTruthCheck: true,
  publicPrivateLeakCheck: true,
};

type EntityInput = Pick<
  AlkonEntity,
  | "entityId"
  | "name"
  | "type"
  | "visibility"
  | "world"
  | "purpose"
  | "serves"
  | "ownerArea"
  | "ownerWorker"
  | "relatedSystems"
  | "reportTarget"
  | "memoryRule"
  | "deprecationRule"
  | "removalRule"
  | "publicVisible"
  | "founderVisible"
> &
  Partial<
    Pick<
      AlkonEntity,
      | "dependencies"
      | "outputs"
      | "boundaries"
      | "lifecycle"
      | "valueScore"
      | "riskLevel"
      | "validation"
      | "status"
    >
  >;

function entity(input: EntityInput): AlkonEntity {
  const validation =
    input.validation ??
    (input.world === "public_earth"
      ? PUBLIC_VALIDATION
      : input.world === "private_alkon"
        ? PRIVATE_VALIDATION
        : INVISIBLE_VALIDATION);

  return {
    dependencies: [],
    outputs: ["readiness", "safe report"],
    boundaries: [
      "preserve Product Truth",
      "no secrets",
      "no fake activation",
      "no shell execution from web app",
    ],
    lifecycle: "accepted",
    valueScore: DEFAULT_VALUE,
    riskLevel: "safe",
    validation,
    status:
      input.visibility === "founder_private"
        ? "internal_only"
        : input.lifecycle === "planned"
          ? "planned"
          : input.lifecycle === "idea"
            ? "future"
            : "active",
    createdAt: STAMP,
    updatedAt: STAMP,
    ...input,
  };
}

function publicEntity(
  entityId: string,
  name: string,
  type: EntityType,
  purpose: string,
  dependencies: string[] = ["product_truth", "surface_boundaries"]
) {
  return entity({
    entityId,
    name,
    type,
    visibility: "public_user",
    world: "public_earth",
    purpose,
    serves: ["public users", "Ahmad's public product trust"],
    ownerArea: "Public Earth",
    ownerWorker: "Public UX Worker",
    relatedSystems: ["Trading Pro Max", "Product Truth", "Surface Boundaries"],
    dependencies,
    outputs: ["public-safe user value", "truthful readiness"],
    reportTarget: "Founder Command",
    memoryRule: "Store public clarity, clutter, no-fake-claim, and public leak lessons.",
    deprecationRule: "Deprecate only if duplicate, confusing, or replaced by a stronger public surface.",
    removalRule: "Remove only after dependents migrate and public access, trust, and tests remain intact.",
    publicVisible: true,
    founderVisible: true,
  });
}

function privateEntity(
  entityId: string,
  name: string,
  type: EntityType,
  purpose: string,
  dependencies: string[] = ["product_truth", "surface_boundaries"]
) {
  return entity({
    entityId,
    name,
    type,
    visibility: "founder_private",
    world: "private_alkon",
    purpose,
    serves: ["Ahmad", "private Alkon command"],
    ownerArea: "Alkon",
    ownerWorker: "Alkon Report Worker",
    relatedSystems: ["Founder Command", "Product Memory", "Result Tribunal"],
    dependencies,
    outputs: ["private readiness", "Founder report"],
    reportTarget: "Founder Command",
    memoryRule: "Store only safe lessons; never store secrets or raw private sensitive data.",
    deprecationRule: "Deprecate only with Founder review if purpose becomes duplicate or unclear.",
    removalRule: "Never remove Alkon core, memory, security, secrets, or launch gates without Founder approval.",
    publicVisible: false,
    founderVisible: true,
    riskLevel: "review_required",
  });
}

function invisibleEntity(
  entityId: string,
  name: string,
  type: EntityType,
  purpose: string,
  dependencies: string[] = []
) {
  return entity({
    entityId,
    name,
    type,
    visibility: "hidden",
    world: "invisible_operating_layer",
    purpose,
    serves: ["public users through safe outputs", "Ahmad through truthful control"],
    ownerArea: "Invisible Operating Layer",
    ownerWorker: "Boundary Mapping Worker",
    relatedSystems: ["Product Truth", "Public/Private Output Mapper"],
    dependencies,
    outputs: ["safe policy result", "public-safe mapping"],
    reportTarget: "Founder Command",
    memoryRule: "Store safe boundary, entitlement, truth, and blocked-state lessons.",
    deprecationRule: "Deprecate only if replaced by stronger truth or boundary contract.",
    removalRule: "Never remove core truth, entitlement, guardian, legal, trust, or boundary systems without Founder approval.",
    publicVisible: false,
    founderVisible: true,
    riskLevel: "review_required",
  });
}

function withValue(
  entityItem: AlkonEntity,
  valueScore: Partial<EntityValueScore>,
  riskLevel?: EntityRiskLevel
): AlkonEntity {
  return {
    ...entityItem,
    valueScore: { ...entityItem.valueScore, ...valueScore },
    riskLevel: riskLevel ?? entityItem.riskLevel,
  };
}

function withMethods(
  entityItem: AlkonEntity,
  methods: EntityValidationMethod[]
): AlkonEntity {
  return {
    ...entityItem,
    validation: {
      ...entityItem.validation,
      methods: Array.from(new Set([...entityItem.validation.methods, ...methods])),
    },
  };
}

export const ALKON_ENTITY_REGISTRY: AlkonEntity[] = [
  withValue(
    publicEntity(
      "home",
      "Home",
      "public_page",
      "Guide users into the public Trading Pro Max world without crowding or private leakage.",
      ["product_truth", "surface_boundaries", "living_earth_identity", "tpm_assistant"]
    ),
    { user_value: 9, trust_value: 8, business_value: 8 }
  ),
  publicEntity(
    "trading_workspace",
    "Trading Workspace",
    "public_page",
    "Give users a chart-first paper-safe terminal with Assistant, Journal, Coach, and truthful blocked states.",
    [
      "product_truth",
      "plan_entitlements",
      "free_earth_realm",
      "market_chart_workspace",
      "tpm_assistant",
      "journal",
      "coach",
      "why_blocked",
    ]
  ),
  publicEntity("markets", "Markets", "market_surface", "Show supported, planned, and future market categories without live-feed or broker claims."),
  publicEntity("plans", "Plans", "public_page", "Explain Free, Pro, VIP, and Institutional truth without fake paid activation.", [
    "product_truth",
    "plan_entitlements",
  ]),
  publicEntity("apps_platforms", "Apps / Platforms", "public_page", "Show Web current, Desktop planned, Mobile planned, and Tablet future without fake downloads.", [
    "product_truth",
    "real_world_launch_readiness",
    "public_private_output_mapper",
  ]),
  publicEntity("academy", "Academy", "academy_surface", "Help users learn product basics, paper trading basics, chart basics, risk basics, and Why Blocked."),
  publicEntity("community", "Community", "community_surface", "Represent future learning and feedback spaces without fake members, rooms, or signals."),
  publicEntity("support", "Support", "support_surface", "Provide public-safe support readiness, help center direction, security contact, and problem-report truth.", [
    "product_truth",
    "public_private_output_mapper",
    "world_interface",
  ]),
  publicEntity("settings", "Settings", "public_page", "Keep manual backup controls for theme, language, environment, personal reality, and product truth."),
  publicEntity("diagnostics", "Diagnostics", "public_page", "Show public-safe readiness and Product Truth without private command internals."),
  publicEntity("free_earth_realm", "Free Earth Realm", "plan_realm", "Keep Free complete, active, paper-safe, and not cheap.", ["product_truth", "plan_entitlements"]),
  publicEntity("pro_orbit_realm", "Pro Orbit Realm", "plan_realm", "Represent planned professional depth without fake activation.", ["product_truth", "plan_entitlements"]),
  publicEntity("vip_lunar_realm", "VIP Lunar Realm", "plan_realm", "Represent planned premium depth without profit promises or fake VIP access.", ["product_truth", "plan_entitlements"]),
  publicEntity("institutional_station_realm", "Institutional Station Realm", "plan_realm", "Represent future institutional readiness without team/admin activation claims.", ["product_truth", "plan_entitlements"]),
  publicEntity("tpm_assistant", "TPM Assistant", "feature", "Translate public user intent into safe navigation, explanations, settings, and blocked-state alternatives.", [
    "product_truth",
    "plan_entitlements",
    "surface_boundaries",
    "assistant_context",
    "why_blocked",
  ]),
  publicEntity("journal", "Journal", "journal_coach_surface", "Capture paper-safe decision notes and reflection prompts without advice or pressure."),
  publicEntity("coach", "Coach", "journal_coach_surface", "Guide post-session learning without signals, guarantees, or financial advice."),
  publicEntity("product_truth_public_summary", "Product Truth public summary", "feature", "Show paper-safe, planned, inactive, future, and blocked truth compactly.", ["product_truth"]),
  publicEntity("adaptive_atmosphere_solar_theme", "Adaptive Atmosphere / Solar Theme", "environment_state", "Let users control code-only atmosphere while privacy and chart safety remain protected.", [
    "planetary_environment_engine",
    "surface_boundaries",
  ]),
  publicEntity("living_earth_identity", "Living Earth identity", "visual_identity", "Make Earth the public identity reference with code-only visuals and no raster assets.", [
    "product_truth",
    "brand_intelligence",
  ]),
  withMethods(
    publicEntity("market_chart_workspace", "Market chart / workspace", "market_surface", "Show a calm paper-safe chart that stays visually first and does not imply live trading.", [
      "product_truth",
      "why_blocked",
      "living_earth_identity",
    ]),
    ["visual_acceptance"]
  ),

  privateEntity("alkon_command_universe", "Alkon Command Universe", "alkon_subsystem", "Provide Ahmad the private command universe for Earth, Moon, Orbit, Solar, Defense, Construction, Memory, and World Interface.", [
    "founder_command",
    "product_truth",
    "surface_boundaries",
  ]),
  privateEntity("founder_command", "Founder Command", "private_page", "Keep owner-only local command reporting and private readiness visible to Ahmad only.", [
    "product_truth",
    "security_sovereignty",
    "secrets_authority",
  ]),
  privateEntity("founder_idea_inbox", "Founder Idea Inbox", "feature", "Turn Founder ideas into classified previews, policy gates, passports, and safe next actions.", [
    "sovereign_autonomy",
    "alkon_cosmic_operating_physics",
  ]),
  privateEntity("sovereign_autonomy", "Sovereign Autonomy", "alkon_subsystem", "Govern idea intake, task passports, policy gates, and manual Codex draft readiness.", [
    "codex_sovereign_construction_state",
    "result_tribunal",
  ]),
  privateEntity("codex_sovereign_construction_state", "Codex Sovereign Construction State", "alkon_subsystem", "Keep Codex as a licensed construction worker with jurisdiction, permits, and tribunal review.", [
    "task_passport",
    "codex_license",
    "result_tribunal",
    "product_memory",
  ]),
  privateEntity("alkon_cosmic_operating_physics", "Alkon Cosmic Operating Physics", "alkon_subsystem", "Distribute every idea, error, risk, feature, and task through governed cosmic work physics.", [
    "founder_idea_inbox",
    "result_tribunal",
    "product_memory",
  ]),
  privateEntity("alkon_work_distribution", "Alkon Work Distribution", "feature", "Assign source, gravity, orbit, owner, satellite, station, worker, passport, validation, tribunal, and memory."),
  privateEntity("alkon_sovereign_operating_consciousness", "Alkon Sovereign Operating Consciousness", "alkon_subsystem", "Sense, understand, law-check, prioritize, route, prepare, judge, remember, and evolve under Founder authority.", [
    "alkon_cosmic_operating_physics",
    "product_memory",
    "result_tribunal",
  ]),
  privateEntity("alkon_ontology_existence_system", "Alkon Ontology & Existence System", "alkon_subsystem", "Give every entity meaning, ownership, lifecycle, relationships, value, risk, validation, memory, and removal law.", [
    "product_memory",
    "result_tribunal",
    "alkon_sovereign_operating_consciousness",
  ]),
  privateEntity("ontology_completeness_checker", "Ontology Completeness Checker", "alkon_subsystem", "Check every registered entity for owner, purpose, lifecycle, relationships, validation, memory, risk, report target, and stay/removal law.", [
    "alkon_ontology_existence_system",
    "product_memory",
    "validation_satellite",
  ]),
  privateEntity("product_memory", "Product Memory", "memory_lesson", "Store safe lessons, repeated mistakes, visual history, Product Truth, and future guards without secrets."),
  privateEntity("result_tribunal", "Result Tribunal", "station", "Judge work by validation, scope, Product Truth, public leak, secrets, fake activation, and visual proof."),
  privateEntity("secrets_authority", "Secrets Authority", "alkon_subsystem", "Track secret categories as status-only and keep values hidden.", ["security_sovereignty"]),
  privateEntity("security_sovereignty", "Security Sovereignty", "alkon_subsystem", "Protect public/private boundaries, auth posture, secrets, and incident readiness.", ["secrets_authority", "product_truth"]),
  privateEntity("world_interface", "World Interface", "alkon_subsystem", "Model external channel readiness without sending, publishing, tokens, or account creation.", ["security_sovereignty", "product_truth"]),
  privateEntity("treasury_readiness", "Treasury Readiness", "feature", "Represent billing and finance readiness only while activation remains blocked.", ["product_truth", "launch_readiness_gate"]),
  privateEntity("media_office", "Media Office", "feature", "Prepare media workflows as draft/review only with no publishing or external accounts.", ["world_interface"]),
  privateEntity("launch_readiness_gate", "Launch Readiness Gate", "launch_gate", "Block real-world launch until legal, support, budget, staging, beta, rollback, and Founder decision gates pass.", ["product_truth", "security_sovereignty"]),
  privateEntity("real_world_launch_readiness", "Real-World Launch Readiness", "launch_gate", "Prepare future economical launch readiness under the 250 CHF cap without activating launch.", ["launch_readiness_gate"]),
  privateEntity("local_day_cycle", "Local Day Cycle", "feature", "Give Ahmad a local day review cadence for ideas, validation, memory, and next safe actions.", ["product_memory"]),
  privateEntity("task_passport", "Task Passport", "codex_task", "Define scope, files, boundaries, validation, and public language before Codex construction."),
  privateEntity("codex_license", "Codex License", "codex_task", "Permit only bounded draft work; never web-app execution or secrets."),
  privateEntity("codex_passport_worker", "Codex Passport Worker", "worker", "Prepare passports and prompt drafts for manual Founder review."),
  privateEntity("validation_satellite", "Validation Satellite", "satellite", "Monitor tsc, eslint, build, prisma, regression, smoke, diff, and public leak checks."),
  privateEntity("tribunal_station", "Tribunal Station", "station", "Hold validation judgment before acceptance."),
  privateEntity("black_hole_zone", "Black Hole Zone", "risk", "Hard-block forbidden activation, secrets, fake claims, and external offensive actions.", ["product_truth", "security_sovereignty"]),
  privateEntity("alkon_ontology_regression_test", "Alkon Ontology regression test", "test", "Prove ontology readiness, entity completeness, private APIs, and public leak prevention.", ["alkon_ontology_existence_system"]),

  invisibleEntity("product_truth", "Product Truth", "feature", "Keep active, planned, inactive, future, and blocked claims truthful."),
  invisibleEntity("plan_entitlements", "Plan Entitlements", "feature", "Prevent fake Pro, VIP, Institutional, billing, or entitlement activation.", ["product_truth"]),
  invisibleEntity("surface_boundaries", "Surface Boundaries", "feature", "Separate public Earth, private Alkon, and invisible operating outputs.", ["product_truth"]),
  invisibleEntity("guardian", "Guardian", "feature", "Guard unsafe actions, sensitive claims, and external activation readiness.", ["product_truth"]),
  invisibleEntity("legal", "Legal", "feature", "Prevent fake legal status, fake certification, false advice, and unsafe claims.", ["guardian"]),
  invisibleEntity("trust_governor", "Trust Governor", "feature", "Keep public trust language honest and non-hype.", ["legal", "product_truth"]),
  invisibleEntity("brand_intelligence", "Brand Intelligence", "visual_identity", "Protect code-only identity, Founder visual preferences, and plan realm brand behavior.", ["product_truth"]),
  invisibleEntity("planetary_environment_engine", "Planetary Environment Engine", "environment_state", "Resolve time, solar, weather readiness, market session, plan realm, and surface intensity without precise location.", ["product_truth", "surface_boundaries"]),
  invisibleEntity("assistant_context", "Assistant Context", "assistant_intent", "Give TPM Assistant public-safe context for route, plan, blocked, support, apps, and personal reality explanations.", ["product_truth", "plan_entitlements", "surface_boundaries"]),
  invisibleEntity("why_blocked", "Why Blocked", "feature", "Explain blocked states without exposing private systems or activating unsafe actions.", ["product_truth", "guardian"]),
  invisibleEntity("diagnostics_health", "Diagnostics Health", "feature", "Summarize public-safe readiness without private internals.", ["product_truth", "public_private_output_mapper"]),
  invisibleEntity("public_private_output_mapper", "Public/Private Output Mapper", "feature", "Translate private readiness into public-safe Trading Pro Max language.", ["surface_boundaries", "product_truth"]),
];

export function getAlkonEntityRegistry() {
  return ALKON_ENTITY_REGISTRY;
}

export function findAlkonEntity(entityId: string) {
  return ALKON_ENTITY_REGISTRY.find((entityItem) => entityItem.entityId === entityId);
}

export function getEntitiesByWorld(world: EntityWorld) {
  return ALKON_ENTITY_REGISTRY.filter((entityItem) => entityItem.world === world);
}

export function getEntitiesByVisibility(visibility: EntityVisibility) {
  return ALKON_ENTITY_REGISTRY.filter(
    (entityItem) => entityItem.visibility === visibility
  );
}

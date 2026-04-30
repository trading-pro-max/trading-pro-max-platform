import "server-only";

export type ElectronicCapabilityStatus =
  | "active_private"
  | "prepare_only"
  | "protected"
  | "future_gate"
  | "blocked";

export type ElectronicCapabilityCategory =
  | "intelligence"
  | "building"
  | "truth_protection"
  | "memory"
  | "interface"
  | "automation"
  | "product_world"
  | "external_gate"
  | "explainability";

export type ElectronicCapability = {
  id: string;
  title: string;
  category: ElectronicCapabilityCategory;
  layer: string;
  owner: "الكون" | "Ahmad" | "Product Truth" | "Universe Operating Kernel";
  status: ElectronicCapabilityStatus;
  directInternalActions: string[];
  prepareOnlyActions: string[];
  legalStopActions: string[];
  moneyStopActions: string[];
  blockedActions: string[];
  productTruthImpact: string;
  uiPath: string;
  docsPath: string;
  reportPath: string;
  testPath: string;
  nextAction: string;
};

const TITLES = [
  ["understanding", "Understanding", "intelligence"],
  ["reasoning", "Reasoning", "intelligence"],
  ["builder", "Builder", "building"],
  ["refactor", "Refactor", "building"],
  ["testing", "Testing", "building"],
  ["reporting", "Reporting", "building"],
  ["monitoring", "Monitoring", "truth_protection"],
  ["protection", "Protection", "truth_protection"],
  ["product_truth", "Product Truth", "truth_protection"],
  ["rights_ownership", "Rights & Ownership", "truth_protection"],
  ["memory", "Memory", "memory"],
  ["ahmad_digital_vault", "Ahmad Digital Vault", "memory"],
  ["human_interface", "Human Interface", "interface"],
  ["agreement_to_execution", "Agreement-to-Execution", "interface"],
  ["daily_work_loop", "Daily Work Loop", "automation"],
  ["automatic_internal_engine", "Automatic Internal Engine", "automation"],
  ["infinity_mode", "Infinity Mode", "automation"],
  ["operator_mode", "Operator Mode", "automation"],
  ["desktop_environment", "Desktop Environment", "interface"],
  ["packaging_distribution_auth", "Packaging / Distribution / Auth", "truth_protection"],
  ["visual_universe", "Visual Universe", "interface"],
  ["reality_universe_one", "Reality / Universe One", "interface"],
  ["pro_max_galaxy", "Pro Max Galaxy", "product_world"],
  ["earth_planet", "Earth Planet", "product_world"],
  ["trading", "Trading", "product_world"],
  ["external_preparation", "External Preparation", "external_gate"],
  ["legal_stop", "Legal Stop", "external_gate"],
  ["money_stop", "Money Stop", "external_gate"],
  ["explainability_infinity_to_zero", "Explainability ∞ to 0", "explainability"],
  ["rollback", "Rollback", "truth_protection"],
  ["decision_center", "Decision Center", "interface"],
  ["control_surfaces", "Control Surfaces", "interface"],
  ["digital_miracles", "Digital Miracles", "automation"],
  ["capability_matrix", "Capability Matrix", "explainability"],
] as const satisfies readonly (readonly [string, string, ElectronicCapabilityCategory])[];

const STOPPED_LEGAL = [
  "legal claim",
  "FINMA wording",
  "contracts",
  "trademark adoption",
  "official regulatory matter",
];

const STOPPED_MONEY = [
  "billing",
  "payments",
  "receiving money",
  "real-money trading",
  "broker execution",
];

const BLOCKED = [
  "public الكون exposure",
  "public ALKON exposure",
  "secret exposure",
  "unknown-source public asset use",
  "false ownership claim",
];

function capabilityFromTitle(
  [id, title, category]: (typeof TITLES)[number],
): ElectronicCapability {
  const automation = category === "automation";
  const external = category === "external_gate";
  const owner =
    id === "product_truth"
      ? "Product Truth"
      : external
        ? "Ahmad"
        : automation
          ? "Universe Operating Kernel"
          : "الكون";

  return {
    id,
    title,
    category,
    layer: external
      ? "Legal/Money/Public Gates"
      : category === "product_world"
        ? "Pro Max Galaxy / Earth Planet"
        : category === "truth_protection"
          ? "Protection and Product Truth"
          : "Al-Kawn Private Operating Layer",
    owner,
    status: external ? "prepare_only" : id.includes("vault") ? "protected" : "active_private",
    directInternalActions: external
      ? ["prepare private evidence", "draft internal checklist"]
      : ["audit", "summarize", "prepare report", "select one next action"],
    prepareOnlyActions: [
      "prepare documentation",
      "prepare validation plan",
      "prepare Ahmad decision summary",
    ],
    legalStopActions: STOPPED_LEGAL,
    moneyStopActions: STOPPED_MONEY,
    blockedActions: BLOCKED,
    productTruthImpact:
      "Capability executes only if Product Truth, Kernel verdict, Legal gate, Money gate, and secret protection allow it.",
    uiPath: "/desktop/kawn",
    docsPath: "docs/product/al-kawn-complete-electronic-capabilities.md",
    reportPath: "reports/al-kawn-complete-electronic-capabilities.md",
    testPath: "tests/regression/al-kawn-complete-electronic-capabilities.spec.ts",
    nextAction: external
      ? "Stop for Ahmad before any external action."
      : "Use this capability for private internal work only.",
  };
}

const CAPABILITIES: ElectronicCapability[] = TITLES.map(capabilityFromTitle);

export function getAlKawnElectronicCapabilities() {
  return CAPABILITIES;
}

export function getElectronicCapabilityById(capabilityId: string) {
  return CAPABILITIES.find((capability) => capability.id === capabilityId) ?? null;
}

export function getElectronicCapabilitiesByCategory(
  category?: ElectronicCapabilityCategory,
) {
  if (!category) {
    return CAPABILITIES.reduce<Record<string, ElectronicCapability[]>>(
      (groups, capability) => {
        groups[capability.category] ??= [];
        groups[capability.category].push(capability);
        return groups;
      },
      {},
    );
  }

  return CAPABILITIES.filter((capability) => capability.category === category);
}

export function getElectronicCapabilitiesByLayer(layer?: string) {
  if (!layer) {
    return CAPABILITIES.reduce<Record<string, ElectronicCapability[]>>(
      (groups, capability) => {
        groups[capability.layer] ??= [];
        groups[capability.layer].push(capability);
        return groups;
      },
      {},
    );
  }

  return CAPABILITIES.filter((capability) => capability.layer === layer);
}

export function getElectronicCapabilityVerdict(capabilityId: string) {
  const capability = getElectronicCapabilityById(capabilityId);
  if (!capability) {
    return {
      capabilityId,
      verdict: "needs_more_evidence",
      reason: "Capability is not registered inside الكون.",
    };
  }

  if (capability.status === "prepare_only") {
    return {
      capabilityId,
      verdict: "prepare_only",
      reason: "This capability can prepare evidence but cannot execute external, legal, or money actions.",
    };
  }

  return {
    capabilityId,
    verdict: "execute_directly_internal",
    reason: "Private internal execution is allowed while Product Truth and gates remain enforced.",
  };
}

export function getElectronicCapabilitySummary() {
  return {
    title: "Capability Matrix",
    total: CAPABILITIES.length,
    activePrivate: CAPABILITIES.filter((item) => item.status === "active_private").length,
    prepareOnly: CAPABILITIES.filter((item) => item.status === "prepare_only").length,
    protected: CAPABILITIES.filter((item) => item.status === "protected").length,
    requiredWording: [
      "Capability Matrix",
      "Product Truth remains visible above visual beauty.",
      "Inside الكون: direct internal execution.",
      "Legal and Money gates stop execution for Ahmad.",
    ],
    nextAction: getElectronicCapabilityNextAction(),
  };
}

export function getElectronicCapabilityNextAction() {
  return "Use the capability verdict before every Infinity or Operator internal cycle.";
}

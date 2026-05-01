import "server-only";

export type AlKawnWorldStatus =
  | "active"
  | "planned"
  | "future_gate"
  | "protected"
  | "needs_ahmad_decision";

export type AlKawnWorld = {
  id: string;
  title: string;
  arabicTitle: string;
  layer: string;
  status: AlKawnWorldStatus;
  purpose: string;
  folderRule: string;
  contracts: string[];
  boundaries: string[];
  nextAction: string;
};

export type AlKawnWorldContract = {
  id: string;
  title: string;
  purpose: string;
  owner: string;
  requiredFor: string[];
};

export type AlKawnModularWorlds = {
  id: "al_kawn_modular_worlds";
  title: "Al-Kawn Modular Worlds Architecture";
  rootRule: string;
  requiredWording: string[];
  worlds: AlKawnWorld[];
  contracts: AlKawnWorldContract[];
  boundaries: string[];
  integrationMap: string[];
  nextAction: string;
};

const WORLD_CONTRACTS: AlKawnWorldContract[] = [
  {
    id: "ProductTruthContract",
    title: "Product Truth Contract",
    purpose:
      "Keeps every world honest about private status, public blocks, money blocks, broker blocks, and legal limits.",
    owner: "Al-Kawn Core",
    requiredFor: ["all_worlds"],
  },
  {
    id: "KernelVerdictContract",
    title: "Kernel Verdict Contract",
    purpose:
      "Routes execution through the Universe Operating Kernel before a world acts.",
    owner: "Universe Operating Kernel",
    requiredFor: ["execution", "automation", "reports"],
  },
  {
    id: "WorldStatusContract",
    title: "World Status Contract",
    purpose: "Makes every world report active, protected, planned, or future-gated state.",
    owner: "Al-Kawn Core",
    requiredFor: ["world_registry", "desktop_summary"],
  },
  {
    id: "ReportContract",
    title: "Report Contract",
    purpose: "Requires concise internal reports without secrets or external data.",
    owner: "Reports Layer",
    requiredFor: ["audits", "daily_reports", "migration_reports"],
  },
  {
    id: "RightsOwnershipContract",
    title: "Rights Ownership Contract",
    purpose:
      "Tracks source, ownership evidence, unknown-source blocks, and public-use readiness.",
    owner: "Rights & Ownership",
    requiredFor: ["assets", "docs", "brand", "public_use"],
  },
  {
    id: "PrivacyBoundaryContract",
    title: "Privacy Boundary Contract",
    purpose:
      "Prevents private data, secrets, and device-only context from leaving Ahmad devices.",
    owner: "Protection Core",
    requiredFor: ["private", "vault", "external_preparation"],
  },
  {
    id: "CommandExecutionContract",
    title: "Command Execution Contract",
    purpose:
      "Defines command-first execution for safe internal work and stops at money, legal, or external gates.",
    owner: "/desktop/kawn",
    requiredFor: ["desktop", "automatic_engine", "operator"],
  },
  {
    id: "UIIntegrationContract",
    title: "UI Integration Contract",
    purpose:
      "Lets worlds appear in the UI without becoming root or cluttering the command entry.",
    owner: "Desktop Experience",
    requiredFor: ["desktop", "founder_universe", "trading"],
  },
];

const WORLDS: AlKawnWorld[] = [
  {
    id: "al_kawn_core",
    title: "Al-Kawn Core",
    arabicTitle: "نواة الكون",
    layer: "core",
    status: "active",
    purpose: "Owns Product Truth, kernel verdicts, device fabric, reports, and contracts.",
    folderRule: "Shared logic belongs in Al-Kawn Core.",
    contracts: WORLD_CONTRACTS.map((contract) => contract.id),
    boundaries: ["الكون owns all worlds.", "No project owns الكون."],
    nextAction: "Keep /desktop/kawn command-first and private.",
  },
  {
    id: "active_source_repo",
    title: "Active Source Repo",
    arabicTitle: "الريبو النشط",
    layer: "01_ACTIVE",
    status: "protected",
    purpose: "Hosts the current validated source without relocation.",
    folderRule: "لا نقل للريبو النشط قبل تقرير migration.",
    contracts: ["ProductTruthContract", "ReportContract", "CommandExecutionContract"],
    boundaries: ["No relocation in this mission.", "No rename in this mission."],
    nextAction: "Write a migration plan before any future move.",
  },
  {
    id: "pro_max_galaxy",
    title: "Pro Max Galaxy",
    arabicTitle: "مجرة Pro Max",
    layer: "02_WORLDS",
    status: "future_gate",
    purpose: "Future product galaxy inside الكون, not the root.",
    folderRule: "Every project has its own complete folder.",
    contracts: ["ProductTruthContract", "UIIntegrationContract", "RightsOwnershipContract"],
    boundaries: ["Pro Max is not root.", "Public launch remains blocked."],
    nextAction: "Keep Pro Max below Al-Kawn living command entry.",
  },
  {
    id: "trading_pro_max_earth",
    title: "Trading Pro Max Earth",
    arabicTitle: "أرض التداول داخل Pro Max",
    layer: "02_WORLDS/Pro-Max-Galaxy",
    status: "protected",
    purpose: "Trading layer remains available without money, broker, or public activation.",
    folderRule: "Trading has its own world boundary and contracts.",
    contracts: ["ProductTruthContract", "KernelVerdictContract", "PrivacyBoundaryContract"],
    boundaries: ["No broker execution.", "No real money.", "No legal claims."],
    nextAction: "Keep /trading as a layer, not root.",
  },
  {
    id: "future_mobile",
    title: "Future Mobile",
    arabicTitle: "الموبايل المستقبلي",
    layer: "02_WORLDS",
    status: "future_gate",
    purpose: "Future-gated mobile world, not active in this mission.",
    folderRule: "Future worlds require Ahmad decision before implementation.",
    contracts: ["ProductTruthContract", "PrivacyBoundaryContract"],
    boundaries: ["No mobile app work in this mission."],
    nextAction: "Keep as future-gated.",
  },
  {
    id: "private_vault",
    title: "Private Vault",
    arabicTitle: "الخزنة الخاصة",
    layer: "03_PRIVATE",
    status: "protected",
    purpose: "Private decisions, daily notes, vault, and personal-only records.",
    folderRule: "Private folders are never scanned by default.",
    contracts: ["PrivacyBoundaryContract", "RightsOwnershipContract", "ReportContract"],
    boundaries: ["No external sync.", "No private folder inspection without Ahmad."],
    nextAction: "Only define the gate, do not inspect private files.",
  },
  {
    id: "rights_and_ownership",
    title: "Rights & Ownership",
    arabicTitle: "الحقوق والملكية",
    layer: "04_RIGHTS",
    status: "protected",
    purpose: "Tracks source evidence, brand readiness, assets, and legal-readiness notes.",
    folderRule: "Unknown-source items are blocked from public use.",
    contracts: ["RightsOwnershipContract", "ProductTruthContract"],
    boundaries: [
      "No global ownership claim.",
      "Trademark/legal review is required before public adoption.",
    ],
    nextAction: "Continue evidence tracking before public use decisions.",
  },
  {
    id: "reports",
    title: "Reports",
    arabicTitle: "التقارير",
    layer: "05_REPORTS",
    status: "active",
    purpose: "Stores wake reports, audits, architecture, and validation records.",
    folderRule: "Reports are concise, private, and secret-free.",
    contracts: ["ReportContract", "ProductTruthContract"],
    boundaries: ["No secrets in reports.", "No external upload."],
    nextAction: "Use reports for migration readiness before movement.",
  },
  {
    id: "inbox_to_classify",
    title: "Inbox To Classify",
    arabicTitle: "الوارد للتصنيف",
    layer: "90_INBOX",
    status: "planned",
    purpose: "Safe landing area for future Ahmad-approved intake.",
    folderRule: "Inventory then classify before use.",
    contracts: ["ReportContract", "PrivacyBoundaryContract", "RightsOwnershipContract"],
    boundaries: ["No automatic intake.", "No external account connection."],
    nextAction: "Create only when Ahmad runs the workspace script manually.",
  },
  {
    id: "legacy_do_not_delete",
    title: "Legacy Do Not Delete",
    arabicTitle: "مشاريع قديمة لا تُحذف",
    layer: "99_LEGACY",
    status: "planned",
    purpose: "Holds old projects after inventory and classification.",
    folderRule: "لا حذف قبل الجرد والتصنيف.",
    contracts: ["ReportContract", "RightsOwnershipContract", "ProductTruthContract"],
    boundaries: ["No deletion before inventory.", "No unreviewed public use."],
    nextAction: "Inventory first, then Ahmad decides.",
  },
];

export function getWorldRegistry(): AlKawnWorld[] {
  return WORLDS;
}

export function getWorldById(worldId: string): AlKawnWorld | undefined {
  return WORLDS.find((world) => world.id === worldId);
}

export function getWorldContracts(): AlKawnWorldContract[] {
  return WORLD_CONTRACTS;
}

export function getWorldBoundaries(): string[] {
  return [
    "كل مشروع داخل الكون له مجلد كامل مستقل.",
    "كل المشاريع تعمل معًا عبر Al-Kawn Core.",
    "الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.",
    "No random imports across worlds.",
    "No project owns الكون.",
    "الكون owns all worlds.",
  ];
}

export function getWorldIntegrationMap(): string[] {
  return [
    "Al-Kawn Core provides Product Truth, kernel verdicts, reports, and contracts.",
    "Worlds expose status through contracts before UI integration.",
    "/desktop/kawn remains the command-first private home.",
    "/founder/universe summarizes root order and Ahmad decision points.",
    "/trading remains a product layer inside Pro Max, not root.",
  ];
}

export function getWorldNextAction(): string {
  return "Prepare an active repo migration plan only after Ahmad accepts the root order.";
}

export function getAlKawnModularWorlds(): AlKawnModularWorlds {
  return {
    id: "al_kawn_modular_worlds",
    title: "Al-Kawn Modular Worlds Architecture",
    rootRule: "الكون is root. Worlds are complete folders inside الكون.",
    requiredWording: [
      "كل مشروع داخل الكون له مجلد كامل مستقل.",
      "كل المشاريع تعمل معًا عبر Al-Kawn Core.",
      "الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.",
    ],
    worlds: getWorldRegistry(),
    contracts: getWorldContracts(),
    boundaries: getWorldBoundaries(),
    integrationMap: getWorldIntegrationMap(),
    nextAction: getWorldNextAction(),
  };
}

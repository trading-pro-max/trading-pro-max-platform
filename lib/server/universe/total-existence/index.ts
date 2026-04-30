import "server-only";

export type TotalExistenceEntityStatus =
  | "owned"
  | "active_private"
  | "protected"
  | "ready_not_started"
  | "future_gate"
  | "blocked";

export type TotalExistenceEntity = {
  id: string;
  arabicLabel: string;
  englishTechnicalLabel: string;
  ownerLayer: string;
  reasonForExistence: string;
  sourceTruth: string;
  status: TotalExistenceEntityStatus;
  productTruthImpact: string;
  rightsStatus: string;
  protectionStatus: string;
  executionVerdict: string;
  reportPath: string;
  testPath?: string;
  infinityToZeroExplanation: string;
  nextAction: string;
};

export type TotalExistenceLayer = {
  id: string;
  label: string;
  arabicLabel: string;
  parentId: string | null;
  status: TotalExistenceEntityStatus;
  purpose: string;
};

export type AlKawnTotalExistenceSystem = {
  id: "al_kawn_total_existence_system";
  title: "Al-Kawn A-Z Total Existence Completion";
  definition: "الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص.";
  status: "closed_total_existence_mapped";
  globalWording: string[];
  layerTree: TotalExistenceLayer[];
  entityRegistry: TotalExistenceEntity[];
  missingItems: string[];
  truth: string[];
  nextAction: string;
};

const GLOBAL_WORDING = [
  "الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص.",
  "الكون هو كون إلكتروني كامل خاص داخل لابتوب أحمد.",
  "الكون ليس Dashboard عادي.",
  "الكون لا يدّعي التحكم بالكون الفيزيائي.",
  "Product Truth هو قانون الحقيقة الأعلى.",
  "Universe Operating Kernel هو القاضي التنفيذي.",
  "داخل الكون: التنفيذ مباشر.",
  "عند القانون: يتوقف لأحمد.",
  "عند المال: يتوقف لأحمد.",
  "كل شيء داخل الكون يجب أن يعرف لماذا يوجد.",
  "كل شيء داخل الكون يجب أن ينتمي إلى طبقة واضحة.",
  "كل شيء حقيقي له مصدر، وكل محاكاة موسومة.",
  "كل شيء داخل الكون يمكن تفسيره من ∞ إلى 0.",
  "الكون بفخامة سويسرية تليق باسمه.",
  "Swiss-inspired precision, not official Swiss endorsement.",
  "Product Truth remains visible above visual beauty.",
];

const LAYERS: TotalExistenceLayer[] = [
  {
    id: "ahmad_origin",
    label: "Ahmad Origin",
    arabicLabel: "أحمد هو الأصل",
    parentId: null,
    status: "owned",
    purpose: "Founder source and final decision point for law, money, and Local Day One.",
  },
  {
    id: "al_kawn",
    label: "Al-Kawn Private Electronic Universe",
    arabicLabel: "الكون",
    parentId: "ahmad_origin",
    status: "active_private",
    purpose: "Contains every private electronic layer, route, file family, report, decision, memory, and capability.",
  },
  {
    id: "truth_kernel_protection",
    label: "Truth, Kernel, Protection",
    arabicLabel: "الحقيقة والنواة والحماية",
    parentId: "al_kawn",
    status: "protected",
    purpose: "Product Truth, Universe Operating Kernel, rights, vault, and stop gates.",
  },
  {
    id: "human_operating_surface",
    label: "Human Operating Surface",
    arabicLabel: "واجهة أحمد البشرية",
    parentId: "al_kawn",
    status: "active_private",
    purpose: "Desktop, spoken interface, daily loop, control surfaces, and reports.",
  },
  {
    id: "automation_surface",
    label: "Automatic Internal Engine",
    arabicLabel: "المحرك الداخلي التلقائي",
    parentId: "al_kawn",
    status: "active_private",
    purpose: "Safe trigger-based internal cycles with one work item per cycle.",
  },
  {
    id: "pro_max_galaxy",
    label: "Pro Max Galaxy",
    arabicLabel: "مجرة Pro Max",
    parentId: "al_kawn",
    status: "future_gate",
    purpose: "Future public product galaxy inside الكون, never owner of الكون.",
  },
  {
    id: "earth_planet",
    label: "Earth Planet / Trading",
    arabicLabel: "كوكب الأرض / التداول",
    parentId: "pro_max_galaxy",
    status: "protected",
    purpose: "Trading project and /trading surface with demo-safe Product Truth boundaries.",
  },
  {
    id: "local_day_one",
    label: "Local Day One Boot Gate",
    arabicLabel: "بوابة اليوم المحلي الأول",
    parentId: "human_operating_surface",
    status: "ready_not_started",
    purpose: "Ready gate requiring Ahmad manual start; never starts itself.",
  },
];

const ENTITY_REGISTRY: TotalExistenceEntity[] = [
  {
    id: "desktop_kawn_route",
    arabicLabel: "/desktop/kawn",
    englishTechnicalLabel: "Private desktop operating route",
    ownerLayer: "human_operating_surface",
    reasonForExistence: "Main private command home for Ahmad's electronic universe.",
    sourceTruth: "Route exists and is covered by desktop and local auth regressions.",
    status: "active_private",
    productTruthImpact: "Keeps الكون private and visible only as Ahmad's operating client.",
    rightsStatus: "Repo-owned source; no unknown public asset.",
    protectionStatus: "Local PIN/passphrase lock preserved.",
    executionVerdict: "Direct internal execution allowed.",
    reportPath: "reports/al-kawn-wake-state-daily-work-loop-closure.md",
    testPath: "tests/regression/al-kawn-local-pin-passphrase-auth.spec.ts",
    infinityToZeroExplanation: "∞ private universe -> desktop client -> route -> component -> visible command surface -> 0 rendered text.",
    nextAction: "Ahmad reviews /desktop/kawn and decides whether to start Local Day One.",
  },
  {
    id: "product_truth",
    arabicLabel: "Product Truth",
    englishTechnicalLabel: "Highest truth law",
    ownerLayer: "truth_kernel_protection",
    reasonForExistence: "Prevents false claims, unsafe launch, public exposure, money, broker, and legal overreach.",
    sourceTruth: "Product Truth panels, docs, reports, and regression forbidden-claim scans.",
    status: "protected",
    productTruthImpact: "Highest law above visual beauty and automation.",
    rightsStatus: "Internal doctrine owned in repo docs.",
    protectionStatus: "Always visible on core private surfaces.",
    executionVerdict: "Blocks Product Truth violations immediately.",
    reportPath: "reports/al-kawn-total-existence-system.md",
    testPath: "tests/regression/al-kawn-total-existence-system.spec.ts",
    infinityToZeroExplanation: "∞ truth law -> kernel verdict -> UI chip -> test assertion -> 0 visible phrase.",
    nextAction: "Keep Product Truth visible before Local Day One.",
  },
  {
    id: "universe_operating_kernel",
    arabicLabel: "النواة",
    englishTechnicalLabel: "Universe Operating Kernel",
    ownerLayer: "truth_kernel_protection",
    reasonForExistence: "Execution judge for direct, legal stop, money stop, and blocked actions.",
    sourceTruth: "Existing kernel module and wake/infinity/operator models.",
    status: "protected",
    productTruthImpact: "Makes every action explainable and gated.",
    rightsStatus: "Repo-owned source.",
    protectionStatus: "No external execution or secret storage.",
    executionVerdict: "Judge active for private internal work.",
    reportPath: "reports/al-kawn-total-existence-system.md",
    testPath: "tests/regression/al-kawn-total-existence-system.spec.ts",
    infinityToZeroExplanation: "∞ execution law -> kernel -> verdict -> panel -> 0 action label.",
    nextAction: "Use kernel verdict before every automatic cycle.",
  },
  {
    id: "infinity_controlled",
    arabicLabel: "Infinity Mode",
    englishTechnicalLabel: "Controlled private internal cycles",
    ownerLayer: "automation_surface",
    reasonForExistence: "Continuous readiness model without uncontrolled loops or daemons.",
    sourceTruth: "Infinity preparation and controlled activation modules.",
    status: "active_private",
    productTruthImpact: "Allows safe internal cycles only.",
    rightsStatus: "Internal operating model, not public distribution.",
    protectionStatus: "Safe trigger required for every cycle.",
    executionVerdict: "Direct internal cycles only.",
    reportPath: "reports/infinity/al-kawn-infinity-controlled-activation.md",
    testPath: "tests/regression/al-kawn-infinity-controlled-activation.spec.ts",
    infinityToZeroExplanation: "∞ continuity -> safe trigger -> one internal cycle -> report -> 0 stopped state.",
    nextAction: "Keep cycle trigger-based and wait for Ahmad review.",
  },
  {
    id: "operator_controlled",
    arabicLabel: "Operator Mode",
    englishTechnicalLabel: "Controlled internal work executor",
    ownerLayer: "automation_surface",
    reasonForExistence: "Lets الكون work for Ahmad internally while stopping at law and money.",
    sourceTruth: "Operator preparation and controlled activation modules.",
    status: "active_private",
    productTruthImpact: "Executes only safe internal work and reports to Ahmad.",
    rightsStatus: "Internal capability, not customer/public auth.",
    protectionStatus: "No public, money, broker, legal, or external actions.",
    executionVerdict: "Direct internal work allowed; legal/money stopped.",
    reportPath: "reports/operator/al-kawn-operator-controlled-activation.md",
    testPath: "tests/regression/al-kawn-operator-controlled-activation.spec.ts",
    infinityToZeroExplanation: "∞ internal service -> work queue -> Product Truth verdict -> report -> 0 next action.",
    nextAction: "Use Operator only for internal reports, audits, and validation planning.",
  },
  {
    id: "rights_ownership",
    arabicLabel: "الحقوق والملكية",
    englishTechnicalLabel: "Rights & Ownership Core",
    ownerLayer: "truth_kernel_protection",
    reasonForExistence: "Every entity needs source evidence before public use.",
    sourceTruth: "Rights ledger, provenance registry, and public-use gate.",
    status: "protected",
    productTruthImpact: "Blocks ownership claims without legal review.",
    rightsStatus: "Evidence ledger created; public brand adoption remains review-gated.",
    protectionStatus: "Unknown-source items blocked from public use.",
    executionVerdict: "Prepare evidence internally; stop legal claims for Ahmad.",
    reportPath: "reports/al-kawn-rights-ownership-core.md",
    testPath: "tests/regression/al-kawn-rights-ownership-core.spec.ts",
    infinityToZeroExplanation: "∞ ownership truth -> provenance -> ledger -> gate -> 0 allowed/private use.",
    nextAction: "Keep rights evidence updated before any public use decision.",
  },
  {
    id: "capability_matrix",
    arabicLabel: "مصفوفة القدرات",
    englishTechnicalLabel: "Complete Electronic Capability Matrix",
    ownerLayer: "human_operating_surface",
    reasonForExistence: "Shows what الكون can do internally, prepare only, stop, or block.",
    sourceTruth: "Capability matrix server registry.",
    status: "active_private",
    productTruthImpact: "Makes capability boundaries visible.",
    rightsStatus: "Internal documentation and source registry.",
    protectionStatus: "Legal, money, broker, external, and public actions blocked.",
    executionVerdict: "Capability verdict required before action.",
    reportPath: "reports/al-kawn-complete-electronic-capabilities.md",
    testPath: "tests/regression/al-kawn-complete-electronic-capabilities.spec.ts",
    infinityToZeroExplanation: "∞ possible capability -> category -> verdict -> UI card -> 0 next action.",
    nextAction: "Use the capability verdict before automatic or operator work.",
  },
  {
    id: "local_day_one_boot_gate",
    arabicLabel: "Local Day One",
    englishTechnicalLabel: "Ready but not started boot gate",
    ownerLayer: "local_day_one",
    reasonForExistence: "Final private start decision belongs to Ahmad.",
    sourceTruth: "Local Day One readiness module and report.",
    status: "ready_not_started",
    productTruthImpact: "Prevents automatic start, public launch, money, broker, and legal claims.",
    rightsStatus: "Private local operating gate.",
    protectionStatus: "Ahmad manual start required.",
    executionVerdict: "Needs Ahmad decision.",
    reportPath: "reports/local-day-one/al-kawn-local-day-one-readiness.md",
    testPath: "tests/regression/al-kawn-local-day-one-boot-gate.spec.ts",
    infinityToZeroExplanation: "∞ readiness -> checklist -> boot gate -> Ahmad decision -> 0 not started.",
    nextAction: "Ahmad reviews /desktop/kawn and decides whether to start Local Day One.",
  },
];

export function getTotalExistenceLayerTree() {
  return LAYERS;
}

export function getTotalExistenceEntityRegistry() {
  return ENTITY_REGISTRY;
}

export function getTotalExistenceTruth() {
  return [
    "Every file family, route, component, report, doc, test, capability, decision, memory, protection layer, and project layer belongs to الكون through an owner layer.",
    "Every real source is labeled, and every simulation remains labeled.",
    "Product Truth overrides total existence claims.",
  ];
}

export function getTotalExistenceMissingItems() {
  return [] as string[];
}

export function getTotalExistenceNextAction() {
  return "Ahmad reviews /desktop/kawn and decides whether to start Local Day One.";
}

export function getAlKawnTotalExistenceSystem(): AlKawnTotalExistenceSystem {
  return {
    id: "al_kawn_total_existence_system",
    title: "Al-Kawn A-Z Total Existence Completion",
    definition: "الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص.",
    status: "closed_total_existence_mapped",
    globalWording: GLOBAL_WORDING,
    layerTree: getTotalExistenceLayerTree(),
    entityRegistry: getTotalExistenceEntityRegistry(),
    missingItems: getTotalExistenceMissingItems(),
    truth: getTotalExistenceTruth(),
    nextAction: getTotalExistenceNextAction(),
  };
}

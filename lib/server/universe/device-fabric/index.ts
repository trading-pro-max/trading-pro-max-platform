import "server-only";

export type DeviceFabricGateState =
  | "defined"
  | "protected"
  | "blocked"
  | "future_gate"
  | "needs_ahmad_decision";

export type DeviceFabricLayer = {
  id: string;
  order: number;
  title: string;
  arabicTitle: string;
  meaning: string;
  state: DeviceFabricGateState;
  boundaries: string[];
};

export type DeviceFabricGate = {
  id: string;
  title: string;
  state: DeviceFabricGateState;
  rule: string;
  requiredBeforeExecution: string[];
  blockedActions: string[];
};

export type AlKawnDeviceUniverseFabric = {
  id: "al_kawn_device_universe_fabric";
  title: "Personal Device Universe Fabric";
  definition: string;
  requiredWording: string[];
  layers: DeviceFabricLayer[];
  ahmadPersonalDeviceDomain: DeviceFabricLayer;
  commandWorkspaceDomain: DeviceFabricLayer;
  activeRepoDomain: DeviceFabricLayer;
  intakeGate: DeviceFabricGate;
  classificationGate: DeviceFabricGate;
  protectionGate: DeviceFabricGate;
  nextAction: string;
};

const REQUIRED_WORDING = [
  "الكون يبقى داخل أجهزة أحمد الشخصية فقط.",
  "الاستخدام شخصي لأحمد فقط.",
  "الكون لا يبدأ من مجلد؛ الكون يبدأ من جهاز أحمد الشخصي.",
  "لابتوب أحمد هو نطاق الكون المحلي.",
  "AL-KAWN هو مركز قيادة داخل نطاق الجهاز.",
  "كل مشروع داخل الكون له مجلد كامل مستقل.",
  "كل المشاريع تعمل معًا عبر Al-Kawn Core.",
  "الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.",
  "لا حذف قبل الجرد والتصنيف.",
  "لا نقل للريبو النشط قبل تقرير migration.",
  "Product Truth يحكم كل شيء.",
] as const;

const DEVICE_FABRIC_LAYERS: DeviceFabricLayer[] = [
  {
    id: "ahmad_absolute_origin",
    order: 0,
    title: "Ahmad Absolute Origin",
    arabicTitle: "أحمد هو الأصل",
    meaning:
      "Ahmad is the only owner, decision source, and final authority for real money, legal approval, external exposure, and Local Day One.",
    state: "protected",
    boundaries: [
      "Legal claims stop for Ahmad.",
      "Real money stops for Ahmad.",
      "Outside-world exposure stops for Ahmad.",
    ],
  },
  {
    id: "ahmad_personal_devices",
    order: 1,
    title: "Ahmad Personal Devices",
    arabicTitle: "أجهزة أحمد الشخصية",
    meaning: "الكون يبقى داخل أجهزة أحمد الشخصية فقط.",
    state: "protected",
    boundaries: [
      "الاستخدام شخصي لأحمد فقط.",
      "No public users.",
      "No customers.",
      "No public cloud scope.",
    ],
  },
  {
    id: "personal_device_universe_fabric",
    order: 2,
    title: "Personal Device Universe Fabric",
    arabicTitle: "نسيج الكون المحلي داخل الجهاز",
    meaning: "الكون لا يبدأ من مجلد؛ الكون يبدأ من جهاز أحمد الشخصي.",
    state: "defined",
    boundaries: [
      "لابتوب أحمد هو نطاق الكون المحلي.",
      "Anything outside the active repo requires inventory before use.",
      "This model does not inspect private folders outside the repo.",
    ],
  },
  {
    id: "al_kawn_command_workspace",
    order: 3,
    title: "AL-KAWN Command Workspace",
    arabicTitle: "مركز قيادة AL-KAWN",
    meaning: "AL-KAWN هو مركز قيادة داخل نطاق الجهاز.",
    state: "defined",
    boundaries: [
      "AL-KAWN is the command workspace, not the whole universe.",
      "The active repo remains unchanged.",
      "Workspace setup remains a manual Ahmad decision.",
    ],
  },
  {
    id: "active_source_repo",
    order: 4,
    title: "Active Source Repo",
    arabicTitle: "الريبو النشط",
    meaning:
      "The current repository stays in place until a migration report exists and Ahmad approves.",
    state: "protected",
    boundaries: [
      "لا نقل للريبو النشط قبل تقرير migration.",
      "No active repo rename.",
      "No active repo relocation.",
    ],
  },
  {
    id: "worlds_private_rights_reports_inbox_legacy",
    order: 5,
    title: "Worlds / Private / Rights / Reports / Inbox / Legacy",
    arabicTitle: "العوالم والخاص والحقوق والتقارير والوارد والقديم",
    meaning:
      "Future folder families are ordered by purpose and must pass gates before execution.",
    state: "future_gate",
    boundaries: [
      "No-delete / no-move / no-chaos.",
      "Legacy items remain until inventory and classification.",
      "Rights and Product Truth decide public use.",
    ],
  },
];

export function getAhmadPersonalDeviceDomain(): DeviceFabricLayer {
  return DEVICE_FABRIC_LAYERS[1];
}

export function getAlKawnCommandWorkspaceDomain(): DeviceFabricLayer {
  return DEVICE_FABRIC_LAYERS[3];
}

export function getActiveRepoDomain(): DeviceFabricLayer {
  return DEVICE_FABRIC_LAYERS[4];
}

export function getDeviceIntakeGate(): DeviceFabricGate {
  return {
    id: "device_intake_gate",
    title: "Device Intake Gate",
    state: "protected",
    rule: "Anything outside the active repo must pass Inventory before use.",
    requiredBeforeExecution: [
      "Inventory",
      "Classification",
      "Protection",
      "Product Truth",
      "Rights",
      "Execution Verdict",
    ],
    blockedActions: [
      "Private folder inspection without Ahmad approval.",
      "Active repo relocation.",
      "Deleting before inventory.",
      "Unknown-source public use.",
    ],
  };
}

export function getDeviceClassificationGate(): DeviceFabricGate {
  return {
    id: "device_classification_gate",
    title: "Device Classification Gate",
    state: "defined",
    rule: "Every incoming file, folder, route, report, world, or asset receives a layer classification before execution.",
    requiredBeforeExecution: [
      "Layer classification",
      "Privacy classification",
      "Rights classification",
      "Product Truth classification",
    ],
    blockedActions: [
      "Random imports across worlds.",
      "Treating Pro Max as root.",
      "Treating Trading as root.",
      "Treating ALKON as the whole universe.",
    ],
  };
}

export function getDeviceProtectionGate(): DeviceFabricGate {
  return {
    id: "device_protection_gate",
    title: "Device Protection Gate",
    state: "protected",
    rule: "Product Truth, privacy, rights evidence, and kernel verdict must be checked before any action leaves the private device context.",
    requiredBeforeExecution: [
      "Product Truth verdict",
      "Secret exposure check",
      "Rights evidence",
      "Kernel verdict",
      "Ahmad decision when external, legal, or money-related",
    ],
    blockedActions: [
      "Public الكون.",
      "Public ALKON.",
      "Billing, payments, receiving money, withdrawals, bank transfers, real money, or broker execution.",
      "Legal, FINMA, licensed, or regulated claims.",
      "Secret exposure through Git or bundle.",
    ],
  };
}

export function getDeviceFabricNextAction() {
  return "Ahmad reviews the root order, then may run the workspace setup script manually.";
}

export function getAlKawnDeviceUniverseFabric(): AlKawnDeviceUniverseFabric {
  return {
    id: "al_kawn_device_universe_fabric",
    title: "Personal Device Universe Fabric",
    definition:
      "الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص، داخل نظام واحد.",
    requiredWording: [...REQUIRED_WORDING],
    layers: DEVICE_FABRIC_LAYERS,
    ahmadPersonalDeviceDomain: getAhmadPersonalDeviceDomain(),
    commandWorkspaceDomain: getAlKawnCommandWorkspaceDomain(),
    activeRepoDomain: getActiveRepoDomain(),
    intakeGate: getDeviceIntakeGate(),
    classificationGate: getDeviceClassificationGate(),
    protectionGate: getDeviceProtectionGate(),
    nextAction: getDeviceFabricNextAction(),
  };
}

import "server-only";

export type ExecutableGlossaryStatus =
  | "executable_internal"
  | "prepare_only"
  | "protected"
  | "future_gate"
  | "blocked";

export type ExecutableGlossaryTerm = {
  id: string;
  term: string;
  layer: string;
  definition: string;
  executableCapability: string;
  executionStatus: ExecutableGlossaryStatus;
  directInternalAction: string;
  stopGate: "none" | "legal" | "money" | "product_truth" | "security";
  productTruthImpact: string;
  nextAction: string;
};

const TERMS = [
  ["al_kawn", "الكون", "root", "Private electronic universe containing everything inside Ahmad's private electronic world.", "total existence registry"],
  ["product_truth", "Product Truth", "law", "Highest truth law.", "truth verdict"],
  ["universe_operating_kernel", "Universe Operating Kernel", "law", "Execution judge.", "kernel verdict"],
  ["existence_contract", "Existence Contract", "ontology", "Reason why an entity exists.", "entity belonging"],
  ["rights_ownership_core", "Rights & Ownership Core", "rights", "Ownership and source evidence.", "rights ledger"],
  ["ahmad_digital_vault", "Ahmad Digital Vault", "protection", "Private vault concept and boundary.", "vault protection"],
  ["protection_core", "Protection Core", "protection", "Secret, public, and unsafe-action protection.", "protection verdict"],
  ["universe_one", "Universe One", "reality", "Private reality source layer.", "reality sync"],
  ["wake_state", "Wake State", "daily", "Daily private wake status.", "wake report"],
  ["daily_work_loop", "Daily Work Loop", "daily", "Daily internal work cycle.", "daily selected work"],
  ["human_spoken_interface", "Human Spoken Interface", "interface", "Arabic-first human briefing.", "spoken briefing"],
  ["internal_builder_mode", "Internal Builder Mode", "automation", "Safe internal build preparation.", "task preparation"],
  ["automatic_internal_engine", "Automatic Internal Engine", "automation", "Trigger-based one-work-item internal cycle.", "safe cycle"],
  ["infinity_mode", "Infinity Mode", "automation", "Private continuous readiness model.", "controlled internal cycle"],
  ["operator_mode", "Operator Mode", "automation", "الكون يعمل عن أحمد داخليًا.", "safe internal work execution"],
  ["execution_law", "Execution Law", "law", "Direct, stop, or block rules.", "execution classification"],
  ["execution_court", "Execution Court", "law", "Verdict surface for actions.", "decision record"],
  ["causal_execution", "Causal Execution", "law", "Cause and consequence explanation.", "cause trace"],
  ["action_passport", "Action Passport", "law", "Action metadata before execution.", "action proof"],
  ["legal_gate", "Legal Gate", "gate", "Stops legal matters for Ahmad.", "legal stop"],
  ["money_gate", "Money Gate", "gate", "Stops money matters for Ahmad.", "money stop"],
  ["product_truth_block", "Product Truth Block", "gate", "Blocks false or unsafe action.", "truth block"],
  ["secret_exposure_block", "Secret Exposure Block", "gate", "Blocks secret exposure.", "security block"],
  ["pro_max_galaxy", "Pro Max Galaxy", "product", "Future public product galaxy inside الكون.", "product map"],
  ["earth_planet", "Earth Planet", "product", "Trading project inside Pro Max Galaxy.", "trading readiness"],
  ["trading_route", "/trading", "product", "Trading surface on Earth Planet.", "demo-safe trading UI"],
  ["alkon_background_guardian", "ALKON Background Guardian", "protection", "Private background guardian.", "private guard status"],
  ["desktop_operating_environment", "Desktop Operating Environment", "interface", "Main private command client.", "desktop command"],
  ["control_surfaces", "Control Surfaces", "interface", "Layer-specific control panels.", "surface control"],
  ["digital_miracles", "Digital Miracles", "automation", "Private electronic capabilities that feel magical but stay truthful.", "safe internal transformation"],
] as const;

function makeTerm([id, term, layer, definition, capability]: (typeof TERMS)[number]): ExecutableGlossaryTerm {
  const gate = id.includes("legal")
    ? "legal"
    : id.includes("money")
      ? "money"
      : id.includes("secret")
        ? "security"
        : id.includes("block")
          ? "product_truth"
          : "none";

  return {
    id,
    term,
    layer,
    definition,
    executableCapability: capability,
    executionStatus: gate === "none" ? "executable_internal" : "protected",
    directInternalAction:
      gate === "none"
        ? "Convert term into private internal status, report, or next-action output."
        : "Prepare explanation only; do not execute the stopped action.",
    stopGate: gate,
    productTruthImpact:
      "كل مصطلح داخل الكون يجب أن يكون قابلًا للتنفيذ. داخل الكون: المصطلح يتحول إلى قدرة.",
    nextAction: "Expose the term through /desktop/kawn as a private executable capability.",
  };
}

const GLOSSARY = TERMS.map(makeTerm);

export function getAlKawnExecutableGlossary() {
  return {
    title: "Executable Glossary",
    requiredWording: [
      "كل مصطلح داخل الكون يجب أن يكون قابلًا للتنفيذ.",
      "داخل الكون: المصطلح يتحول إلى قدرة.",
    ],
    terms: GLOSSARY,
    total: GLOSSARY.length,
    nextAction: getTermNextAction(),
  };
}

export function getExecutableGlossaryTerm(termId: string) {
  return GLOSSARY.find((term) => term.id === termId) ?? null;
}

export function getTermsByLayer(layer?: string) {
  if (!layer) {
    return GLOSSARY.reduce<Record<string, ExecutableGlossaryTerm[]>>((groups, term) => {
      groups[term.layer] ??= [];
      groups[term.layer].push(term);
      return groups;
    }, {});
  }

  return GLOSSARY.filter((term) => term.layer === layer);
}

export function getTermsByExecutionStatus(status?: ExecutableGlossaryStatus) {
  if (!status) {
    return GLOSSARY.reduce<Record<string, ExecutableGlossaryTerm[]>>((groups, term) => {
      groups[term.executionStatus] ??= [];
      groups[term.executionStatus].push(term);
      return groups;
    }, {});
  }

  return GLOSSARY.filter((term) => term.executionStatus === status);
}

export function getTermCapabilityMap() {
  return GLOSSARY.map((term) => ({
    termId: term.id,
    term: term.term,
    capability: term.executableCapability,
    status: term.executionStatus,
  }));
}

export function getTermNextAction() {
  return "Keep every Al-Kawn term mapped to a capability, status, gate, and Product Truth verdict.";
}

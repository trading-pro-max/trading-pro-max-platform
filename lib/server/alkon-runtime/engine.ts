import { assignAlkonRuntimeCivilization } from "./civilization-layer";
import { evaluateAlkonRuntimeCommunication } from "./communication-layer";
import { evaluateAlkonRuntimeConsequence } from "./consequence-layer";
import { evaluateAlkonRuntimeDefense } from "./defense-layer";
import { evaluateAlkonRuntimeEconomy } from "./economy-layer";
import { assignAlkonRuntimeGravity } from "./gravity-layer";
import { decideAlkonRuntimeLaw } from "./law-layer";
import { assignAlkonRuntimeLife } from "./life-layer";
import { createAlkonRuntimeMemory } from "./memory-layer";
import { decideAlkonRuntimeNextFate } from "./next-fate";
import { routeAlkonRuntimeOrbit } from "./orbit-layer";
import { decideAlkonRealityAdmission } from "./reality-layer";
import { assignAlkonRuntimeSpace } from "./space-layer";
import { assignAlkonRuntimeTime } from "./time-layer";
import type {
  AlkonRuntimeBirth,
  AlkonRuntimeIdentity,
  AlkonRuntimeInput,
  AlkonRuntimeMeaning,
  AlkonRuntimeReport,
  AlkonRuntimeWorld,
} from "./types";

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 64);
}

function initialWorld(input: AlkonRuntimeInput): AlkonRuntimeWorld {
  if (
    input.category === "invoice" ||
    input.category === "treasury_event" ||
    input.category === "tax_event" ||
    input.category === "security_risk" ||
    input.category === "secret_risk" ||
    input.category === "media_message" ||
    input.category === "claim_risk" ||
    input.category === "codex_result"
  ) {
    return "private_alkon";
  }

  if (input.category === "validation_result" || input.category === "build_result") {
    return "invisible_operating_layer";
  }

  return input.affectedWorld ?? "public_earth";
}

function createBirth(input: AlkonRuntimeInput): AlkonRuntimeBirth {
  const sensitiveFlags = [
    input.requiresSecrets ? "requires_secrets" : null,
    input.containsBankCardData ? "bank_card_data" : null,
    input.requestsPaymentExecution ? "payment_execution" : null,
    input.publicVisible && input.description.toLowerCase().includes("alkon")
      ? "public_alkon_risk"
      : null,
  ].filter((value): value is string => Boolean(value));

  return {
    runtimeEntityId:
      input.inputId ?? `runtime_${input.category}_${slug(input.title) || "entity"}`,
    name: input.title,
    category: input.category,
    reasonBorn: input.description,
    sourceText: input.claimText ?? input.description,
    initialWorld: initialWorld(input),
    publicVisible: input.publicVisible === true,
    sensitiveFlags,
  };
}

function identifyRuntimeEntity(
  birth: AlkonRuntimeBirth,
  input: AlkonRuntimeInput
): AlkonRuntimeIdentity {
  const privateOwner =
    input.category === "invoice" || input.category === "treasury_event"
      ? "Treasury & Tax Ministry"
      : input.category === "media_message" || input.category === "claim_risk"
        ? "Media Reality Ministry"
        : input.category === "security_risk" || input.category === "secret_risk"
          ? "Security Ministry"
          : "Alkon Runtime";

  return {
    runtimeEntityId: birth.runtimeEntityId,
    name: birth.name,
    world: birth.initialWorld,
    surface: input.affectedSurface ?? "Private Runtime Intake",
    ownerArea: birth.initialWorld === "public_earth" ? "Public Earth World" : privateOwner,
    ownerWorker: "Alkon runtime classifier",
    reportTarget: "Founder Command private runtime report",
    publicVisible: false,
    founderVisible: true,
  };
}

function createMeaning(
  birth: AlkonRuntimeBirth,
  identity: AlkonRuntimeIdentity
): AlkonRuntimeMeaning {
  return {
    runtimeEntityId: birth.runtimeEntityId,
    meaning:
      "Runtime gives the input place, time, law, gravity, orbit, owner, proof, reality admission, consequence, memory, and fate.",
    userImpact:
      identity.world === "public_earth"
        ? "Can improve clarity, trust, support, workspace comfort, or public product truth."
        : "No direct public user exposure; may protect public users from unsafe internal action.",
    founderImpact:
      "Gives Ahmad a private decision report instead of uncontrolled automation.",
    riskContext: birth.sensitiveFlags.length
      ? `Sensitive flags: ${birth.sensitiveFlags.join(", ")}.`
      : "No sensitive runtime flags beyond normal Product Truth review.",
    valueCreated:
      "Transforms raw input into governed readiness, proof requirements, and memory.",
  };
}

export const SAMPLE_ALKON_RUNTIME_INPUTS: AlkonRuntimeInput[] = [
  {
    category: "founder_idea",
    title: "Improve first-day Journal and Coach continuity",
    description:
      "Create a safe local readiness task that helps users reflect after paper practice.",
    requestedBy: "founder",
    affectedWorld: "public_earth",
    affectedSurface: "Journal / Coach",
    currentStage: "laptop_planet",
    publicVisible: false,
    hasRollback: true,
  },
  {
    category: "chart_issue",
    title: "Chart feels crowded",
    description: "The workspace chart needs calmer chart-first proof.",
    requestedBy: "founder",
    affectedWorld: "public_earth",
    affectedSurface: "Trading Workspace",
    currentStage: "laptop_planet",
    visualSensitive: true,
    hasRollback: true,
  },
  {
    category: "invoice",
    title: "Review vendor invoice",
    description: "Classify invoice readiness without payment execution.",
    requestedBy: "founder",
    affectedWorld: "private_alkon",
    amount: 120,
    currency: "CHF",
    hasInvoice: true,
    hasBudget: false,
    hasReserve: false,
    hasRollback: true,
  },
  {
    category: "media_message",
    title: "Explain public app status",
    description: "Draft wording for Web current, Desktop planned, Mobile planned.",
    requestedBy: "founder",
    affectedWorld: "private_alkon",
    claimText: "Trading Pro Max Web App is current; Desktop and Mobile are planned.",
    hasRollback: true,
  },
  {
    category: "live_request",
    title: "Activate live execution now",
    description: "Enable live execution and broker feed now.",
    requestedBy: "test",
    affectedWorld: "public_earth",
    requiresSecrets: true,
    hasRollback: false,
  },
];

export function runAlkonRuntime(input: AlkonRuntimeInput): AlkonRuntimeReport {
  const birth = createBirth(input);
  const identity = identifyRuntimeEntity(birth, input);
  const meaning = createMeaning(birth, identity);
  const space = assignAlkonRuntimeSpace(input);
  const time = assignAlkonRuntimeTime(input);
  const law = decideAlkonRuntimeLaw(input);
  const gravity = assignAlkonRuntimeGravity(input, law);
  const orbit = routeAlkonRuntimeOrbit(input, law, gravity);
  const life = assignAlkonRuntimeLife(input, law, orbit);
  const civilization = assignAlkonRuntimeCivilization(orbit);
  const economy = evaluateAlkonRuntimeEconomy(input, law);
  const defense = evaluateAlkonRuntimeDefense(input, law);
  const communication = evaluateAlkonRuntimeCommunication(input, law);
  const reality = decideAlkonRealityAdmission(input, law, economy, defense);
  const consequence = evaluateAlkonRuntimeConsequence(input, law, reality);
  const memory = createAlkonRuntimeMemory(input, orbit);
  const nextFate = decideAlkonRuntimeNextFate(law, gravity, consequence);

  return {
    reportId: `alkon_runtime_report_${birth.runtimeEntityId}`,
    input,
    birth,
    identity,
    meaning,
    space,
    time,
    law,
    gravity,
    orbit,
    life,
    civilization,
    economy,
    defense,
    communication,
    reality,
    consequence,
    memory,
    nextFate,
  };
}

export function runAlkonRuntimeSamples() {
  return SAMPLE_ALKON_RUNTIME_INPUTS.map(runAlkonRuntime);
}

import type {
  AlkonContinuityEntityCategory,
  AlkonContinuityWorld,
  AlkonEntityBirthCandidate,
  AlkonEntityBirthRequest,
} from "./types";

const BLACK_HOLE_PATTERNS = [
  "activate live",
  "live execution",
  "real money",
  "activate billing",
  "activate broker",
  "broker feed",
  "production secrets",
  "publish social",
  "shell execution",
  "raw secret",
  "bank card",
  "card number",
  "cvv",
  "expose alkon",
  "public alkon",
];

function normalizeId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function inferCategory(text: string): AlkonContinuityEntityCategory {
  if (text.includes("chart") || text.includes("workspace")) return "market_surface";
  if (text.includes("mobile") || text.includes("desktop app")) return "app_platform_surface";
  if (text.includes("support")) return "support_surface";
  if (text.includes("academy") || text.includes("learn")) return "academy_surface";
  if (text.includes("pay") || text.includes("invoice") || text.includes("treasury")) return "treasury_system";
  if (text.includes("media") || text.includes("claim") || text.includes("ad")) return "media_system";
  if (text.includes("security") || text.includes("secret")) return "security_system";
  if (text.includes("cleanup") || text.includes("remove") || text.includes("duplicate")) return "cleanup_candidate";
  if (text.includes("assistant")) return "assistant_intent";
  if (text.includes("image") || text.includes("memory")) return "memory_lesson";
  return "feature";
}

function inferWorld(
  category: AlkonContinuityEntityCategory,
  request: AlkonEntityBirthRequest
): AlkonContinuityWorld {
  if (request.worldHint) return request.worldHint;
  if (
    category === "alkon_subsystem" ||
    category === "treasury_system" ||
    category === "media_system" ||
    category === "security_system" ||
    category === "codex_task" ||
    category === "cleanup_candidate"
  ) {
    return "private_alkon";
  }
  if (category === "memory_lesson" || category === "test") {
    return "invisible_operating_layer";
  }
  return "public_earth";
}

function inferName(text: string, category: AlkonContinuityEntityCategory) {
  if (text.includes("chart")) return "Living Market Core improvement";
  if (text.includes("mobile")) return "Apps and Platforms device truth";
  if (text.includes("image")) return "No images memory guard";
  if (text.includes("vanity") || text.includes("hype") || text.includes("random")) {
    return "Vanity hype continuity candidate";
  }
  if (text.includes("pay") || text.includes("invoice")) return "Treasury payment draft readiness";
  if (text.includes("live")) return "Live execution activation request";
  if (text.includes("duplicate")) return "Duplicate surface cleanup candidate";
  if (text.includes("support")) return "Support path continuity improvement";
  return `${category.replace(/_/g, " ")} continuity candidate`;
}

export function createAlkonEntityBirthCandidate(
  request: AlkonEntityBirthRequest
): AlkonEntityBirthCandidate {
  const text = request.text.toLowerCase();
  const blackHole = BLACK_HOLE_PATTERNS.some((pattern) => text.includes(pattern));
  const imageWithoutApproval =
    (request.requestsImageGeneration || text.includes("generate image") || text.includes("png")) &&
    !request.explicitImageApproval;
  const category = request.categoryHint ?? inferCategory(text);
  const world = inferWorld(category, request);
  const proposedName = inferName(text, category);
  const sensitiveFlags = [
    blackHole ? "dangerous_activation_or_secret_request" : "",
    imageWithoutApproval ? "image_generation_without_explicit_approval" : "",
    request.requiresSecrets ? "secrets_requested" : "",
    request.requestsDeletion ? "removal_requested" : "",
  ].filter(Boolean);

  return {
    candidateId: `birth_${normalizeId(proposedName || request.text)}`,
    proposedName,
    category,
    world,
    source: request.source,
    reasonProposed:
      request.source === "cleanup_candidate"
        ? "Existing surface may be duplicate, stale, risky, or cluttered."
        : "A new product need, gap, lesson, or Founder signal requires continuity review.",
    serves:
      world === "public_earth"
        ? ["public user clarity", "Product Truth", "Earth product usefulness"]
        : world === "private_alkon"
          ? ["Founder command", "private safety", "operating continuity"]
          : ["invisible protection", "memory", "validation"],
    timing: blackHole || imageWithoutApproval ? "blocked" : text.includes("future") ? "future" : "now",
    publicVisible: world === "public_earth" && request.publicVisible !== false,
    memoryApplied: [
      "No generated images or raster assets unless explicitly requested.",
      "No fake activation, fake downloads, fake users, fake revenue, or fake legal/certification claims.",
      "Alkon, Founder Command, Product Memory internals, Codex tasks, and lifecycle governance remain private.",
      "Chart is king; public workspace must stay clean and single-shell.",
    ],
    sensitiveFlags,
  };
}

export const SAMPLE_CONTINUITY_BIRTH_REQUESTS: AlkonEntityBirthRequest[] = [
  {
    source: "visual_rejection",
    text: "The chart is annoying and needs a calmer chart-first workspace improvement.",
    requestedBy: "founder",
    surface: "Trading Workspace",
    currentStage: "laptop_planet",
  },
  {
    source: "founder_idea",
    text: "No images should be generated unless explicitly requested.",
    requestedBy: "founder",
    worldHint: "invisible_operating_layer",
    categoryHint: "memory_lesson",
  },
  {
    source: "user_confusion",
    text: "Where is the mobile app and desktop app?",
    requestedBy: "system",
    surface: "Apps / Platforms",
  },
  {
    source: "treasury_need",
    text: "Pay a vendor invoice after review.",
    requestedBy: "founder",
    worldHint: "private_alkon",
    categoryHint: "treasury_system",
    hasDependencyMap: true,
  },
  {
    source: "founder_idea",
    text: "Activate live execution now.",
    requestedBy: "founder",
    surface: "Trading Workspace",
  },
];

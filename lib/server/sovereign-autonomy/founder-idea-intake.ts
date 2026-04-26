import "server-only";

import { classifyFounderIdeaEvent } from "./event-classifier";
import type {
  FounderIdea,
  FounderIdeaInput,
  SovereignAffectedWorld,
} from "./types";

const SECRET_PATTERN =
  /(api[_-]?key|secret|token|password|sk-[a-z0-9_-]{12,}|ghp_[a-z0-9_]{12,}|akia[0-9a-z]{12,})/i;

function stableId(prefix: string, value: string, createdAt: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 36);

  return `${prefix}_${slug || "idea"}_${createdAt.replace(/\D/g, "").slice(0, 14)}`;
}

function cleanText(value: string, maxLength = 1200) {
  return value.replace(/[\r\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function summarize(rawIdea: string, fallbackTitle: string) {
  const cleaned = cleanText(rawIdea, 240);
  return cleaned || fallbackTitle;
}

function defaultAffectedWorld(input: FounderIdeaInput): SovereignAffectedWorld {
  const haystack = `${input.title} ${input.rawIdea} ${input.affectedSurface ?? ""}`.toLowerCase();

  if (
    haystack.includes("codex") ||
    haystack.includes("founder") ||
    haystack.includes("command")
  ) {
    return "private_founder_world";
  }

  if (
    haystack.includes("billing") ||
    haystack.includes("broker") ||
    haystack.includes("live") ||
    haystack.includes("secret") ||
    haystack.includes("launch")
  ) {
    return "invisible_operating_layer";
  }

  return "public_user_world";
}

function defaultCategory(input: FounderIdeaInput) {
  const haystack = `${input.title} ${input.rawIdea}`.toLowerCase();
  if (haystack.includes("logo") || haystack.includes("الشعار")) return "brand_identity";
  if (haystack.includes("chart") || haystack.includes("الشارت")) return "workstation";
  if (haystack.includes("mobile") || haystack.includes("platform")) return "apps_platforms";
  if (haystack.includes("billing")) return "billing_blocked";
  if (haystack.includes("codex")) return "codex_governance";
  return "general_product_gap";
}

export function containsSensitiveIdeaData(input: FounderIdeaInput) {
  return SECRET_PATTERN.test(`${input.title} ${input.rawIdea} ${input.summary ?? ""}`);
}

export function intakeFounderIdea(
  input: FounderIdeaInput,
  checkedAt = new Date().toISOString()
) {
  if (containsSensitiveIdeaData(input)) {
    const idea: FounderIdea = {
      ideaId: input.ideaId ?? stableId("idea_quarantined", input.title, checkedAt),
      title: cleanText(input.title, 120),
      rawIdea: "[redacted sensitive founder idea]",
      summary:
        "Sensitive data was detected and redacted. The system only creates a secrets-risk event.",
      source: input.source ?? "founder_manual",
      affectedWorld: "invisible_operating_layer",
      affectedSurface: "secrets_authority",
      suspectedCategory: "secrets_risk",
      urgency: "critical",
      founderIntent: "Protect sensitive material and route to Secrets Authority.",
      createdAt: input.createdAt ?? checkedAt,
    };

    return {
      idea,
      event: classifyFounderIdeaEvent(idea, checkedAt),
      sensitiveDataRejected: true,
      storage: "stateless_no_persistence" as const,
    };
  }

  const createdAt = input.createdAt ?? checkedAt;
  const idea: FounderIdea = {
    ideaId: input.ideaId ?? stableId("idea", input.title, createdAt),
    title: cleanText(input.title, 120),
    rawIdea: cleanText(input.rawIdea),
    summary: cleanText(input.summary ?? summarize(input.rawIdea, input.title), 280),
    source: input.source ?? "founder_manual",
    affectedWorld: input.affectedWorld ?? defaultAffectedWorld(input),
    affectedSurface: cleanText(input.affectedSurface ?? defaultCategory(input), 80),
    suspectedCategory: cleanText(input.suspectedCategory ?? defaultCategory(input), 80),
    urgency: input.urgency ?? "medium",
    founderIntent: cleanText(
      input.founderIntent ?? "Convert Founder input into a governed safe next action.",
      180
    ),
    createdAt,
  };

  return {
    idea,
    event: classifyFounderIdeaEvent(idea, checkedAt),
    sensitiveDataRejected: false,
    storage: "stateless_no_persistence" as const,
  };
}

export function getFounderIdeaIntakeSamples(
  checkedAt = new Date().toISOString()
) {
  return [
    intakeFounderIdea(
      {
        title: "Logo does not feel right",
        rawIdea: "الشعار لا يعجبني",
        source: "visual_feedback",
        affectedSurface: "brand_identity",
        suspectedCategory: "logo",
        founderIntent: "Improve brand identity after Founder review.",
      },
      checkedAt
    ),
    intakeFounderIdea(
      {
        title: "Chart feels annoying",
        rawIdea: "الشارت مزعج",
        source: "visual_feedback",
        affectedSurface: "workstation",
        suspectedCategory: "chart",
      },
      checkedAt
    ),
    intakeFounderIdea(
      {
        title: "Where is the mobile app?",
        rawIdea: "أين تطبيق الموبايل؟",
        source: "product_gap",
        affectedSurface: "apps_platforms",
        suspectedCategory: "apps_platforms",
      },
      checkedAt
    ),
    intakeFounderIdea(
      {
        title: "No images preference",
        rawIdea: "لا أريد صور",
        source: "founder_manual",
        affectedWorld: "private_founder_world",
        affectedSurface: "identity_memory",
        suspectedCategory: "founder_preference",
        founderIntent: "Remember no raster/image generation preference.",
      },
      checkedAt
    ),
    intakeFounderIdea(
      {
        title: "I want Codex to execute",
        rawIdea: "أريد Codex ينفذ",
        source: "founder_manual",
        affectedWorld: "private_founder_world",
        affectedSurface: "codex_governance",
        suspectedCategory: "construction_task_needed",
      },
      checkedAt
    ),
    intakeFounderIdea(
      {
        title: "I want billing",
        rawIdea: "أريد billing",
        source: "founder_manual",
        affectedSurface: "billing_blocked",
        suspectedCategory: "blocked_real_world_activation",
        urgency: "critical",
      },
      checkedAt
    ),
  ];
}

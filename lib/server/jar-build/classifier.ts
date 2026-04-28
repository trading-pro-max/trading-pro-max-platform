import type { JarBuildItem, JarDecision, JarId, JarItemSource } from "./types";

type JarInput = {
  id?: string;
  title: string;
  summary?: string;
  source?: JarItemSource;
};

function normalize(input: string) {
  return input.trim().toLowerCase();
}

function buildId(title: string, jarId: JarId) {
  const slug = normalize(title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${jarId}_${slug.slice(0, 48) || "item"}`;
}

function selectJar(text: string): { jarId: JarId; decision: JarDecision; priority: number; reason: string } {
  if (/secret|password|bank|card|cvv|private key|token|live trading|real money|billing|broker|feed activation|production launch|expose alkon publicly|run shell|run codex/i.test(text)) {
    return {
      jarId: "jar_0_black_hole",
      decision: "black_hole",
      priority: 100,
      reason: "Unsafe or sensitive content must be contained before any action.",
    };
  }

  if (/broken|p0|route|build fail|public leak|product truth|blocking/i.test(text)) {
    return {
      jarId: "jar_1_p0_reality",
      decision: "validate_only",
      priority: 95,
      reason: "Reality-breaking items go first and require validation proof.",
    };
  }

  if (/trading|chart|execution|heart|cockpit|workspace/i.test(text)) {
    return {
      jarId: "jar_2_heart",
      decision: "prepare_command",
      priority: 85,
      reason: "The current heart is Pro Max Trading and must be protected.",
    };
  }

  if (/comfort|confusion|support|learn|assistant|journal|coach|user/i.test(text)) {
    return {
      jarId: "jar_3_user_comfort",
      decision: "prepare_command",
      priority: 70,
      reason: "User comfort improves the public world without unsafe activation.",
    };
  }

  if (/trust|claim|legal|treasury|diagnostics|regulated|profit|win-rate/i.test(text)) {
    return {
      jarId: "jar_4_public_trust",
      decision: "validate_only",
      priority: 80,
      reason: "Public trust items require claim and Product Truth review.",
    };
  }

  if (/alkon|founder|kernel|zero truth|reality trial|command passport|private/i.test(text)) {
    return {
      jarId: "jar_5_private_alkon",
      decision: "prepare_command",
      priority: 75,
      reason: "Private Alkon work stays Founder-only and no-execution.",
    };
  }

  if (/cleanup|folder|file|css|archive|desktop|unknown|move|delete/i.test(text)) {
    return {
      jarId: "jar_6_cleanup",
      decision: "ask_ahmad",
      priority: 65,
      reason: "Cleanup needs evidence and must not delete uncertain files.",
    };
  }

  if (/test|evidence|screenshot|report|validation|proof/i.test(text)) {
    return {
      jarId: "jar_7_evidence",
      decision: "validate_only",
      priority: 60,
      reason: "Evidence closes the loop and proves reality.",
    };
  }

  if (/future|world|academy|apps|media|intelligence|expansion/i.test(text)) {
    return {
      jarId: "jar_8_future_worlds",
      decision: "delay",
      priority: 35,
      reason: "Future worlds wait until the current heart is stable.",
    };
  }

  if (/ahmad|accept|reject|decision|approval/i.test(text)) {
    return {
      jarId: "jar_9_founder_decision",
      decision: "ask_ahmad",
      priority: 90,
      reason: "Ahmad is final authority.",
    };
  }

  return {
    jarId: "jar_9_founder_decision",
    decision: "ask_ahmad",
    priority: 50,
    reason: "Unknown ownership requires Ahmad decision before action.",
  };
}

export function classifyJarInput(input: JarInput): JarBuildItem {
  const summary = input.summary ?? input.title;
  const text = `${input.title} ${summary}`;
  const selected = selectJar(text);
  const dangerous = selected.jarId === "jar_0_black_hole";

  return {
    id: input.id ?? buildId(input.title, selected.jarId),
    title: input.title,
    source: input.source ?? "founder_instruction",
    summary,
    jarId: selected.jarId,
    decision: selected.decision,
    priority: selected.priority,
    sensitivity: dangerous ? "dangerous" : selected.jarId === "jar_9_founder_decision" ? "sensitive" : "normal",
    lifecycle: dangerous ? "blocked" : "classified",
    publicExposureAllowed: false,
    reason: selected.reason,
    blockedActions: [
      "no shell execution from web",
      "no Codex execution from web",
      "no billing activation",
      "no live trading",
      "no real money",
      "no broker/feed activation",
      "no production launch",
      "no public Alkon exposure",
    ],
    evidenceRequired: ["Reality Trial note", "Product Truth check", "public/private boundary check"],
    exitPermitRequired: true,
    commandPassportRequired:
      selected.decision === "prepare_command" || selected.decision === "produce_now",
    nextAction: dangerous
      ? "Contain and propose a safe alternative."
      : "Prepare an exit permit preview before any Command Passport.",
  };
}

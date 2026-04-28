import { classifyJarInput } from "./classifier";
import type { JarBuildItem } from "./types";

function delayedGlobalBrandGateItem(): JarBuildItem {
  return {
    id: "jar_item_global_brand_gate_delayed",
    title: "Global Exclusive Brand Gate",
    source: "future_world",
    summary:
      "Brand ownership and final global naming remain important, but ALKON daily operation comes first.",
    jarId: "jar_8_future_worlds",
    decision: "delay",
    priority: 20,
    sensitivity: "normal",
    lifecycle: "delayed",
    publicExposureAllowed: false,
    reason:
      "ALKON operation comes first; global naming belongs to Jar 8 Future / Public Trust and Jar 9 Founder Decision later.",
    blockedActions: [
      "no public brand migration now",
      "no codebase rename now",
      "no trademark ownership claim",
      "no global exclusivity claim",
      "no public launch",
      "no domain purchase from the app",
    ],
    evidenceRequired: [
      "manual trademark search tasks",
      "manual domain review tasks",
      "legal review",
      "Ahmad final approval",
    ],
    exitPermitRequired: true,
    commandPassportRequired: false,
    nextAction:
      "Delay until the current ALKON daily operating loop and Pro Max Trading heart are stable.",
  };
}

export function getJarInboxItems() {
  return [
    delayedGlobalBrandGateItem(),
    classifyJarInput({
      id: "jar_item_route_trading_canonical",
      title: "Make /trading the canonical Pro Max Trading route",
      summary: "/en must stay compatibility only while Home and header point to /trading.",
      source: "founder_instruction",
    }),
    classifyJarInput({
      id: "jar_item_trading_living_core",
      title: "Rebirth Pro Max Trading living cockpit",
      summary: "Chart owns the page, execution attaches to chart, Assistant stays collapsed, Journal is secondary.",
      source: "rejection",
    }),
    classifyJarInput({
      id: "jar_item_desktop_unknown_sorting",
      title: "Classify desktop filesystem order without destructive moves",
      summary: "Desktop sorting issues enter cleanup or Founder Decision jars before any move or delete.",
      source: "desktop_sorting",
    }),
    classifyJarInput({
      id: "jar_item_sensitive_env_files",
      title: "Protect local env files and sensitive artifacts",
      summary: "Secrets, bank/card data, keys, and raw personal documents must never be committed or printed.",
      source: "cleanup_candidate",
    }),
    classifyJarInput({
      id: "jar_item_source_to_reality_docs",
      title: "Document Source to Reality architecture",
      summary: "Ahmad is Source, ALKON is Root, Alkon -0 is Private Origin, Pro Max is Public World.",
      source: "founder_instruction",
    }),
    classifyJarInput({
      id: "jar_item_visual_acceptance_gate",
      title: "Ahmad visual acceptance remains required",
      summary: "Local Day One cannot start until Ahmad accepts the current visual reality.",
      source: "founder_instruction",
    }),
    classifyJarInput({
      id: "jar_item_future_worlds_delay",
      title: "Delay Pro Max future worlds until the current heart is stable",
      summary: "Academy, Apps, Media, Intelligence, and future worlds remain readiness or future surfaces.",
      source: "future_world",
    }),
    classifyJarInput({
      id: "jar_item_evidence_closure",
      title: "Capture validation and screenshots before closure",
      summary: "No closure without tests, route smoke, reports, and visual proof.",
      source: "evidence",
    }),
  ];
}

import "server-only";

import { getAlKawnAutomaticEngineState } from "../automatic-engine";
import { getAlKawnDailyWorkLoop } from "../daily-work-loop";
import { getAlKawnDesktopState } from "../desktop-interface";
import { getAlKawnElectronicCapabilities } from "../electronic-capabilities";
import { getInfinityControlledActivation } from "../infinity";
import { getAlKawnLivingOntology } from "../living-ontology";
import { getLocalDesktopAuthStatus } from "../local-desktop-auth";
import { getOperatorControlledActivation } from "../operator";
import { getAlKawnOwnershipRegistry } from "../rights-ownership";
import { getAlKawnTotalExistenceSystem } from "../total-existence";
import { getAlKawnWakeState } from "../wake-state";
import type { AwarenessItem } from "./types";

export function getAlKawnAwarenessModel(): AwarenessItem[] {
  const wake = getAlKawnWakeState();
  const daily = getAlKawnDailyWorkLoop();
  const desktop = getAlKawnDesktopState();
  const localAuth = getLocalDesktopAuthStatus();
  const totalExistence = getAlKawnTotalExistenceSystem();
  const capabilities = getAlKawnElectronicCapabilities();
  const ontology = getAlKawnLivingOntology();
  const automaticEngine = getAlKawnAutomaticEngineState();
  const infinity = getInfinityControlledActivation();
  const operator = getOperatorControlledActivation();
  const rights = getAlKawnOwnershipRegistry();

  return [
    {
      id: "self_state",
      label: "Self state",
      layer: "Wake / Daily / Desktop / Local Auth",
      state: `${wake.state} / ${daily.state} / ${desktop.nativeShell.desktopRoute} / ${localAuth.state}`,
      evidence: "الكون يعرف حالته وطبقاته وقدراته وحدوده.",
    },
    {
      id: "truth_kernel_state",
      label: "Product Truth and Kernel state",
      layer: "Product Truth / Universe Operating Kernel",
      state: `${wake.productTruthStatus} / ${wake.kernelStatus}`,
      evidence: "Product Truth يحكم كل قرار ذكي.",
    },
    {
      id: "layer_state",
      label: "Layer state",
      layer: "Total Existence / Living Ontology",
      state: `${totalExistence.layerTree.length} layers / ${ontology.entities.length} living entities`,
      evidence: "الوعي داخل الكون مبني على الحالة والتقارير والاختبارات وليس على الادعاء.",
    },
    {
      id: "capability_state",
      label: "Capability state",
      layer: "Capability Matrix",
      state: `${capabilities.length} registered capabilities`,
      evidence: "Implemented, partial, future-gated, blocked, and next actions are explicit.",
    },
    {
      id: "risk_state",
      label: "Risk state",
      layer: "Rights / Product Truth / Gates",
      state: `${rights.entries.length} rights entries / money, legal, external, public, and secrets gated`,
      evidence: "الأولوية الأولى هي Product Truth والخصوصية.",
    },
    {
      id: "automation_state",
      label: "Automation state",
      layer: "Automatic Engine / Infinity / Operator",
      state: `${automaticEngine.status} / ${infinity.status} / ${operator.status}`,
      evidence: "الذكاء الحي داخل الكون يعمل عبر Trigger آمن، وليس loop فوضوي.",
    },
  ];
}

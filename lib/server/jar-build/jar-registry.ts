import type { JarDefinition, JarId } from "./types";

export const jarRegistry: JarDefinition[] = [
  {
    id: "jar_0_black_hole",
    number: 0,
    name: "Jar 0 Black Hole",
    shortName: "Black Hole",
    purpose: "Contain dangerous, sensitive, illegal, secret, or unsafe activation requests.",
    accepts: ["secrets", "bank/card data", "unsafe activation", "public Alkon exposure"],
    exitRule: "No exit unless Ahmad explicitly decides a safe alternative.",
    visibility: "private_only",
  },
  {
    id: "jar_1_p0_reality",
    number: 1,
    name: "Jar 1 P0 Reality",
    shortName: "P0 Reality",
    purpose: "Hold route breaks, build breaks, public leaks, and Product Truth blockers.",
    accepts: ["broken route", "failed build", "public leak", "Product Truth regression"],
    exitRule: "Reality Trial and validation proof are required.",
    visibility: "private_only",
  },
  {
    id: "jar_2_heart",
    number: 2,
    name: "Jar 2 Heart",
    shortName: "Heart",
    purpose: "Protect the current product heart: Pro Max Trading as the first living product.",
    accepts: ["Trading cockpit", "chart ownership", "execution arm", "product heart"],
    exitRule: "Must preserve public/private boundary and Product Truth.",
    visibility: "private_only",
  },
  {
    id: "jar_3_user_comfort",
    number: 3,
    name: "Jar 3 User Comfort",
    shortName: "User Comfort",
    purpose: "Handle user confusion, comfort, support, learning, and calmness gaps.",
    accepts: ["confusion", "support issue", "learning need", "comfort need"],
    exitRule: "Must improve public user value without private leak.",
    visibility: "private_only",
  },
  {
    id: "jar_4_public_trust",
    number: 4,
    name: "Jar 4 Public Trust",
    shortName: "Public Trust",
    purpose: "Guard public claims, legal/treasury readiness, trust, and public safety.",
    accepts: ["claim risk", "legal readiness", "trust gap", "diagnostics clarity"],
    exitRule: "No fake claims, no regulated/licensed claim, no profit promise.",
    visibility: "private_only",
  },
  {
    id: "jar_5_private_alkon",
    number: 5,
    name: "Jar 5 Private Alkon",
    shortName: "Private Alkon",
    purpose: "Hold Alkon -0, Kernel, Founder Command, and private operating universe work.",
    accepts: ["Alkon", "Founder Command", "Kernel", "private command interface"],
    exitRule: "Must stay Founder-only and no-execution.",
    visibility: "private_only",
  },
  {
    id: "jar_6_cleanup",
    number: 6,
    name: "Jar 6 Cleanup",
    shortName: "Cleanup",
    purpose: "Classify cleanup candidates, stale files, CSS islands, archive confusion, and desktop sorting issues.",
    accepts: ["cleanup", "folder ownership", "CSS split", "archive confusion"],
    exitRule: "No deletion or move without evidence and Ahmad decision when uncertain.",
    visibility: "private_only",
  },
  {
    id: "jar_7_evidence",
    number: 7,
    name: "Jar 7 Evidence",
    shortName: "Evidence",
    purpose: "Collect tests, screenshots, reports, validation, and proof gaps.",
    accepts: ["test", "screenshot", "report", "validation", "proof"],
    exitRule: "Evidence must be current, truthful, and non-sensitive.",
    visibility: "private_only",
  },
  {
    id: "jar_8_future_worlds",
    number: 8,
    name: "Jar 8 Future Worlds",
    shortName: "Future Worlds",
    purpose: "Delay future products, future worlds, and expansion ideas until Reality Trial.",
    accepts: ["future product", "future world", "expansion", "roadmap idea"],
    exitRule: "Must not distract from the current heart.",
    visibility: "private_only",
  },
  {
    id: "jar_9_founder_decision",
    number: 9,
    name: "Jar 9 Founder Decision",
    shortName: "Founder Decision",
    purpose: "Hold choices that require Ahmad: acceptance, rejection, sensitive moves, and final authority.",
    accepts: ["Ahmad decision", "visual acceptance", "unknown ownership", "sensitive choice"],
    exitRule: "Ahmad decides before execution.",
    visibility: "private_only",
  },
];

export function getJarRegistry() {
  return jarRegistry;
}

export function getJarDefinition(id: JarId) {
  return jarRegistry.find((jar) => jar.id === id);
}

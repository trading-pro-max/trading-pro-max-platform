import type { RealityProductionBuilder } from "./types";

export const REALITY_PRODUCTION_BUILDERS: RealityProductionBuilder[] = [
  {
    builderId: "alkon",
    role: "decides what deserves existence",
    leader: true,
    allowedWork: ["meaning", "gates", "memory", "next fate"],
    forbiddenWork: ["fake evidence", "public leak"],
  },
  {
    builderId: "codex",
    role: "bounded code builder under Alkon and Ahmad",
    leader: false,
    allowedWork: ["code", "docs", "tests", "reports"],
    forbiddenWork: ["leadership", "shell from web app", "unsafe activation"],
  },
  {
    builderId: "reality",
    role: "judges outputs through evidence",
    leader: false,
    allowedWork: ["validation", "visual proof", "public safety checks"],
    forbiddenWork: ["acceptance without proof"],
  },
  {
    builderId: "ahmad",
    role: "Founder final authority for sensitive matters",
    leader: true,
    allowedWork: ["visual acceptance", "final sensitive decisions"],
    forbiddenWork: ["automated replacement"],
  },
];


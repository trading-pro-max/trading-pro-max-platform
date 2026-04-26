import "server-only";

import type { CosmicHandoff } from "./types";

export const COSMIC_HANDOFFS: CosmicHandoff[] = [
  {
    handoffId: "event-classifier-to-gravity",
    from: "Event Classifier",
    to: "Gravity System",
    requiredPayload: ["source", "energy", "event type", "initial risk"],
    safetyGate: "No event proceeds without source and energy.",
  },
  {
    handoffId: "gravity-to-orbit",
    from: "Gravity System",
    to: "Orbit Router",
    requiredPayload: ["gravity priority", "reason", "allowed next state"],
    safetyGate: "Blocked and black-hole gravity cannot enter normal work orbits.",
  },
  {
    handoffId: "orbit-to-planet",
    from: "Orbit Router",
    to: "Planet Owner",
    requiredPayload: ["orbit path", "owner planet", "required reviews"],
    safetyGate: "Owner must match the surface and forbidden scope.",
  },
  {
    handoffId: "planet-to-station",
    from: "Planet Owner",
    to: "Operating Station",
    requiredPayload: ["station", "required inputs", "forbidden actions"],
    safetyGate: "Station must forbid launch, billing, live, broker/feed, secrets, and public Alkon exposure as needed.",
  },
  {
    handoffId: "station-to-worker",
    from: "Operating Station",
    to: "Worker",
    requiredPayload: ["worker", "allowed files/surfaces", "validation requirements"],
    safetyGate: "Worker must have explicit allowed and forbidden scope.",
  },
  {
    handoffId: "worker-to-passport",
    from: "Worker",
    to: "Task Passport",
    requiredPayload: ["source", "scope", "public language rule", "validation"],
    safetyGate: "No task proceeds without a Task Passport.",
  },
  {
    handoffId: "passport-to-codex-license",
    from: "Task Passport",
    to: "Codex License",
    requiredPayload: ["passport status", "forbidden scope", "manual-only rule"],
    safetyGate: "Codex License cannot permit web-app shell execution or secrets.",
  },
  {
    handoffId: "codex-to-result-tribunal",
    from: "Codex License",
    to: "Result Tribunal",
    requiredPayload: ["validation plan", "diff scope", "Product Truth checks"],
    safetyGate: "Result Tribunal rejects unvalidated or unsafe work.",
  },
  {
    handoffId: "tribunal-to-memory",
    from: "Result Tribunal",
    to: "Memory Universe",
    requiredPayload: ["tribunal decision", "lesson", "safe summary"],
    safetyGate: "Memory cannot store raw secrets or private sensitive data.",
  },
  {
    handoffId: "memory-to-founder-command",
    from: "Memory Universe",
    to: "Founder Command",
    requiredPayload: ["memory lesson", "next safe action", "blocked reason"],
    safetyGate: "Founder report remains private and read-only.",
  },
];

export function getCosmicHandoffs(): CosmicHandoff[] {
  return COSMIC_HANDOFFS;
}

import type { BuilderSelection } from "./types";

type BuilderSelectionRequest = {
  sensitive?: boolean;
  validation?: boolean;
  visual?: boolean;
  unsafe?: boolean;
};

export function getBuilderSelection(
  request: BuilderSelectionRequest = {}
): BuilderSelection {
  const recommendedBuilder = request.unsafe
    ? "No Builder / Block"
    : request.visual || request.sensitive
      ? "Manual Ahmad Review"
      : request.validation
        ? "Test Runner"
        : "Codex Builder";

  return {
    selectionStatus: "ready",
    recommendedBuilder,
    codexIsBuilderNotLeader: true,
    builders: [
      {
        builder: "Codex Builder",
        role: "Implement bounded code, docs, and tests after Ahmad gives a command.",
        leader: false,
        allowed: !request.unsafe,
      },
      {
        builder: "Local Builder",
        role: "Prepare local reports, passports, and status snapshots.",
        leader: false,
        allowed: !request.unsafe,
      },
      {
        builder: "Local Script",
        role: "Run deterministic local maintenance only when explicitly safe.",
        leader: false,
        allowed: !request.unsafe,
      },
      {
        builder: "Test Runner",
        role: "Validate code, routes, screenshots, and Product Truth.",
        leader: false,
        allowed: true,
      },
      {
        builder: "Git Evidence",
        role: "Record diff, commit hash, push state, and clean status.",
        leader: false,
        allowed: true,
      },
      {
        builder: "Visual Proof",
        role: "Capture screenshots for human review.",
        leader: false,
        allowed: true,
      },
      {
        builder: "Manual Ahmad Review",
        role: "Decide visual acceptance and every sensitive action.",
        leader: true,
        allowed: true,
      },
      {
        builder: "Ollama Advisor Future",
        role: "Future local advisory support only after gates exist.",
        leader: false,
        allowed: false,
      },
      {
        builder: "No Builder / Block",
        role: "Stop money, live, billing, broker/feed, public launch, secrets, or public Alkon exposure attempts.",
        leader: false,
        allowed: request.unsafe === true,
      },
    ],
  };
}

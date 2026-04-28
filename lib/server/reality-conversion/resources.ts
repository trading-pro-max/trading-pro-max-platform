import type { RealityConversionResource } from "./types";

export const realityConversionResources: RealityConversionResource[] = [
  {
    id: "resource_codex_local_builder",
    name: "Codex / Local Builder",
    role: "Builds from Command Passport only",
    allowed: true,
    boundary: "No web-triggered shell or uncontrolled automation",
  },
  {
    id: "resource_reports_evidence",
    name: "Reports and evidence",
    role: "Proves what changed and what remains blocked",
    allowed: true,
    boundary: "No secrets or raw sensitive data",
  },
  {
    id: "resource_visual_proof",
    name: "Visual proof screenshots",
    role: "Shows reality before Ahmad acceptance",
    allowed: true,
    boundary: "Stored under test-results only",
  },
  {
    id: "resource_payments_live_trading",
    name: "Payments / live trading",
    role: "Forbidden conversion resource",
    allowed: false,
    boundary: "Blocked until legal, treasury, broker, billing, and Ahmad gates exist",
  },
];

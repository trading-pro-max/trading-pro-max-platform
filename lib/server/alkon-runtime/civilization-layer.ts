import type { AlkonRuntimeCivilization, AlkonRuntimeOrbit } from "./types";

const institutions: Record<AlkonRuntimeOrbit["orbit"], string> = {
  public_earth_orbit: "Public Earth Ministry",
  market_workspace_orbit: "Market Workspace Ministry",
  assistant_orbit: "TPM Assistant Ministry",
  earth_identity_orbit: "Earth Identity Ministry",
  environment_orbit: "Environment Ministry",
  treasury_orbit: "Treasury & Tax Ministry",
  media_reality_orbit: "Media Reality Ministry",
  security_orbit: "Security Ministry",
  secrets_orbit: "Security Ministry",
  codex_construction_orbit: "Codex Construction Ministry",
  launch_readiness_orbit: "Launch Readiness Ministry",
  legal_guardian_orbit: "Constitution Council",
  memory_orbit: "Memory Ministry",
  cleanup_orbit: "Courts / Tribunals",
  reality_admission_orbit: "Constitution Council",
  black_hole_orbit: "Courts / Tribunals",
};

export function assignAlkonRuntimeCivilization(
  orbit: AlkonRuntimeOrbit
): AlkonRuntimeCivilization {
  const institution = institutions[orbit.orbit];

  return {
    institution,
    authority:
      orbit.orbit === "black_hole_orbit"
        ? "Product Truth and Founder final authority"
        : "Founder-approved private readiness authority",
    worker:
      orbit.orbit === "codex_construction_orbit"
        ? "Codex draft worker, manual only"
        : "Alkon runtime classifier",
    court:
      orbit.orbit === "black_hole_orbit" || orbit.orbit === "cleanup_orbit"
        ? "Result Tribunal"
        : "Readiness review gate",
    acceptanceGate: orbit.requiredProof.join(", "),
    reportTarget: orbit.reportTarget,
  };
}

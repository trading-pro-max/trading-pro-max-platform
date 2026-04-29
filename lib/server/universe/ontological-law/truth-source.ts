import "server-only";
import type { TruthSourceRule } from "./types";

export function getTruthSourceRules(): TruthSourceRule[] {
  return [
    {
      source: "device_time",
      meaning: "The user's local device clock supports time-phase claims.",
      allowedClaim: "Device-time simulation active.",
      forbiddenClaim: "Exact physical sun position unless implemented and verified.",
    },
    {
      source: "device_date",
      meaning: "The user's local device date supports season-phase simulation.",
      allowedClaim: "Device-date simulation active.",
      forbiddenClaim: "Exact weather, exact location, or physical climate control.",
    },
    {
      source: "local_project_state",
      meaning: "Repository code, routes, modules, and local state support current project claims.",
      allowedClaim: "Local project state says the feature exists.",
      forbiddenClaim: "Production, public, money, broker, or legal activation unless the real gate is closed.",
    },
    {
      source: "report_evidence",
      meaning: "A report documents a mission, gate, or closure.",
      allowedClaim: "Report evidence exists.",
      forbiddenClaim: "Evidence proves legal approval or public launch by itself.",
    },
    {
      source: "test_evidence",
      meaning: "Automated tests verify behavior or visible truth labels.",
      allowedClaim: "Test evidence exists.",
      forbiddenClaim: "Tests replace legal, money, broker, or founder approval.",
    },
    {
      source: "git_evidence",
      meaning: "Git history proves commit/push state.",
      allowedClaim: "Commit evidence exists.",
      forbiddenClaim: "Git commit means public launch or legal approval.",
    },
    {
      source: "manual_founder_decision",
      meaning: "Ahmad's explicit decision supports founder-only strategic truth.",
      allowedClaim: "Founder decision recorded.",
      forbiddenClaim: "Automation can replace Ahmad's final decision.",
    },
    {
      source: "simulation_labeled",
      meaning: "The product can simulate when the label is visible and honest.",
      allowedClaim: "Real when sourced. Simulated when labeled.",
      forbiddenClaim: "Simulation is physical reality.",
    },
    {
      source: "future_gate_pending",
      meaning: "A future capability is planned but blocked until gates close.",
      allowedClaim: "Pending when future-gated.",
      forbiddenClaim: "Fake readiness, fake legal status, fake money status, or fake broker status.",
    },
  ];
}

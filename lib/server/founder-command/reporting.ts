import "server-only";

import { getFounderCommandSnapshot } from "./state";
import { getFounderBriefing, getPlanetMinistryReports } from "@/lib/server/planet-os";
import type { FounderBriefing, MinistryReport } from "@/lib/server/planet-os";

export type FounderCommandReportingSnapshot = {
  checkedAt: string;
  mode: "founder_command_reporting_engine";
  privateOwnerOnly: true;
  publicRouteExposed: false;
  ministries: MinistryReport[];
  briefing: FounderBriefing;
  commandReadiness: ReturnType<typeof getFounderCommandSnapshot>;
  truth: {
    fakeUsers: "blocked";
    fakeRevenue: "blocked";
    fakeMetrics: "blocked";
    publicFounderRoute: "blocked";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    billing: "inactive";
  };
};

export function getFounderCommandReportingSnapshot(
  checkedAt = new Date().toISOString()
): FounderCommandReportingSnapshot {
  return {
    checkedAt,
    mode: "founder_command_reporting_engine",
    privateOwnerOnly: true,
    publicRouteExposed: false,
    ministries: getPlanetMinistryReports(checkedAt),
    briefing: getFounderBriefing(checkedAt),
    commandReadiness: getFounderCommandSnapshot(checkedAt),
    truth: {
      fakeUsers: "blocked",
      fakeRevenue: "blocked",
      fakeMetrics: "blocked",
      publicFounderRoute: "blocked",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
    },
  };
}

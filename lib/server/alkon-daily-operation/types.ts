import type { JarBuildItem } from "@/lib/server/jar-build";

export type AlkonDailyOperationStatus =
  | "operating_today"
  | "operating_with_notes"
  | "blocked";

export type AlkonDailyOperationSnapshot = {
  checkedAt: string;
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  noExecution: true;
  noShell: true;
  noCodex: true;
  noPayments: true;
  noExternalCalls: true;
  noPublicExposure: true;
  status: AlkonDailyOperationStatus;
  currentTruth: string;
  whatChanged: string[];
  blocked: string[];
  currentHeart: string;
  oneNextAction: {
    action: string;
    whyNow: string;
    requiresAhmad: boolean;
  };
  whatNotToDo: string[];
  needsAhmad: string[];
  latestWakeReportSummary: string;
  nextCommandSummary: string;
  jar: {
    status: string;
    priority: string;
    brandGateDelayed: true;
    brandGateItem?: JarBuildItem;
  };
  realityConversion: {
    status: string;
    firstRealityStep: string;
    oneNextRealityAction: string;
  };
  permissionToExist: {
    status: string;
    nextStructuralAction: string;
  };
  proMaxTrading: {
    status: string;
    route: "/trading";
    truth: string;
  };
  founderRoutes: {
    alkon: "active_private";
    pocket: "active_private";
  };
  productTruth: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    billing: "inactive";
    brokerFeed: "inactive";
    publicLaunch: "inactive";
    noSecretsExposed: true;
    noPublicAlkonExposure: true;
  };
  publicPrivateBoundary: {
    publicSafe: true;
    alkonPrivate: true;
    founderRoutesHiddenFromPublic: true;
  };
  localDayOne: {
    status: "not_started";
    reason: string;
  };
};

import "server-only";

export type AlKawnControlSurfaceStatus =
  | "active"
  | "protected"
  | "future"
  | "blocked"
  | "active_with_notes";

export type AlKawnControlActionVerdict =
  | "execute_directly"
  | "stop_for_legal"
  | "stop_for_money"
  | "blocked_product_truth"
  | "blocked_security"
  | "future_gate"
  | "needs_more_evidence";

export type AlKawnControlAction = {
  id: string;
  label: string;
  verdict: AlKawnControlActionVerdict;
  detail: string;
};

export type AlKawnControlSurface = {
  id: string;
  label: string;
  arabicLabel: string;
  ownerLayer: string;
  status: AlKawnControlSurfaceStatus;
  purpose: string;
  visibleState: string[];
  directInternalActions: AlKawnControlAction[];
  legalStopActions: AlKawnControlAction[];
  moneyStopActions: AlKawnControlAction[];
  blockedActions: AlKawnControlAction[];
  productTruthImpact: string;
  nextSafeAction: string;
  relatedRoute: string;
  relatedReport: string;
  relatedTest: string;
};

export type AlKawnControlSurfaceSummary = {
  total: number;
  active: number;
  protected: number;
  future: number;
  blocked: number;
  activeWithNotes: number;
  nextSafeAction: string;
  rule: string;
};

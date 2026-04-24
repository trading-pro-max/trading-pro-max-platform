export type VisualAcceptanceArea =
  | "public_entry"
  | "workstation"
  | "chart"
  | "execution_ticket"
  | "settings"
  | "diagnostics"
  | "auth_session"
  | "feedback"
  | "dark_theme"
  | "light_theme"
  | "arabic_rtl"
  | "english_ltr"
  | "brand_identity"
  | "plan_visual_identity";

export type VisualAcceptanceStatus = "pass" | "partial" | "blocker";

export type VisualAcceptanceScore = {
  area: VisualAcceptanceArea;
  label: string;
  scoreEstimate: number;
  status: VisualAcceptanceStatus;
  criteria: {
    hierarchy: number;
    clarity: number;
    premiumFeel: number;
    clutterLevel: number;
    consistency: number;
    readability: number;
    productTruthVisibility: number;
  };
  reasons: string[];
  nextVisualActions: string[];
};

export type VisualAcceptanceSnapshot = {
  checkedAt: string;
  mode: "visual_acceptance_engine";
  status: VisualAcceptanceStatus;
  averageScoreEstimate: number;
  areas: VisualAcceptanceScore[];
  truth: {
    humanAcceptanceRequired: true;
    screenshotsRequiredForFinalClaim: true;
    fakeVisualSuccessBlocked: true;
  };
};

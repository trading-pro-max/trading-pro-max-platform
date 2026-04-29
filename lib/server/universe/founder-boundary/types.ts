export type FounderBoundaryActionCategory =
  | "money_payment_receiving_funds"
  | "real_trading_broker"
  | "legal_official_claims"
  | "public_launch_customers"
  | "brand_domains_ownership"
  | "personal_data_secrets_documents"
  | "external_accounts_integrations"
  | "irreversible_destructive_actions"
  | "final_founder_decisions"
  | "safe_internal_work";

export type FounderBoundaryDecision =
  | "safe_internal_execute_alone"
  | "requires_ahmad_approval"
  | "never_alone_blocked_until_ahmad";

export type FounderBoundaryAction = {
  id: string;
  label: string;
  category: FounderBoundaryActionCategory;
  decision: FounderBoundaryDecision;
  reason: string;
  productTruthImpact: string;
};

export type FounderBoundaryRule = {
  id: string;
  label: string;
  wording: string;
  scope: string;
};

export type FounderBoundaryExplanation = {
  action: string;
  decision: FounderBoundaryDecision;
  matchedAction?: FounderBoundaryAction;
  requiresAhmad: boolean;
  canExecuteAlone: boolean;
  explanation: string;
};

export type StateExplanationSeverity = "info" | "warning" | "blocked" | "error";

export type StateExplanationResolver =
  | "user"
  | "operator"
  | "founder"
  | "external_configuration"
  | "future_scope";

export type StateExplanationView = {
  key: string;
  title: string;
  shortMessage: string;
  reason: string;
  safeNextStep: string;
  severity: StateExplanationSeverity;
  resolvedBy: StateExplanationResolver;
  blockerType?: string;
  requiredConditionToUnblock?: string;
  whoCanUnblock?: string;
  state?: string;
  userCopy: string;
  internalCopy?: string;
};

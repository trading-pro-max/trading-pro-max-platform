export type AccountTypeIdentityState =
  | "standard"
  | "islamic_requested"
  | "islamic_review_required"
  | "islamic_configured"
  | "not_certified"
  | "unavailable";

export type AccountTypeIdentity = {
  label: string;
  note: string;
  state: AccountTypeIdentityState;
  tone: "approved" | "pending" | "restricted" | "blocked";
};

export const ACCOUNT_TYPE_IDENTITY_STATES: Record<
  AccountTypeIdentityState,
  AccountTypeIdentity
> = {
  standard: {
    label: "Standard",
    note: "Default paper-evaluation account type.",
    state: "standard",
    tone: "approved",
  },
  islamic_requested: {
    label: "Islamic requested",
    note: "Request captured only; review is still required.",
    state: "islamic_requested",
    tone: "pending",
  },
  islamic_review_required: {
    label: "Islamic review required",
    note: "No Islamic account status applies until a qualified review is complete.",
    state: "islamic_review_required",
    tone: "restricted",
  },
  islamic_configured: {
    label: "Islamic configured",
    note: "Configuration state only; do not describe as certified unless certification exists.",
    state: "islamic_configured",
    tone: "pending",
  },
  not_certified: {
    label: "Not certified",
    note: "No Islamic or Sharia certification is configured.",
    state: "not_certified",
    tone: "restricted",
  },
  unavailable: {
    label: "Unavailable",
    note: "Account type metadata is unavailable for this session.",
    state: "unavailable",
    tone: "blocked",
  },
};

export function getDefaultAccountTypeIdentity() {
  return ACCOUNT_TYPE_IDENTITY_STATES.not_certified;
}

import "server-only";

export type LocalDayOneStatus =
  | "ready_not_started"
  | "blocked_prerequisite_missing";

export type LocalDayOneChecklistItem = {
  id: string;
  label: string;
  status: "ready" | "ready_with_notes" | "blocked";
  evidence: string;
};

export type LocalDayOneBlockedAction = {
  id: string;
  title: string;
  reason: string;
};

export type LocalDayOneNextAction = {
  next: "Ahmad reviews /desktop/kawn and decides whether to start Local Day One.";
  reason: string;
  requiresAhmad: true;
};

export type LocalDayOneReadiness = {
  id: "local_day_one_readiness";
  title: "Local Day One Boot Gate";
  status: LocalDayOneStatus;
  summary: string;
  requiredWording: string[];
  checklist: LocalDayOneChecklistItem[];
  blockedActions: LocalDayOneBlockedAction[];
  bootGate: {
    status: LocalDayOneStatus;
    finalDecision: "Ahmad final start decision required";
    notStarted: true;
  };
  nextAction: LocalDayOneNextAction;
};

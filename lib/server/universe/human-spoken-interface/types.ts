import "server-only";

export type AlKawnSpokenLine = {
  id: string;
  text: string;
  purpose: string;
};

export type AlKawnSpokenToneRule = {
  id: string;
  rule: string;
};

export type AlKawnHumanSpokenInterfaceState = {
  id: "al_kawn_human_spoken_interface";
  title: "Human Spoken Interface is active.";
  state: "active";
  audience: "Ahmad only";
  summary: string;
  wakeMessage: AlKawnSpokenLine;
  dailyBriefing: AlKawnSpokenLine[];
  needsFromAhmad: AlKawnSpokenLine[];
  blockers: AlKawnSpokenLine[];
  nextAction: AlKawnSpokenLine;
  toneRules: AlKawnSpokenToneRule[];
};

import "server-only";

import type { LocalDayOneBlockedAction } from "./types";

export function getLocalDayOneBlockedActions(): LocalDayOneBlockedAction[] {
  return [
    {
      id: "auto_start",
      title: "Automatic Local Day One start blocked",
      reason: "Ahmad must start Local Day One.",
    },
    {
      id: "public_launch",
      title: "Public launch blocked",
      reason: "Local Day One is private and does not launch public.",
    },
    {
      id: "money",
      title: "Money actions blocked",
      reason: "Billing, payments, receiving money, real money, broker, and bank actions remain stopped.",
    },
    {
      id: "legal",
      title: "Legal claims blocked",
      reason: "Legal approval, FINMA, licensing, and regulated claims are not made.",
    },
    {
      id: "external_accounts",
      title: "External account action blocked",
      reason: "External accounts are not connected.",
    },
    {
      id: "public_private_layers",
      title: "Public Al-Kawn / ALKON blocked",
      reason: "Al-Kawn and ALKON remain private.",
    },
  ];
}

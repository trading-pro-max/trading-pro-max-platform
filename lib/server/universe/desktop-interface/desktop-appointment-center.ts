import "server-only";

import type { AlKawnDesktopAppointment } from "./types";

export function getAlKawnDesktopAppointmentCenter(): AlKawnDesktopAppointment[] {
  return [
    {
      id: "project_review",
      title: "Project review appointment placeholder",
      status: "pending",
      rule: "Appointments are private and local-first.",
      nextStep: "Manual private review appointments can be added later without external calendar connection.",
    },
    {
      id: "official_legal_payment",
      title: "Official/legal/payment reminder placeholder",
      status: "future_gate",
      rule: "External calendar connection requires Ahmad approval.",
      nextStep: "Do not connect Gmail, Calendar, Drive, Apple, Google, or external accounts automatically.",
    },
    {
      id: "local_day_one",
      title: "Local Day One schedule placeholder",
      status: "blocked",
      rule: "Sensitive appointments must not be committed to Git.",
      nextStep: "Local Day One remains not_started until Ahmad explicitly starts it.",
    },
    {
      id: "founder_decision",
      title: "Founder decision reminder placeholder",
      status: "pending",
      rule: "Final founder decisions belong to Ahmad.",
      nextStep: "Keep decision reminders non-sensitive unless Ahmad approves a private storage method.",
    },
  ];
}

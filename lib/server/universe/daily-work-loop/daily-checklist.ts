import "server-only";

import type { DailyChecklistSection } from "./types";

export function getDailyWorkChecklist(): DailyChecklistSection[] {
  return [
    {
      id: "reality_check",
      title: "Reality check",
      status: "checked",
      checks: [
        "Device time is the active reality source.",
        "Device date is the active reality source.",
        "Day/night phase is local-device sourced.",
        "Season is device-date derived.",
        "Weather is not connected.",
        "Location is not requested.",
      ],
    },
    {
      id: "product_truth_check",
      title: "Product Truth check",
      status: "checked",
      checks: [
        "Public launch blocked.",
        "Billing inactive.",
        "Payments inactive.",
        "Receiving money inactive.",
        "Real money disabled.",
        "Broker disabled/not connected.",
        "Legal review pending.",
        "ALKON private/background.",
        "الكون private to Ahmad devices.",
      ],
    },
    {
      id: "kernel_check",
      title: "Kernel check",
      status: "checked",
      checks: [
        "Universe Operating Kernel available.",
        "Execution judge available.",
        "Product Truth law available.",
      ],
    },
    {
      id: "desktop_state_check",
      title: "Desktop state check",
      status: "checked",
      checks: [
        "/desktop/kawn available.",
        "Local PIN / Passphrase Auth status visible.",
        "Private Desktop Packaging Gate status visible.",
        "Private Desktop Local Build Dry Run status visible.",
        "Private Desktop Distribution Gate status visible.",
      ],
    },
    {
      id: "reports_check",
      title: "Reports check",
      status: "visible",
      checks: [
        "Latest WAKE REPORT exists.",
        "Latest daily report exists.",
        "Latest validation summary is report-backed.",
        "Missing reports are shown honestly if any appear.",
      ],
    },
    {
      id: "work_selection_check",
      title: "Work selection check",
      status: "ready",
      checks: [
        "Choose one safe internal work item.",
        "Avoid legal and money work.",
        "Avoid public launch.",
        "Avoid broker, payment, and real trading.",
        "Avoid secrets exposure.",
      ],
    },
    {
      id: "report_output_check",
      title: "Report output check",
      status: "updated",
      checks: [
        "Daily report updated.",
        "One next action updated.",
        "Daily blockers are visible.",
      ],
    },
  ];
}

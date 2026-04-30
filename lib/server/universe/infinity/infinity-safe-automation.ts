import "server-only";

import type { InfinityAutomationItem } from "./types";

export function getInfinitySafeAutomation(): InfinityAutomationItem[] {
  return [
    {
      id: "report_refresh",
      title: "Report refresh",
      scope: "safe_internal",
      reason: "Refreshing internal reports is private and produces no external side effects.",
      productTruthImpact: "Preserves Product Truth by keeping status visible.",
    },
    {
      id: "daily_status_refresh",
      title: "Daily status refresh",
      scope: "safe_internal",
      reason: "Daily loop status can be refreshed from local project state.",
      productTruthImpact: "Keeps wake state and blockers current.",
    },
    {
      id: "task_generation",
      title: "Task generation",
      scope: "safe_internal",
      reason: "Private task drafts can be prepared without connecting external services.",
      productTruthImpact: "Legal and money tasks remain stopped for Ahmad.",
    },
    {
      id: "next_action_selection",
      title: "Next action selection",
      scope: "safe_internal",
      reason: "Selecting one next safe internal action extends the daily loop without bypassing it.",
      productTruthImpact: "One next action remains enforced.",
    },
    {
      id: "product_truth_check",
      title: "Product Truth check",
      scope: "safe_internal",
      reason: "Forbidden-claim and readiness checks are internal safety work.",
      productTruthImpact: "Product Truth controls every cycle.",
    },
    {
      id: "docs_report_checklist",
      title: "Docs/report checklist",
      scope: "safe_internal",
      reason: "Documentation and report checklist preparation is private project work.",
      productTruthImpact: "No public claim is created.",
    },
    {
      id: "regression_summary",
      title: "Regression summary",
      scope: "safe_internal",
      reason: "Validation summaries can be prepared from local test results.",
      productTruthImpact: "Avoids fake readiness claims.",
    },
    {
      id: "desktop_status_summary",
      title: "Desktop status summary",
      scope: "safe_internal",
      reason: "Desktop readiness can be summarized without packaging, signing, or distribution.",
      productTruthImpact: "Keeps desktop gates visible.",
    },
    {
      id: "architecture_status_summary",
      title: "Architecture status summary",
      scope: "safe_internal",
      reason: "Architecture status is internal project memory.",
      productTruthImpact: "Preserves canonical layer ownership.",
    },
    {
      id: "forbidden_claim_scan",
      title: "Forbidden claim scan",
      scope: "safe_internal",
      reason: "Scanning for unsafe claims reduces Product Truth risk.",
      productTruthImpact: "Blocks false public, money, broker, legal, and guarantee claims.",
    },
    {
      id: "wake_report_preparation",
      title: "Wake report preparation",
      scope: "safe_internal",
      reason: "A WAKE REPORT can be prepared as private internal status output.",
      productTruthImpact: "Reports remain private and secret-free.",
    },
  ];
}

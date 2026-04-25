import type { ContentLifecycleState } from "../types";

const states: ContentLifecycleState[] = [
  "idea",
  "draft",
  "brand_review",
  "guardian_review",
  "legal_review",
  "founder_approval",
  "scheduled_later",
  "blocked",
  "archived",
];

const publicStateLabels: Record<ContentLifecycleState, string> = {
  idea: "idea",
  draft: "draft",
  brand_review: "brand review",
  guardian_review: "safety review",
  legal_review: "claim review",
  founder_approval: "final approval",
  scheduled_later: "scheduled later",
  blocked: "blocked",
  archived: "archived",
};

export default function ContentLifecyclePreview() {
  return (
    <div className="tpm-content-lifecycle" aria-label="Content lifecycle readiness">
      {states.map((state) => (
        <span key={state} data-state={state}>
          {publicStateLabels[state]}
        </span>
      ))}
    </div>
  );
}

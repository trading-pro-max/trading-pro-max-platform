import type { ContentLifecycleState } from "../types";

const states: ContentLifecycleState[] = [
  "idea",
  "draft",
  "brand_review",
  "guardian_review",
  "legal_review",
  "founder_approval",
  "scheduled",
  "published",
  "blocked",
  "archived",
];

export default function ContentLifecyclePreview() {
  return (
    <div className="tpm-content-lifecycle" aria-label="Content lifecycle readiness">
      {states.map((state) => (
        <span key={state} data-state={state}>
          {state.replaceAll("_", " ")}
        </span>
      ))}
    </div>
  );
}

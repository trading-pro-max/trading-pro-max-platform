import type { PlanFeatureState } from "@/lib/plans/types";

type PlanCapabilityListProps = {
  features: PlanFeatureState[];
  title: string;
};

function stateLabel(state: PlanFeatureState["state"]) {
  if (state === "coming_later") return "coming later";
  return state;
}

export default function PlanCapabilityList({
  features,
  title,
}: PlanCapabilityListProps) {
  return (
    <div className="tpm-plan-capability-list">
      <span>{title}</span>
      {features.length === 0 ? (
        <small>No active capability in this state.</small>
      ) : (
        features.map((feature) => (
          <article key={`${feature.group}-${feature.label}`} data-state={feature.state}>
            <strong>{feature.label}</strong>
            <em>{stateLabel(feature.state)}</em>
            <small>{feature.explanation}</small>
          </article>
        ))
      )}
    </div>
  );
}

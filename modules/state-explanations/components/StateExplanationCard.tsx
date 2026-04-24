import type { StateExplanationView } from "../types";

type StateExplanationCardProps = {
  compact?: boolean;
  explanation: StateExplanationView;
};

export default function StateExplanationCard({
  compact = false,
  explanation,
}: StateExplanationCardProps) {
  return (
    <article
      className={compact ? "tpm-state-explanation-card compact" : "tpm-state-explanation-card"}
      data-severity={explanation.severity}
      data-state-key={explanation.key}
    >
      <div>
        <span>{explanation.severity}</span>
        <h3>{explanation.title}</h3>
      </div>
      <p>{explanation.reason}</p>
      <small>{explanation.safeNextStep}</small>
    </article>
  );
}

import type { StateExplanationView } from "../types";

type SafeNextStepListProps = {
  explanations: StateExplanationView[];
};

export default function SafeNextStepList({ explanations }: SafeNextStepListProps) {
  return (
    <ul className="tpm-state-safe-next-list">
      {explanations.map((explanation) => (
        <li key={explanation.key}>
          <strong>{explanation.title}</strong>
          <span>{explanation.safeNextStep}</span>
        </li>
      ))}
    </ul>
  );
}

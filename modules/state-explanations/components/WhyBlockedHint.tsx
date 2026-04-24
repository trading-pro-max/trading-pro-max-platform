import type { StateExplanationView } from "../types";

type WhyBlockedHintProps = {
  explanation: StateExplanationView;
  label?: string;
};

export default function WhyBlockedHint({
  explanation,
  label = "Why blocked",
}: WhyBlockedHintProps) {
  return (
    <details className="tpm-why-blocked-hint" data-severity={explanation.severity}>
      <summary>{label}</summary>
      <div>
        <strong>{explanation.title}</strong>
        <p>{explanation.reason}</p>
        <small>{explanation.safeNextStep}</small>
      </div>
    </details>
  );
}

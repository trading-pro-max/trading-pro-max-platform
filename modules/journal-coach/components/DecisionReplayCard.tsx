import type { DecisionReplayFoundation } from "@/lib/server/journal-coach/types";

type DecisionReplayCardProps = {
  replay: DecisionReplayFoundation;
};

export default function DecisionReplayCard({ replay }: DecisionReplayCardProps) {
  return (
    <article className="tpm-decision-replay-card" aria-label="Decision replay foundation">
      <header>
        <span>Decision replay</span>
        <strong>
          {replay.selectedSymbol} / {replay.timeframe}
        </strong>
      </header>

      <dl>
        <div>
          <dt>Context</dt>
          <dd>{replay.contextQuality}</dd>
        </div>
        <div>
          <dt>Preflight</dt>
          <dd>{replay.preflightState.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt>Allowed state</dt>
          <dd>{replay.allowedState.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt>Truth</dt>
          <dd>
            live {replay.productTruthAtDecisionTime.liveExecution}, money{" "}
            {replay.productTruthAtDecisionTime.realMoneyRouting}
          </dd>
        </div>
      </dl>

      <ul>
        {replay.learningPrompts.slice(0, 3).map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>

      <small>No alternative outcome guarantee is provided.</small>
    </article>
  );
}

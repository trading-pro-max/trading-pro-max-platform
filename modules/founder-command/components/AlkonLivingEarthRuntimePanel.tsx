import type { LivingEarthRuntimeState } from "@/lib/brand/living-earth";

export default function AlkonLivingEarthRuntimePanel({
  state,
}: {
  state: LivingEarthRuntimeState;
}) {
  const homeDecision = state.renderDecisions.find(
    (decision) => decision.surface === "home_hero"
  );
  const tradingDecision = state.renderDecisions.find(
    (decision) => decision.surface === "trading_workspace"
  );
  const privateDecision = state.renderDecisions.find(
    (decision) => decision.surface === "founder_private_preview"
  );

  return (
    <section
      className="alkon-builder-device-panel alkon-living-earth-runtime-panel"
      aria-label="Living Earth Runtime readiness"
      data-living-earth-runtime="private-readiness"
      data-public-route-exposed="false"
      data-read-only="true"
    >
      <div className="alkon-rail-head">
        <span>Living Earth Runtime</span>
        <h2>Earth identity is governed privately</h2>
        <p>
          Pro Max shows the Living Earth publicly. Alkon keeps the asset law,
          visual acceptance, evolution state, and next safe action private.
        </p>
      </div>
      <dl className="alkon-command-facts">
        <div>
          <dt>Runtime</dt>
          <dd>Active with notes</dd>
        </div>
        <div>
          <dt>Visual acceptance</dt>
          <dd>Ahmad review needed</dd>
        </div>
        <div>
          <dt>Asset status</dt>
          <dd>{state.assetStatus.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt>Home surface</dt>
          <dd>{homeDecision?.visualIntensity ?? "strong"} living Earth</dd>
        </div>
        <div>
          <dt>Trading surface</dt>
          <dd>{tradingDecision?.reason ?? "Trading keeps Earth subtle."}</dd>
        </div>
        <div>
          <dt>Private preview</dt>
          <dd>{privateDecision?.mode.replaceAll("_", " ") ?? "procedural fallback"}</dd>
        </div>
        <div>
          <dt>Next safe action</dt>
          <dd>{state.evolution.nextSafeAction}</dd>
        </div>
        <div>
          <dt>What not to do</dt>
          <dd>No external image, generated texture, Swiss regulatory claim, or chart cover.</dd>
        </div>
      </dl>
    </section>
  );
}

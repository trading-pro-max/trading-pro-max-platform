import { getInvisibleOperatingLayerSnapshot } from "@/lib/server/invisible-operating-layer";
import { getLocalLivingDayLoopSnapshot } from "@/lib/server/local-ops";
import { getFounderIdeaInboxReadiness } from "@/lib/server/sovereign-autonomy";

export default function FounderPlanetStatusMap({
  checkedAt,
}: {
  checkedAt: string;
}) {
  const invisibleLayer = getInvisibleOperatingLayerSnapshot(checkedAt);
  const livingLoop = getLocalLivingDayLoopSnapshot(checkedAt);
  const ideaInbox = getFounderIdeaInboxReadiness(checkedAt);

  const zones = [
    {
      title: "Public Trading Platform World",
      status: "ready",
      note: "Users see Home, Trading Workspace, Markets, Plans, Apps / Platforms, Academy, Community, Support, Settings, and Diagnostics.",
    },
    {
      title: "Private Planet Command World",
      status: "owner-only",
      note: "Founder Command, Idea Inbox, Codex Governance, Product Memory, Result Tribunal, and Security are private.",
    },
    {
      title: "Invisible Operating Intelligence",
      status: `${invisibleLayer.systems.length} systems`,
      note: `${invisibleLayer.hiddenFromPublic.length} systems are hidden from public users and mapped only through public-safe outputs.`,
    },
    {
      title: "Local Day One Loop",
      status: livingLoop.mode,
      note: livingLoop.today.nextSafeAction,
    },
    {
      title: "Idea Inbox",
      status: ideaInbox.status,
      note: ideaInbox.nextSafeIdeaAction,
    },
  ];

  return (
    <section className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Planet Status Map</span>
        <h2>Inside / outside operating boundary</h2>
        <p>
          Ahmad lives in the private command world while users stay on the public
          trading platform surface. The invisible layer carries complexity without
          public leakage.
        </p>
      </div>

      <div className="tpm-founder-briefing-grid">
        {zones.map((zone) => (
          <article key={zone.title}>
            <h3>{zone.title}</h3>
            <strong>{zone.status}</strong>
            <p>{zone.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

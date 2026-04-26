import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonGravityOrbitPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const events = snapshot.cosmicPhysics.sampleEvents.slice(0, 6);

  return (
    <section className="tpm-founder-subpanel alkon-gravity-orbit">
      <span>Gravity Priority / Orbit Path</span>
      <h3>Event classifier routes work before any worker receives it</h3>
      <div className="alkon-domain-list alkon-event-list">
        {events.map((event) => (
          <div key={event.eventId}>
            <small>{event.gravityPriority}</small>
            <strong>{event.title}</strong>
            <p>
              {event.energy} to {event.orbitPath}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

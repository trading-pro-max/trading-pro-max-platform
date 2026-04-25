import type { CommunityRoomReadiness } from "../types";

const rooms: CommunityRoomReadiness[] = [
  {
    id: "learning-spaces",
    label: "Free learning spaces",
    planLayer: "Free",
    state: "planned",
    safetyRule: "moderated education only",
  },
  {
    id: "pro-rooms",
    label: "Pro rooms",
    planLayer: "Pro",
    state: "planned",
    safetyRule: "no fake Pro activation",
  },
  {
    id: "vip-rooms",
    label: "VIP rooms",
    planLayer: "VIP",
    state: "planned",
    safetyRule: "no signal room or fake VIP access",
  },
  {
    id: "feedback-rooms",
    label: "Feedback rooms",
    planLayer: "Free",
    state: "planned",
    safetyRule: "anti-spam and support review",
  },
];

export default function CommunityReadinessPanel() {
  return (
    <section className="tpm-community-readiness" aria-label="Community readiness">
      <header>
        <span>Community</span>
        <h2>Rooms planned, not active</h2>
        <p>
          Community remains a guarded readiness layer with anti-scam,
          anti-spam, safety, and review policies required before activation.
        </p>
      </header>
      <div>
        {rooms.map((room) => (
          <article key={room.id}>
            <span>{room.planLayer}</span>
            <strong>{room.label}</strong>
            <small>
              {room.state} / {room.safetyRule}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}

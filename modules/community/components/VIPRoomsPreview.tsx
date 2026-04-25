const vipCapabilities = [
  "VIP Brain planned",
  "Advanced coaching planned",
  "Strategy review planned",
  "Premium reports planned",
  "Private rooms planned",
];

export default function VIPRoomsPreview() {
  return (
    <section className="tpm-vip-rooms-preview" aria-label="VIP rooms readiness">
      <header>
        <span>VIP Rooms</span>
        <h2>Elite layer planned</h2>
        <p>
          VIP rooms are not active. No private room, copy trading, live signal,
          priority support, or performance claim is available now.
        </p>
      </header>
      <div>
        {vipCapabilities.map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
    </section>
  );
}

import styles from "../trading-premium-realism.module.css";

const positions = [
  ["EUR/USD", "Paper long", "0.10", "+0.12%", "Read-only"],
  ["XAU/USD", "Watch", "-", "0.00%", "No order"],
];

const orders = [
  ["PMX-2048", "Limit demo", "Pending review", "No broker"],
  ["PMX-2049", "Risk check", "Blocked", "Real money disabled"],
];

const events = [
  "Read-only floor opened",
  "Demo feed rendered",
  "Product Truth strip visible",
  "Broker execution confirmed disabled",
];

export default function PositionsActivityDock() {
  return (
    <section
      className={`${styles.activityDock} tpm-workspace-activity-shelf`}
      data-positions-activity-dock="true"
      data-bottom-terminal-dock="true"
      data-trading-platform-depth="bottom-terminal-dock"
      aria-label="Premium Positions / Orders / Activity Dock"
    >
      <details className="tpm-workspace-activity-panel" open>
        <summary>Active paper positions</summary>
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>State</th>
              <th>Size</th>
              <th>Move</th>
              <th>Truth</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(([instrument, state, size, move, truth]) => (
              <tr key={instrument}>
                <td>{instrument}</td>
                <td>{state}</td>
                <td>{size}</td>
                <td>{move}</td>
                <td>{truth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <details className="tpm-workspace-activity-panel" open>
        <summary>Pending paper orders</summary>
        <table>
          <tbody>
            {orders.map(([id, type, state, truth]) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{type}</td>
                <td>{state}</td>
                <td>{truth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <details className="tpm-workspace-activity-panel" open>
        <summary>Fills / activity timeline</summary>
        <ol>
          {events.map((event) => (
            <li key={event}>{event}</li>
          ))}
        </ol>
      </details>
    </section>
  );
}

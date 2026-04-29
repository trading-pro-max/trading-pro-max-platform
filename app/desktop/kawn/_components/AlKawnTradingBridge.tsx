import Link from "next/link";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnTradingBridge() {
  return (
    <section className={styles.tradingBridge} aria-label="trading bridge">
      <div className={styles.sectionTitle}>
        <span>Earth Planet bridge</span>
        <h2>Trading bridge</h2>
      </div>
      <p>Earth Planet contains /trading as the professional trading surface.</p>
      <p>Trading: demo-safe/read-only</p>
      <p>Real money disabled</p>
      <p>Broker execution disabled/not connected</p>
      <Link href="/trading">Open /trading</Link>
    </section>
  );
}

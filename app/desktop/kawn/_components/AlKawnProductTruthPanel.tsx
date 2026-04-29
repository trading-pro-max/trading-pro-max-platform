import type { AlKawnDesktopTruthItem } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnProductTruthPanel({ items }: { items: AlKawnDesktopTruthItem[] }) {
  return (
    <section className={styles.productTruth} data-product-truth="true" aria-label="Product Truth">
      <div className={styles.sectionTitle}>
        <span>Product Truth</span>
        <h2>Product Truth</h2>
      </div>
      <div className={styles.truthChips}>
        {items.map((item) => (
          <span key={item.id}>{item.label}: {item.value}</span>
        ))}
      </div>
    </section>
  );
}

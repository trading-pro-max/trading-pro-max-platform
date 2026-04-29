import { ProMaxDeviceTimeRealityBar } from "@/app/_components/ProMaxDeviceTimeRealityBar";
import { ProMaxLivingEarth } from "@/app/_components/ProMaxLivingEarth";
import { ProMaxLivingUniverseBackground } from "@/app/_components/ProMaxLivingUniverseBackground";
import { ProMaxUniverseSoundscape } from "@/app/_components/ProMaxUniverseSoundscape";
import type {
  ProjectUniverseTruthSnapshot,
  UniverseTruthItem,
} from "@/lib/server/project-universe-truth";
import styles from "../founder-universe.module.css";

function TruthList({ items }: { items: UniverseTruthItem[] }) {
  return (
    <ul className={styles.truthList}>
      {items.map((item) => (
        <li key={item.id}>
          <strong>{item.label}</strong>
          <span>{item.value}</span>
          <small>{item.note}</small>
        </li>
      ))}
    </ul>
  );
}

export default function UniverseCommandCenter({
  truth,
}: {
  truth: ProjectUniverseTruthSnapshot;
}) {
  return (
    <main
      className={styles.universe}
      data-founder-universe-command-center="true"
      data-owner-only="true"
      data-read-only="true"
      data-public-route-exposed="false"
      aria-label="Private Founder Universe Command Center"
    >
      <ProMaxLivingUniverseBackground surface="founder" />
      <header className={styles.hero}>
        <ProMaxLivingEarth size="hero" surface="founder" showText intensity="hero" />
        <div>
          <span>Private Founder Universe Command Center</span>
          <h1>ALKON / Alkon -0 Project Universe</h1>
          <p>{truth.identityLine}</p>
        </div>
        <div className={styles.accessCard}>
          <span>Universe status</span>
          <strong>Private / read-only</strong>
          <small>Product Truth guarded</small>
        </div>
      </header>

      <ProMaxDeviceTimeRealityBar variant="full" />
      <ProMaxUniverseSoundscape />

      <section className={styles.metricGrid} aria-label="Universe status">
        <article>
          <span>ALKON state</span>
          <strong>Private / read-only</strong>
          <small>Ahmad-only command universe</small>
        </article>
        <article>
          <span>Pro Max Trading state</span>
          <strong>First living product</strong>
          <small>Demo-safe operating floor</small>
        </article>
        <article>
          <span>/trading visual realism</span>
          <strong>Premium floor ready with notes</strong>
          <small>Chart-first, no real execution</small>
        </article>
        <article>
          <span>Animated Earth identity</span>
          <strong>Original code-driven</strong>
          <small>Swiss-inspired visual identity only</small>
        </article>
        <article>
          <span>Swiss legal-review gate</span>
          <strong>Pending</strong>
          <small>Legal-review-ready only</small>
        </article>
        <article>
          <span>Global legal-review gate</span>
          <strong>Pending</strong>
          <small>No global approval claim</small>
        </article>
        <article>
          <span>Brand Gate</span>
          <strong>Frozen/deferred</strong>
          <small>No rename, no research now</small>
        </article>
        <article>
          <span>Local Day One</span>
          <strong>not_started</strong>
          <small>Ahmad has not started it</small>
        </article>
      </section>

      <section className={styles.truthPanel} data-product-truth="true">
        <div>
          <span>Product Truth</span>
          <h2>Blocked gates remain blocked</h2>
        </div>
        <div className={styles.truthStrip}>
          <span>Private: yes</span>
          <span>Read-only/demo-safe: yes</span>
          <span>Pro Max: working_name_only</span>
          <span>Real money: disabled</span>
          <span>Broker execution: disabled/not connected</span>
          <span>Public launch: not started</span>
          <span>Billing: not active</span>
          <span>Brand Gate: frozen/deferred</span>
          <span>Brand Gate: ready_with_notes</span>
          <span>Local Day One: not_started</span>
          <span>ALKON public exposure: no</span>
          <span>Swiss legal-review: pending</span>
          <span>Global legal-review: pending</span>
          <span>Swiss-inspired visual identity only; no government endorsement</span>
          <span>Device-time simulation only</span>
          <span>Weather not connected</span>
          <span>Assets: local/procedural/license-safe</span>
        </div>
      </section>

      <section className={styles.columns}>
        <article>
          <span>Allowed now</span>
          <h2>Private review only</h2>
          <TruthList items={truth.allowedNow} />
        </article>
        <article>
          <span>Blocked now</span>
          <h2>Unsafe activation stays closed</h2>
          <TruthList items={truth.blockedNow} />
        </article>
        <article>
          <span>Legal review</span>
          <h2>Not legal advice</h2>
          <TruthList items={truth.futureLegalReview} />
        </article>
        <article>
          <span>Swiss / global review</span>
          <h2>Future review gates</h2>
          <TruthList items={[...truth.futureSwissReview, ...truth.futureGlobalReview]} />
        </article>
      </section>

      <section className={styles.actionPanel}>
        <article data-one-next-action="true">
          <span>One Next Action</span>
          <strong>{truth.oneNextAction}</strong>
        </article>
        <article data-what-not-to-do="true">
          <span>What Not To Do</span>
          <ul>
            {truth.whatNotToDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

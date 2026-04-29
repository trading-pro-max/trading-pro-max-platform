import { ProMaxDeviceTimeRealityBar } from "@/app/_components/ProMaxDeviceTimeRealityBar";
import { ProMaxLivingEarthLayers } from "@/app/_components/ProMaxLivingEarthLayers";
import { ProMaxLivingEarth } from "@/app/_components/ProMaxLivingEarth";
import { ProMaxLivingUniverseBackground } from "@/app/_components/ProMaxLivingUniverseBackground";
import { ProMaxRealitySourceBar } from "@/app/_components/ProMaxRealitySourceBar";
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
          <h1>Universe Command Center</h1>
          <small className={styles.legacyUniverseTitle}>
            ALKON / Alkon -0 Project Universe
          </small>
          <p>{truth.identityLine}</p>
          <p>Universe stays private on Ahmad&apos;s devices.</p>
        </div>
        <div className={styles.accessCard}>
          <span>Universe status</span>
          <strong>Private / read-only</strong>
          <small>Product Truth guarded</small>
        </div>
      </header>

      <ProMaxDeviceTimeRealityBar variant="full" />
      <ProMaxUniverseSoundscape />

      <section className={styles.hierarchyPanel} data-testid="private-universe-hierarchy">
        <div>
          <span>Official Layer Order</span>
          <h2>Private Universe manages Pro Max Earth</h2>
          <p>Universe privately manages Pro Max.</p>
        </div>
        <pre className={styles.hierarchyTree}>
{`Ahmad Private Devices
└── Universe — Private Living Operating System
    └── Pro Max Earth — Future Global Product
        ├── Living Earth Reality — Device-Time Life Layers
        ├── /trading — Trading Ground
        ├── Public Pro Max Surfaces — Future Public Product Layer
        └── ALKON — Private Background Guardian`}
        </pre>
        <div className={styles.layerGrid}>
          {truth.layerOrder.map((layer) => (
            <article key={layer.id}>
              <span>Layer {layer.layerOrder}</span>
              <strong>{layer.label}</strong>
              <small>{layer.truth}</small>
            </article>
          ))}
        </div>
        <p>Pro Max is the product that may appear to the world.</p>
        <p>Pro Max is private until legally ready.</p>
        <p>Public Pro Max launch is blocked until all gates close.</p>
        <p>Real when sourced. Simulated when labeled.</p>
        <p>Weather is not connected.</p>
        <p>Legal review is pending.</p>
        <p>ALKON stays private/background.</p>
        <p>ALKON is background guardian support, not the second layer.</p>
        <p>Goal: world-class legally ready global product.</p>
      </section>

      <ProMaxLivingEarthLayers />

      <section className={styles.metricGrid} aria-label="Universe status">
        <article>
          <span>Ahmad Private Devices</span>
          <strong>Universe private only</strong>
          <small>Universe stays private on Ahmad&apos;s devices.</small>
        </article>
        <article>
          <span>Universe state</span>
          <strong>Private living operating system</strong>
          <small>Universe is a private living operating system and visual simulation.</small>
        </article>
        <article>
          <span>Pro Max Earth</span>
          <strong>Product planet</strong>
          <small>Pro Max Earth is the product planet inside Universe.</small>
        </article>
        <article>
          <span>Trading Ground</span>
          <strong>Demo-safe / read-only</strong>
          <small>Trading Ground on Pro Max Earth.</small>
        </article>
        <article>
          <span>Public Pro Max future</span>
          <strong>Blocked until gates close</strong>
          <small>Brand, legal, compliance, billing, broker, asset, and Founder gates remain pending.</small>
        </article>
        <article>
          <span>ALKON background guardian</span>
          <strong>Private / read-only</strong>
          <small>ALKON stays private/background.</small>
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

      <ProMaxRealitySourceBar variant="full" />

      <section className={styles.truthPanel} data-product-truth="true">
        <div>
          <span>Product Truth</span>
          <h2>Blocked gates remain blocked</h2>
        </div>
        <div className={styles.truthStrip}>
          <span>Private: yes</span>
          <span>Universe: Ahmad devices only</span>
          <span>Read-only/demo-safe: yes</span>
          <span>Pro Max: working_name_only</span>
          <span>Pro Max public/global approval: false</span>
          <span>Real money: disabled</span>
          <span>Broker execution: disabled/not connected</span>
          <span>Trading: demo-safe/read-only</span>
          <span>Public launch: not started</span>
          <span>Public launch: blocked/not started</span>
          <span>Billing: not active</span>
          <span>Brand Gate: frozen/deferred</span>
          <span>Brand Gate: ready_with_notes</span>
          <span>Local Day One: not_started</span>
          <span>ALKON public exposure: no</span>
          <span>ALKON: private/read-only/background</span>
          <span>Swiss legal-review: pending</span>
          <span>Global legal-review: pending</span>
          <span>Swiss-inspired visual identity only; no government endorsement</span>
          <span>Device-time simulation only</span>
          <span>Device-date simulation only</span>
          <span>Weather not connected</span>
          <span>Weather is not connected</span>
          <span>Location: not requested</span>
          <span>Assets: local/procedural/license-safe</span>
          <span>Assets: local/legal-safe/procedural/manifest-tracked</span>
          <span>Soundscape: user controlled/off by default</span>
          <span>Private until legally ready</span>
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

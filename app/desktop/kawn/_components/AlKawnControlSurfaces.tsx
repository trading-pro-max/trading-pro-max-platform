import type {
  AlKawnControlSurface,
  AlKawnControlSurfaceSummary,
} from "@/lib/server/universe/control-surfaces";
import styles from "../al-kawn-desktop.module.css";

function ActionList({
  label,
  actions,
}: {
  label: string;
  actions: AlKawnControlSurface["directInternalActions"];
}) {
  return (
    <article>
      <span>{label}</span>
      {actions.map((action) => (
        <small key={action.id}>
          <strong>{action.label}</strong> - {action.detail}
        </small>
      ))}
    </article>
  );
}

export function AlKawnControlSurfaces({
  surfaces,
  summary,
}: {
  surfaces: AlKawnControlSurface[];
  summary: AlKawnControlSurfaceSummary;
}) {
  const selectedSurface =
    surfaces.find((surface) => surface.id === "kernel") ?? surfaces[0];

  return (
    <section
      className={styles.controlSurfaces}
      data-testid="al-kawn-control-surfaces"
      aria-label="Al-Kawn Control Surfaces"
    >
      <div className={styles.sectionTitle}>
        <span>Control Surfaces</span>
        <h2>Each layer has a control surface</h2>
      </div>
      <p>
        Control surfaces make الكون controllable before Infinity Mode or Operator Mode can
        be prepared. Inside الكون: clean internal actions execute directly. Legal stops
        for Ahmad. Money stops for Ahmad. Product Truth violations are blocked.
      </p>
      <div className={styles.truthChips}>
        <span>Total {summary.total}</span>
        <span>Active {summary.active}</span>
        <span>Protected {summary.protected}</span>
        <span>Future {summary.future}</span>
        <span>Blocked {summary.blocked}</span>
        <span>Active with notes {summary.activeWithNotes}</span>
      </div>
      <div className={styles.truthChips}>
        <span>داخل الكون: التنفيذ مباشر.</span>
        <span>عند القانون: يتوقف لأحمد.</span>
        <span>عند المال: يتوقف لأحمد.</span>
        <span>Product Truth هو قانون الحقيقة الأعلى.</span>
        <span>Universe Operating Kernel هو القاضي التنفيذي.</span>
      </div>

      <div className={styles.controlSurfaceGrid}>
        {surfaces.map((surface) => (
          <article key={surface.id} className={styles.controlSurfaceCard}>
            <span>{surface.status}</span>
            <strong>{surface.label}</strong>
            <small>{surface.arabicLabel}</small>
            <p>{surface.purpose}</p>
            <small>Owner: {surface.ownerLayer}</small>
            <small>Product Truth impact: {surface.productTruthImpact}</small>
            <em>{surface.nextSafeAction}</em>
          </article>
        ))}
      </div>

      <div className={styles.controlDetail}>
        <div>
          <span>Selected surface detail panel</span>
          <h3>{selectedSurface.label}</h3>
          <p>{selectedSurface.purpose}</p>
          <div className={styles.stateList}>
            {selectedSurface.visibleState.map((state, index) => (
              <span key={`control-visible-state-${selectedSurface.id}-${index}-${state}`}>
                {state}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.actionColumns}>
          <ActionList
            label="Direct internal execution"
            actions={selectedSurface.directInternalActions}
          />
          <ActionList label="Legal stop" actions={selectedSurface.legalStopActions} />
          <ActionList label="Money stop" actions={selectedSurface.moneyStopActions} />
          <ActionList
            label="Blocked by Product Truth"
            actions={selectedSurface.blockedActions}
          />
        </div>
        <footer>
          <span>Related route: {selectedSurface.relatedRoute}</span>
          <span>Related report: {selectedSurface.relatedReport}</span>
          <span>Related test: {selectedSurface.relatedTest}</span>
          <strong>Next safe action: {summary.nextSafeAction}</strong>
        </footer>
      </div>
    </section>
  );
}

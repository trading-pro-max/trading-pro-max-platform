import type { SourceLawSnapshot } from "@/lib/server/source-law";

export default function AlkonVisionCorePanel({
  snapshot,
}: {
  snapshot: SourceLawSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-vision-core="true">
      <div className="tpm-founder-panel-head">
        <span>Ahmad Vision Core</span>
        <h2>Private source alignment</h2>
        <p>{snapshot.visionAlignment.reason}</p>
      </div>
      <ul className="tpm-founder-list">
        <li>
          <span>Vision</span>
          <strong>{snapshot.visionCore.vision}</strong>
          <small>Public doctrine visible: {String(!snapshot.visionCore.noPublicDoctrine)}</small>
        </li>
        <li>
          <span>Founder authority</span>
          <strong>{String(snapshot.visionCore.founderFinalAuthority)}</strong>
          <small>Review needed: {String(snapshot.visionAlignment.founderReviewNeeded)}</small>
        </li>
      </ul>
    </section>
  );
}

import Link from "next/link";
import { getPublicDeviceRegistry } from "@/lib/server/devices";

const availabilityLabel = {
  current: "Current",
  planned: "Planned",
  future: "Future",
  internal_only: "Internal",
  blocked: "Blocked",
} as const;

export default function PublicAppsPlatformsSection() {
  const platforms = getPublicDeviceRegistry();

  return (
    <section
      className="tpm-product-section tpm-product-section-compact"
      data-public-section="apps-platforms"
      id="apps-platforms"
    >
      <div className="tpm-product-section-head">
        <div>
          <span className="tpm-product-kicker">Apps / Platforms</span>
          <h2>Use Pro Max Web App today. Desktop and mobile stay planned.</h2>
        </div>
        <p>Pro Max Trading is web-first and paper-safe. No fake downloads, no store listing claim, and no native app release claim.</p>
      </div>

      <div className="tpm-public-readiness-grid tpm-device-public-grid">
        {platforms.map((item) => (
          <article
            key={item.deviceId}
            className="tpm-foundation-card tpm-product-card tpm-device-card"
            data-device-id={item.deviceId}
            data-device-availability={item.availability}
          >
            <div className="tpm-product-card-head">
              <strong>{item.publicName}</strong>
              <span className="tpm-product-chip">
                {availabilityLabel[item.availability]}
              </span>
            </div>
            <p>{item.role}</p>
            <div className="tpm-device-truth-row" aria-label={`${item.publicName} truth`}>
              <span>{item.installStatus.replace(/_/g, " ")}</span>
              <span>{item.permissionLevel.replace(/_/g, " ")}</span>
            </div>
            <small>{item.productTruthNotes.join(" ")}</small>
          </article>
        ))}
      </div>

      <div className="tpm-product-cta-row tpm-device-cta-row">
        <Link className="tpm-product-cta tpm-product-cta-primary" href="/en">
          Use Web App
        </Link>
        <span className="tpm-product-cta tpm-product-cta-secondary" aria-disabled="true">
          Desktop planned
        </span>
        <span className="tpm-product-cta tpm-product-cta-secondary" aria-disabled="true">
          Mobile planned
        </span>
        <span className="tpm-product-cta tpm-product-cta-secondary" aria-disabled="true">
          Tablet future
        </span>
      </div>
    </section>
  );
}

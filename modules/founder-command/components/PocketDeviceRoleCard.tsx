import type { AlkonPocketUniverseSnapshot } from "@/lib/server/devices";

type PocketDeviceRole = AlkonPocketUniverseSnapshot["deviceRoles"][number];

export default function PocketDeviceRoleCard({ device }: { device: PocketDeviceRole }) {
  return (
    <article className="tpm-founder-subpanel alkon-pocket-card" data-pocket-device={device.deviceId}>
      <span>{device.constellationRole}</span>
      <h3>{device.privateName}</h3>
      <p>{device.role}</p>
      <dl className="alkon-command-facts">
        <div>
          <dt>Allowed</dt>
          <dd>{device.allowed.join(" / ")}</dd>
        </div>
        <div>
          <dt>Blocked</dt>
          <dd>{device.blocked.join(" / ")}</dd>
        </div>
      </dl>
    </article>
  );
}


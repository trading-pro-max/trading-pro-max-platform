import type { AlkonPocketUniverseSnapshot } from "@/lib/server/devices";

type PocketDeviceRole = AlkonPocketUniverseSnapshot["deviceRoles"][number];
const MAX_VISIBLE_ALLOWED = 4;
const MAX_VISIBLE_BLOCKED = 6;

function formatCapability(capability: string) {
  return capability.replace(/_/g, " ");
}

function CapabilityList({
  capabilities,
  hiddenLabel,
  maxVisible,
}: {
  capabilities: string[];
  hiddenLabel: string;
  maxVisible: number;
}) {
  const visibleCapabilities = capabilities.slice(0, maxVisible);
  const hiddenCount = capabilities.length - visibleCapabilities.length;

  return (
    <dd className="alkon-pocket-capability-list">
      {visibleCapabilities.map((capability) => (
        <span key={capability}>{formatCapability(capability)}</span>
      ))}
      {hiddenCount > 0 ? <span>{hiddenCount} more {hiddenLabel}</span> : null}
    </dd>
  );
}

export default function PocketDeviceRoleCard({ device }: { device: PocketDeviceRole }) {
  return (
    <article className="tpm-founder-subpanel alkon-pocket-card" data-pocket-device={device.deviceId}>
      <span>{formatCapability(device.constellationRole)}</span>
      <h3>{device.privateName}</h3>
      <p>{device.role}</p>
      <dl className="alkon-command-facts alkon-pocket-capability-facts">
        <div>
          <dt>Allowed</dt>
          <CapabilityList
            capabilities={device.allowed}
            hiddenLabel="allowed"
            maxVisible={MAX_VISIBLE_ALLOWED}
          />
        </div>
        <div>
          <dt>Blocked</dt>
          <CapabilityList
            capabilities={device.blocked}
            hiddenLabel="blocked"
            maxVisible={MAX_VISIBLE_BLOCKED}
          />
        </div>
      </dl>
    </article>
  );
}

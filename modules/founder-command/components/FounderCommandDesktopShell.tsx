import type { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";

type FounderCommandAppSnapshot = ReturnType<typeof getFounderCommandAppSnapshot>;

type FounderCommandDesktopShellProps = {
  snapshot: FounderCommandAppSnapshot;
};

export default function FounderCommandDesktopShell({
  snapshot,
}: FounderCommandDesktopShellProps) {
  return (
    <section className="tpm-founder-command-desktop-shell" aria-label="Founder desktop command shell">
      <header>
        <span>Desktop command app</span>
        <h2>Full planet command layout</h2>
        <p>{snapshot.desktopApp.purpose}</p>
      </header>

      <div className="tpm-founder-command-shell-grid">
        {snapshot.desktopApp.primaryScreens.slice(0, 8).map((screen) => (
          <article key={screen}>
            <span>Zone</span>
            <strong>{screen}</strong>
            <small>Read-only foundation</small>
          </article>
        ))}
      </div>
    </section>
  );
}

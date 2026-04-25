import type { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";

type FounderCommandAppSnapshot = ReturnType<typeof getFounderCommandAppSnapshot>;

type FounderCommandMobileShellProps = {
  snapshot: FounderCommandAppSnapshot;
};

export default function FounderCommandMobileShell({
  snapshot,
}: FounderCommandMobileShellProps) {
  return (
    <section className="tpm-founder-command-mobile-shell" aria-label="Founder mobile command shell">
      <header>
        <span>Mobile command app</span>
        <h2>Urgent review shell</h2>
        <p>{snapshot.mobileApp.purpose}</p>
      </header>

      <div className="tpm-founder-command-mobile-stack">
        {snapshot.mobileApp.primaryScreens.slice(0, 6).map((screen) => (
          <article key={screen}>
            <strong>{screen}</strong>
            <small>No approval execution. No secrets. No private user data.</small>
          </article>
        ))}
      </div>
    </section>
  );
}

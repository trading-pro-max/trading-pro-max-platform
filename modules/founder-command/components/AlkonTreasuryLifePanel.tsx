import type { TreasuryLifeSnapshot } from "@/lib/server/treasury-life";

export default function AlkonTreasuryLifePanel({
  snapshot,
}: {
  snapshot: TreasuryLifeSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-treasury-life-panel">
      <span>Treasury Life</span>
      <h3>Founder-funded to revenue-funded readiness</h3>
      <p>
        Treasury is evidence and review only. The app stores no bank/card data,
        sends no invoices, performs no tax filing, and executes no payments.
      </p>
      <div className="alkon-command-facts">
        <div>
          <dt>Funding</dt>
          <dd>{snapshot.fundingMode}</dd>
        </div>
        <div>
          <dt>Cap</dt>
          <dd>{snapshot.budgetCap.initialCap} {snapshot.budgetCap.currency}</dd>
        </div>
        <div>
          <dt>Autopay</dt>
          <dd>{snapshot.autopayReadiness}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>{snapshot.paymentExecutionStatus}</dd>
        </div>
      </div>
    </section>
  );
}

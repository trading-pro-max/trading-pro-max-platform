import type { PlanEntitlementContract, PlanEntitlementSnapshot } from "@/lib/plans/types";
import { getPlanVisualIdentity } from "@/lib/plans/visual-identity";
import PlanCapabilityList from "./PlanCapabilityList";

type PlanExperienceCardProps = {
  currentPlan: PlanEntitlementSnapshot["currentPlan"];
  plan: PlanEntitlementContract;
  truth: PlanEntitlementSnapshot["truth"];
};

function planStateLabel(plan: PlanEntitlementContract) {
  if (plan.truthState === "paper_active") return "Paper-safe active";
  if (plan.truthState === "planned_locked") return "Planned / locked";
  return "Future planned";
}

export default function PlanExperienceCard({
  currentPlan,
  plan,
  truth,
}: PlanExperienceCardProps) {
  const identity = getPlanVisualIdentity(plan.visualIdentity);
  const active = currentPlan === plan.planId;

  return (
    <article
      className={`tpm-plan-experience-card ${identity.className}`}
      data-current={active}
      data-plan={plan.planId}
    >
      <header>
        <div>
          <span className={identity.badgeClassName}>{identity.shortLabel}</span>
          <h3>{plan.planName}</h3>
          <p>{identity.tone}</p>
        </div>
        <strong>{planStateLabel(plan)}</strong>
      </header>

      <div className="tpm-plan-experience-truth">
        <span>Assistant: {identity.assistantIdentity}</span>
        <span>Billing: {truth.billing}</span>
        <span>Paid access: {truth.paidAccess}</span>
        <span>Founder Command: owner-only</span>
      </div>

      <div className="tpm-plan-experience-columns">
        <PlanCapabilityList title="Active now" features={plan.allowedFeatures.slice(0, 4)} />
        <PlanCapabilityList
          title="Locked / planned"
          features={[...plan.lockedFeatures, ...plan.comingLaterFeatures].slice(0, 4)}
        />
      </div>

      <footer>
        <p>{plan.upgradeExplanation}</p>
        <small>
          VIP activation: {truth.vipActivation}; no billing, checkout, or premium unlock exists.
        </small>
      </footer>
    </article>
  );
}

import type {
  PlanEntitlementContract,
  PlanEntitlementSnapshot,
  PlanPlanetAccessLayer,
} from "@/lib/plans/types";
import { getPlanInterfaceLayerForPlan } from "@/lib/plans/interface-architecture";
import { getPlanVisualIdentity } from "@/lib/plans/visual-identity";
import PlanCapabilityList from "./PlanCapabilityList";

type PlanExperienceCardProps = {
  currentPlan: PlanEntitlementSnapshot["currentPlan"];
  layer?: PlanPlanetAccessLayer;
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
  layer,
  plan,
  truth,
}: PlanExperienceCardProps) {
  const identity = getPlanVisualIdentity(plan.visualIdentity);
  const interfaceLayer = getPlanInterfaceLayerForPlan(plan.planId);
  const active = currentPlan === plan.planId;

  return (
    <article
      className={`tpm-plan-experience-card ${identity.className}`}
      data-current={active}
      data-plan={plan.planId}
      data-plan-realm={plan.realmId}
    >
      <header>
        <div>
          <span className={identity.badgeClassName}>{identity.shortLabel}</span>
          <h3>{plan.planName}</h3>
          <p>{identity.functionalDepth}</p>
        </div>
        <strong>{planStateLabel(plan)}</strong>
      </header>

      <div className="tpm-plan-experience-truth">
        <span>Assistant: {identity.assistantIdentity}</span>
        <span>Interface: {interfaceLayer.headline}</span>
        <span>Workspace: {layer?.activeLayer ?? "Plan readiness"}</span>
        <span>Reports: {plan.reportsDepth}</span>
        <span>Billing: {truth.billing}</span>
        <span>Paid access: {truth.paidAccess}</span>
      </div>

      <p className="tpm-plan-interface-note">{plan.workspaceBehavior}</p>
      <p className="tpm-plan-interface-note">{plan.journalCoachDepth}</p>

      <div className="tpm-plan-experience-columns">
        <PlanCapabilityList title="Active now" features={plan.allowedFeatures.slice(0, 4)} />
        <PlanCapabilityList
          title="Locked / planned"
          features={[...plan.lockedFeatures, ...plan.comingLaterFeatures].slice(0, 4)}
        />
      </div>

      <footer>
        <p>{plan.upgradeExplanation}</p>
        {layer ? <p>{layer.upgradeExplanation}</p> : null}
        <small>
          VIP activation: {truth.vipActivation}; no billing, checkout, or premium unlock exists.
        </small>
      </footer>
    </article>
  );
}

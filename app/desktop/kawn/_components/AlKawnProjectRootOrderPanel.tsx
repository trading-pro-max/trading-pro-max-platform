import type { AlKawnDeviceUniverseFabric } from "@/lib/server/universe/device-fabric";
import type { AlKawnModularWorlds } from "@/lib/server/universe/modular-worlds";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnProjectRootOrderPanel({
  fabric,
  modularWorlds,
}: {
  fabric: AlKawnDeviceUniverseFabric;
  modularWorlds: AlKawnModularWorlds;
}) {
  const visibleRules = [
    fabric.requiredWording[0],
    fabric.requiredWording[1],
    fabric.requiredWording[2],
    fabric.requiredWording[3],
    fabric.requiredWording[4],
    modularWorlds.requiredWording[0],
    modularWorlds.requiredWording[1],
    modularWorlds.requiredWording[2],
    fabric.requiredWording[8],
    fabric.requiredWording[9],
    fabric.requiredWording[10],
  ];

  return (
    <section
      className={styles.projectRootOrderPanel}
      data-testid="al-kawn-project-root-order"
      aria-label="Al-Kawn project root order foundation"
    >
      <div className={styles.projectRootOrderHeader}>
        <span>Project Root Order Foundation</span>
        <h2>الكون يبقى داخل أجهزة أحمد الشخصية فقط.</h2>
        <p>الاستخدام شخصي لأحمد فقط.</p>
        <p>Product Truth يحكم كل شيء.</p>
      </div>

      <div className={styles.projectRootOrderGrid}>
        <article>
          <span>Device Fabric</span>
          <strong>الكون لا يبدأ من مجلد؛ الكون يبدأ من جهاز أحمد الشخصي.</strong>
          <small>لابتوب أحمد هو نطاق الكون المحلي.</small>
        </article>
        <article>
          <span>Command Workspace</span>
          <strong>AL-KAWN هو مركز قيادة داخل نطاق الجهاز.</strong>
          <small>Active repo remains unchanged until a migration report exists.</small>
        </article>
        <article>
          <span>Modular Worlds</span>
          <strong>كل مشروع داخل الكون له مجلد كامل مستقل.</strong>
          <small>كل المشاريع تعمل معًا عبر Al-Kawn Core.</small>
        </article>
        <article>
          <span>Contracts</span>
          <strong>الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.</strong>
          <small>Product Truth, Kernel Verdict, Rights, Privacy, and UI contracts govern worlds.</small>
        </article>
      </div>

      <div className={styles.projectRootOrderRules}>
        {visibleRules.map((rule, index) => (
          <span key={`project-root-order-rule-${index}`}>{rule}</span>
        ))}
      </div>

      <div className={styles.projectRootOrderFooter}>
        <strong>لا حذف قبل الجرد والتصنيف.</strong>
        <strong>لا نقل للريبو النشط قبل تقرير migration.</strong>
        <small>{fabric.nextAction}</small>
      </div>
    </section>
  );
}

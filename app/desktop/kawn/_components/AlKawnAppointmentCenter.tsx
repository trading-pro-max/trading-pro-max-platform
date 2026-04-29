import type { AlKawnDesktopAppointment } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnAppointmentCenter({
  appointments,
}: {
  appointments: AlKawnDesktopAppointment[];
}) {
  return (
    <section className={styles.panel} aria-label="appointment placeholder">
      <div className={styles.sectionTitle}>
        <span>Appointment Center</span>
        <h2>Appointment placeholder</h2>
      </div>
      <p>Appointments are private and local-first</p>
      <p>External calendar connection requires Ahmad approval</p>
      <p>Sensitive appointments must not be committed to Git</p>
      {appointments.map((appointment) => (
        <article key={appointment.id}>
          <strong>{appointment.title}</strong>
          <small>{appointment.rule}</small>
          <em>{appointment.nextStep}</em>
        </article>
      ))}
    </section>
  );
}

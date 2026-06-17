import "@/components/lessons/lesson.css";

export function MedizinHinweis() {
  return (
    <div className="warn-box">
      <strong>⚕️ Nur zur Veranschaulichung</strong> — keine medizinische Behandlungsempfehlung.
      {" "}Alle Angaben dienen ausschließlich der allgemeinen Information.
      Bitte konsultiere dein Diabetes-Fachteam, bevor du Einstellungen, Insulin oder Geräte änderst.
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import { MedizinHinweis } from "@/components/lessons/MedizinHinweis";
import "@/components/lessons/lesson.css";

export default function PenVsPumpe() {
  return (
    <div className="lesson-card">
      <h2>Resorption: Pen vs. Insulinpumpe</h2>
      <MedizinHinweis />
      <p className="lesson-description">
        Dasselbe Insulin kann unterschiedlich wirken — je nachdem, ob es als einzelne Pen-Dosis
        oder als kontinuierliche Mikrodosen per Pumpe appliziert wird. Der Unterschied liegt
        im subkutanen Depot.
      </p>

      <div className="info-box">
        <strong>Kernprinzip:</strong> Je kleiner das injizierte Volumen, desto kleiner das
        Depot — und desto gleichmäßiger und schneller die Resorption ins Blut.
      </div>

      <div className="actors">
        <div className="actor-card" style={{ borderLeft: "4px solid #3b82f6" }}>
          <div className="actor-title">💉 Pen (MDI)</div>
          <ul
            style={{
              paddingLeft: "18px",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "#374151",
              margin: 0,
            }}
          >
            <li>4–6 Injektionen pro Tag</li>
            <li>Bolus: 3–15 IE auf einmal → großes Depot</li>
            <li>Langwirkend (Basal) + Kurzwirkend (Bolus)</li>
            <li>Resorption variiert je nach Injektionsstelle</li>
            <li>Stichtiefe beeinflusst Wirkbeginn stark</li>
          </ul>
        </div>
        <div className="actor-card" style={{ borderLeft: "4px solid #10b981" }}>
          <div className="actor-title">🔄 Pumpe (CSII)</div>
          <ul
            style={{
              paddingLeft: "18px",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "#374151",
              margin: 0,
            }}
          >
            <li>Kontinuierliche Basalrate (z.B. 0,05 IE alle 3 Min)</li>
            <li>Bolus: gleiche Menge, aber kleineres Einzel-Depot</li>
            <li>Nur kurzwirksames Insulin (24/7)</li>
            <li>Infusionsset alle 2–3 Tage wechseln</li>
            <li>Temporäre Basalraten für Sport und Krankheit möglich</li>
          </ul>
        </div>
      </div>

      <h3>Was beeinflusst die Resorption?</h3>
      <ol className="step-list">
        <li>
          <strong>Injektionsstelle:</strong> Bauch (schnellste Resorption){" "}
          &gt; Oberschenkel &gt; Gesäß &gt; Oberarm (langsamste). Rotation ist wichtig,
          aber der Körperbereich bleibt ein Faktor.
        </li>
        <li>
          <strong>Lipohypertrophie:</strong> Narbengewebe durch wiederholte Injektionen
          an derselben Stelle. Insulin wird im Narbengewebe unvorhersehbar resorbiert —
          häufigster Grund für unerklärlich schlechte Werte trotz korrekter Dosierung.
        </li>
        <li>
          <strong>Körperwärme:</strong> Ein heißes Bad, Sauna oder Sport kurz nach der
          Injektion kann die Resorption drastisch beschleunigen — Unterzuckerungsgefahr.
        </li>
        <li>
          <strong>Injektionstiefe:</strong> Zu tiefe Injektion erreicht den Muskel —
          deutlich schnellere Resorption als subkutan beabsichtigt.
        </li>
        <li>
          <strong>Depotgröße:</strong> Je mehr Insulin auf einmal, desto länger braucht
          das Depot zum Auflösen. Das ist der Kernvorteil der Pumpe bei Basalraten:
          die Mikrodosen erzeugen kein nennenswertes Depot.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum gibt die Pumpe stabilere Werte?">
        Eine Pumpe liefert die Basalrate als Mikrodosen — z.B. 1,2 IE/h als 0,006 IE alle
        18 Sekunden. Das Depot im Gewebe bleibt winzig klein, die Auflösung erfolgt fast
        sofort. Beim Pen-Basal (z.B. 12 IE Lantus einmal täglich) liegt dagegen ein großes
        Depot vor, das 24 Stunden lang variabel resorbiert wird. Das erklärt die bekannte
        Tag-zu-Tag-Variabilität bei Langzeitinsulinen — nicht das Insulin ist unzuverlässig,
        sondern die Resorption des großen Depots.
      </DepthBox>

      <DepthBox variant="mistake" title="Lipohypertrophie: der stille Saboteur">
        Studien zeigen, dass ein erheblicher Teil der Pen-Anwenderinnen und -Anwender
        Lipohypertrophie (Fettgewebsverdickung durch wiederholte Injektionen an derselben
        Stelle) hat — oft ohne es zu wissen. Das Insulin im Narbengewebe wirkt anders:
        mal gar nicht, mal mit Stunden Verzögerung. Einfaches Gegenmittel: Den
        Injektionsbereich systematisch in Quadranten aufteilen und täglich rotieren.
      </DepthBox>

      <DepthBox variant="deeper" title="Closed-Loop und geschlossene Systeme">
        Moderne Pumpen (z.B. MiniMed 780G, CamAPS FX, Omnipod 5) kombinieren sich mit
        CGM-Geräten zu einem Closed-Loop-System: Der Algorithmus passt die Basalrate
        automatisch an den aktuellen und vorhergesagten Blutzucker an. Das funktioniert
        besonders gut, weil die Pumpen-Resorptionskurve stabiler und vorhersagbarer ist
        als die des Pen-Basalinsulins — der Algorithmus kann sein Modell eng kalibrieren.
      </DepthBox>

      <DepthBox variant="related" title="Haengt zusammen mit: CGM und xDrip+">
        Pumpe oder Pen — in beiden Fällen ist ein kontinuierliches Glukosemessgerät (CGM)
        die wichtigste Entscheidungsgrundlage für Dosierungen. Wie man Dexcom G6/G7 mit
        xDrip+ und Juggluco einrichtet, erklärt die nächste Lektion.
      </DepthBox>
    </div>
  );
}

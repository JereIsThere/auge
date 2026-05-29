import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe } from "@/components/lessons/Aufgabe";
import "@/components/lessons/lesson.css";

export default function MotorImagery() {
  return (
    <div className="lesson-card">
      <h2>Motor Imagery — Bewegung im Kopf</h2>
      <p className="lesson-description">
        Wenn man sich eine Bewegung nur <em>vorstellt</em> — ohne sie
        auszuführen —, feuern fast dieselben Hirnareale wie bei der
        echten Ausführung. Was als Esoterik klingt, ist seit fMRT-Zeiten
        gut dokumentiert und gehört zu den evidenzstärksten Interventionen
        in der Neuroreha.
      </p>

      <div className="info-box">
        <strong>Die Kurzfassung:</strong> mentale Wiederholung aktiviert
        prämotorischen Cortex, ergänzendes Motorareal (SMA), Basalganglien
        und Kleinhirn — fast komplett wie echte Bewegung, nur der primäre
        Motorcortex feuert schwächer (Ausführung wird unterdrückt).
      </div>

      <h3>Zwei Arten von Motor Imagery</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">👁️ Visual Imagery (3rd person)</div>
          <div className="actor-row">
            Sich selbst von außen sehen, wie in einem Video. Aktiviert vor
            allem visuelle Verarbeitungs-Areale. Gut für Planung und
            Bewegungs-Analyse, aber weniger motorisch wirksam.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🤲 Kinaesthetic Imagery (1st person)</div>
          <div className="actor-row">
            Die Bewegung von <em>innen</em> fühlen — wie der Muskel sich
            spannt, das Gewicht in der Hand, der Widerstand. Aktiviert
            motorische Areale stark. <strong>Das ist die Reha-relevante
            Form.</strong>
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">⏱ Real-time vs. Slow-motion</div>
          <div className="actor-row">
            Beide funktionieren — aber: real-time imagery muss zeitlich
            der echten Bewegung entsprechen. Wenn die Vorstellung
            schneller läuft als die echte Bewegung dauern würde, ist es
            eher Visualisierung als Imagery. Stoppuhr-Test: vorstellen
            dauert in etwa so lang wie echte Ausführung.
          </div>
        </div>
      </div>

      <h3>Einsatz in der Reha</h3>
      <ol className="step-list">
        <li>
          <strong>Schlaganfall</strong> — paretische Hand, vor allem in der
          frühen Phase, wenn willkürliche Bewegung noch nicht möglich ist.
          Bahnen vorbereitend stärken, bevor echte Bewegung zurückkehrt.
        </li>
        <li>
          <strong>Postoperativ</strong> — nach Hand-OP oder Schulter-OP,
          wenn echte Bewegung kontraindiziert ist. Motor Imagery erhält die
          neuronalen Bahnen, damit der Muskel nach Wundheilung schneller
          reaktivierbar ist.
        </li>
        <li>
          <strong>Sport-Reha</strong> — Sportler:innen reduzieren mit Motor
          Imagery den Performance-Verlust während Verletzungspausen
          (gut dokumentiert in Klavier-, Basketball- und Skischuhfahrer-
          Studien).
        </li>
        <li>
          <strong>Phantomschmerz</strong> — bei Amputationen kann
          Motor-Imagery-Therapie (oft kombiniert mit Spiegeltherapie) die
          überaktive sensorische Cortex-Region wieder normalisieren.
        </li>
      </ol>

      <Aufgabe titel="Mini-Test — versuch's selbst" schwierigkeit="leicht" zeit="2 min">
        <p>
          Stell dir vor, du nimmst eine Tasse Kaffee vom Tisch. Mach es
          rein mental, nicht physisch. Achte auf:
        </p>
        <ul>
          <li>Welche Hand benutzt du in deiner Vorstellung?</li>
          <li>Spürst du das Gewicht? Die Wärme?</li>
          <li>Wie lange dauert die Vorstellung im Vergleich zur echten Bewegung?</li>
        </ul>
        <p>
          Wenn du die kinästhetischen Details spürst (Gewicht, Wärme,
          Spannung im Bizeps): du machst kinästhetische Motor Imagery.
          Wenn du dich nur „siehst": eher visuelle Imagery.
        </p>
      </Aufgabe>

      <DepthBox variant="why" title="Warum funktioniert das überhaupt?">
        Spiegelneuronen + interne Bewegungsmodelle. Das Gehirn
        unterscheidet zwischen einer geplanten und einer ausgeführten
        Bewegung erst sehr spät in der Verarbeitung — im präfrontal-
        motorischen Bereich laufen praktisch dieselben Prozesse ab. Die
        Hemmung „mache es jetzt wirklich" passiert ganz am Ende. Daher
        kann eine ausreichend lebendige Vorstellung die Vorbereitungs-
        und Planungs-Bahnen stärken wie echte Übung.
      </DepthBox>

      <DepthBox variant="mistake" title='"Stell dir einfach vor, dass du es kannst"'>
        Motor Imagery ist nicht positives Denken. „Stell dir vor, dass du
        gesund bist" hilft nicht. „Spüre, wie dein Bizeps sich anspannt,
        spüre das Gewicht des Stiftes, spüre den Druck der Fingerkuppen
        auf dem Papier" hilft. Spezifität ist entscheidend. Auch Dauer:
        15-20 min/Tag, mehrmals/Woche, über Wochen — wie körperliches
        Training.
      </DepthBox>

      <DepthBox variant="deeper" title="Aphantasie und Imagery">
        Ca. 2-5 % der Menschen haben Aphantasie — sie können sich Bilder
        kaum oder gar nicht vorstellen. Für klassische visuelle Imagery
        ist das ein echtes Hindernis, aber kinästhetische Motor Imagery
        funktioniert oft trotzdem (man muss die Bewegung ja nicht „sehen",
        sondern „spüren"). Vor Therapiebeginn mit dem KVIQ
        (Kinaesthetic and Visual Imagery Questionnaire) screenen, damit
        man weiß, womit man arbeitet.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Neuroplastizität (Imagery löst dieselben LTP-Mechanismen aus),
        Spiegeltherapie (visueller Trick, der Motor Imagery erleichtert,
        weil das Gehirn das Spiegelbild „glaubt"), und Action Observation
        Therapy (jemand anderen die Bewegung machen sehen + sich
        gleichzeitig vorstellen, sie selbst zu machen — zusätzlicher
        Spiegelneuron-Boost).
      </DepthBox>
    </div>
  );
}

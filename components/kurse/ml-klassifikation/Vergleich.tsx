import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function Vergleich() {
  return (
    <div className="lesson-card">
      <h2>Der große Vergleich</h2>
      <p className="lesson-description">
        Vier Verfahren, ein Dataset — jetzt nebeneinander. Diese Lektion
        gibt dir das Werkzeug, um in der Verteidigung die Frage zu
        beantworten, die garantiert kommt: <em>Warum dieses Verfahren und
        nicht ein anderes?</em>
      </p>

      <div className="info-box">
        <strong>Es gibt kein bestes Verfahren</strong> — nur das passendste
        für eine gegebene Kombination aus Daten, Hardware,
        Erklärbarkeits-Anforderung und Zeitbudget.
      </div>

      <h3>Die Vergleichstabelle</h3>
      <div style={{ overflowX: "auto" }}>
        <table className="ml-tabelle">
          <thead>
            <tr>
              <th>Kriterium</th>
              <th>Logistic Regression</th>
              <th>SVM</th>
              <th>Random Forest</th>
              <th>CNN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Input</th>
              <td colSpan={3}>handgebaute Features (Histogramm/Textur)</td>
              <td>rohe Pixel</td>
            </tr>
            <tr>
              <th>Entscheidungsgrenze</th>
              <td>linear</td>
              <td>linear / Kernel</td>
              <td>achsenparallele Stufen</td>
              <td>beliebig (gelernt)</td>
            </tr>
            <tr>
              <th>Skalierung nötig?</th>
              <td>ja</td>
              <td>ja (Pflicht)</td>
              <td>nein</td>
              <td>ja (0–1 oder −1…1)</td>
            </tr>
            <tr>
              <th>Trainingszeit (54k Bilder)</th>
              <td>Sekunden–Minuten</td>
              <td>Minuten (linear) bis Stunden (RBF)</td>
              <td>Minuten</td>
              <td>Minuten (Transfer) bis Stunden</td>
            </tr>
            <tr>
              <th>Hardware</th>
              <td>CPU</td>
              <td>CPU</td>
              <td>CPU (parallel)</td>
              <td>GPU empfohlen</td>
            </tr>
            <tr>
              <th>Erklärbarkeit</th>
              <td>hoch (Gewichte)</td>
              <td>mittel (Support-Vektoren)</td>
              <td>mittel (Importance)</td>
              <td>niedrig (Grad-CAM nötig)</td>
            </tr>
            <tr>
              <th>Typ. Accuracy*</th>
              <td>~70–90 %</td>
              <td>~75–90 %</td>
              <td>~80–92 %</td>
              <td>97 %+</td>
            </tr>
            <tr>
              <th>Hauptknopf</th>
              <td>C</td>
              <td>C &amp; gamma</td>
              <td>max_features</td>
              <td>Architektur &amp; Lernrate</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: "0.82rem", opacity: 0.7 }}>
        *Grobe Größenordnungen auf PlantVillage-Histogrammen bzw. Rohbildern
        — stark abhängig von Feature-Wahl, Bildgröße und Tuning. Nicht als
        Benchmark zitieren, sondern als Verhältnis lesen.
      </p>

      <h3>Entscheidungshilfe</h3>
      <ol className="step-list">
        <li>
          <strong>Erklärbarkeit ist Pflicht</strong> (Behörde, Medizin,
          Audit) → Logistic Regression, notfalls Random Forest. Niemals
          mit &bdquo;das CNN sagt krank&ldquo; vor Gericht.
        </li>
        <li>
          <strong>Tabellen-/Feature-Daten, schnelle solide Baseline</strong>{" "}
          → Random Forest. Pflegeleicht, kein Scaler, gute Defaults.
        </li>
        <li>
          <strong>Wenig Beispiele, viele Dimensionen</strong> → SVM
          (linear). Glänzt genau dort, wo CNNs verhungern.
        </li>
        <li>
          <strong>Rohe Bilder, genug Daten, Genauigkeit zählt</strong> →
          CNN, am besten via Transfer Learning.
        </li>
        <li>
          <strong>Im Zweifel</strong> → erst die einfachste Baseline
          (LogReg), dann nach oben arbeiten. Komplexität muss sich ihren
          Platz verdienen.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum nicht immer das CNN, wenn es gewinnt?">
        Weil die Accuracy-Spalte nur eine von acht Zeilen ist. Ein CNN, das
        2 Punkte mehr liefert, aber GPU braucht, nicht erklärbar ist, im
        Feld auf 31&nbsp;% einbricht (Domain Shift!) und Tage Tuning
        kostet, ist für viele reale Projekte die <em>schlechtere</em> Wahl.
        Reife im ML zeigt sich nicht darin, das stärkste Verfahren zu
        kennen, sondern die ganze Tabelle gegen die konkreten Projekt­ziele
        abzuwägen.
      </DepthBox>

      <DepthBox variant="deeper" title="Was es in der Tabelle nicht gibt: Ensembles über Verfahren">
        In der Praxis muss man sich nicht entscheiden. Ein{" "}
        <strong>Stacking-Ensemble</strong> kombiniert die Vorhersagen
        mehrerer Verfahren (z.B. CNN-Wahrscheinlichkeiten + RF auf
        Histogrammen) über ein Meta-Modell — oft besser als jedes Einzelne,
        weil die Fehler unterschiedlich gelagert sind. In sklearn:{" "}
        <code>StackingClassifier</code>. Für eure vier Projekte ein
        spannendes gemeinsames Finale: Schlägt das Team-Ensemble jedes
        Einzelmodell?
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Allen vorherigen Lektionen — das ist die Synthese. Besonders den{" "}
        <strong>Metriken</strong> (woran &bdquo;Accuracy&ldquo; oben wirklich
        gemessen wird) und der <strong>CNN-Transfer-Lektion</strong> (die
        Domain-Shift-Warnung relativiert die ganze Accuracy-Spalte).
      </DepthBox>

      <Aufgabe titel="Verfahrenswahl begründen" schwierigkeit="mittel" zeit="45 min">
        <p>
          Schreibe für <strong>dein</strong> in der Projektarbeit gebautes
          Verfahren eine einseitige Begründung, die ein Prüfer als
          Verteidigung akzeptieren würde. Stütze dich auf die
          Vergleichstabelle, bleib aber konkret bei PlantVillage.
        </p>
        <AufgabeCheckliste
          items={[
            "Benenne die Entscheidungsgrenze deines Verfahrens und was das für trennbare vs. überlappende Klassen bedeutet.",
            "Erkläre, welche Vorverarbeitung dein Verfahren zwingend braucht (Scaler? Features? Rescaling?) — und was passiert, wenn man sie weglässt.",
            "Nenne den/die wichtigsten Hyperparameter und in welche Richtung du sie bei Over- bzw. Underfitting drehst.",
            "Gib die für PlantVillage passende Metrik an (nicht nur Accuracy!) und begründe die Wahl mit der Klassen-Unbalance.",
            "Diskutiere ehrlich eine Schwäche: Wo würde dein Verfahren gegen die anderen drei verlieren?",
          ]}
        />
        <KiReview
          prompt={`Du bist Prüfer einer ML-Einführungsveranstaltung. Ich habe in einem Uni-Projekt ein Klassifikationsverfahren (Random Forest, SVM, CNN oder Logistic Regression) auf dem PlantVillage-Dataset (~54.000 Blatt-Fotos, 38 Klassen, stark unbalanciert) implementiert und verteidige nun meine Verfahrenswahl. Hier ist meine Begründung:

[HIER DEINE BEGRÜNDUNG EINFÜGEN]

Bewerte kritisch wie in einer mündlichen Prüfung. Prüfe konkret: (1) Stimmt meine Beschreibung der Entscheidungsgrenze und ist sie für das Problem passend begründet? (2) Habe ich die nötige Vorverarbeitung korrekt benannt — insbesondere Feature-Skalierung bei LogReg/SVM, Pixel-Rescaling beim CNN, oder korrekt deren Wegfall beim Random Forest? (3) Ist meine Hyperparameter-Logik richtig (z.B. C/gamma-Richtung, max_features, Lernrate, n_estimators)? (4) Habe ich verstanden, warum Accuracy bei unbalancierten Klassen irreführt und macro-F1 die ehrlichere Metrik ist? (5) Ist meine genannte Schwäche real und nicht nur Pflichtübung? Erwähne, falls ich die PlantVillage-Domain-Shift-Falle (99 % im Labor vs. ~31 % auf Feldfotos) übersehen habe. Schließe mit den zwei größten Verbesserungs-Hebeln meiner Argumentation.`}
        />
      </Aufgabe>
    </div>
  );
}

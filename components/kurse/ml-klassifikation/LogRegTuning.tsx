import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function LogRegTuning() {
  return (
    <div className="lesson-card">
      <h2>Tuning: C, Solver &amp; Fallstricke</h2>
      <p className="lesson-description">
        Logistic Regression hat erfreulich wenige Stellschrauben — aber die
        wenigen muss man verstehen. Und es gibt einen Fallstrick, der mehr
        Punkte kostet als jedes Tuning bringt: vergessenes Skalieren.
      </p>

      <div className="info-box">
        <strong>Wichtigster Knopf:</strong> C — die inverse
        Regularisierungsstärke. Kleines C = starke Regularisierung =
        einfacheres Modell. Großes C = das Modell darf den Trainingsdaten
        mehr glauben.
      </div>

      <h3>C verstehen statt raten</h3>
      <table className="ml-tabelle">
        <thead>
          <tr>
            <th></th>
            <th>C zu klein (z.B. 0.001)</th>
            <th>C zu groß (z.B. 1000)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Effekt</th>
            <td>Gewichte werden gegen 0 gedrückt</td>
            <td>Regularisierung praktisch aus</td>
          </tr>
          <tr>
            <th>Symptom</th>
            <td>Train- UND Test-Score schlecht (Underfitting)</td>
            <td>Train-Score top, Test-Score fällt ab (Overfitting)</td>
          </tr>
          <tr>
            <th>Diagnose</th>
            <td colSpan={2}>
              Train- und Validation-Score <em>gemeinsam</em> über C plotten
              — die Lücke zwischen beiden Kurven erzählt die Geschichte
            </td>
          </tr>
        </tbody>
      </table>

      <CodeBlock lang="python"
        title="tuning.py — Grid Search über C"
        code={`from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=2000, n_jobs=-1),
)

suche = GridSearchCV(
    pipe,
    param_grid={"logisticregression__C": [0.01, 0.1, 1, 10, 100]},
    cv=3,                    # 3-Fold CV auf den Trainingsdaten
    scoring="f1_macro",      # NICHT accuracy — Klassen sind unbalanciert!
    n_jobs=-1,
)
suche.fit(X_train, y_train)
print(suche.best_params_, suche.best_score_)`}
      />

      <h3>Die übrigen Knöpfe</h3>
      <ol className="step-list">
        <li>
          <strong>penalty</strong> — <code>l2</code> (Default, alle
          Gewichte klein halten) oder <code>l1</code> (Gewichte exakt auf 0
          drücken — eingebaute Feature-Auswahl, braucht Solver{" "}
          <code>saga</code>).
        </li>
        <li>
          <strong>solver</strong> — <code>lbfgs</code> für mittlere
          Datenmengen, <code>saga</code> für sehr viele Beispiele oder
          L1-Penalty. Für unsere 43.000 × 512-Matrix sind beide okay.
        </li>
        <li>
          <strong>class_weight=&quot;balanced&quot;</strong> — gewichtet
          seltene Klassen im Loss höher. Bei PlantVillage (150 vs. 5.500
          Bilder pro Klasse) fast immer einen Versuch wert; prüfe den
          Effekt am macro-F1.
        </li>
      </ol>

      <h3>Der teuerste Fehler: unskalierte Features</h3>
      <p>
        Regularisierung bestraft <em>große Gewichte</em>. Wenn Feature A in
        [0, 1] lebt und Feature B in [0, 10.000], braucht A zwangsläufig
        viel größere Gewichte, um denselben Einfluss zu haben — und wird
        von der Regularisierung dafür bestraft. Das Modell bevorzugt dann
        Features nach <em>Maßstab</em> statt nach <em>Nutzen</em>.
      </p>
      <CodeBlock
        title="Der Unterschied in Zahlen (typisch)"
        lang="text"
        code={`ohne StandardScaler:   Accuracy 0.61   + ConvergenceWarning
mit  StandardScaler:   Accuracy 0.84   konvergiert sauber

gleicher Code, gleiche Daten, gleiches Modell.`}
      />

      <DepthBox variant="why" title="Warum heißt es C und nicht λ?">
        In Lehrbüchern steht die Regularisierung meist als λ·||w||² im
        Loss — größeres λ, stärkere Strafe. scikit-learn folgt der
        SVM-Konvention und parametrisiert invers: C = 1/λ sitzt vor dem
        Daten-Term. Merksatz: <strong>C wie Confidence in die Daten</strong>.
        Wer zwischen Frameworks wechselt (Keras nutzt λ-Stil), muss diese
        Umrechnung im Kopf haben, sonst tunt man in die falsche Richtung.
      </DepthBox>

      <DepthBox variant="mistake" title="Auf Accuracy statt macro-F1 tunen">
        GridSearchCV optimiert per Default Accuracy. Bei 38 unbalancierten
        Klassen findet die Suche dann bevorzugt Parameter, die große
        Klassen weiter verbessern und kleine opfern — der Bericht sieht
        gut aus, die seltenen Krankheiten werden systematisch übersehen.{" "}
        <code>scoring=&quot;f1_macro&quot;</code> ist bei PlantVillage die
        ehrlichere Zielgröße. Generell gilt: Die Tuning-Metrik muss
        dieselbe sein wie die, an der das Projekt gemessen wird.
      </DepthBox>

      <DepthBox variant="deeper" title="L1 als Feature-Detektiv">
        Mit <code>penalty=&quot;l1&quot;</code> drückt die Regularisierung
        unwichtige Gewichte auf exakt 0 — übrig bleibt eine{" "}
        <strong>sparse</strong> Lösung. Bei 512 Histogramm-Bins bleiben je
        nach C vielleicht 60 aktive Bins übrig: Das Modell verrät damit,
        welche Farbbereiche die Krankheiten wirklich unterscheiden. Das ist
        nicht nur Kompression, sondern Erkenntnis — und ein guter
        Startpunkt, um die Feature-Extraktion gezielt zu verbessern.
        (Mathematischer Hintergrund: Die L1-Kugel hat Ecken auf den Achsen,
        und Optima landen gern in Ecken.)
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>SVM-Tuning-Lektion</strong> (C bedeutet dort dasselbe —
        plus gamma), den <strong>Metriken</strong> (macro-F1 als
        Tuning-Ziel) und der <strong>Features-Lektion</strong> (L1 sagt
        dir, welche Features du hättest weglassen können).
      </DepthBox>
    </div>
  );
}

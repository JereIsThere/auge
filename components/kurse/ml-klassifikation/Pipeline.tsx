import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";

export default function Pipeline() {
  return (
    <div className="lesson-card">
      <h2>Die ML-Pipeline</h2>
      <p className="lesson-description">
        Egal ob Logistic Regression oder CNN — der Weg von 54.000 Fotos zu
        einer belastbaren Zahl ist immer derselbe. Wer diese Pipeline einmal
        sauber verinnerlicht, erkennt 80&nbsp;% aller ML-Fehler sofort: Es
        sind fast immer Reihenfolge-Fehler.
      </p>

      <div className="info-box">
        <strong>Eiserne Regel:</strong> Alles, was aus den Daten{" "}
        <em>gelernt</em> wird (Skalierung, Modell, Feature-Auswahl), darf nur
        die <strong>Trainingsdaten</strong> sehen. Test-Daten sind tabu, bis
        die allerletzte Zahl berichtet wird.
      </div>

      <h3>Die sechs Schritte</h3>
      <div className="flow-step">
        <div className="flow-step-num">1</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Daten laden</div>
          <div className="flow-step-desc">
            Bilder + Labels aus der Ordnerstruktur einlesen. Ordnername =
            Klasse.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">2</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Split: Train / Validation / Test</div>
          <div className="flow-step-desc">
            Z.B. 70/15/15 — <em>stratifiziert</em>, damit jede der 38 Klassen
            in jedem Teil im gleichen Verhältnis vorkommt.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">3</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Preprocessing</div>
          <div className="flow-step-desc">
            Bilder skalieren, Features extrahieren, normalisieren. Scaler
            wird <strong>nur auf Train gefittet</strong>, dann auf alles
            angewendet.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">4</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Training</div>
          <div className="flow-step-desc">
            Das Verfahren lernt seine Parameter aus den Trainingsdaten —
            Gewichte, Splits oder Filter, je nach Modell.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">5</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Validierung &amp; Tuning</div>
          <div className="flow-step-desc">
            Hyperparameter (C, n_estimators, Lernrate…) am{" "}
            <em>Validation-Set</em> vergleichen — so oft du willst.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">6</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Finale Evaluation</div>
          <div className="flow-step-desc">
            Genau <strong>einmal</strong> auf dem Test-Set messen. Diese Zahl
            kommt in den Bericht.
          </div>
        </div>
      </div>

      <h3>In Python: Dateiliste + stratifizierter Split</h3>
      <p>
        Für die klassischen Verfahren sammeln wir erst Pfade und Labels,
        gesplittet wird <em>bevor</em> irgendetwas berechnet wird:
      </p>
      <CodeBlock
        title="split.py"
        code={`from pathlib import Path
from sklearn.model_selection import train_test_split

DATA_DIR = Path("plantvillage dataset/color")

pfade, labels = [], []
for klassen_ordner in sorted(DATA_DIR.iterdir()):
    for bild in klassen_ordner.glob("*.jpg"):
        pfade.append(bild)
        labels.append(klassen_ordner.name)

# 70 % Train, 30 % Rest — stratify hält die Klassenverhältnisse
X_train, X_rest, y_train, y_rest = train_test_split(
    pfade, labels, test_size=0.30, stratify=labels, random_state=42
)
# Rest nochmal halbieren: 15 % Validation, 15 % Test
X_val, X_test, y_val, y_test = train_test_split(
    X_rest, y_rest, test_size=0.50, stratify=y_rest, random_state=42
)

print(len(X_train), len(X_val), len(X_test))  # ~38000, ~8150, ~8150`}
      />

      <DepthBox variant="why" title="Warum ist das Test-Set heilig?">
        Das Test-Set simuliert <em>Zukunft</em>: Daten, die das Modell im
        Einsatz sehen wird und die heute niemand kennt. Jedes Mal, wenn du
        eine Entscheidung anhand des Test-Scores triffst (&bdquo;mit C=10
        ist Test besser, nehmen wir!&ldquo;), fließt Information aus dem
        Test-Set ins Modell — und der Score wird zur Selbsttäuschung. Genau
        dafür existiert das Validation-Set: Es ist das Test-Set, das du{" "}
        <em>verbrauchen darfst</em>.
      </DepthBox>

      <DepthBox variant="mistake" title="Data Leakage — der Klassiker">
        <p>
          <strong>Leakage</strong> = Information aus Validation/Test sickert
          ins Training. Die zwei häufigsten Varianten:
        </p>
        <ul>
          <li>
            <strong>Scaler auf allem fitten:</strong>{" "}
            <code>scaler.fit(X)</code> vor dem Split berechnet Mittelwert und
            Streuung auch aus Test-Daten. Richtig:{" "}
            <code>scaler.fit(X_train)</code>, dann{" "}
            <code>scaler.transform(X_test)</code>.
          </li>
          <li>
            <strong>Near-Duplicates über den Split:</strong> PlantVillage
            enthält teils mehrere Fotos <em>desselben Blatts</em>. Landet
            eins in Train und eins in Test, prüft der Test nur noch
            Wiedererkennen statt Generalisieren — die Scores werden
            künstlich gut.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="deeper" title="Cross-Validation statt festem Validation-Set">
        Bei kleinen Datasets verschenkt ein festes Validation-Set wertvolle
        Trainingsdaten. <strong>k-Fold Cross-Validation</strong> teilt Train
        in k Stücke, trainiert k-mal (jedes Stück einmal als Validierung)
        und mittelt die Scores. Bei 54.000 Bildern ist das für die
        klassischen Verfahren machbar (<code>cross_val_score</code> in
        scikit-learn), beim CNN meist zu teuer — dort bleibt es beim festen
        Split. Das Test-Set bleibt in beiden Welten unangetastet.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>Feature-Extraktion</strong> (Schritt 3 im Detail), den{" "}
        <strong>Metriken</strong> (was in Schritt 5 und 6 eigentlich gemessen
        wird) und jeder Praxis-Lektion der vier Verfahren — sie alle stecken
        ihre Modelle in genau diese Pipeline.
      </DepthBox>
    </div>
  );
}

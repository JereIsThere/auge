import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";

export default function LogRegPraxis() {
  return (
    <div className="lesson-card">
      <h2>Praxis: scikit-learn auf PlantVillage</h2>
      <p className="lesson-description">
        Die komplette Strecke in einem Skript: Features aus der
        Features-Lektion, Split aus der Pipeline-Lektion, dazu Scaler +
        Logistic Regression. Das ist die <strong>Baseline</strong>, an der
        sich alle weiteren Verfahren messen lassen müssen.
      </p>

      <div className="info-box">
        <strong>Faustregel:</strong> Erst die einfachste sinnvolle Baseline
        bauen, dann komplexer werden. Ein CNN, das die LogReg-Baseline nur
        um 1 Punkt schlägt, ist seine Kosten selten wert.
      </div>

      <h3>Das komplette Skript</h3>
      <CodeBlock lang="python"
        title="logreg_plantvillage.py"
        code={`import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

# ── 1. Pfade + Labels sammeln (siehe Pipeline-Lektion) ──
DATA_DIR = Path("plantvillage dataset/color")
pfade, labels = [], []
for ordner in sorted(DATA_DIR.iterdir()):
    for bild in ordner.glob("*.jpg"):
        pfade.append(bild)
        labels.append(ordner.name)

X_train_p, X_test_p, y_train, y_test = train_test_split(
    pfade, labels, test_size=0.20, stratify=labels, random_state=42
)

# ── 2. Features extrahieren (siehe Features-Lektion) ──
X_train = np.array([extrahiere_features(p) for p in X_train_p])
X_test  = np.array([extrahiere_features(p) for p in X_test_p])

# ── 3. Skalieren: fit NUR auf Train ──
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# ── 4. Trainieren ──
modell = LogisticRegression(
    max_iter=2000,           # Default 100 reicht hier nicht
    C=1.0,                   # Regularisierungsstärke (Tuning-Lektion)
    n_jobs=-1,               # alle CPU-Kerne
)
modell.fit(X_train, y_train)

# ── 5. Evaluieren ──
y_pred = modell.predict(X_test)
print(classification_report(y_test, y_pred, digits=3))`}
      />

      <h3>Was dabei herauskommt</h3>
      <p>
        Mit 512 HSV-Histogramm-Features liegt die Accuracy typischerweise
        irgendwo zwischen <strong>70 und 90&nbsp;%</strong> — abhängig von
        Bins, Bildgröße und ob Textur-Features dazukommen. Das klingt nach
        viel für ein lineares Modell, ist aber vor allem ein Kompliment an
        PlantVillage: kontrollierte Fotos, farblich gut trennbare Klassen.
        Wichtiger als die eine Zahl: der Blick in den{" "}
        <code>classification_report</code> — welche Klassen funktionieren,
        welche nicht?
      </p>

      <h3>Bonus: Das Modell erklären</h3>
      <p>
        Der unterschätzte Vorteil der Logistic Regression: Man kann
        nachsehen, <em>warum</em> sie entscheidet.{" "}
        <code>modell.coef_</code> hat eine Zeile pro Klasse — die größten
        Gewichte zeigen, welche Histogramm-Bins (= Farbbereiche) für eine
        Klasse sprechen:
      </p>
      <CodeBlock lang="python"
        title="interpretation.py"
        code={`klassen = modell.classes_
idx = list(klassen).index("Tomato___Late_blight")
gewichte = modell.coef_[idx]

top = np.argsort(gewichte)[-5:][::-1]
print("Stärkste Farb-Bins für Late Blight:", top)
# → die Bins lassen sich zu HSV-Bereichen zurückrechnen:
#   bin // 64 = Hue-Bereich, (bin // 8) % 8 = Saturation, bin % 8 = Value`}
      />

      <MlQuelle
        id="pedregosa2011-sklearn"
        kernaussagen={[
          "Das scikit-learn-Paper: einheitliche fit/predict/transform-API für klassische ML-Verfahren in Python.",
          "Genau diese API-Konsistenz nutzen wir: LogReg, SVM und Random Forest sind im Code austauschbar.",
        ]}
      />

      <DepthBox variant="why" title="Warum max_iter=2000?">
        Der Default-Solver <code>lbfgs</code> iteriert maximal 100-mal.
        Bei 512 skalierten Features und 38 Klassen konvergiert er bis dahin
        oft nicht und wirft eine <code>ConvergenceWarning</code>. Die
        Gewichte sind dann ein willkürlicher Zwischenstand — das Modell
        funktioniert scheinbar, ist aber schlechter als es sein könnte.
        Mehr Iterationen erlauben kostet nur Zeit; die Warnung zu
        ignorieren kostet Qualität.
      </DepthBox>

      <DepthBox variant="mistake" title="Die Warnung wegfiltern statt beheben">
        Der reflexhafte Griff zu{" "}
        <code>warnings.filterwarnings(&quot;ignore&quot;)</code> ist hier
        ein Klassiker. Eine <code>ConvergenceWarning</code> hat immer eine
        Ursache, meist eine von drei: zu wenige Iterationen (→{" "}
        <code>max_iter</code> hoch), unskalierte Features (→ Scaler
        vergessen? Häufigster Fall!) oder fast-redundante Features
        (→ Regularisierung erhöhen, C senken). Die Warnung ist ein
        Diagnose-Werkzeug, kein Lärm.
      </DepthBox>

      <DepthBox variant="deeper" title="Sauberer: alles in eine sklearn-Pipeline">
        <p>
          Scaler und Modell lassen sich zu einem Objekt koppeln — dann ist
          Leakage konstruktionsbedingt unmöglich, auch bei
          Cross-Validation:
        </p>
        <p>
          <code>
            make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))
          </code>
        </p>
        <p>
          Bei <code>cross_val_score</code> wird der Scaler dann in jedem
          Fold nur auf dessen Trainings-Teil gefittet — genau das, was man
          von Hand leicht falsch macht. Für Abgaben und Paper-Code ist die
          Pipeline-Variante der Standard.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>Tuning-Lektion</strong> (C, Solver, class_weight), der{" "}
        <strong>SVM-Praxis</strong> (gleicher Code, anderes Modell — die
        API macht den Tausch trivial) und den <strong>Metriken</strong>{" "}
        (was der classification_report eigentlich sagt).
      </DepthBox>
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function RfPraxis() {
  return (
    <div className="lesson-card">
      <h2>Praxis: RandomForestClassifier</h2>
      <p className="lesson-description">
        Der Random Forest ist das pflegeleichteste der vier Verfahren:
        kein Scaler, brauchbare Defaults, parallelisiert von allein. Dazu
        liefert er etwas, das die anderen nicht haben — eine eingebaute
        Antwort auf die Frage, <em>welche Features wichtig waren</em>.
      </p>

      <div className="info-box">
        <strong>Beachte, was fehlt:</strong> kein StandardScaler, kein
        max_iter, keine ConvergenceWarning. Bäume splitten auf
        Schwellwerten — Skalierung ist ihnen egal.
      </div>

      <h3>Training + Evaluation</h3>
      <CodeBlock lang="python"
        title="rf_plantvillage.py"
        code={`from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Features + Split wie gehabt — aber OHNE Scaler
wald = RandomForestClassifier(
    n_estimators=300,        # Anzahl Bäume
    max_features="sqrt",     # ~23 von 512 Features pro Split
    min_samples_leaf=2,      # Blätter dürfen nicht zu klein werden
    oob_score=True,          # Gratis-Validierung (siehe Ensemble-Lektion)
    n_jobs=-1,               # Bäume parallel auf allen Kernen
    random_state=42,
)
wald.fit(X_train, y_train)

print("OOB-Score:", round(wald.oob_score_, 3))
print(classification_report(y_test, wald.predict(X_test), digits=3))`}
      />
      <p>
        Auf den 512 HSV-Histogramm-Features schlägt der Wald die
        LogReg-Baseline typischerweise um einige Punkte — gekrümmte
        Entscheidungsgrenzen ohne Kernel-Kosten. Das Training der 300
        Bäume läuft parallel und bleibt auch bei 43.000 Bildern im
        Minutenbereich.
      </p>

      <h3>Feature Importance: Was hat der Wald gelernt?</h3>
      <CodeBlock lang="python"
        title="importance.py"
        code={`import numpy as np

# Variante 1: eingebaut (Gini Importance) — schnell, aber mit Bias
imp = wald.feature_importances_
top = np.argsort(imp)[-10:][::-1]
print("Wichtigste Histogramm-Bins:", top)

# Variante 2: Permutation Importance — ehrlicher, dafür teurer.
# Misst: wie stark fällt der Score, wenn man ein Feature zerwürfelt?
from sklearn.inspection import permutation_importance
perm = permutation_importance(
    wald, X_test, y_test, n_repeats=5, n_jobs=-1, random_state=42
)
top_perm = np.argsort(perm.importances_mean)[-10:][::-1]
print("Wichtigste Bins (Permutation):", top_perm)`}
      />
      <p>
        Die Top-Bins lassen sich in HSV-Bereiche zurückübersetzen — und
        erzählen meist eine plausible Geschichte: Grün-, Gelb- und
        Braun-Töne dominieren, genau die Farben, in denen sich gesunde
        und kranke Blätter unterscheiden.
      </p>

      <DepthBox variant="why" title="Warum zwei Importance-Varianten?">
        Die eingebaute Gini-Importance misst, wie viel Impurity-Reduktion
        ein Feature über alle Splits beigesteuert hat — auf den{" "}
        <em>Trainingsdaten</em>. Sie bevorzugt systematisch Features mit
        vielen möglichen Schwellwerten und kann Features belohnen, die nur
        beim Auswendiglernen halfen. Die Permutation-Importance stellt die
        ehrlichere Frage: <em>Was kostet es auf ungesehenen Daten, dieses
        Feature zu zerstören?</em> Wenn beide Rankings übereinstimmen —
        gut. Wenn nicht, glaub der Permutation.
      </DepthBox>

      <DepthBox variant="mistake" title="predict_proba für bare Münze nehmen">
        <code>wald.predict_proba</code> liefert den Stimmenanteil der
        Bäume — 0,9 heißt: 90&nbsp;% der Bäume sagen diese Klasse. Das ist
        ein brauchbares Konfidenz-Ranking, aber keine kalibrierte
        Wahrscheinlichkeit: Wälder sind oft <em>unter</em>konfident
        (selten nahe 0 oder 1, weil fast nie alle Bäume einstimmig sind).
        Für Schwellwert-Entscheidungen reicht es; für echte
        Risikoabschätzungen vorher kalibrieren
        (<code>CalibratedClassifierCV</code>).
      </DepthBox>

      <DepthBox variant="deeper" title="Speicher und Latenz im Blick behalten">
        300 unbeschnittene Bäume auf 43.000 Bildern können als
        Pickle-Datei mehrere hundert MB wiegen — jeder Baum speichert
        zehntausende Knoten. Für eine Submission egal, für ein Deployment
        nicht. Stellschrauben: <code>min_samples_leaf</code> erhöhen
        (weniger Knoten pro Baum, oft sogar besserer Test-Score),{" "}
        <code>max_depth</code> begrenzen oder schlicht weniger Bäume —
        ab einem Punkt bringt jeder weitere Baum messbar nichts mehr.
        Die Vorhersage-Latenz bleibt dabei angenehm: 300 Baum-Abstiege
        sind Mikrosekunden, kein Vergleich zur Kernel-SVM.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Dem <strong>RF-Tuning</strong> (welche der vielen Parameter
        wirklich zählen), der <strong>Features-Lektion</strong>{" "}
        (Importance als Feedback für bessere Feature-Extraktion) und der{" "}
        <strong>SVM-Praxis</strong> — der direkte Gegner im Vergleich
        Trainingszeit vs. Genauigkeit.
      </DepthBox>
    </div>
  );
}

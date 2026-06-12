import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function SvmPraxis() {
  return (
    <div className="lesson-card">
      <h2>Praxis: SVC auf PlantVillage</h2>
      <p className="lesson-description">
        Dank der scikit-learn-API ist der Tausch LogReg → SVM eine Zeile.
        Die eigentliche Lektion hier ist eine andere: Bei 43.000
        Trainingsbildern entscheidet die <strong>Skalierbarkeit</strong>{" "}
        des Verfahrens, nicht nur seine Genauigkeit.
      </p>

      <div className="info-box">
        <strong>Das Problem:</strong> Kernel-SVMs trainieren zwischen
        O(n²) und O(n³) in der Anzahl der Beispiele. 43.000 Beispiele sind
        für <code>SVC</code> bereits Schmerzgrenze — für{" "}
        <code>LinearSVC</code> dagegen kein Thema.
      </div>

      <h3>Variante 1: LinearSVC — der Arbeitsgaul</h3>
      <CodeBlock lang="python"
        title="svm_linear.py"
        code={`from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report

# Features + Split wie in den Grundlagen-Lektionen
pipe = make_pipeline(
    StandardScaler(),
    LinearSVC(C=1.0, max_iter=5000),
)
pipe.fit(X_train, y_train)          # Minuten, nicht Stunden

print(classification_report(y_test, pipe.predict(X_test), digits=3))`}
      />
      <p>
        <code>LinearSVC</code> nutzt einen spezialisierten Solver
        (liblinear), der die Kernel-Maschinerie weglässt und direkt im
        Feature-Raum optimiert. Multiclass läuft als One-vs-Rest: 38
        binäre Klassifikatoren, jeder trennt eine Klasse vom Rest.
      </p>

      <h3>Variante 2: SVC mit RBF — teuer, aber gekrümmt</h3>
      <CodeBlock lang="python"
        title="svm_rbf.py"
        code={`from sklearn.svm import SVC
import numpy as np

# Bei 43.000 Beispielen: erstmal auf einem Subsample testen!
rng = np.random.default_rng(42)
idx = rng.choice(len(X_train), size=10_000, replace=False)

pipe_rbf = make_pipeline(
    StandardScaler(),
    SVC(kernel="rbf", C=10, gamma="scale", cache_size=1000),
)
pipe_rbf.fit(X_train[idx], np.array(y_train)[idx])

print(classification_report(y_test, pipe_rbf.predict(X_test), digits=3))`}
      />

      <h3>Was man typischerweise sieht</h3>
      <table className="ml-tabelle">
        <thead>
          <tr>
            <th>Modell</th>
            <th>Trainingszeit (Größenordnung)</th>
            <th>Qualität</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>LinearSVC</code>, 43k Beispiele</td>
            <td>einige Minuten</td>
            <td>≈ LogReg-Baseline, oft 1–3 Punkte drüber</td>
          </tr>
          <tr>
            <td><code>SVC(rbf)</code>, 10k Subsample</td>
            <td>zweistellige Minuten</td>
            <td>kann LinearSVC schlagen — trotz weniger Daten</td>
          </tr>
          <tr>
            <td><code>SVC(rbf)</code>, alle 43k</td>
            <td>Stunden + viel RAM</td>
            <td>selten den Aufpreis wert</td>
          </tr>
        </tbody>
      </table>
      <p>
        Auch die <strong>Vorhersage</strong> skaliert unterschiedlich:
        LinearSVC wertet pro Bild ein Skalarprodukt aus, SVC(rbf) den
        Kernel gegen <em>jeden Support-Vektor</em> — bei verrauschten Daten
        können das Tausende sein. Für eine Smartphone-App zur
        Blatt-Diagnose ist das ein Ausschlusskriterium.
      </p>

      <DepthBox variant="why" title="Warum probability=True doppelt kostet">
        <code>SVC(probability=True)</code> trainiert intern per 5-Fold-CV
        eine Platt-Kalibrierung — das Training läuft also effektiv
        sechsmal. Bei einem ohnehin O(n²)-Verfahren ist das der Unterschied
        zwischen &bdquo;Kaffeepause&ldquo; und &bdquo;über Nacht&ldquo;.
        Wer nur ein Ranking der Klassen braucht, nimmt{" "}
        <code>decision_function</code>; wer echte Wahrscheinlichkeiten
        braucht, sollte den Bedarf hinterfragen oder gleich zur LogReg
        greifen.
      </DepthBox>

      <DepthBox variant="mistake" title="dual und max_iter bei LinearSVC ignorieren">
        Zwei typische Stolperer: <strong>(1)</strong> LinearSVC warnt bei
        knappem Iterationsbudget genau wie LogReg — <code>max_iter</code>{" "}
        hochsetzen statt Warnung wegklicken. <strong>(2)</strong> Der
        Parameter <code>dual</code>: Bei mehr Beispielen als Features
        (43.000 ≫ 512) ist <code>dual=False</code> die schnellere
        Formulierung. Neuere sklearn-Versionen wählen mit{" "}
        <code>dual=&quot;auto&quot;</code> selbst — ältere Defaults taten
        es nicht, und das kostete grundlos Trainingszeit.
      </DepthBox>

      <DepthBox variant="deeper" title="Der Mittelweg: Kernel-Approximation">
        Es gibt einen dritten Weg, der beide Welten verbindet:{" "}
        <strong>Random Fourier Features</strong> approximieren den
        RBF-Kernel durch eine explizite Zufalls-Transformation in z.B.
        1.000 Dimensionen — danach trainiert man ein <em>lineares</em>{" "}
        Modell auf den transformierten Daten. In sklearn:{" "}
        <code>RBFSampler</code> + <code>LinearSVC</code>. Man bekommt
        gekrümmte Entscheidungsgrenzen zum Preis eines linearen Trainings —
        für große Datasets oft der beste SVM-Deal überhaupt.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Dem <strong>SVM-Tuning</strong> (C und gamma sauber suchen), der{" "}
        <strong>LogReg-Praxis</strong> (identisches Skript-Skelett — nur
        das Modell ist getauscht) und dem <strong>CNN</strong>, das die
        Skalierungsfrage genau andersherum beantwortet: teuer in Hardware,
        aber linear in der Datenmenge.
      </DepthBox>
    </div>
  );
}

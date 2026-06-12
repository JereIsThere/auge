import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function SvmTuning() {
  return (
    <div className="lesson-card">
      <h2>Tuning: C &amp; gamma</h2>
      <p className="lesson-description">
        Bei der RBF-SVM entscheiden genau zwei Hyperparameter über alles:{" "}
        <strong>C</strong> (wie teuer sind Fehler?) und{" "}
        <strong>gamma</strong> (wie lokal denkt der Kernel?). Wer ihre
        Wirkung versteht, liest aus jedem Score-Plot sofort ab, in welche
        Richtung es weitergeht.
      </p>

      <div className="info-box">
        <strong>Merksatz:</strong> C kontrolliert die{" "}
        <em>Strafe für Margin-Verstöße</em>, gamma die{" "}
        <em>Reichweite eines einzelnen Trainingspunkts</em>. Beide hoch =
        auswendig lernen. Beide niedrig = alles verschwimmt.
      </div>

      <h3>Die Wirkung im Überblick</h3>
      <table className="ml-tabelle">
        <thead>
          <tr>
            <th></th>
            <th>zu niedrig</th>
            <th>zu hoch</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>C</th>
            <td>
              Fehler sind billig → breite, glatte Grenze, ignoriert auch
              echte Struktur (<em>Underfitting</em>)
            </td>
            <td>
              jeder Fehler teuer → Grenze windet sich um einzelne Punkte
              (<em>Overfitting</em>)
            </td>
          </tr>
          <tr>
            <th>gamma</th>
            <td>
              jeder Punkt strahlt weit → fast lineares Verhalten, Details
              gehen verloren
            </td>
            <td>
              jeder Punkt strahlt nur millimeterweit → Inseln um einzelne
              Trainingspunkte, Test-Punkte fallen ins Niemandsland
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Die beiden Parameter <strong>kompensieren sich teilweise</strong>:
        Ein zu großes gamma lässt sich mit kleinem C etwas zähmen und
        umgekehrt. Deshalb sucht man sie immer <em>gemeinsam</em> — als
        Gitter, nicht nacheinander.
      </p>

      <h3>Logarithmisches Grid + Heatmap</h3>
      <CodeBlock lang="python"
        title="svm_grid.py"
        code={`from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("svc", SVC(kernel="rbf", cache_size=1000)),
])

# Immer in Zehnerpotenzen suchen — die Wirkung ist logarithmisch
grid = GridSearchCV(
    pipe,
    param_grid={
        "svc__C":     [0.1, 1, 10, 100],
        "svc__gamma": [1e-4, 1e-3, 1e-2, 1e-1, "scale"],
    },
    cv=3,
    scoring="f1_macro",
    n_jobs=-1,
)
# 4 x 5 Kombis x 3 Folds = 60 SVM-Trainings → aufs Subsample!
grid.fit(X_train_sub, y_train_sub)

print(grid.best_params_)
# Die ganze cv_results_-Matrix als C-gamma-Heatmap plotten:
# gute Regionen bilden ein Plateau — nimm dessen Mitte,
# nicht die zufällige Bestmarke am Rand.`}
      />

      <h3>Workflow-Empfehlung</h3>
      <ol className="step-list">
        <li>
          <strong>Subsample ziehen</strong> (z.B. 8.000 Bilder,
          stratifiziert) — das Grid wäre auf allen Daten unbezahlbar.
        </li>
        <li>
          <strong>Grob suchen</strong> in Zehnerpotenzen, Heatmap ansehen.
        </li>
        <li>
          <strong>Fein nachsuchen</strong> um die beste Region (z.B. C ∈
          [3, 10, 30]).
        </li>
        <li>
          <strong>Final einmal</strong> mit den besten Parametern auf allen
          Trainingsdaten trainieren, dann Test-Set.
        </li>
      </ol>

      <DepthBox variant="why" title="Was bedeutet gamma='scale' eigentlich?">
        Der sklearn-Default setzt γ = 1 / (n_features · Var(X)) — die
        Reichweite des Kernels wird an Dimension und Streuung der Daten
        angepasst. Für skalierte Daten (Var ≈ 1) heißt das γ ≈ 1/512. Das
        ist ein bemerkenswert guter Startwert: Die typische quadrierte
        Distanz zweier zufälliger Punkte wächst proportional zur
        Dimension, und genau das gleicht der Nenner aus. Trotzdem gilt:
        &bdquo;scale&ldquo; gehört als Kandidat <em>ins</em> Grid, ersetzt
        es aber nicht.
      </DepthBox>

      <DepthBox variant="mistake" title="Auf dem Tuning-Subsample auch evaluieren">
        Subtiler Doppelfehler: Wer auf dem 8.000er-Subsample tunt{" "}
        <em>und</em> evaluiert, vergleicht Verfahren unter
        Laborbedingungen, die später keiner reproduziert. Das Subsample ist
        nur Werkzeug für die <em>Suche</em>. Final trainiert wird mit den
        gefundenen Parametern auf allen Trainingsdaten, gemessen wird auf
        dem unangetasteten Test-Set — sonst sind die berichteten Zahlen
        Äpfel gegen Birnen (z.B. gegen die LogReg, die auf allem
        trainiert hat).
      </DepthBox>

      <DepthBox variant="deeper" title="RandomizedSearch und Halving — wenn das Grid explodiert">
        Mit jedem zusätzlichen Parameter multipliziert sich das Grid. Zwei
        Auswege: <code>RandomizedSearchCV</code> zieht zufällige
        Kombinationen aus Verteilungen (überraschend effektiv — wichtige
        Parameter bekommen automatisch mehr unterschiedliche Werte) und{" "}
        <code>HalvingGridSearchCV</code> startet alle Kandidaten mit wenig
        Daten und lässt nur die besten in die teuren Runden mit vollen
        Daten aufsteigen. Für SVMs mit ihrem superlinearen Training ist
        Halving wie gemacht.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Dem <strong>LogReg-Tuning</strong> (C ist exakt dasselbe Konzept),
        dem <strong>Kernel-Trick</strong> (was gamma geometrisch tut) und
        dem <strong>RF-Tuning</strong> — das angenehm zeigen wird, wie viel
        unempfindlicher ein Random Forest gegenüber seinen Hyperparametern
        ist.
      </DepthBox>
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function RfTuning() {
  return (
    <div className="lesson-card">
      <h2>Tuning: n_estimators &amp; Co.</h2>
      <p className="lesson-description">
        Die gute Nachricht zuerst: Random Forests sind erstaunlich
        unempfindlich gegenüber ihren Hyperparametern — die Defaults sind
        selten weit vom Optimum. Tuning lohnt sich trotzdem, aber anders
        als bei der SVM: weniger Suche, mehr Verständnis.
      </p>

      <div className="info-box">
        <strong>Prioritätenliste:</strong> 1.{" "}
        <code>n_estimators</code> hoch genug (kein Tuning, nur Budget),
        2. <code>max_features</code>, 3. <code>min_samples_leaf</code> /{" "}
        <code>max_depth</code>. Der Rest ist meist Rauschen.
      </div>

      <h3>Die Parameter, die zählen</h3>
      <table className="ml-tabelle">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Wirkung</th>
            <th>Praxis-Empfehlung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>n_estimators</code></td>
            <td>
              Mehr Bäume = stabiler, nie schlechter — nur teurer. Der
              Score steigt und erreicht ein Plateau.
            </td>
            <td>
              200–500. OOB-Score gegen Baumzahl plotten, ab dem Plateau
              ist Schluss.
            </td>
          </tr>
          <tr>
            <td><code>max_features</code></td>
            <td>
              Weniger Features pro Split = stärker dekorrelierte Bäume,
              aber schwächere Einzelbäume. <em>Der</em> Trade-off-Regler
              des Waldes.
            </td>
            <td>
              <code>&quot;sqrt&quot;</code> als Anker; 0.1–0.3 ×
              n_features gegentesten.
            </td>
          </tr>
          <tr>
            <td><code>min_samples_leaf</code></td>
            <td>
              Größere Blätter = glattere Vorhersagen, kleinere Bäume,
              weniger Overfitting und weniger RAM.
            </td>
            <td>1 (Default), 2, 5 vergleichen.</td>
          </tr>
          <tr>
            <td><code>max_depth</code></td>
            <td>
              Harte Obergrenze fürs Baumwachstum — grober als
              min_samples_leaf, dafür planbarer Speicher.
            </td>
            <td>
              Meist None lassen und über min_samples_leaf steuern.
            </td>
          </tr>
          <tr>
            <td><code>class_weight</code></td>
            <td>
              Gewichtet seltene Klassen in der Impurity-Berechnung höher.
            </td>
            <td>
              Bei PlantVillage <code>&quot;balanced&quot;</code>{" "}
              gegentesten, Effekt am macro-F1 messen.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Tuning mit dem OOB-Score statt Grid + CV</h3>
      <p>
        Der Wald bringt sein Validation-Set mit (Out-of-Bag, siehe
        Ensemble-Lektion) — für die Parametersuche reicht oft eine simple
        Schleife ohne Cross-Validation:
      </p>
      <CodeBlock
        title="rf_tuning.py"
        code={`from sklearn.ensemble import RandomForestClassifier

for mf in ["sqrt", 0.1, 0.2, 0.3]:
    for msl in [1, 2, 5]:
        wald = RandomForestClassifier(
            n_estimators=300,
            max_features=mf,
            min_samples_leaf=msl,
            oob_score=True,
            n_jobs=-1,
            random_state=42,
        )
        wald.fit(X_train, y_train)
        print(f"max_features={mf!s:5} min_samples_leaf={msl}  "
              f"OOB={wald.oob_score_:.4f}")

# Beste Kombi → einmal final aufs Test-Set.
# 12 Trainings statt 12 x 3 CV-Folds — der Wald validiert sich selbst.`}
      />

      <DepthBox variant="why" title="Warum ist der Wald so robust gegen schlechtes Tuning?">
        Bei LogReg und SVM verschiebt ein falsches C die{" "}
        <em>eine</em> gelernte Grenze global. Beim Wald wirken die
        Parameter nur auf einzelne Bäume — und deren Fehler werden
        anschließend weggemittelt. Das Ensemble dämpft also nicht nur die
        Varianz der Daten, sondern auch die Varianz schlechter
        Hyperparameter-Entscheidungen. Die Kehrseite: Tuning kann den
        Wald auch nur begrenzt <em>verbessern</em>. Wer mehr Qualität
        will, investiert beim RF besser in Features als in Parameter.
      </DepthBox>

      <DepthBox variant="mistake" title="n_estimators per Grid Search optimieren wollen">
        <code>n_estimators</code> in ein Grid zu stecken ist doppelt
        verschwendet: Der Score steigt mit der Baumzahl monoton bis zum
        Plateau — es gibt kein Optimum zu finden, nur ein
        &bdquo;genug&ldquo;. Und statt für jede Baumzahl neu zu trainieren,
        kann man mit <code>warm_start=True</code> Bäume an einen
        bestehenden Wald <em>anbauen</em> und den OOB-Score nach jedem
        Schub messen. Eine Trainingsserie, die komplette Kurve.
      </DepthBox>

      <DepthBox variant="deeper" title="Wenn der Wald nicht reicht: Gradient Boosting">
        Auf Feature-Vektoren ist der natürliche nächste Schritt nicht
        &bdquo;mehr Wald&ldquo;, sondern <strong>Gradient Boosting</strong>{" "}
        (XGBoost, LightGBM, sklearns{" "}
        <code>HistGradientBoostingClassifier</code>): Bäume werden
        sequenziell gebaut, jeder auf die Residualfehler der bisherigen.
        Boosting senkt — anders als Bagging — auch den <em>Bias</em> und
        gewinnt auf Tabellendaten fast jede Kaggle-Competition. Der Preis:
        echte Overfitting-Gefahr, Lernrate und Baumzahl müssen{" "}
        <em>gemeinsam</em> getunt werden, Early Stopping ist Pflicht. Der
        Wald bleibt der robuste Allrounder, Boosting der getunte Sportler.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>Ensemble-Lektion</strong> (warum OOB funktioniert und
        warum mehr Bäume nicht overfitten), dem{" "}
        <strong>SVM-Tuning</strong> (der Kontrast: dort entscheidet das
        Grid über Erfolg und Misserfolg) und dem{" "}
        <strong>großen Vergleich</strong> am Ende des Themas.
      </DepthBox>
    </div>
  );
}

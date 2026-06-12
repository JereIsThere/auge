"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function Metriken() {
  // Szenario: 1000 Blätter, 100 davon krank. Der Schwellwert t steuert,
  // ab welchem Score das Modell "krank" sagt.
  const [t, setT] = useState(0.5);
  const positiven = 100;
  const negativen = 900;

  // Vereinfachtes Modellverhalten: niedriger Schwellwert → alles wird
  // markiert (Recall hoch, viele Fehlalarme), hoher Schwellwert umgekehrt.
  const recallWert = 1 - t * t;
  const fprWert = (1 - t) * (1 - t);
  const tp = Math.round(positiven * recallWert);
  const fn = positiven - tp;
  const fp = Math.round(negativen * fprWert);
  const tn = negativen - fp;

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp / positiven;
  const f1 =
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;
  const accuracy = (tp + tn) / (positiven + negativen);

  const pct = (x: number) => `${(100 * x).toFixed(1)} %`;

  return (
    <div className="lesson-card">
      <h2>Metriken &amp; Confusion Matrix</h2>
      <p className="lesson-description">
        Alle vier Verfahren werden am Ende an denselben Zahlen gemessen.
        Aber welche Zahl? Accuracy ist die bekannteste — und bei
        unbalancierten Klassen wie in PlantVillage die irreführendste.
      </p>

      <div className="info-box">
        <strong>Die Accuracy-Falle:</strong> Wenn 90&nbsp;% der Blätter
        gesund sind, bekommt ein Modell, das <em>immer</em> &bdquo;gesund&ldquo;
        sagt, 90&nbsp;% Accuracy — und hat null gelernt.
      </div>

      <h3>Interaktiv: der Schwellwert-Trade-off</h3>
      <p>
        Szenario: 1.000 Blätter, davon 100 krank. Das Modell gibt jedem Bild
        einen Krankheits-Score; ab dem Schwellwert sagt es &bdquo;krank&ldquo;.
        Zieh am Regler und beobachte, wie Precision und Recall gegeneinander
        arbeiten:
      </p>
      <div className="ml-demo">
        <div className="ml-slider-row">
          <label htmlFor="schwelle">Schwellwert</label>
          <input
            id="schwelle"
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
          />
          <span className="ml-slider-wert">{t.toFixed(2)}</span>
        </div>

        <table className="ml-tabelle">
          <thead>
            <tr>
              <th></th>
              <th>Modell: krank</th>
              <th>Modell: gesund</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>wirklich krank (100)</th>
              <td style={{ background: "rgba(52, 211, 153, 0.18)" }}>
                <strong>{tp}</strong> richtig erkannt (TP)
              </td>
              <td style={{ background: "rgba(248, 113, 113, 0.18)" }}>
                <strong>{fn}</strong> übersehen (FN)
              </td>
            </tr>
            <tr>
              <th>wirklich gesund (900)</th>
              <td style={{ background: "rgba(251, 191, 36, 0.18)" }}>
                <strong>{fp}</strong> Fehlalarm (FP)
              </td>
              <td style={{ background: "rgba(52, 211, 153, 0.18)" }}>
                <strong>{tn}</strong> richtig verschont (TN)
              </td>
            </tr>
          </tbody>
        </table>

        <div className="result-grid">
          <div className="result-box">
            <div className="result-label">Accuracy</div>
            <div className="result-value">{pct(accuracy)}</div>
          </div>
          <div className="result-box">
            <div className="result-label">Precision</div>
            <div className="result-value">{pct(precision)}</div>
          </div>
          <div className="result-box">
            <div className="result-label">Recall</div>
            <div className="result-value">{pct(recall)}</div>
          </div>
          <div className="result-box">
            <div className="result-label">F1</div>
            <div className="result-value">{pct(f1)}</div>
          </div>
        </div>
      </div>

      <h3>Die Begriffe in einem Satz</h3>
      <ol className="step-list">
        <li>
          <strong>Precision</strong> — Wenn das Modell &bdquo;krank&ldquo;
          sagt: wie oft stimmt das? <em>TP / (TP + FP)</em>
        </li>
        <li>
          <strong>Recall</strong> — Von allen wirklich kranken Blättern:
          wie viele findet es? <em>TP / (TP + FN)</em>
        </li>
        <li>
          <strong>F1</strong> — Harmonisches Mittel aus beiden. Wird nur
          gut, wenn <em>beide</em> gut sind.
        </li>
        <li>
          <strong>Confusion Matrix</strong> — Die ganze Wahrheit: welche
          Klasse wird mit welcher verwechselt.
        </li>
      </ol>

      <h3>In Python: classification_report</h3>
      <CodeBlock lang="python"
        title="evaluation.py"
        code={`from sklearn.metrics import classification_report, confusion_matrix

y_pred = modell.predict(X_test_feat)

# Precision/Recall/F1 pro Klasse + macro/weighted-Mittel
print(classification_report(y_test, y_pred, digits=3))

# 38x38-Matrix: Zeile = wahre Klasse, Spalte = Vorhersage
cm = confusion_matrix(y_test, y_pred)
# Spannend sind die größten Werte ABSEITS der Diagonale:
# welche Krankheiten verwechselt das Modell systematisch?`}
      />

      <DepthBox variant="why" title="Warum ausgerechnet das harmonische Mittel?">
        Das arithmetische Mittel von Precision 100&nbsp;% und Recall
        2&nbsp;% wäre 51&nbsp;% — klingt halbwegs okay, das Modell ist aber
        nutzlos (es findet fast nichts). Das harmonische Mittel bestraft
        Ungleichgewicht hart: F1 wäre hier nur ~3,9&nbsp;%. Es belohnt nur
        Modelle, die beide Ziele gleichzeitig erreichen — deshalb ist F1 der
        Standard-Score für unbalancierte Klassifikation.
      </DepthBox>

      <DepthBox variant="mistake" title="macro und weighted F1 verwechseln">
        Bei 38 Klassen liefert <code>classification_report</code> zwei
        Mittelwerte: <strong>macro</strong> mittelt die F1-Werte aller
        Klassen <em>gleichberechtigt</em> — die 150-Bilder-Klasse zählt
        genauso viel wie die 5.500-Bilder-Klasse. <strong>weighted</strong>{" "}
        gewichtet nach Klassengröße und kaschiert damit schwache kleine
        Klassen. Für PlantVillage-Berichte gehört <strong>macro-F1</strong>{" "}
        neben die Accuracy — wer nur weighted berichtet, versteckt
        (bewusst oder nicht) die Problemklassen.
      </DepthBox>

      <DepthBox variant="deeper" title="Welcher Fehler ist teurer?">
        Precision und Recall sind keine technischen, sondern{" "}
        <em>fachliche</em> Größen. Übersehene Krankheit (FN): Der Pilz
        breitet sich aus, die Ernte ist gefährdet. Fehlalarm (FP): Ein
        gesundes Feld wird unnötig gespritzt. Im Pflanzenschutz ist FN meist
        teurer → man wählt den Schwellwert eher links (hoher Recall) und
        akzeptiert Fehlalarme. Ein Spam-Filter entscheidet genau andersrum.
        Der &bdquo;beste&ldquo; Schwellwert steht nie im Code — er kommt aus
        der Anwendung.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>Pipeline</strong> (Validation- vs. Test-Messung), allen
        vier Praxis-Lektionen (sie enden alle in{" "}
        <code>classification_report</code>) und dem{" "}
        <strong>großen Vergleich</strong>, der die Verfahren genau an diesen
        Zahlen nebeneinanderstellt.
      </DepthBox>
    </div>
  );
}

"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function LogRegIntuition() {
  // p(krank) = sigmoid(w * (x - x0)) — Steilheit w, Schwelle x0
  const [w, setW] = useState(12);
  const [x0, setX0] = useState(0.4);

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  // SVG-Plot: Feature x (0..1) → Wahrscheinlichkeit p (0..1)
  const W = 600;
  const H = 260;
  const PAD = 40;
  const px = (x: number) => PAD + x * (W - 2 * PAD);
  const py = (p: number) => H - PAD - p * (H - 2 * PAD);

  const punkte: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = i / 80;
    const p = sigmoid(w * (x - x0));
    punkte.push(`${px(x).toFixed(1)},${py(p).toFixed(1)}`);
  }

  const beispielX = 0.7;
  const beispielP = sigmoid(w * (beispielX - x0));

  return (
    <div className="lesson-card">
      <h2>Logistic Regression: Linie + Sigmoid</h2>
      <p className="lesson-description">
        Das einfachste der vier Verfahren — und genau deshalb der richtige
        Start. Logistic Regression rechnet eine{" "}
        <strong>gewichtete Summe</strong> der Features aus und drückt das
        Ergebnis durch eine S-Kurve, damit eine Wahrscheinlichkeit zwischen
        0 und 1 herauskommt. Das ist wirklich alles.
      </p>

      <div className="info-box">
        <strong>In einer Formel:</strong> p(krank) = σ(w₁x₁ + w₂x₂ + … + b).
        Die Gewichte w sagen, welche Features wie stark für
        &bdquo;krank&ldquo; sprechen. σ ist die Sigmoid-Funktion.
      </div>

      <h3>Interaktiv: die Sigmoid an einem Feature</h3>
      <p>
        Vereinfachen wir auf <em>ein</em> Feature: den Anteil brauner Pixel
        im Blatt-Foto. Die Steilheit entspricht dem Gewicht, die Schwelle
        dem (umgerechneten) Bias:
      </p>
      <div className="ml-demo">
        <div className="ml-slider-row">
          <label htmlFor="steilheit">Steilheit (Gewicht)</label>
          <input
            id="steilheit"
            type="range"
            min={2}
            max={40}
            step={1}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
          />
          <span className="ml-slider-wert">{w}</span>
        </div>
        <div className="ml-slider-row">
          <label htmlFor="schwelle">Schwelle (Bias)</label>
          <input
            id="schwelle"
            type="range"
            min={0.1}
            max={0.9}
            step={0.01}
            value={x0}
            onChange={(e) => setX0(Number(e.target.value))}
          />
          <span className="ml-slider-wert">{x0.toFixed(2)}</span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Sigmoid-Kurve">
          {/* Achsen */}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="currentColor" strokeOpacity={0.4} />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="currentColor" strokeOpacity={0.4} />
          {/* 50%-Linie */}
          <line x1={PAD} y1={py(0.5)} x2={W - PAD} y2={py(0.5)} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="4 4" />
          <text x={W - PAD + 4} y={py(0.5) + 4} fontSize={11} fill="currentColor" opacity={0.6}>50 %</text>
          {/* Entscheidungsgrenze */}
          <line x1={px(x0)} y1={PAD} x2={px(x0)} y2={H - PAD} stroke="#f59e0b" strokeDasharray="5 4" />
          <text x={px(x0) + 5} y={PAD + 12} fontSize={11} fill="#f59e0b">Entscheidungsgrenze</text>
          {/* Sigmoid */}
          <polyline points={punkte.join(" ")} fill="none" stroke="#10b981" strokeWidth={2.5} />
          {/* Beispielpunkt */}
          <circle cx={px(beispielX)} cy={py(beispielP)} r={5} fill="#8b5cf6" />
          <text x={px(beispielX) + 8} y={py(beispielP) - 8} fontSize={11} fill="#8b5cf6">
            x=0.70 → p={beispielP.toFixed(2)}
          </text>
          {/* Achsenbeschriftung */}
          <text x={W / 2} y={H - 8} fontSize={12} textAnchor="middle" fill="currentColor" opacity={0.7}>
            Feature: Anteil brauner Pixel
          </text>
          <text x={14} y={H / 2} fontSize={12} textAnchor="middle" fill="currentColor" opacity={0.7} transform={`rotate(-90 14 ${H / 2})`}>
            P(krank)
          </text>
        </svg>
      </div>
      <p>
        Links von der Entscheidungsgrenze sagt das Modell
        &bdquo;gesund&ldquo;, rechts &bdquo;krank&ldquo;. Die Steilheit
        bestimmt, wie <em>sicher</em> sich das Modell nahe der Grenze ist —
        die Grenze selbst bleibt eine harte Linie.
      </p>

      <h3>Warum &bdquo;Regression&ldquo;, wenn es klassifiziert?</h3>
      <p>
        Historisch gewachsen: Das Verfahren <em>regrediert</em> die
        Log-Odds (das Verhältnis von p zu 1−p, logarithmiert) linear auf die
        Features. Erst die Sigmoid macht daraus eine Wahrscheinlichkeit,
        erst der Schwellwert eine Klasse. Der Name beschreibt die Mechanik,
        nicht den Einsatzzweck.
      </p>

      <MlQuelle
        id="cox1958-logistic"
        kernaussagen={[
          "Formalisiert die Regression binärer Zielgrößen über das logistische Modell.",
          "Grundlage der Maximum-Likelihood-Schätzung der Koeffizienten, wie sie scikit-learn heute löst.",
        ]}
      />

      <DepthBox variant="why" title="Warum überhaupt eine S-Kurve?">
        Eine rohe gewichtete Summe kann −500 oder +3000 ergeben — als
        Wahrscheinlichkeit unbrauchbar. Die Sigmoid σ(z) = 1/(1+e^(−z))
        quetscht jeden Wert in (0, 1), ist monoton (mehr Indiz → mehr
        Wahrscheinlichkeit) und differenzierbar (wichtig fürs Training).
        Und sie hat eine saubere Interpretation: Ihr Input z ist genau der
        Log-Odds-Wert. Sie ist nicht irgendeine S-Kurve, sondern die
        mathematisch passende.
      </DepthBox>

      <DepthBox variant="mistake" title="Linear heißt nicht primitiv">
        &bdquo;Logistic Regression kann nur Linien&ldquo; stimmt — aber im{" "}
        <em>Feature-Raum</em>, nicht im Bild. Unsere 512
        Histogramm-Dimensionen spannen einen Raum auf, in dem eine
        Hyperebene erstaunlich viel trennen kann. Und wer Features
        quadriert oder kombiniert (Polynomial Features), bekommt gekrümmte
        Grenzen im Originalraum — mit demselben linearen Verfahren. Die
        Grenze des Modells ist oft eher die Grenze der Features.
      </DepthBox>

      <DepthBox variant="deeper" title="Von 2 auf 38 Klassen: Softmax">
        PlantVillage hat 38 Klassen, nicht 2. Die Verallgemeinerung:
        pro Klasse ein eigener Gewichtsvektor, also 38 Scores pro Bild —
        und statt der Sigmoid normiert die <strong>Softmax</strong> alle 38
        Scores zu einer Wahrscheinlichkeitsverteilung, die sich zu 1
        summiert. Vorhersage = Klasse mit dem höchsten Wert. scikit-learn
        macht das automatisch, sobald y mehr als zwei Werte hat. Details in
        der Mathe-Lektion.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>Mathe-Lektion</strong> (wie die Gewichte gelernt
        werden), der <strong>SVM</strong> (auch linear, aber anderes
        Optimierungsziel — der Vergleich ist lehrreich) und dem{" "}
        <strong>CNN</strong>: dessen letzte Schicht ist exakt eine Logistic
        Regression auf gelernten Features.
      </DepthBox>
    </div>
  );
}

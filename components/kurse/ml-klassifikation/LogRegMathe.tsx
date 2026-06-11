import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function LogRegMathe() {
  return (
    <div className="lesson-card">
      <h2>Mathe: Cross-Entropy &amp; Gradient Descent</h2>
      <p className="lesson-description">
        Die Intuition war: gewichtete Summe + Sigmoid. Jetzt die Frage, die
        in jeder Prüfung kommt: <em>Woher kommen die Gewichte?</em> Antwort:
        aus einem Optimierungsproblem — Loss-Funktion definieren, Gradient
        ausrechnen, bergab laufen.
      </p>

      <div className="info-box">
        <strong>Trainingsziel:</strong> Finde Gewichte w und Bias b, die den
        Trainingsdaten die höchste Wahrscheinlichkeit geben
        (Maximum Likelihood) — gleichbedeutend mit: minimiere die
        Cross-Entropy.
      </div>

      <h3>Schritt 1: Das Modell</h3>
      <div className="ml-formel">
        z = w·x + b &nbsp;&nbsp;&nbsp; p̂ = σ(z) = 1 / (1 + e<sup>−z</sup>)
      </div>
      <p>
        x ist unser Feature-Vektor (512 Histogramm-Werte), w hat dieselbe
        Länge, p̂ ist die vorhergesagte Wahrscheinlichkeit für
        &bdquo;krank&ldquo; (binärer Fall — Softmax kommt unten).
      </p>

      <h3>Schritt 2: Die Loss-Funktion (Binary Cross-Entropy)</h3>
      <div className="ml-formel">
        L(w, b) = −(1/n) Σᵢ [ yᵢ · log(p̂ᵢ) + (1 − yᵢ) · log(1 − p̂ᵢ) ]
      </div>
      <p>
        Lies es so: Für ein krankes Blatt (y=1) zählt nur −log(p̂) — je
        näher p̂ an 1, desto kleiner die Strafe. Für ein gesundes (y=0)
        zählt −log(1−p̂). Entscheidend ist die Form der Strafe:{" "}
        <strong>log explodiert nahe 0</strong>. Ein Modell, das sich mit
        p̂ = 0,99 irrt, zahlt dafür drastisch — selbstbewusst falsch ist
        die teuerste Art, falsch zu sein.
      </p>

      <h3>Schritt 3: Der Gradient</h3>
      <p>
        Das Schöne an der Kombination Sigmoid + Cross-Entropy: Beim
        Ableiten kürzt sich fast alles weg und übrig bleibt:
      </p>
      <div className="ml-formel">
        ∂L/∂w = (1/n) Σᵢ (p̂ᵢ − yᵢ) · xᵢ &nbsp;&nbsp;&nbsp; ∂L/∂b = (1/n) Σᵢ (p̂ᵢ − yᵢ)
      </div>
      <p>
        Der Gradient ist einfach <strong>Fehler mal Input</strong>: Wo das
        Modell daneben liegt (p̂ − y groß), werden genau die Gewichte der
        Features korrigiert, die an dieser Vorhersage beteiligt waren.
      </p>

      <h3>Schritt 4: Gradient Descent</h3>
      <div className="ml-formel">
        w ← w − η · ∂L/∂w
      </div>
      <ol className="step-list">
        <li>Gewichte zufällig (oder mit 0) initialisieren.</li>
        <li>Vorhersagen für die Trainingsdaten berechnen.</li>
        <li>Gradient ausrechnen — die Richtung des steilsten Anstiegs.</li>
        <li>
          Einen kleinen Schritt (Lernrate η) in die Gegenrichtung gehen.
        </li>
        <li>Wiederholen, bis sich der Loss kaum noch bewegt.</li>
      </ol>
      <p>
        In scikit-learn übernehmen das Solver wie <code>lbfgs</code> oder{" "}
        <code>saga</code> — cleverere Varianten desselben Prinzips. Beim
        CNN-Training begegnet dir exakt derselbe Mechanismus wieder, nur
        mit Millionen Parametern statt 512.
      </p>

      <h3>Von 2 auf 38 Klassen: Softmax</h3>
      <div className="ml-formel">
        p̂ₖ = e<sup>zₖ</sup> / Σⱼ e<sup>zⱼ</sup> &nbsp;&nbsp; mit &nbsp; zₖ = wₖ·x + bₖ
      </div>
      <p>
        Pro Klasse ein eigener Gewichtsvektor → 38 Scores, die Softmax
        normiert sie zu einer Verteilung. Die Loss-Funktion wird zur{" "}
        <strong>kategorischen Cross-Entropy</strong>: −log(p̂ der wahren
        Klasse). Bei 512 Features sind das 38 × 513 ≈ 19.500 lernbare
        Parameter — winzig im Vergleich zu jedem CNN.
      </p>

      <DepthBox variant="why" title="Warum nicht einfach MSE als Loss?">
        Mean Squared Error funktioniert formal, hat aber zwei Probleme.
        Erstens: MSE durch die Sigmoid ist <strong>nicht konvex</strong> —
        die Loss-Landschaft hat lokale Mulden, Gradient Descent kann
        steckenbleiben. Cross-Entropy + Sigmoid ist konvex: ein einziges
        globales Minimum, garantiert findbar. Zweitens: Bei MSE wird der
        Gradient gerade dann winzig, wenn das Modell selbstbewusst
        falsch liegt (Sigmoid-Sättigung) — das Lernen stirbt ab, wo es am
        nötigsten wäre. Cross-Entropy hält den Gradienten dort groß.
      </DepthBox>

      <DepthBox variant="mistake" title="p̂ = 0,93 heißt nicht: zu 93 % sicher wahr">
        Die Softmax-Ausgabe ist eine <em>modellinterne</em> Größe, keine
        geprüfte Wahrscheinlichkeit. Ein Modell kann systematisch
        überkonfident sein: im Schnitt 95&nbsp;% behaupten, aber nur
        80&nbsp;% Trefferquote liefern. Wer die Werte ernsthaft als
        Wahrscheinlichkeiten nutzen will (z.B. &bdquo;nur ab 90&nbsp;%
        automatisch handeln&ldquo;), muss <strong>Kalibrierung</strong>{" "}
        messen (Reliability Diagram) und ggf. nachkalibrieren
        (Platt Scaling, Isotonic Regression).
      </DepthBox>

      <DepthBox variant="deeper" title="Regularisierung steckt schon in der Loss">
        scikit-learn minimiert standardmäßig nicht die reine Cross-Entropy,
        sondern <strong>L + (1/C) · ||w||²</strong> — eine L2-Strafe auf
        große Gewichte. Statistisch entspricht das einem Gauß-Prior auf w
        (MAP-Schätzung statt Maximum Likelihood): Ohne Gegenbeweis sollen
        Gewichte klein bleiben. Das verhindert, dass einzelne, zufällig im
        Training nützliche Histogramm-Bins absurd hohe Gewichte bekommen —
        der wichtigste Schutz gegen Overfitting bei vielen Features. Der
        Parameter C steuert die Stärke; die Tuning-Lektion dreht genau an
        diesem Knopf.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>Praxis-Lektion</strong> (dieselbe Mathematik in fünf
        Zeilen scikit-learn), dem <strong>CNN-Training</strong> (gleiche
        Loss, gleicher Gradient Descent, nur tieferes Modell) und der{" "}
        <strong>SVM</strong> — die ersetzt die Cross-Entropy durch den
        Hinge-Loss und bekommt dadurch einen völlig anderen Charakter.
      </DepthBox>
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function RfBaum() {
  return (
    <div className="lesson-card">
      <h2>Der Entscheidungsbaum</h2>
      <p className="lesson-description">
        Bevor wir den Wald verstehen, brauchen wir den Baum. Ein
        Entscheidungsbaum klassifiziert wie ein Arzt beim Durchfragen:
        eine Ja/Nein-Frage nach der anderen, bis die Diagnose feststeht —
        und er <em>lernt</em> selbst, welche Fragen er stellen soll.
      </p>

      <div className="info-box">
        <strong>Kernidee:</strong> Finde die Frage (Feature + Schwellwert),
        die die Daten am besten in reinere Gruppen aufteilt. Wiederhole das
        in jeder Gruppe. Stoppe, wenn die Gruppen rein genug sind.
      </div>

      <h3>So sieht das für PlantVillage aus</h3>
      <div className="ml-demo">
        <svg viewBox="0 0 620 300" role="img" aria-label="Entscheidungsbaum-Beispiel">
          {/* Kanten */}
          <line x1={310} y1={58} x2={160} y2={128} stroke="currentColor" strokeOpacity={0.45} />
          <line x1={310} y1={58} x2={460} y2={128} stroke="currentColor" strokeOpacity={0.45} />
          <line x1={160} y1={186} x2={80} y2={246} stroke="currentColor" strokeOpacity={0.45} />
          <line x1={160} y1={186} x2={240} y2={246} stroke="currentColor" strokeOpacity={0.45} />
          <line x1={460} y1={186} x2={380} y2={246} stroke="currentColor" strokeOpacity={0.45} />
          <line x1={460} y1={186} x2={540} y2={246} stroke="currentColor" strokeOpacity={0.45} />
          {/* Kantenlabels */}
          <text x={215} y={88} fontSize={11} fill="currentColor" opacity={0.6}>ja</text>
          <text x={395} y={88} fontSize={11} fill="currentColor" opacity={0.6}>nein</text>

          {/* Wurzel */}
          <rect x={195} y={20} width={230} height={38} rx={8} fill="#f59e0b" opacity={0.18} stroke="#f59e0b" />
          <text x={310} y={43} fontSize={12.5} textAnchor="middle" fill="currentColor">
            Grün-Anteil &gt; 60 % ?
          </text>

          {/* Ebene 2 */}
          <rect x={55} y={148} width={210} height={38} rx={8} fill="#f59e0b" opacity={0.18} stroke="#f59e0b" />
          <text x={160} y={171} fontSize={12.5} textAnchor="middle" fill="currentColor">
            Gelb-Anteil &gt; 15 % ?
          </text>
          <rect x={355} y={148} width={210} height={38} rx={8} fill="#f59e0b" opacity={0.18} stroke="#f59e0b" />
          <text x={460} y={171} fontSize={12.5} textAnchor="middle" fill="currentColor">
            Braun-Anteil &gt; 30 % ?
          </text>

          {/* Blätter */}
          <rect x={25} y={246} width={110} height={34} rx={8} fill="#10b981" opacity={0.22} stroke="#10b981" />
          <text x={80} y={267} fontSize={12} textAnchor="middle" fill="currentColor">gesund</text>
          <rect x={185} y={246} width={110} height={34} rx={8} fill="#8b5cf6" opacity={0.22} stroke="#8b5cf6" />
          <text x={240} y={267} fontSize={12} textAnchor="middle" fill="currentColor">Gelbmosaik</text>
          <rect x={325} y={246} width={110} height={34} rx={8} fill="#8b5cf6" opacity={0.22} stroke="#8b5cf6" />
          <text x={380} y={267} fontSize={12} textAnchor="middle" fill="currentColor">Braunfäule</text>
          <rect x={485} y={246} width={110} height={34} rx={8} fill="#8b5cf6" opacity={0.22} stroke="#8b5cf6" />
          <text x={540} y={267} fontSize={12} textAnchor="middle" fill="currentColor">Mehltau</text>
        </svg>
      </div>
      <p>
        Jeder innere Knoten testet <strong>ein Feature gegen einen
        Schwellwert</strong>, jedes Blatt ist eine Klasse. Ein neues Bild
        läuft von der Wurzel nach unten — Vorhersage in Mikrosekunden,
        und der Pfad ist die Erklärung gleich mit.
      </p>

      <h3>Woher kommen die Fragen? Gini-Impurity</h3>
      <p>
        Beim Training probiert der Baum an jedem Knoten alle Features und
        viele Schwellwerte durch und bewertet jeden Kandidaten danach, wie{" "}
        <em>rein</em> die beiden entstehenden Gruppen wären:
      </p>
      <div className="ml-formel">
        Gini(Gruppe) = 1 − Σₖ pₖ² &nbsp;&nbsp;&nbsp; (pₖ = Anteil der Klasse k in der Gruppe)
      </div>
      <ol className="step-list">
        <li>
          Gruppe besteht nur aus einer Klasse → Gini = 0 (perfekt rein).
        </li>
        <li>
          Zwei Klassen je 50&nbsp;% → Gini = 0,5 (maximal unrein bei 2
          Klassen).
        </li>
        <li>
          Gewählt wird der Split mit der größten{" "}
          <strong>Impurity-Reduktion</strong> (gewichtetes Mittel der
          Kind-Gruppen vs. Eltern-Knoten).
        </li>
        <li>In jeder Kind-Gruppe: dasselbe Spiel, rekursiv.</li>
      </ol>

      <DepthBox variant="why" title="Warum braucht der Baum keine skalierten Features?">
        Ein Split fragt nur: <em>Ist Feature j größer als t?</em> Diese
        Frage ist invariant gegen jede monotone Transformation — ob das
        Feature in [0, 1] oder [0, 10.000] lebt, ändert nur den gelernten
        Schwellwert, nicht die Aufteilung. Der ganze
        StandardScaler-Komplex aus LogReg und SVM entfällt ersatzlos.
        Das macht Bäume (und Wälder) zum dankbarsten Verfahren für
        heterogene, schlecht normalisierte Features — einer der Gründe
        ihrer Beliebtheit auf Tabellendaten.
      </DepthBox>

      <DepthBox variant="mistake" title="Den Baum unbegrenzt wachsen lassen">
        Ohne Stopp-Kriterium splittet der Baum weiter, bis jedes Blatt nur
        noch ein einziges Trainingsbild enthält — 100&nbsp;%
        Trainings-Accuracy, auswendig gelernt. Schlimmer noch: Bäume sind{" "}
        <strong>instabil</strong>. Ein paar andere Trainingsbilder, und
        gleich der Wurzel-Split kippt — und mit ihm der gesamte Baum
        darunter. Hohe Varianz ist die Krankheit des Entscheidungsbaums.
        Man kann sie mit <code>max_depth</code> und{" "}
        <code>min_samples_leaf</code> lindern — oder sie zur Stärke
        umdrehen. Genau das tut der Random Forest in der nächsten Lektion.
      </DepthBox>

      <DepthBox variant="deeper" title="Gini vs. Entropy — und warum es fast egal ist">
        Die Alternative zur Gini-Impurity ist die Entropie
        (−Σ pₖ log pₖ, der &bdquo;Information Gain&ldquo; aus der
        Informationstheorie). Beide Kurven sind fast deckungsgleich: maximal
        bei Gleichverteilung, null bei Reinheit. In der Praxis unterscheiden
        sich die resultierenden Bäume selten messbar; Gini ist der
        sklearn-Default, weil der Logarithmus entfällt und es schneller
        rechnet. Erwähnenswert fürs Kolloquium: Beide sind{" "}
        <em>gierige</em> lokale Kriterien — der global optimale Baum ist
        NP-hart, der gierige Baum nur eine gute Heuristik.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Dem <strong>Random Forest</strong> (nächste Lektion: viele instabile
        Bäume mitteln sich zu einem stabilen Modell), der{" "}
        <strong>Features-Lektion</strong> (Histogramm-Bins sind genau die
        Art Feature, auf der Splits gut funktionieren) und{" "}
        <strong>Gradient Boosting</strong> (die andere große Baum-Familie:
        XGBoost &amp; Co. bauen Bäume sequenziell statt parallel).
      </DepthBox>
    </div>
  );
}

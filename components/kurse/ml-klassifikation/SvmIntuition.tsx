import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function SvmIntuition() {
  return (
    <div className="lesson-card">
      <h2>SVM: die breiteste Straße</h2>
      <p className="lesson-description">
        Zwischen zwei trennbaren Punktwolken gibt es unendlich viele
        Trennlinien — Logistic Regression nimmt irgendeine gute. Die{" "}
        <strong>Support Vector Machine</strong> stellt eine schärfere
        Frage: Welche Linie hat zu <em>beiden</em> Seiten den größten
        Sicherheitsabstand?
      </p>

      <div className="info-box">
        <strong>Maximum Margin:</strong> Die SVM legt nicht eine Linie,
        sondern die breiteste mögliche Straße zwischen die Klassen. Die
        Mitte der Straße ist die Entscheidungsgrenze.
      </div>

      <h3>Das Bild, das man nie wieder vergisst</h3>
      <div className="ml-demo">
        <svg viewBox="0 0 600 300" role="img" aria-label="Maximum-Margin-Trennlinie mit Support-Vektoren">
          {/* Straße (Margin-Band) */}
          <polygon
            points="84,255 484,-5 516,45 116,305"
            fill="#f59e0b"
            opacity={0.12}
          />
          {/* Entscheidungsgrenze */}
          <line x1={100} y1={280} x2={500} y2={20} stroke="#f59e0b" strokeWidth={2.5} />
          {/* Margin-Linien */}
          <line x1={84} y1={255} x2={484} y2={-5} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="6 5" />
          <line x1={116} y1={305} x2={516} y2={45} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="6 5" />

          {/* Klasse gesund (grün), links oben */}
          <circle cx={120} cy={80} r={6} fill="#10b981" />
          <circle cx={180} cy={60} r={6} fill="#10b981" />
          <circle cx={140} cy={140} r={6} fill="#10b981" />
          <circle cx={240} cy={90} r={6} fill="#10b981" />
          <circle cx={90} cy={180} r={6} fill="#10b981" />
          {/* Support-Vektoren grün (auf der Margin-Linie) */}
          <circle cx={204} cy={177} r={6} fill="#10b981" stroke="#f59e0b" strokeWidth={3} />
          <circle cx={364} cy={73} r={6} fill="#10b981" stroke="#f59e0b" strokeWidth={3} />

          {/* Klasse krank (violett), rechts unten */}
          <circle cx={420} cy={250} r={6} fill="#8b5cf6" />
          <circle cx={480} cy={200} r={6} fill="#8b5cf6" />
          <circle cx={360} cy={260} r={6} fill="#8b5cf6" />
          <circle cx={500} cy={260} r={6} fill="#8b5cf6" />
          <circle cx={450} cy={140} r={6} fill="#8b5cf6" />
          {/* Support-Vektor violett */}
          <circle cx={296} cy={188} r={6} fill="#8b5cf6" stroke="#f59e0b" strokeWidth={3} />

          <text x={150} y={278} fontSize={12} fill="#10b981">gesund</text>
          <text x={470} y={120} fontSize={12} fill="#8b5cf6">krank</text>
          <text x={310} y={30} fontSize={12} fill="#f59e0b">Margin (die Straße)</text>
        </svg>
      </div>
      <p>
        Die umrandeten Punkte sind die <strong>Support-Vektoren</strong>:
        die Trainingsbeispiele, die direkt am Straßenrand liegen. Nur sie
        bestimmen die Grenze — alle anderen Punkte könnte man löschen, ohne
        dass sich irgendetwas ändert. Daher der Name des Verfahrens.
      </p>

      <h3>Drei Eigenschaften, die daraus folgen</h3>
      <ol className="step-list">
        <li>
          <strong>Sparsamkeit</strong> — Das fertige Modell besteht nur aus
          den Support-Vektoren. Bei sauber trennbaren Daten sind das
          wenige; bei verrauschten Daten werden es viele (und das Modell
          langsam).
        </li>
        <li>
          <strong>Robustheit der Grenze</strong> — Punkte tief im eigenen
          Gebiet ziehen die Grenze nicht zu sich. Die Logistic Regression
          dagegen schiebt ihre Grenze auch wegen Punkten, die längst
          richtig klassifiziert sind.
        </li>
        <li>
          <strong>Empfindlichkeit gegen Ausreißer am Rand</strong> — Ein
          einziges falsch gelabeltes Blatt nahe der Grenze kann die Straße
          drastisch verengen. Dagegen gibt es den Soft Margin (unten).
        </li>
      </ol>

      <MlQuelle
        id="cortes1995-svm"
        kernaussagen={[
          "Das SVM-Paper: Soft-Margin-Formulierung für nicht perfekt trennbare Daten.",
          "Verbindet Maximum-Margin-Idee mit dem Kernel-Trick zu einem praktisch einsetzbaren Verfahren.",
          "Jahrzehntelang Stand der Technik für Bildklassifikation — bis zu den CNNs.",
        ]}
      />

      <DepthBox variant="why" title="Warum sollte die breiteste Straße besser generalisieren?">
        Neue, ungesehene Blätter streuen um die Trainingsbeispiele herum.
        Liegt die Grenze knapp an einer Klasse, kippen schon kleine
        Abweichungen Punkte auf die falsche Seite. Ein breiter Margin ist
        ein Puffer gegen genau diese Streuung. Das ist nicht nur Intuition:
        Aus der statistischen Lerntheorie folgt, dass die erwartete
        Fehlerrate mit wachsendem Margin sinkt — unabhängig von der
        Dimension des Feature-Raums. Deshalb funktionieren SVMs auch bei
        512 Dimensionen und vergleichsweise wenigen Beispielen gut.
      </DepthBox>

      <DepthBox variant="mistake" title="Von der SVM Wahrscheinlichkeiten erwarten">
        Eine SVM liefert von Haus aus nur Seite + Abstand zur Grenze
        (<code>decision_function</code>), keine Wahrscheinlichkeit.{" "}
        <code>SVC(probability=True)</code> schraubt intern eine
        Kalibrierung per Kreuzvalidierung dran — das macht das Training
        spürbar langsamer und die Werte sind eine Näherung. Wer
        Wahrscheinlichkeiten als Kernfeature braucht, ist bei der Logistic
        Regression von vornherein richtiger.
      </DepthBox>

      <DepthBox variant="deeper" title="Soft Margin: bezahlbare Regelverstöße">
        Echte Daten sind selten perfekt trennbar — PlantVillage-Histogramme
        zweier ähnlicher Krankheiten überlappen. Der{" "}
        <strong>Soft Margin</strong> erlaubt Punkten, in der Straße oder
        sogar auf der falschen Seite zu liegen, gegen eine Strafe
        (Schlupfvariablen ξᵢ). Der Parameter C wechselt den Kurs der
        Währung: großes C = Verstöße teuer = schmale Straße, die sich um
        jeden Punkt windet; kleines C = Verstöße billig = breite, ruhige
        Straße. Das zugehörige Loss heißt <strong>Hinge Loss</strong>:
        null Strafe ab genug Abstand, linear ansteigend davor.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Dem <strong>Kernel-Trick</strong> (nächste Lektion — was tun, wenn
        keine gerade Straße existiert), der{" "}
        <strong>LogReg-Intuition</strong> (beide linear, anderes
        Optimierungsziel) und dem <strong>SVM-Tuning</strong> (C in
        Aktion).
      </DepthBox>
    </div>
  );
}

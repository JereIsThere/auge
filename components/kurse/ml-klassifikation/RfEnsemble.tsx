import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function RfEnsemble() {
  return (
    <div className="lesson-card">
      <h2>Vom Baum zum Wald</h2>
      <p className="lesson-description">
        Ein einzelner Baum ist instabil: kleine Datenänderung, anderer
        Baum. Der Random Forest macht aus diesem Defekt ein Prinzip — er
        baut <strong>absichtlich viele verschiedene</strong> Bäume und
        lässt sie abstimmen. Die Einzelfehler mitteln sich weg.
      </p>

      <div className="info-box">
        <strong>Random Forest = Bagging + Feature-Zufall:</strong> Jeder
        Baum sieht (1) eine zufällige Bootstrap-Stichprobe der Daten und
        prüft (2) an jedem Knoten nur eine zufällige Teilmenge der
        Features. Vorhersage: Mehrheitsentscheid.
      </div>

      <h3>Die zwei Zufallsquellen</h3>
      <div className="flow-step">
        <div className="flow-step-num">1</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Bootstrap-Sampling (Bagging)</div>
          <div className="flow-step-desc">
            Für jeden Baum werden n Beispiele <em>mit Zurücklegen</em> aus
            den n Trainingsdaten gezogen. Jeder Baum sieht so ~63&nbsp;%
            der Bilder, manche mehrfach — jeder lernt eine andere Version
            des Datasets.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">2</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Feature-Zufall pro Knoten</div>
          <div className="flow-step-desc">
            An jedem Split stehen nur √(Anzahl Features) zufällig gewählte
            Features zur Wahl (bei 512 also ~23). Dominante Features können
            nicht jeden Baum gleich aussehen lassen.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">3</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Abstimmung</div>
          <div className="flow-step-desc">
            Jeder der z.B. 300 Bäume gibt eine Klasse ab; die häufigste
            gewinnt (bzw. die gemittelten Klassen-Wahrscheinlichkeiten).
          </div>
        </div>
      </div>

      <h3>Warum das funktioniert — die Jury-Intuition</h3>
      <p>
        Stell dir 300 Gutachter vor, die jeder zu 75&nbsp;% richtig liegen.
        Sind ihre Fehler <strong>unabhängig</strong>, liegt die Mehrheit
        fast nie daneben — Fehler eines Einzelnen werden überstimmt. Sind
        die Fehler dagegen <strong>korreliert</strong> (alle haben
        dieselbe Schwäche), bringt die Abstimmung nichts: Alle irren
        gemeinsam. Die beiden Zufallsquellen existieren genau deshalb —
        sie <em>dekorrelieren</em> die Bäume.
      </p>

      <MlQuelle
        id="breiman2001-rf"
        kernaussagen={[
          "Das Random-Forest-Paper: Bagging + zufällige Feature-Auswahl pro Split.",
          "Zeigt: Der Generalisierungsfehler hängt von Stärke der Einzelbäume UND Korrelation zwischen ihnen ab.",
          "Mehr Bäume führen nicht zu Overfitting — der Fehler konvergiert.",
        ]}
      />
      <MlQuelle
        id="ho1995-randomforests"
        kernaussagen={[
          "Frühform der Idee: Entscheidungsbäume auf zufälligen Feature-Unterräumen trainieren.",
          "Motivation: Einzelbäume verlieren Generalisierung, wenn man sie beliebig komplex wachsen lässt.",
        ]}
      />

      <DepthBox variant="why" title="Bias-Varianz: warum Mitteln genau hier hilft">
        Der Fehler eines Modells zerfällt in <strong>Bias</strong>{" "}
        (systematisch daneben) und <strong>Varianz</strong> (instabil je
        nach Trainingsdaten). Tiefe Bäume haben wenig Bias, aber riesige
        Varianz — der perfekte Kandidat fürs Mitteln, denn Mitteln senkt{" "}
        <em>Varianz</em>, nicht Bias: Bei B unabhängigen Bäumen fällt der
        Varianz-Anteil etwa auf 1/B. Deshalb mittelt man tiefe Bäume statt
        flacher: Flache Bäume hätten gemeinsamen Bias, und den stimmt
        keine Mehrheit weg. Umgekehrt heißt das: Ein Random Forest aus
        lauter gleich-falschen Bäumen bleibt falsch.
      </DepthBox>

      <DepthBox variant="mistake" title="Mehr Bäume = Overfitting? Nein.">
        Die Intuition &bdquo;300 tiefe Bäume, jeder einzeln übergefittet —
        das Ensemble muss doch erst recht overfitten&ldquo; klingt
        plausibel und ist falsch. Mit mehr Bäumen nähert sich der Wald
        seinem Erwartungswert — die Kurve wird <em>flacher</em>, nicht
        schlechter (Breiman 2001 beweist die Konvergenz). Mehr Bäume
        kosten nur Zeit und RAM. Overfitting beim Random Forest steuert
        man über die <em>Tiefe</em> der Bäume und{" "}
        <code>min_samples_leaf</code>, nicht über die Anzahl.
      </DepthBox>

      <DepthBox variant="deeper" title="Out-of-Bag: das eingebaute Validation-Set">
        Jeder Baum hat ~37&nbsp;% der Trainingsdaten <em>nie gesehen</em>{" "}
        (sie wurden für seinen Bootstrap nicht gezogen). Man kann also
        jedes Trainingsbild von genau den Bäumen klassifizieren lassen,
        die es nicht kennen — das ergibt den <strong>OOB-Score</strong>:
        eine ehrliche Generalisierungs-Schätzung ganz ohne separates
        Validation-Set, quasi gratis beim Training. In sklearn:{" "}
        <code>oob_score=True</code>. Für schnelle Experimente ersetzt das
        die Cross-Validation; das finale Test-Set ersetzt es nicht.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>RF-Praxis</strong> (das alles in fünf Zeilen sklearn),
        dem <strong>Entscheidungsbaum</strong> (die Varianz, die hier
        weggemittelt wird) und <strong>Gradient Boosting</strong> — dem
        Gegenentwurf: Bäume nacheinander bauen, jeder korrigiert die
        Fehler der vorherigen (XGBoost, LightGBM).
      </DepthBox>
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Spiegeltherapie() {
  return (
    <div className="lesson-card">
      <h2>Spiegeltherapie</h2>
      <p className="lesson-description">
        Eine der elegantesten Reha-Interventionen der letzten Jahrzehnte:
        Ein einfacher Spiegel, eine geniale Idee. Die gesunde Hand wird
        bewegt, ein Spiegel reflektiert das Bild an die Stelle, wo die
        betroffene Hand wäre — und das Gehirn glaubt, die betroffene Hand
        bewegt sich. Daraus folgt messbare Kortex-Reorganisation.
      </p>

      <div className="info-box">
        Entwickelt von <strong>V. S. Ramachandran</strong> (1990er) als
        Therapie für Phantomschmerz nach Amputation. Heute Standard auch
        nach Schlaganfall, komplexem regionalem Schmerzsyndrom (CRPS) und
        bei sensorischen Defiziten der Hand.
      </div>

      <h3>Das Setup in 60 Sekunden</h3>
      <ol className="step-list">
        <li>
          <strong>Spiegel aufstellen</strong> — vertikal zwischen den beiden
          Händen, mit Spiegelseite zur gesunden Hand. Spezialspiegel mit
          Box gibt es als Reha-Equipment, im Notfall reicht ein normaler
          Spiegel.
        </li>
        <li>
          <strong>Sicht auf die betroffene Hand verdecken</strong> — sie
          ist hinter dem Spiegel. Wichtig: das Auge soll <em>nicht</em>{" "}
          das echte Bild der betroffenen Hand sehen, sondern{" "}
          <em>nur</em> das Spiegelbild der gesunden.
        </li>
        <li>
          <strong>Synchron oder einseitig üben</strong> — Faust schließen,
          öffnen, Finger einzeln strecken, Klavierspielen mimen. Der
          Klient sieht im Spiegel zwei „intakt" funktionierende Hände.
        </li>
        <li>
          <strong>Mit der betroffenen Hand mitversuchen</strong> — auch
          wenn sich nichts bewegt. Mentale Imagery + visuelle
          „Bestätigung" stärken die Bahnen.
        </li>
      </ol>

      <h3>Wofür's wofür gut ist</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🧠 Schlaganfall</div>
          <div className="actor-row">
            Aktiviert den präfrontal-motorischen Cortex der betroffenen
            Hemisphäre — auch ohne echte Bewegung. Mehrere RCTs zeigen
            signifikante Verbesserung der Hand-/Armfunktion gegen
            Standard-Reha alleine.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">👻 Phantomschmerz</div>
          <div className="actor-row">
            Bei Amputierten reagiert der Cortex der amputierten Extremität
            auf andere Reize („Phantomgefühl"). Spiegeltherapie liefert
            das visuelle Feedback einer intakten Hand — und reduziert die
            cortikale Überaktivität messbar.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">🔥 CRPS und chronische Schmerzen</div>
          <div className="actor-row">
            Bei komplexem regionalem Schmerzsyndrom hilft die visuelle
            Trennung „Bewegung ohne Schmerz" — das Gehirn kann lernen,
            dass Bewegung wieder ohne Schmerz möglich ist.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum lässt sich das Gehirn so leicht täuschen?">
        Visuelle Information dominiert über sensorische und
        propriozeptive — wenn Auge und Hand sich widersprechen, vertraut
        das ZNS dem Auge. (Klassisches Beispiel: Rubber Hand Illusion.)
        Spiegeltherapie nutzt das gezielt: das Auge sieht zwei
        funktionierende Hände → das Gehirn integriert das in sein
        Körperbild → Cortex-Areale der betroffenen Hand werden mit
        aktiviert.
      </DepthBox>

      <DepthBox variant="mistake" title='"Es bewegt sich ja gar nichts, das bringt nichts"'>
        Häufige Skepsis von Klienten. Aber: gerade <em>weil</em> die
        betroffene Hand sich nicht bewegt, ist Spiegeltherapie sinnvoll.
        Es geht nicht um Muskeltraining — es geht darum, die kortikalen
        Bahnen am Leben zu halten, bis die Hand wieder ansprechbar wird.
        Faustregel: 15-30 min/Tag, über Wochen. Klient:innen merken oft
        erst nach 2-4 Wochen subtile Veränderungen.
      </DepthBox>

      <DepthBox variant="deeper" title="Kombinierte Protokolle">
        Spiegeltherapie wird selten allein eingesetzt — die meiste
        Evidenz gibt es für Kombinationen:
        <ul>
          <li>
            <strong>Mirror + Motor Imagery</strong> — Spiegel als visueller
            Anker für mentale Bewegungsvorstellung. Synergistisch.
          </li>
          <li>
            <strong>Mirror + CIMT</strong> — die gesunde Hand wird
            blockiert (Schiene), die betroffene benutzt — im Spiegel
            sieht der Klient eine flüssige Bewegung, obwohl real noch
            Schwierigkeiten existieren.
          </li>
          <li>
            <strong>Mirror + Bilateral Training</strong> — beide Hände
            synchron üben (gesund wird gespiegelt), aktiviert beide
            Hemisphären gleichzeitig.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Motor Imagery (visueller Anker hilft, kinästhetische Vorstellung
        zu produzieren), Spiegelneuronen (Sehen anderer Bewegung aktiviert
        eigene motorische Areale — Spiegel macht diesen Effekt
        intensiver), Neuroplastizität (das ist der zugrundeliegende
        Mechanismus, der die Veränderung trägt).
      </DepthBox>

      <DepthBox variant="history" title="Ramachandran's Spiegelkasten">
        V. S. Ramachandran ist Neurowissenschaftler an der UCSD. Anfang
        der 1990er beobachtete er einen Patienten mit Phantomschmerz —
        die amputierte Hand „verkrampfte" gefühlt, die Person konnte sie
        nicht „öffnen". Ramachandran baute eine simple Box mit einem
        Spiegel in der Mitte. Der Patient legte die gesunde Hand rein,
        sah ihr Spiegelbild dort, wo die amputierte gewesen wäre, öffnete
        die gesunde Hand — und „spürte", wie sich auch die phantomische
        Hand öffnete. Der Krampf löste sich. Eine Studienlinie war
        geboren. Sein Buch „Phantoms in the Brain" (1998) ist immer noch
        eine wundervolle Einführung in das Thema.
      </DepthBox>
    </div>
  );
}

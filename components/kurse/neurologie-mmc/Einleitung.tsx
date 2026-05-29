import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Vom Hirn zum Muskel</h2>
      <p className="lesson-description">
        Eine Bewegung wirkt simpel: man denkt sie, sie passiert. Dahinter
        steckt aber eine Kette aus mindestens fünf Stationen, die in
        Millisekunden durchlaufen wird. Wer diese Kette versteht, versteht
        auch, warum manche Reha funktioniert und manche nicht — und warum
        Mind-Muscle-Connection mehr ist als Esoterik.
      </p>

      <div className="info-box">
        <strong>Die Kurzfassung:</strong> Motorcortex → Pyramidenbahn →
        spinales Vorderhorn → Motoneuron → Muskelfaser. Wenn an einer
        Station eine Schwäche oder Läsion sitzt, weiß man, was die Übung
        gezielt ansprechen muss.
      </div>

      <h3>Die fünf Stationen</h3>
      <ol className="step-list">
        <li>
          <strong>Motorcortex (Großhirnrinde, Gyrus präcentralis)</strong> —
          hier wird der Bewegungsplan generiert. Jede Körperregion hat ihren
          eigenen Bereich, größer für feinmotorische Regionen (Hand, Mund),
          kleiner für grobmotorische (Bein, Rumpf) — der berühmte Homunkulus.
        </li>
        <li>
          <strong>Pyramidenbahn (Tractus corticospinalis)</strong> — leitet
          das Signal vom Hirn ins Rückenmark. Kreuzt fast vollständig auf
          die Gegenseite (deshalb steuert die linke Hirnhälfte die rechte
          Körperhälfte und umgekehrt).
        </li>
        <li>
          <strong>Spinales Vorderhorn (Rückenmark)</strong> — letzte
          Verarbeitungsstation vor dem Muskel. Hier sitzen die
          α-Motoneurone und Reflex-Schaltkreise.
        </li>
        <li>
          <strong>α-Motoneuron + neuromuskuläre Endplatte</strong> — schickt
          den Aktionsstrom über das Axon direkt an die Muskelfasern. Ein
          Motoneuron innerviert mehrere Muskelfasern (= motorische Einheit).
        </li>
        <li>
          <strong>Muskelfaser</strong> — Aktin und Myosin gleiten ineinander,
          die Faser kontrahiert. Ende der Kette, aber Sensoren in der Faser
          melden den Status zurück ans Rückenmark (Propriozeption).
        </li>
      </ol>

      <h3>Die drei Akteure</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🧠 Zentrales Nervensystem (ZNS)</div>
          <div className="actor-row">
            Hirn + Rückenmark. Plant Bewegung, lernt sie, automatisiert sie.
            Hier passiert das, was wir <em>Üben</em> nennen.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">⚡ Peripheres Nervensystem (PNS)</div>
          <div className="actor-row">
            Nerven vom Rückenmark zu Muskeln und Sensoren. Reine
            Leitungsbahn — aber wenn sie geschädigt ist (Polyneuropathie,
            Karpaltunnel), bricht die ganze Kette.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">💪 Muskelapparat</div>
          <div className="actor-row">
            Die ausführende Schicht. Aber: ohne ZNS-Signal keine
            Kontraktion. Im Ergotherapie-Kontext: auch der schönste
            Muskelaufbau hilft nichts, wenn die Ansteuerung nicht passt.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum dauert Reha so lange?">
        Weil jede Station Wochen braucht, um sich umzustellen. Synaptische
        Verstärkung (LTP) braucht Wiederholung. Nervenwachstum nach Läsion
        läuft mit ~1 mm/Tag. Muskelhypertrophie braucht 6–8 Wochen sichtbarer
        Veränderung. Die Kette ist nur so schnell wie ihr langsamstes Glied —
        und nach einem Schlaganfall ist das oft die kortikale Reorganisation.
      </DepthBox>

      <DepthBox variant="mistake" title="Schwacher Muskel = Krafttraining">
        Klassischer Fehl-Schluss in der Reha. Wenn die Schwäche von einer
        gestörten neuronalen Ansteuerung kommt (z.B. nach Schlaganfall),
        bringt klassisches Krafttraining wenig — du trainierst eine
        intakte Muskelmasse, die das Signal nicht bekommt. Erst Ansteuerung
        wiederherstellen (Motor Imagery, EMG-Biofeedback, CIMT), <em>dann</em>{" "}
        Belastung erhöhen.
      </DepthBox>

      <DepthBox variant="deeper" title="Das Bewegungs-Doppel: Pyramidal vs. Extrapyramidal">
        <ul>
          <li>
            <strong>Pyramidalsystem</strong> — präzise willkürliche Bewegung
            (Hand greift gezielt nach Tasse). Bei Läsion: spastische Parese.
          </li>
          <li>
            <strong>Extrapyramidalsystem</strong> — Tonus, Haltung,
            automatisierte Bewegung (Gehen, Kauen). Geht über Basalganglien
            und Kleinhirn. Bei Läsion: Tremor, Rigor, Ataxie (klassisch:
            Parkinson, Kleinhirn-Schäden).
          </li>
        </ul>
        In der Ergotherapie tauchen beide Systeme ständig parallel auf —
        und brauchen unterschiedliche Übungsansätze.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Mind-Muscle-Connection (nächste Lektion — was passiert, wenn man
        bewusst auf einen Muskel fokussiert), Homunkulus (warum so viel
        Hirnfläche für die Hand reserviert ist — direkt relevant für
        Handtherapie), und Motor Imagery (das mentale Üben, das auch
        ohne Bewegung neuronale Bahnen stärkt).
      </DepthBox>

      <DepthBox variant="history" title="Das motorische Modell ist überraschend jung">
        Sir Charles Sherrington beschrieb das Konzept der motorischen Einheit
        und der Reflexbögen erst Anfang des 20. Jahrhunderts (Nobelpreis 1932).
        Wilder Penfield kartierte den Homunkulus in den 1940ern bei
        wachen Hirnoperationen. Das, was du in der Ergotherapie-Ausbildung
        lernst, ist neurologisch gesehen relativ frisches Wissen — und wird
        durch Bildgebung (fMRT, TMS) noch immer aktiv präzisiert.
      </DepthBox>
    </div>
  );
}

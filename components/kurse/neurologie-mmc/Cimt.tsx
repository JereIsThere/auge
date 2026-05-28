import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Cimt() {
  return (
    <div className="lesson-card">
      <h2>CIMT — Constraint-Induced Movement Therapy</h2>
      <p className="lesson-description">
        Eine der evidenzstärksten Reha-Methoden nach Schlaganfall — und
        konzeptionell radikal: die <em>gesunde</em> Hand wird mit einer
        Schiene oder einem Handschuh blockiert. Das zwingt den/die
        Klient:in, die betroffene Hand zu benutzen, auch wenn das mühsam
        ist. Resultat: massive kortikale Reorganisation.
      </p>

      <div className="info-box">
        Entwickelt von <strong>Edward Taub</strong> (UAB Birmingham) ab
        den 1980ern. Bricht das Phänomen „<em>learned non-use</em>" —
        nach Schlaganfall lernt das Gehirn, die schwächere Hand zu
        vermeiden, weil sie unzuverlässig ist; dieser Vermeidungs-Reflex
        verfestigt das Defizit zusätzlich zur eigentlichen Läsion.
      </div>

      <h3>Das Standardprotokoll</h3>
      <ol className="step-list">
        <li>
          <strong>Restriction</strong> — gesunde Hand für <em>90 % der
          Wachzeit</em> in Schiene/Handschuh. Klingt brutal, ist aber
          essentiell — ohne die Restriktion fällt man sofort in alte
          Vermeidungsmuster zurück.
        </li>
        <li>
          <strong>Massed Practice</strong> — 6 Stunden pro Tag,
          intensives Üben der betroffenen Hand. Aufgaben sind funktional
          (Tasse halten, Schlüssel drehen, Knöpfe schließen) — nicht
          abstrakte Übungen.
        </li>
        <li>
          <strong>Shaping</strong> — Aufgaben werden in kleinste
          schaffbare Schritte zerlegt. Erfolg ist garantiert, dann
          schrittweise schwieriger. Belohnung sofort.
        </li>
        <li>
          <strong>Transfer Package</strong> — gezielte Strategien, das
          neu Gelernte in den Alltag zu übertragen. Tagebuch,
          Hausaufgaben, Familien-Coaching.
        </li>
        <li>
          <strong>Dauer: 2-3 Wochen</strong>, dann normalisiert sich die
          Reha — aber: in den 2-3 Wochen zeigt fMRT bereits messbare
          Cortex-Vergrößerung der betroffenen Hand-Region.
        </li>
      </ol>

      <h3>Wann eignet sich CIMT?</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">✅ Geeignet</div>
          <div className="actor-row">
            Schlaganfall-Patient:innen mit mindestens 10° aktiver
            Handgelenk-Extension und 10° aktiver Finger-Extension. Heißt:
            die Hand muss noch ein <em>Minimum</em> an Bewegung haben —
            sonst kann sie nicht trainiert werden.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">❌ Nicht geeignet</div>
          <div className="actor-row">
            Komplette Plegie (gar keine willkürliche Bewegung) — hier
            erst Motor Imagery, Spiegeltherapie, oder EMG-Biofeedback,
            um überhaupt erst Ansteuerung zurückzubringen. Auch bei
            schwerer Spastik oder Schmerz nicht direkt einsetzbar.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">⚙ Modifiziertes CIMT (mCIMT)</div>
          <div className="actor-row">
            Wenn 6 h/Tag nicht realistisch sind: 2-3 h/Tag, 5×/Woche, 10
            Wochen. Etwas geringere Effekte, aber besser durchhaltbar.
            Praxis-Standard in vielen Kliniken.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum funktioniert es so dramatisch?">
        Zwei Mechanismen wirken zusammen:
        <ol>
          <li>
            <strong>Unterbrechung von learned non-use</strong> — der/die
            Klient:in <em>muss</em> die betroffene Hand benutzen,
            entdeckt dabei oft Fähigkeiten, die sie schon hatte, aber
            vermieden hatte.
          </li>
          <li>
            <strong>Massive kortikale Stimulation</strong> — 6h/Tag ist
            eine enorme Reiz-Dichte für die betroffene Hemisphäre.
            Neuroplastizität skaliert nicht-linear mit Reiz-Dichte:
            5 h/Tag intensives Training bringt deutlich mehr als 10×
            30 min verteilt.
          </li>
        </ol>
      </DepthBox>

      <DepthBox variant="mistake" title='"CIMT ist veraltet"'>
        Im Gegenteil — CIMT ist eines der wenigen Reha-Protokolle mit
        einer Cochrane-Review-Bewertung „Strong Evidence" für die
        chronische Phase nach Schlaganfall. Was ältere Studien suggerierten
        (Wolf et al. 2006), wurde in den 2010ern repliziert und
        verfeinert. Was tatsächlich diskutiert wird, ist die Intensität
        (6h vs 3h vs 2h) und die optimale Phase (akut vs subakut vs
        chronisch).
      </DepthBox>

      <DepthBox variant="deeper" title="Forced-Use vs. Shaping — die zwei Säulen">
        <ul>
          <li>
            <strong>Forced Use</strong>: gesunde Hand blockieren. Nötig,
            aber nicht ausreichend — manche Klient:innen sitzen einfach
            still, wenn sie die gesunde Hand nicht benutzen können.
          </li>
          <li>
            <strong>Shaping</strong>: aktive, sehr fein abgestufte
            Aufgaben für die betroffene Hand. Macht den Unterschied
            zwischen „mühsam aushalten" und „echte Plastizität".
          </li>
        </ul>
        Beide zusammen ergeben CIMT. Eines allein bringt deutlich weniger.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Neuroplastizität (CIMT ist im Grunde Plastizität-Maximierung
        durch Reiz-Dichte), Learned Non-Use (das zu durchbrechende
        Phänomen), Bilaterale Integration (kontra-intuitiv: CIMT
        kann später bilaterale Funktion verbessern, obwohl unilateral
        geübt wird), Spiegeltherapie (oft kombiniert für Klient:innen
        mit zu wenig aktiver Bewegung für reines CIMT).
      </DepthBox>
    </div>
  );
}

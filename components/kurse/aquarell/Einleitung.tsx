import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Was Aquarell anders macht</h2>
      <p className="lesson-description">
        Aquarell ist die Kunst, dem <em>Wasser</em> zuzuhören. Anders als Öl
        oder Acryl deckt Aquarell nicht — es leuchtet. Weiß entsteht durch
        Aussparung, nicht durch Beimischung. Und das Pigment bewegt sich, wo
        das Wasser hingeht: du steuerst grob, das Wasser füllt die Lücken.
      </p>

      <div className="info-box">
        <strong>Die Grundregel:</strong> dunkel über hell, nicht umgekehrt.
        Wer mit den hellen Stellen anfängt und sich zum Dunklen vorarbeitet,
        bleibt sicher.
      </div>

      <h3>Die drei Materialien</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🎨 Pigmente</div>
          <div className="actor-row">
            Transparent, leuchtend, lichtbeständig. Drei Eigenschaften
            entscheiden alles: Transparenz, Granulierung, Färbekraft.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">📜 Papier</div>
          <div className="actor-row">
            Min. 300 gsm (140 lb) aus 100 % Baumwolle. Dünneres wellt sich,
            Holzschliff säuft Farbe und wirft sie nicht mehr ab.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">💧 Wasser</div>
          <div className="actor-row">
            Das eigentliche Werkzeug. Wie viel ist auf dem Pinsel? Wie viel
            ist auf dem Papier? Diese zwei Verhältnisse bestimmen, ob du
            scharfe Kanten, weiche Übergänge oder zufällige Texturen
            bekommst.
          </div>
        </div>
      </div>

      <h3>Eine typische Sitzung</h3>
      <ol className="step-list">
        <li>
          <strong>Skizze und Wertstudie</strong> — auf billigem Papier kurz
          ausprobieren, welche Stellen hell, mittel, dunkel werden.
        </li>
        <li>
          <strong>Hellste Schicht zuerst</strong> — sehr verdünnte Farbe
          flächig auftragen (Wash). Helle Stellen frei lassen, sie sind das
          „Weiß" deines Bildes.
        </li>
        <li>
          <strong>Mittlere Werte</strong> — wenn die erste Schicht trocken
          ist, eine konzentriertere Farbe darüber. Glazing nennt sich das.
        </li>
        <li>
          <strong>Dunkelste Akzente am Ende</strong> — wenig Wasser, viel
          Pigment, gezielt. Kontrast macht das Bild.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum darf man Aquarell nicht korrigieren?">
        Weil die Farbe transparent ist. Wenn du eine dunkle Schicht überstreichst,
        addiert sich neue Farbe — der Fehler verschwindet nicht, er wird nur
        bunter. Korrekturen passieren entweder durch Lifting (mit feuchtem
        Pinsel oder Schwamm wieder rausnehmen, geht nur bei nicht-stainenden
        Pigmenten) oder gar nicht. Deshalb planen Aquarellist:innen viel
        bewusster als andere Maler.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich mache erstmal Konturen, dann male ich aus"'>
        Klassischer Anfängerfehler. Aquarell funktioniert anders als ein
        Malbuch — die Konturen entstehen durch das Zusammentreffen von
        Farbflächen, nicht durch Linien. Wenn du erst Linien zeichnest und
        dann „ausmalst", verlierst du die Lebendigkeit. Besser:
        Wertstudie → grobe Form mit Pinsel → Details ganz am Ende.
      </DepthBox>

      <DepthBox variant="deeper" title="Die drei Pigment-Eigenschaften">
        <ul>
          <li>
            <strong>Transparenz</strong>: Phthalo Blue ist sehr transparent
            (Glazing geht), Cadmium Red ist halbdeckend (mischt sich, statt
            zu glasieren).
          </li>
          <li>
            <strong>Granulierung</strong>: Ultramarin, Sienna setzen sich in
            Papierfasern ab und ergeben Textur. Phthalo, Quinacridone bleiben
            glatt.
          </li>
          <li>
            <strong>Färbekraft (staining)</strong>: Phthalo „verklebt" mit
            dem Papier und lässt sich nicht mehr abheben. Cobalt schwimmt
            obenauf, ist leicht zu liften.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Farbtheorie (kommt als nächstes — wie Pigmente sich mischen, wann
        Komplementärfarben das Bild lebendig machen), Wet-on-Wet vs
        Wet-on-Dry (die zwei Grundtechniken), Notan-Studien (Wertstruktur in
        2–3 Stufen vor dem Farb-Detail).
      </DepthBox>
    </div>
  );
}

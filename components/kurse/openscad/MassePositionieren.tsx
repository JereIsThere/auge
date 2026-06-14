import { DepthBox } from "@/components/lessons/DepthBox";
import { ScadStep } from "./ScadStep";
import { IsoFigure, solidBox, proj } from "./iso";
import "@/components/lessons/lesson.css";
import "./openscad.css";

export default function MassePositionieren() {
  const S = 1.6;
  const [bx, by] = proj([42.5, 55, 0], S); // Breite (X)
  const [dx, dy] = proj([85, 27.5, 0], S); // Tiefe (Y)
  const [hx, hy] = proj([85, 55, 20], S); // Höhe (Z)

  return (
    <div className="lesson-card">
      <h2>Maße &amp; Positionieren</h2>
      <p className="lesson-description">
        Ein Würfel mit einer Zahl ist überall gleich lang. Für eine Box brauchen
        wir <strong>drei Maße</strong> — und wir müssen verstehen, wo im Raum
        unser Körper eigentlich sitzt.
      </p>

      <div className="info-box">
        <span className="mono">cube([x, y, z])</span> nimmt drei Maße in
        Millimeter. Eine Standard-Visitenkarte ist <strong>85 × 55 mm</strong> —
        damit ist unser Box-Rohling schon fast definiert.
      </div>

      <h3>Der Box-Rohling auf Kartenmaß</h3>

      <ScadStep
        titel="rohling.scad"
        code={`cube([85, 55, 40]);`}
        figur={
          <IsoFigure
            scale={S}
            cx={168}
            cy={116}
            caption="cube([85, 55, 40]) — Breite × Tiefe × Höhe"
            faces={solidBox([0, 0, 0], [85, 55, 40])}
          >
            <text className="iso-label strong" x={bx} y={by + 24} textAnchor="middle">
              85 mm
            </text>
            <text className="iso-label strong" x={dx + 12} y={dy + 16}>
              55 mm
            </text>
            <text className="iso-label strong" x={hx + 14} y={hy + 4}>
              40 mm
            </text>
          </IsoFigure>
        }
      />

      <h3>Das Koordinatensystem</h3>
      <p>
        OpenSCAD denkt in drei Achsen: <strong>X</strong> nach rechts,{" "}
        <strong>Y</strong> nach hinten, <strong>Z</strong> nach oben. Standardmäßig
        sitzt der Würfel mit einer Ecke im Nullpunkt und wächst in den positiven
        Bereich. Das ist wichtig zu wissen, sobald wir mehrere Teile kombinieren.
      </p>

      <h3>Teile verschieben: translate</h3>
      <p>
        <span className="mono">translate([x, y, z])</span> verschiebt das{" "}
        <em>nächste</em> Objekt. So setzen wir z.&nbsp;B. einen flachen Block als
        Deckel-Rohling oben auf die Box:
      </p>

      <ScadStep
        titel="verschieben.scad"
        code={`cube([85, 55, 40]);

translate([0, 0, 40])      // 40 mm nach oben
  cube([85, 55, 5]);       // flacher Block obendrauf`}
      />

      <DepthBox variant="why" title="Warum drei benannte Maße?">
        <p>
          Sobald die Box eine Breite, Tiefe und Höhe hat, kannst du jede einzeln
          steuern. Genau hier wird OpenSCAD stark: In zwei Lektionen ersetzen wir
          die <code>85</code> und <code>55</code> durch Variablen wie{" "}
          <code>karte_b</code> — dann passt sich die ganze Box automatisch an jede
          Kartengröße an.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Häufige Fehler beim Positionieren">
        <p>
          <strong>„Mein Würfel sitzt nicht in der Mitte":</strong> Standard ist die
          Ecke im Nullpunkt. <code>cube([85,55,40], center=true)</code> zentriert
          ihn um den Ursprung. <strong>translate wirkt nur auf das Folgende:</strong>{" "}
          <code>translate([..]) cube(..);</code> verschiebt genau diesen einen
          Würfel — die Reihenfolge (erst translate, dann Objekt) muss stimmen.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Mehr als verschieben: rotate & Vektoren">
        <p>
          Die <code>[x, y, z]</code>-Schreibweise ist ein <em>Vektor</em> und taucht
          überall auf. <code>rotate([0, 0, 45])</code> dreht z.&nbsp;B. um 45° um die
          Z-Achse. Transformationen lassen sich auch verschachteln —{" "}
          <code>translate(...) rotate(...) cube(...)</code> — und wirken dann von
          innen nach außen.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <p>
          Jetzt haben wir einen massiven Block. In der nächsten Lektion höhlen wir
          ihn mit <code>difference()</code> aus — und aus dem Klotz wird eine
          Schale.
        </p>
      </DepthBox>
    </div>
  );
}

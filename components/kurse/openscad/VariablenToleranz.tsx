import { DepthBox } from "@/components/lessons/DepthBox";
import { ScadStep } from "./ScadStep";
import { IsoFigure, tray, solidBox, proj, type Face } from "./iso";
import "@/components/lessons/lesson.css";
import "./openscad.css";

export default function VariablenToleranz() {
  const S = 1.5;
  // Schale + ein Kartenstapel als gelber Block darin.
  const karten: Face[] = solidBox([3, 3, 2], [84, 54, 12]).map((f) => ({
    ...f,
    role: "card",
  }));
  const faces: Face[] = [...tray([0, 0, 0], [90, 60, 40], 2), ...karten];
  const [lx, ly] = proj([45, 30, 14], S);

  return (
    <div className="lesson-card">
      <h2>Variablen &amp; Toleranz</h2>
      <p className="lesson-description">
        Bis jetzt stehen feste Zahlen im Code. Jetzt heben wir sie nach oben in{" "}
        <strong>Variablen</strong> — und fügen das hinzu, was eine gedruckte Box
        erst benutzbar macht: ein bisschen <strong>Spiel</strong>.
      </p>

      <div className="info-box">
        Eine Variable ist ein Name für eine Zahl. Steht <code>karte_b = 85</code>{" "}
        oben, kannst du an einer Stelle die Kartengröße ändern — und die ganze Box
        passt sich an.
      </div>

      <h3>Die Box wird parametrisch</h3>

      <ScadStep
        titel="box.scad"
        code={`karte_b = 85;     // Visitenkarte Breite
karte_t = 55;     // Visitenkarte Tiefe
wand    = 2;      // Wandstärke
spiel   = 0.5;    // Luft, damit die Karten reinrutschen
hoehe   = 40;

aussen_b = karte_b + 2 * wand + spiel;
aussen_t = karte_t + 2 * wand + spiel;

difference() {
  cube([aussen_b, aussen_t, hoehe]);
  translate([wand, wand, wand])
    cube([karte_b + spiel, karte_t + spiel, hoehe]);
}`}
        figur={
          <IsoFigure
            scale={S}
            cx={168}
            cy={120}
            caption="Innenmaß = Karte + Spiel, Außenmaß = + 2 × Wand"
            faces={faces}
          >
            <text className="iso-label strong" x={lx} y={ly - 8} textAnchor="middle">
              Karten + Spiel
            </text>
          </IsoFigure>
        }
      />

      <p>
        Der Trick steckt in den zwei Rechenzeilen: Das <strong>Innenmaß</strong>{" "}
        ist Kartengröße plus <code>spiel</code>, das <strong>Außenmaß</strong>{" "}
        zusätzlich plus zweimal Wandstärke (links und rechts). Ändere{" "}
        <code>karte_b</code> auf ein anderes Format — Innen- und Außenwand wandern
        automatisch mit.
      </p>

      <DepthBox variant="why" title="Warum überhaupt Spiel?">
        <p>
          Ein 3D-Drucker trifft Maße nie perfekt — eine Wand wird leicht dicker,
          eine Öffnung leicht enger als im Modell. Ohne <code>spiel</code> klemmen
          die Karten oder passen gar nicht rein. 0,3–0,5&nbsp;mm sind für die meisten
          Drucker ein guter Startwert. Toleranz ist <em>der</em> Unterschied zwischen
          „sieht am Bildschirm gut aus" und „funktioniert in echt".
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Stolpersteine bei der Rechnung">
        <p>
          <strong>Wand nur einmal gezählt:</strong> Die Wand sitzt auf{" "}
          <em>beiden</em> Seiten — deshalb <code>2 * wand</code>.{" "}
          <strong>Spiel vergessen:</strong> dann ist das Innenmaß exakt die
          Kartengröße und die Karten klemmen. <strong>Komma statt Punkt:</strong>{" "}
          OpenSCAD schreibt Dezimalzahlen mit Punkt — <code>0.5</code>, nicht{" "}
          <code>0,5</code>.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Variablen sind Ausdrücke, keine Zuweisungen">
        <p>
          OpenSCAD ist eine <em>deklarative</em> Sprache: <code>aussen_b</code>{" "}
          beschreibt eine Beziehung, keinen Ablauf. Steht eine Variable mehrfach im
          Code, gilt am Ende der letzte Wert — eine Schleife im klassischen Sinn
          gibt es nicht. Mit <code>echo(aussen_b);</code> kannst du dir den
          berechneten Wert in der Konsole ausgeben lassen.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <p>
          Funktional ist die Box jetzt fertig. Was noch fehlt, ist Feinschliff:
          runde Ecken und eine Daumenmulde zum Herausnehmen der Karten — und der
          Weg zur druckfertigen STL. Beides kommt in den nächsten Lektionen.
        </p>
      </DepthBox>
    </div>
  );
}

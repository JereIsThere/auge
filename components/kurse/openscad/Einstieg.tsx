import { DepthBox } from "@/components/lessons/DepthBox";
import { ScadStep } from "./ScadStep";
import { IsoFigure, solidBox } from "./iso";
import "@/components/lessons/lesson.css";
import "./openscad.css";

export default function Einstieg() {
  return (
    <div className="lesson-card">
      <h2>Dinge programmieren statt zeichnen</h2>
      <p className="lesson-description">
        OpenSCAD baut 3D-Modelle aus Code. Du beschreibst als Text, welche Form
        entstehen soll — OpenSCAD rechnet sie aus und zeigt sie an. In diesem
        Kurs bauen wir damit Schritt für Schritt eine echte, druckbare
        Visitenkarten-Box.
      </p>

      <div className="info-box">
        In OpenSCAD klickst du nichts zusammen — du schreibst, was entstehen
        soll. Ungewohnt, aber genau deshalb lässt sich am Ende{" "}
        <strong>alles per Zahl anpassen</strong>: andere Kartengröße? Eine Zeile
        ändern, fertig.
      </div>

      <h3>Dein erster Körper</h3>
      <p>
        Ein Würfel ist das „Hallo Welt" von OpenSCAD. Eine Zeile, ein
        Strichpunkt am Ende — das ist schon ein vollständiges Programm:
      </p>

      <ScadStep
        titel="wuerfel.scad"
        code={`cube(30);`}
        figur={
          <IsoFigure
            scale={2.1}
            cx={150}
            cy={170}
            caption="cube(30) — 30 mm in jede Richtung"
            faces={solidBox([0, 0, 0], [30, 30, 30])}
          />
        }
      />

      <p>
        <span className="mono">cube(30)</span> erzeugt einen Würfel mit 30&nbsp;mm
        Kantenlänge. Die Einheit ist <strong>immer Millimeter</strong> — praktisch,
        denn so denkt auch dein 3D-Drucker. Drück in OpenSCAD <span className="mono">F5</span>,
        und die Vorschau erscheint.
      </p>

      <DepthBox variant="why" title="Warum Code statt Maus?">
        <p>
          Drei Gründe: <strong>parametrisch</strong> — eine Variable ändern passt
          das ganze Modell an. <strong>Reproduzierbar</strong> — derselbe Code
          ergibt immer dasselbe Teil. <strong>Versionierbar</strong> — der Code
          ist Text, also kannst du ihn wie jeden anderen Code in git versionieren
          und Änderungen nachvollziehen. Eine gezeichnete STL kann das alles nicht.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Typische Stolpersteine am Anfang">
        <p>
          <strong>Strichpunkt vergessen:</strong> Jede Anweisung endet mit{" "}
          <code>;</code>. Fehlt er, meckert OpenSCAD.{" "}
          <strong>Nichts sichtbar?</strong> F5 macht die schnelle Vorschau, F6 das
          finale (langsamere) Render. <strong>In Maus-Operationen denken:</strong>{" "}
          Es gibt kein „Eckpunkt ziehen". Du beschreibst Formen und verrechnest
          sie miteinander — das ist der Denkschritt, der am Anfang am meisten
          umgewöhnt.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Was OpenSCAD im Hintergrund macht (CSG)">
        <p>
          OpenSCAD arbeitet mit <em>Constructive Solid Geometry</em>: Es nimmt
          einfache Grundkörper (Würfel, Zylinder, Kugel) und kombiniert sie mit
          Mengen-Operationen — vereinigen, abziehen, schneiden. Komplexe Teile
          sind also nur clever verrechnete einfache Körper. Genau diesen Weg gehen
          wir bei der Box: erst ein Block, dann höhlen wir ihn aus.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <p>
          Als Nächstes geben wir dem Würfel echte Maße und lernen, Teile im Raum
          zu <strong>positionieren</strong> — die Grundlage, um die Box auf
          Visitenkarten-Größe zu bringen.
        </p>
      </DepthBox>
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import { ScadStep } from "./ScadStep";
import { IsoFigure, tray } from "./iso";
import "@/components/lessons/lesson.css";
import "./openscad.css";

export default function Aushoehlen() {
  return (
    <div className="lesson-card">
      <h2>difference: aushöhlen</h2>
      <p className="lesson-description">
        Ein massiver Block hält keine Karten. Jetzt kommt die wichtigste Operation
        in OpenSCAD: <strong>difference</strong> zieht einen Körper von einem
        anderen ab — und macht aus dem Klotz eine Schale.
      </p>

      <div className="info-box">
        <span className="mono">difference()</span> behält das{" "}
        <strong>erste</strong> Kind und schneidet alle <strong>folgenden</strong>{" "}
        davon ab. Hier: äußere Box minus eine etwas kleinere innere Box = Wände +
        Boden bleiben stehen.
      </div>

      <h3>Vom Block zur Schale</h3>

      <ScadStep
        titel="schale.scad"
        code={`difference() {
  cube([85, 55, 40]);          // 1. bleibt
  translate([2, 2, 2])         // 2 mm Wand & Boden
    cube([81, 51, 40]);        // 2. wird abgezogen
}`}
        figur={
          <IsoFigure
            scale={1.6}
            cx={168}
            cy={116}
            caption="Außenbox minus Innenbox = offene Schale, 2 mm Wand"
            faces={tray([0, 0, 0], [85, 55, 40], 2)}
          />
        }
      />

      <p>
        Die innere Box ist auf jeder Seite 2&nbsp;mm kleiner und um{" "}
        <span className="mono">[2, 2, 2]</span> verschoben — so bleiben ringsum
        2&nbsp;mm Wand und 2&nbsp;mm Boden. Wichtig: Der Innenkörper ist{" "}
        <strong>genauso hoch</strong> (sogar etwas höher), damit er oben{" "}
        <em>durchstößt</em> und die Box offen bleibt.
      </p>

      <DepthBox variant="why" title="Warum difference das Herzstück ist">
        <p>
          Fast jedes nützliche Teil hat Hohlräume, Löcher oder Aussparungen —
          Schraubenlöcher, Kabelkanäle, Griffmulden. Alle entstehen durch{" "}
          <code>difference()</code>: erst den vollen Körper bauen, dann das
          Negativ abziehen. Wer difference verstanden hat, kann den Großteil aller
          Druckteile modellieren.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Die zwei klassischen difference-Fehler">
        <p>
          <strong>Deckel statt offene Box:</strong> Ist der Innenkörper genauso hoch
          und exakt auf gleicher Z-Höhe, bleibt oben eine dünne Haut stehen. Lass
          den Cutter oben 1–2&nbsp;mm <em>überstehen</em> (oder fang ihn weiter unten
          an), damit er sauber durchschneidet. <strong>Reihenfolge:</strong> Das
          erste Kind ist der Körper, alles danach wird abgezogen — vertauscht man
          das, bleibt nichts übrig.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Die drei Boolean-Operationen">
        <p>
          <code>union()</code> verschmilzt Körper zu einem.{" "}
          <code>difference()</code> zieht ab. <code>intersection()</code> behält nur
          die <em>Schnittmenge</em> — den Bereich, den alle Körper gemeinsam haben.
          Mit diesen drei Mengen-Operationen plus Grundkörpern lässt sich
          erstaunlich viel bauen — das ist die ganze Idee hinter CSG.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <p>
          Unsere Schale hat noch feste Zahlen drin. Als Nächstes machen wir sie{" "}
          <strong>parametrisch</strong>: Kartenmaße als Variablen oben — plus etwas{" "}
          <em>Spiel</em>, damit die Karten wirklich reinpassen.
        </p>
      </DepthBox>
    </div>
  );
}

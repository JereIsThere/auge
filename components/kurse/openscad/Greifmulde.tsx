import { DepthBox } from "@/components/lessons/DepthBox";
import { ScadStep } from "./ScadStep";
import "@/components/lessons/lesson.css";
import "./openscad.css";

/** Querschnitt (Seitenschnitt) der Box: Vorderwand mit Greifmulde + Karten. */
function Querschnitt() {
  return (
    <div className="iso">
      <svg
        viewBox="0 0 280 180"
        className="iso-svg"
        role="img"
        aria-label="Querschnitt der Box mit Greifmulde"
      >
        {/* Boden */}
        <rect
          x="40"
          y="128"
          width="200"
          height="22"
          fill="var(--iso-floor)"
          stroke="var(--iso-edge)"
          strokeWidth="1.2"
        />
        {/* Rückwand */}
        <rect
          x="218"
          y="40"
          width="22"
          height="110"
          fill="var(--iso-wall)"
          stroke="var(--iso-edge)"
          strokeWidth="1.2"
        />
        {/* Karten im Inneren */}
        <g fill="var(--iso-card)" stroke="var(--iso-edge)" strokeWidth="1">
          <rect x="74" y="54" width="34" height="76" />
          <rect x="114" y="54" width="34" height="76" />
          <rect x="154" y="54" width="34" height="76" />
        </g>
        {/* Vorderwand mit halbrunder Mulde */}
        <path
          d="M40,128 L40,40 Q 51,76 62,40 L62,128 Z"
          fill="var(--iso-front)"
          stroke="var(--iso-edge)"
          strokeWidth="1.2"
        />
        {/* Radius-Maß der Mulde */}
        <line x1="51" y1="41" x2="51" y2="74" className="iso-dim" />
        <text className="iso-label" x="55" y="62">
          mulde_r
        </text>
        {/* Daumen-Pfeil */}
        <path
          d="M16,26 C 33,38 44,50 51,62"
          fill="none"
          stroke="var(--iso-anno-strong)"
          strokeWidth="2"
        />
        <polygon points="51,63 44,56 55,53" fill="var(--iso-anno-strong)" />
        <text className="iso-label strong" x="8" y="20">
          Daumen
        </text>
      </svg>
      <p className="iso-caption">
        Querschnitt: die Mulde in der Vorderwand gibt den Daumen frei
      </p>
    </div>
  );
}

export default function Greifmulde() {
  return (
    <div className="lesson-card">
      <h2>Die Greifmulde: Karten greifen</h2>
      <p className="lesson-description">
        Die Box hält jetzt Karten — aber sie wieder herauszubekommen ist fummelig,
        weil die Wände sie verdecken. Die Lösung zeigt das Schöne am Code-Modell:
        Wir fügen <strong>kein</strong> neues Konzept hinzu, sondern{" "}
        <strong>ziehen einfach eine weitere Form ab</strong>.
      </p>

      <div className="info-box">
        Jedes Feature einer Box ist entweder „Material dazu" (<code>union</code>)
        oder „Material weg" (<code>difference</code>). Die Greifmulde ist
        Material weg — ein halber Zylinder, aus der Vorderwand geschnitten.
      </div>

      <h3>Eine neue Form: der Zylinder</h3>
      <p>
        Bisher hatten wir nur Quader. Für die runde Mulde brauchen wir einen{" "}
        <span className="mono">cylinder</span>:
      </p>

      <ScadStep
        titel="zylinder.scad"
        code={`cylinder(h = 40, r = 12, $fn = 64);
// h = Höhe, r = Radius
// $fn = wie viele Segmente → wie rund`}
      />

      <p>
        Ein Zylinder steht standardmäßig <em>aufrecht</em> (entlang Z). Für die
        Mulde legen wir ihn mit <span className="mono">rotate</span> quer und
        positionieren ihn mittig in der Vorderwand.
      </p>

      <h3>Die Mulde in die Box schneiden</h3>
      <p>
        Wir hängen den Zylinder einfach als <strong>weiteres Kind</strong> in das{" "}
        <code>difference()</code> der Box — alles, was er überlappt, verschwindet:
      </p>

      <ScadStep
        titel="box-mit-mulde.scad"
        code={`karte_b = 85; karte_t = 55;
wand = 2; spiel = 0.5; hoehe = 40;
mulde_r = 12;     // Tiefe der Mulde
mulde_b = 45;     // Breite der Mulde

aussen_b = karte_b + 2 * wand + spiel;
aussen_t = karte_t + 2 * wand + spiel;

difference() {
  cube([aussen_b, aussen_t, hoehe]);          // Außenkörper

  translate([wand, wand, wand])               // Hohlraum
    cube([karte_b + spiel, karte_t + spiel, hoehe]);

  translate([aussen_b / 2, wand, hoehe])      // Greifmulde
    rotate([0, 90, 0])
      cylinder(h = mulde_b, r = mulde_r, center = true, $fn = 64);
}`}
        figur={<Querschnitt />}
      />

      <p>
        Beachte: Die Mulde nutzt dieselben Variablen wie der Rest.{" "}
        <code>aussen_b / 2</code> hält sie automatisch mittig — egal, wie breit
        die Box wird. Genau das ist die Stärke des parametrischen Modells:{" "}
        <strong>ein Maß ändern, und alles bleibt stimmig.</strong>
      </p>

      <DepthBox variant="why" title="Warum aussen_b / 2 statt einer festen Zahl?">
        <p>
          Schriebe man hier <code>42.5</code>, wäre die Mulde nur für genau diese
          Boxbreite mittig. Sobald du <code>karte_b</code> auf ein anderes Format
          änderst, säße sie schief. Mit <code>aussen_b / 2</code> ist die Position
          eine <em>Beziehung</em> zur Box — sie rechnet sich bei jeder Änderung neu.
          Das ist der Unterschied zwischen „einmal hingemalt" und „echtes Modell".
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Klassische Fehler bei der Mulde">
        <p>
          <strong>Zylinder steht hochkant:</strong> Ohne <code>rotate</code> zeigt
          er nach oben und schneidet ein rundes Loch nach unten statt einer Mulde —
          die <code>rotate([0, 90, 0])</code> legt ihn quer.{" "}
          <strong>$fn vergessen:</strong> dann ist die Mulde grobkantig statt rund
          (Standard sind nur wenige Segmente). <strong>Mulde zu tief:</strong> ist{" "}
          <code>mulde_r</code> größer als der Wandabstand zum Boden, schneidest du
          die Box durch.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Andere Mulden-Formen">
        <p>
          Ein einzelner Zylinder gibt eine halbrunde Rinne mit geraden Enden. Willst
          du eine weiche, an beiden Enden gerundete Mulde, nimmst du{" "}
          <code>hull()</code> um <em>zwei</em> Kugeln (<code>sphere</code>) — dann
          spannt OpenSCAD eine glatte Hülle dazwischen. Eine Kugel statt Zylinder
          gibt eine runde Daumen-Delle. Dieselbe Idee, anderes Negativ.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <p>
          <code>hull()</code> und <code>$fn</code> tauchen gleich wieder auf, wenn
          wir die <strong>Box-Ecken abrunden</strong>. Und danach geht es vom Modell
          zur druckfertigen STL.
        </p>
      </DepthBox>
    </div>
  );
}

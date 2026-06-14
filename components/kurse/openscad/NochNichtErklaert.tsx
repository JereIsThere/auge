import "@/components/lessons/lesson.css";
import "./openscad.css";

const THEMEN: { name: string; was: string; wofuer: string }[] = [
  {
    name: "module",
    was: "Eigene, wiederverwendbare Bauteile mit Parametern definieren.",
    wofuer: "Box und Deckel als saubere, einzeln aufrufbare Teile.",
  },
  {
    name: "for ( … )",
    was: "Schleifen — dasselbe Element mehrfach, automatisch verteilt.",
    wofuer: "Mehrere Trennfächer oder Lüftungsschlitze in einem Rutsch.",
  },
  {
    name: "hull() / minkowski()",
    was: "Hüllkörper bzw. Abrunden über alle Kanten.",
    wofuer: "Weich abgerundete Box-Ecken statt scharfer Kanten.",
  },
  {
    name: "$fn",
    was: "Auflösung von Rundungen — wie viele Segmente ein Kreis hat.",
    wofuer: "Glatte Zylinder und runde Ecken statt eckiger Näherung.",
  },
  {
    name: "Deckel mit Passung",
    was: "Zwei Teile mit Toleranz-Spalt, die ineinander stecken.",
    wofuer: "Ein aufsteckbarer Deckel, der hält, aber abnehmbar bleibt.",
  },
  {
    name: "Customizer",
    was: "Spezielle Kommentare machen Variablen zu Schiebereglern.",
    wofuer: "Maße ändern, ohne den Code anzufassen.",
  },
  {
    name: "text() + linear_extrude()",
    was: "2D-Text/Formen in die Höhe ziehen, um sie 3D zu machen.",
    wofuer: "Name oder Logo erhaben auf dem Deckel.",
  },
  {
    name: "import() / surface()",
    was: "Externe Dateien (SVG, DXF, Höhenkarten) einlesen.",
    wofuer: "Ein fertiges Logo als SVG in die Box einlassen.",
  },
  {
    name: "Gewinde / threads",
    was: "Schraubgewinde über Bibliotheken wie BOSL2.",
    wofuer: "Ein Schraubverschluss statt Steckdeckel.",
  },
];

export default function NochNichtErklaert() {
  return (
    <div className="lesson-card">
      <h2>Das ist hier noch nicht erklärt</h2>
      <p className="lesson-description">
        Unsere Visitenkarten-Box nutzt bewusst nur die Basics — ein paar
        Grundkörper, <code>difference</code> und Variablen. Das reicht für ein
        echtes, druckbares Teil. OpenSCAD kann aber deutlich mehr. Hier eine
        ehrliche Landkarte, was wir <strong>weggelassen</strong> haben und wofür
        es gut ist.
      </p>

      <div className="info-box">
        Diese Liste ist gleichzeitig die <strong>Roadmap</strong> dieses Kurses:
        Stück für Stück wird aus jedem Punkt eine eigene Lektion — und die Box
        bekommt damit Deckel, Logo und runde Ecken.
      </div>

      <div className="wegweiser">
        {THEMEN.map((t) => (
          <div className="wegweiser-item" key={t.name}>
            <span className="wegweiser-name">{t.name}</span>
            <span className="wegweiser-was">{t.was}</span>
            <span className="wegweiser-wofuer">{t.wofuer}</span>
          </div>
        ))}
      </div>

      <div className="success-box">
        Bis dahin gilt: Mit dem, was du in diesem Kurs gelernt hast, kannst du die
        Box schon drucken und benutzen. Alles Weitere ist Kür — und kommt.
      </div>
    </div>
  );
}

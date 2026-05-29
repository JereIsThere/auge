"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Schema = "drittel" | "diagonale" | "goldener" | "kreuz" | "off";

const SCHEMAS: { id: Schema; titel: string; kurz: string }[] = [
  { id: "off",       titel: "Aus",            kurz: "Bild ohne Hilfslinien" },
  { id: "drittel",   titel: "Drittelregel",   kurz: "Vier Schnittpunkte — auf einen Fokus setzen" },
  { id: "goldener",  titel: "Goldener Schnitt", kurz: "1 : 1,618 — natürlicher als Drittel" },
  { id: "diagonale", titel: "Diagonalen",     kurz: "Eckverbindungen — führen den Blick" },
  { id: "kreuz",     titel: "Mittelkreuz",    kurz: "Selten gut — meist statisch und langweilig" },
];

const PHI = 1.618;

export default function Komposition() {
  const [schema, setSchema] = useState<Schema>("drittel");
  const [horizont, setHorizont] = useState(33); // Position des Horizonts in %
  const [baumX, setBaumX] = useState(72);       // Position des Baums in %

  return (
    <div className="lesson-card">
      <h2>Bildaufteilung</h2>
      <p className="lesson-description">
        Wo etwas im Bild liegt, entscheidet ob es spannend wirkt oder zu Tode
        gestaltet ist. Drittelregel, goldener Schnitt, Diagonalen — alle haben
        dieselbe Wurzel: Asymmetrie ist interessanter als Symmetrie. Hier
        kannst du die Hilfslinien durchschalten und den Horizont/Baum-Fokus
        verschieben.
      </p>

      <div className="info-box">
        <strong>Was zählt:</strong> der <em>Fokus</em> (das wichtigste Element)
        liegt auf einem Schnittpunkt, der <em>Horizont</em> auf einer der
        horizontalen Linien — nicht in der Bildmitte. Sobald beides stimmt,
        wirkt das Bild von selbst „komponiert".
      </div>

      <h3>Hilfslinien</h3>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {SCHEMAS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSchema(s.id)}
            className="toggle-code"
            style={{
              background: schema === s.id ? "#eff6ff" : "transparent",
              borderColor: schema === s.id ? "#2563eb" : "#d1d5db",
              color: schema === s.id ? "#1d4ed8" : "#374151",
              fontWeight: schema === s.id ? 700 : 500,
              fontSize: "0.78rem",
              padding: "5px 10px",
              textAlign: "left",
            }}
            title={s.kurz}
          >
            {s.titel}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="input-group">
          <label>Horizont-Position: {horizont} %</label>
          <input type="range" min={10} max={90} step={1} value={horizont} onChange={(e) => setHorizont(parseInt(e.target.value, 10))} />
        </div>
        <div className="input-group">
          <label>Baum-Position (X): {baumX} %</label>
          <input type="range" min={10} max={90} step={1} value={baumX} onChange={(e) => setBaumX(parseInt(e.target.value, 10))} />
        </div>
      </div>

      <svg viewBox="0 0 400 280" style={{ width: "100%", background: "#fdf6e3", border: "1px solid #d6c896", borderRadius: 10 }}>
        {/* Bild-Sample */}
        <rect x="0" y="0" width="400" height={(horizont / 100) * 280} fill="#cfe0ef" />
        <rect x="0" y={(horizont / 100) * 280} width="400" height={280 - (horizont / 100) * 280} fill="#cbd9a9" />
        {/* Berge im Hintergrund */}
        <polygon
          points={`0,${(horizont / 100) * 280} 80,${(horizont / 100) * 280 - 30} 160,${(horizont / 100) * 280 - 10} 240,${(horizont / 100) * 280 - 40} 320,${(horizont / 100) * 280 - 15} 400,${(horizont / 100) * 280}`}
          fill="#a8b4b8"
          opacity="0.7"
        />
        {/* Baum als Fokus */}
        <ellipse cx={(baumX / 100) * 400} cy={(horizont / 100) * 280 - 25} rx="22" ry="32" fill="#5a8a3d" />
        <rect x={(baumX / 100) * 400 - 3} y={(horizont / 100) * 280 - 5} width="6" height="20" fill="#3a2010" />
        {/* Bodenschatten */}
        <ellipse cx={(baumX / 100) * 400} cy={(horizont / 100) * 280 + 18} rx="28" ry="5" fill="#000" opacity="0.18" />

        {/* Hilfslinien-Overlays */}
        {schema === "drittel" && (
          <g stroke="#dc2626" strokeWidth="1" strokeDasharray="4 3" opacity="0.85">
            <line x1="133.3" y1="0" x2="133.3" y2="280" />
            <line x1="266.6" y1="0" x2="266.6" y2="280" />
            <line x1="0" y1="93.3" x2="400" y2="93.3" />
            <line x1="0" y1="186.6" x2="400" y2="186.6" />
            {[[133.3, 93.3], [266.6, 93.3], [133.3, 186.6], [266.6, 186.6]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#dc2626" opacity="0.8" />
            ))}
          </g>
        )}
        {schema === "goldener" && (
          <g stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 3" opacity="0.85">
            <line x1={400 / PHI} y1="0" x2={400 / PHI} y2="280" />
            <line x1={400 - 400 / PHI} y1="0" x2={400 - 400 / PHI} y2="280" />
            <line x1="0" y1={280 / PHI} x2="400" y2={280 / PHI} />
            <line x1="0" y1={280 - 280 / PHI} x2="400" y2={280 - 280 / PHI} />
            {[
              [400 / PHI, 280 / PHI],
              [400 - 400 / PHI, 280 / PHI],
              [400 / PHI, 280 - 280 / PHI],
              [400 - 400 / PHI, 280 - 280 / PHI],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#7c3aed" opacity="0.8" />
            ))}
          </g>
        )}
        {schema === "diagonale" && (
          <g stroke="#059669" strokeWidth="1" strokeDasharray="4 3" opacity="0.85">
            <line x1="0" y1="0" x2="400" y2="280" />
            <line x1="400" y1="0" x2="0" y2="280" />
            {/* Baroque-Diagonalen */}
            <line x1="0" y1="0" x2="266.6" y2="280" stroke="#059669" opacity="0.5" />
            <line x1="400" y1="0" x2="133.3" y2="280" stroke="#059669" opacity="0.5" />
          </g>
        )}
        {schema === "kreuz" && (
          <g stroke="#a16207" strokeWidth="1" strokeDasharray="4 3" opacity="0.85">
            <line x1="200" y1="0" x2="200" y2="280" />
            <line x1="0" y1="140" x2="400" y2="140" />
            <circle cx="200" cy="140" r="6" fill="#a16207" opacity="0.8" />
          </g>
        )}
      </svg>

      {schema !== "off" && (
        <div style={{ fontSize: "0.85rem", color: "#52525b", lineHeight: 1.6 }}>
          {schema === "drittel" && "Klassischer Standard. Der Baum sollte auf einem der Punkte sitzen, der Horizont auf der oberen oder unteren Linie. Versuch beides — der Horizont ist gerade bei "}
          {schema === "drittel" && <strong>{horizont} %</strong>}
          {schema === "drittel" && " (Ideal: 33 % oder 67 %)."}
          {schema === "goldener" && "Engere Aufteilung als die Drittel — etwa 38 % / 62 %. Wirkt natürlicher, weil das Verhältnis in Pflanzen, Muscheln und vielem in der Natur vorkommt."}
          {schema === "diagonale" && "Diagonalen führen den Blick. Wenn dein Baum, Weg oder Fluss entlang einer Diagonale liegt, wird das Bild dynamisch — wie eine Linie, die das Auge zieht."}
          {schema === "kreuz" && "Mittelkreuz ist statisch — fast nie eine gute Wahl. Ausnahme: bewusst meditative Bilder (Symmetrie als Statement, z.B. Spiegelungen)."}
        </div>
      )}

      <h3>Praxis-Faustregeln</h3>
      <ol className="step-list">
        <li>
          <strong>Horizont NIE in der Mitte</strong> — entweder oberes oder unteres
          Drittel. Mitte teilt das Bild in zwei gleich große Hälften, die um
          Aufmerksamkeit konkurrieren.
        </li>
        <li>
          <strong>Fokus auf Schnittpunkt</strong> — nicht in der Mitte, nicht am
          Rand. Die vier Drittel-Schnittpunkte sind die „Sweet Spots".
        </li>
        <li>
          <strong>Eine starke Diagonale</strong> — ein Weg, ein Fluss, eine Reihe
          von Bäumen. Bringt Bewegung ins Bild.
        </li>
        <li>
          <strong>Drei ungleich große Massen</strong> — Vordergrund, Mittelgrund,
          Hintergrund. Niemals gleich groß. Faustregel: 1 : 2 : 3 oder 1 : 1 : 5.
        </li>
        <li>
          <strong>Blickführung zum Fokus</strong> — Linien, Tonwerte, Farben sollten
          dorthin zeigen, wo das Auge landen soll.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum funktioniert Asymmetrie besser?">
        Unser Gehirn ist eine Mustererkennungs-Maschine. Symmetrie wird sofort
        verarbeitet und abgehakt („gesehen, verstanden, fertig"). Asymmetrische
        Bilder lassen das Gehirn längere Zeit „suchen" — und genau dieses
        Suchen empfinden wir als ästhetisches Erlebnis. Forschung von
        <em>Berlyne</em> (1971) zeigte: Bilder mit mittlerer Komplexität und
        leicht asymmetrischer Komposition werden am längsten betrachtet.
      </DepthBox>

      <DepthBox variant="mistake" title="Alles in die Bildmitte">
        Häufigster Anfänger-Reflex: das interessanteste Element zentriert
        platzieren. Wirkt wie Pass-Foto. Cure: zeichne dein Motiv bewusst
        außerhalb der Mitte, am Rand des Drittel-Schnittpunkts. Hat erst
        Übung gebraucht, ist aber nach ein paar Bildern automatisch.
      </DepthBox>

      <DepthBox variant="deeper" title="Negative Räume nutzen">
        Genauso wichtig wie der Fokus: der <em>leere Raum drumherum</em>.
        Wenn dein Hauptmotiv links sitzt, brauchst du rechts daneben eine
        ruhige Fläche, in die es „atmen" kann. Cluttern alle Bildecken,
        wirkt es überladen, egal wie gut der Fokus sitzt. Faustregel:
        <strong>40-60 % des Bildes ist „nichts"</strong> — Himmel, Wand,
        Hintergrundfläche. Das ist nicht verschwendet, das ist Komposition.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Notan (Wertstruktur trägt die Komposition), Negative Painting (Form
        durch das, was drumrum ist), Farbkreis (Komplementärfarben können
        den Fokus zusätzlich verstärken), Blickführung (Linien und Werte
        leiten das Auge zum Komposition-Hauptpunkt).
      </DepthBox>

      <DepthBox variant="history" title="Goldener Schnitt — Mythos und Realität">
        Der Goldene Schnitt (1 : 1,618) wird oft als „göttliches Verhältnis"
        verkauft. Tatsächlich ist die mathematische Bedeutung in der Kunst
        umstritten — Studien zeigen, dass Maler:innen das Verhältnis selten
        bewusst anwendeten und Betrachter:innen es nicht eindeutig bevorzugen
        gegenüber der einfachen Drittelregel. Trotzdem nützlich als Werkzeug:
        die Aufteilung 38/62 fühlt sich oft natürlicher an als 33/67, weil
        sie weniger schematisch wirkt.
      </DepthBox>
    </div>
  );
}

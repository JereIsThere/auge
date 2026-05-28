"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Schicht = { name: string; hex: string };

const SCHICHT_PALETTE: Schicht[] = [
  { name: "Hansa Yellow",      hex: "#f3d83a" },
  { name: "Quinacridone Rose", hex: "#c2348a" },
  { name: "Phthalo Blue",      hex: "#0c5b8b" },
  { name: "Burnt Sienna",      hex: "#a1532c" },
  { name: "Sap Green",         hex: "#5a8a3d" },
  { name: "Ultramarine",       hex: "#274ea8" },
];

// "Multiply" zweier Hex-Farben mit Opacity-Faktor pro Schicht
function multiplyHex(hexA: string, hexB: string, opacityB: number): string {
  const a = [
    parseInt(hexA.slice(1, 3), 16),
    parseInt(hexA.slice(3, 5), 16),
    parseInt(hexA.slice(5, 7), 16),
  ];
  const b = [
    parseInt(hexB.slice(1, 3), 16),
    parseInt(hexB.slice(3, 5), 16),
    parseInt(hexB.slice(5, 7), 16),
  ];
  // Multiply mit Alpha-Compositing: result = A * (A_mul_B * opacity + (1-opacity))
  const mul = a.map((ca, i) => {
    const cb = b[i];
    const m = (ca * cb) / 255;
    return Math.round(ca * (1 - opacityB) + m * opacityB);
  });
  return "#" + mul.map((c) => c.toString(16).padStart(2, "0")).join("");
}

function glazeStack(schichten: Schicht[]): string {
  if (schichten.length === 0) return "#fdf6e3";
  let result = "#fdf6e3"; // Papier-Weiß
  for (const s of schichten) {
    result = multiplyHex(result, s.hex, 0.55);
  }
  return result;
}

export default function Glazing() {
  const [stack, setStack] = useState<Schicht[]>([
    SCHICHT_PALETTE[0], // Gelb
    SCHICHT_PALETTE[2], // Blau
  ]);

  // Physikalisch gemischt: Mittelwert der Hex-Werte (vereinfacht)
  function physischGemischt(): string {
    if (stack.length === 0) return "#fdf6e3";
    const sums = [0, 0, 0];
    for (const s of stack) {
      sums[0] += parseInt(s.hex.slice(1, 3), 16);
      sums[1] += parseInt(s.hex.slice(3, 5), 16);
      sums[2] += parseInt(s.hex.slice(5, 7), 16);
    }
    const mix = sums.map((c) => Math.round(c / stack.length));
    return "#" + mix.map((c) => c.toString(16).padStart(2, "0")).join("");
  }

  const optisch = glazeStack(stack);
  const physisch = physischGemischt();

  return (
    <div className="lesson-card">
      <h2>Glazing</h2>
      <p className="lesson-description">
        Glazing heißt: transparente Schichten übereinander, jede einzeln
        getrocknet. Das ergibt eine andere Farbe als physisch gemischtes
        Pigment auf der Palette — eine, die <em>von innen leuchtet</em>.
        Probier es: bau deinen Schichtaufbau, vergleich live mit der
        Misch-Variante.
      </p>

      <div className="info-box">
        <strong>Grundregel:</strong> jede Schicht muss <em>komplett trocken</em>
        sein, bevor die nächste kommt. Sonst löst die zweite Schicht die
        erste an und es wird zur Misch-Schlamperei (statt sauber geglast).
      </div>

      <h3>Bau deinen Schichtstapel</h3>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        {SCHICHT_PALETTE.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setStack([...stack, s])}
            className="toggle-code"
            style={{
              borderColor: "#d1d5db",
              fontSize: "0.75rem",
              padding: "5px 9px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 11, height: 11, borderRadius: 2, background: s.hex, border: "1px solid rgba(0,0,0,0.15)" }} />
            + {s.name}
          </button>
        ))}
        {stack.length > 0 && (
          <button
            type="button"
            onClick={() => setStack([])}
            className="toggle-code"
            style={{ fontSize: "0.75rem", padding: "5px 9px", borderColor: "#fca5a5", color: "#dc2626" }}
          >
            Alle löschen
          </button>
        )}
      </div>

      <div className="result-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="result-box">
          <div className="result-label">Optisch geglast (Schicht für Schicht)</div>
          <div style={{
            height: 140,
            background: optisch,
            border: "1px solid #d1d5db",
            borderRadius: 8,
            marginTop: 4,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Schicht-Marker — kleine Etiketten links */}
            {stack.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.78rem", fontStyle: "italic" }}>
                Papier (keine Schicht)
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
            {stack.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", fontFamily: "ui-monospace, monospace" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: s.hex, border: "1px solid rgba(0,0,0,0.15)" }} />
                <span style={{ color: "#52525b" }}>Schicht {i + 1}: {s.name}</span>
                <button
                  type="button"
                  onClick={() => setStack(stack.filter((_, j) => j !== i))}
                  style={{
                    marginLeft: "auto",
                    background: "transparent",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    padding: 0,
                  }}
                  aria-label={`Schicht ${i + 1} entfernen`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 4, fontSize: "0.72rem", color: "#6b7280", fontFamily: "ui-monospace, monospace" }}>
            Ergebnis: {optisch}
          </div>
        </div>

        <div className="result-box">
          <div className="result-label">Physisch gemischt (auf der Palette)</div>
          <div style={{
            height: 140,
            background: physisch,
            border: "1px solid #d1d5db",
            borderRadius: 8,
            marginTop: 4,
          }} />
          <div style={{ fontSize: "0.78rem", color: "#52525b", marginTop: 4 }}>
            Alle Pigmente nass-in-nass gemischt — physisch.
          </div>
          <div style={{ marginTop: 4, fontSize: "0.72rem", color: "#6b7280", fontFamily: "ui-monospace, monospace" }}>
            Ergebnis: {physisch}
          </div>
        </div>
      </div>

      <div className="warn-box" style={{ fontSize: "0.85rem" }}>
        <strong>Beobachte den Unterschied:</strong> Gelb + Blau optisch geglast
        ergibt ein anderes Grün als Gelb + Blau auf der Palette gemischt.
        Geglastes Grün leuchtet, gemischtes wirkt eher matt. Bei mehr Schichten
        (z.B. + Sienna) sieht man auch: physisch wird&apos;s schnell schmutzig-grau,
        optisch behält jede Schicht ihren Charakter.
      </div>

      <h3>Vier klassische Glazing-Anwendungen</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🌤 Atmosphärische Tiefe</div>
          <div className="actor-row">
            Dünne blaue Glazing-Schicht über Hintergrund-Bergen — sie wandern
            sofort optisch zurück. Klassischer Landschafts-Trick.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🌅 Color-Unification</div>
          <div className="actor-row">
            Gegen Ende eine zarte gelbe oder rosa Glazing übers ganze Bild —
            verbindet alle Farben in einer warmen Stimmung.
          </div>
        </div>
        <div className="actor-card alice">
          <div className="actor-title">🌑 Schatten-Modellierung</div>
          <div className="actor-row">
            Statt schwarz: erst Burnt Sienna, dann Ultramarine drauf. Tiefer,
            atmender Schatten mit Wärme.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🍑 Hauttöne</div>
          <div className="actor-row">
            Drei dünne Schichten (Gelb-Ocker, Rosa, Hauch Blau) ergeben
            lebendige Haut — eine Schicht „Hautfarbe" wirkt tot.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum leuchtet optisch geglast anders?">
        Bei <em>physischer Mischung</em> kommen die Pigment-Partikel direkt
        zusammen — Licht wird absorbiert, bevor es zurück kann. Bei <em>Glazing</em>
        liegen die Schichten getrennt aufeinander. Licht dringt durch die obere
        Schicht (Pigment A absorbiert manche Wellenlängen), durch die untere
        (Pigment B absorbiert andere), reflektiert vom <strong>weißen Papier</strong>,
        und kommt durch beide Schichten zurück ins Auge. Das Weiß wirkt als
        Leuchtkasten von hinten — daher die Innen-Leuchtkraft.
      </DepthBox>

      <DepthBox variant="mistake" title="Mit opakem Pigment glasen">
        Glazing funktioniert nur mit transparenten Pigmenten (siehe
        Pigment-Eigenschaften). Cadmium Red als Glazing-Schicht über Gelb
        ergibt keinen leuchtenden Orange-Effekt — es überdeckt das Gelb
        einfach kreidig. Faustregel: <strong>Glazing-Schicht muss Transparenz
        &gt; 70 % haben</strong> (Phthalo, Quinacridone, Hansa, Alizarin,
        Burnt Sienna).
      </DepthBox>

      <DepthBox variant="deeper" title="Wie viele Schichten gehen?">
        Faustregel: <strong>3-4 Glazing-Schichten</strong> bevor das Papier
        anfängt, kreidig zu wirken. Über vier Schichten verlierst du das
        Innen-Leuchten — die untersten Schichten werden vom darüber liegenden
        Pigment einfach zu stark abgedämpft. Wenn du mehr Tiefe willst:
        intensiveres einzelnes Pigment pro Schicht statt mehr Schichten.
        Profis arbeiten oft mit nur <strong>zwei</strong> Schichten — eine
        warme Unterlage, eine kalte oder umgekehrt.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Pigment-Eigenschaften (transparent + niedrige Färbekraft = ideale
        Glazing-Schicht), Wet-on-Dry (Glazing ist immer Wet-on-Dry, niemals
        Wet-on-Wet), Lifting (eine optisch geglaste Stelle lässt sich oft
        besser teilweise heben als eine physisch gemischte — die Schichten
        lösen sich getrennt).
      </DepthBox>

      <DepthBox variant="history" title="Glazing in der Ölmalerei">
        Glazing kommt nicht aus dem Aquarell — die alten Meister (Vermeer,
        Rembrandt, Tizian) bauten ihre Bilder aus 5-20 transparenten Öl-Schichten.
        Vermeers Perlenohrring leuchtet durch genau diese Technik: weiße
        Untermalung, darüber dünne Glazings aus Ultramarin und Bleiweiß.
        Aquarell hat die Idee übernommen und auf Wasser/Papier übertragen —
        einfacher, aber mit denselben Prinzipien.
      </DepthBox>
    </div>
  );
}

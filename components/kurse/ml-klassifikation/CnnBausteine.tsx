"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";
import "./ml.css";

// 8×8-Testbild: vertikale Hell/Dunkel-Kante + dunkles Band unten.
// Werte 0 (schwarz) bis 1 (weiß), bewusst deterministisch.
const BILD: number[][] = Array.from({ length: 8 }, (_, zeile) =>
  Array.from({ length: 8 }, (_, spalte) => {
    if (zeile >= 6) return 0.15; // dunkles Band unten
    return spalte < 4 ? 0.15 : 0.85; // vertikale Kante in der Mitte
  })
);

const KERNEL: Record<string, { label: string; matrix: number[][] }> = {
  sobelX: {
    label: "Vertikale Kanten",
    matrix: [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1],
    ],
  },
  sobelY: {
    label: "Horizontale Kanten",
    matrix: [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ],
  },
  blur: {
    label: "Weichzeichner",
    matrix: [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ],
  },
};

function falte(bild: number[][], kernel: number[][]): number[][] {
  const out: number[][] = [];
  for (let i = 0; i <= bild.length - 3; i++) {
    const zeile: number[] = [];
    for (let j = 0; j <= bild[0].length - 3; j++) {
      let summe = 0;
      for (let di = 0; di < 3; di++)
        for (let dj = 0; dj < 3; dj++)
          summe += kernel[di][dj] * bild[i + di][j + dj];
      zeile.push(summe);
    }
    out.push(zeile);
  }
  return out;
}

const ZELLE = 30;

export default function CnnBausteine() {
  const [kernelId, setKernelId] = useState<keyof typeof KERNEL>("sobelX");
  const [fokus, setFokus] = useState<{ i: number; j: number } | null>(null);

  const kernel = KERNEL[kernelId].matrix;
  const ausgabe = falte(BILD, kernel);
  const maxAbs = Math.max(
    0.001,
    ...ausgabe.flat().map((v) => Math.abs(v))
  );

  const gridStil = (spalten: number): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: `repeat(${spalten}, ${ZELLE}px)`,
    gap: 2,
  });

  return (
    <div className="lesson-card">
      <h2>Bausteine: Conv, Pooling, ReLU</h2>
      <p className="lesson-description">
        Eine Convolution ist nur ein kleines Zahlengitter (der{" "}
        <strong>Filter</strong> oder Kernel), das über das Bild geschoben
        wird. An jeder Position: Werte übereinanderlegen, multiplizieren,
        aufsummieren — eine Zahl. Alle Positionen zusammen ergeben die{" "}
        <strong>Feature-Map</strong>.
      </p>

      <div className="info-box">
        <strong>Der einzige Unterschied zum klassischen Bildfilter:</strong>{" "}
        Beim CNN sind die 9 Zahlen im Filter <em>lernbare Gewichte</em> —
        das Training findet selbst heraus, welche Filter der Aufgabe
        helfen.
      </div>

      <h3>Interaktiv: Filter über ein Mini-Bild schieben</h3>
      <p>
        Das 8×8-Bild hat eine vertikale Kante (Mitte) und eine horizontale
        (unten). Wähle einen Filter und fahre über die Feature-Map rechts —
        links siehst du, welchen 3×3-Ausschnitt die Zelle ansieht:
      </p>
      <div className="ml-demo">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {(Object.keys(KERNEL) as Array<keyof typeof KERNEL>).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setKernelId(id)}
              className="pill"
              style={{
                cursor: "pointer",
                fontWeight: kernelId === id ? 700 : 400,
                outline: kernelId === id ? "2px solid #10b981" : "none",
              }}
            >
              {KERNEL[id].label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Eingabebild */}
          <div>
            <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: 6 }}>
              Input 8×8
            </div>
            <div style={gridStil(8)}>
              {BILD.map((zeile, i) =>
                zeile.map((wert, j) => {
                  const imFokus =
                    fokus &&
                    i >= fokus.i &&
                    i < fokus.i + 3 &&
                    j >= fokus.j &&
                    j < fokus.j + 3;
                  return (
                    <div
                      key={`${i}-${j}`}
                      style={{
                        width: ZELLE,
                        height: ZELLE,
                        borderRadius: 3,
                        background: `rgba(148, 163, 184, ${wert})`,
                        outline: imFokus ? "2px solid #f59e0b" : "1px solid rgba(148,163,184,0.25)",
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Kernel */}
          <div>
            <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: 6 }}>
              Filter 3×3
            </div>
            <div style={gridStil(3)}>
              {kernel.map((zeile, i) =>
                zeile.map((w, j) => (
                  <div
                    key={`${i}-${j}`}
                    style={{
                      width: ZELLE,
                      height: ZELLE,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.66rem",
                      fontFamily: "ui-monospace, monospace",
                      background:
                        w > 0
                          ? `rgba(16, 185, 129, ${Math.min(1, Math.abs(w) / 2) * 0.5 + 0.1})`
                          : w < 0
                            ? `rgba(139, 92, 246, ${Math.min(1, Math.abs(w) / 2) * 0.5 + 0.1})`
                            : "rgba(148,163,184,0.12)",
                    }}
                  >
                    {Math.abs(w) < 0.2 && w !== 0 ? w.toFixed(2) : w}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Feature-Map */}
          <div>
            <div style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: 6 }}>
              Feature-Map 6×6 — grün +, violett −
            </div>
            <div style={gridStil(6)} onMouseLeave={() => setFokus(null)}>
              {ausgabe.map((zeile, i) =>
                zeile.map((v, j) => {
                  const staerke = Math.abs(v) / maxAbs;
                  return (
                    <div
                      key={`${i}-${j}`}
                      onMouseEnter={() => setFokus({ i, j })}
                      style={{
                        width: ZELLE,
                        height: ZELLE,
                        borderRadius: 3,
                        cursor: "crosshair",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        fontFamily: "ui-monospace, monospace",
                        background:
                          v >= 0
                            ? `rgba(16, 185, 129, ${staerke})`
                            : `rgba(139, 92, 246, ${staerke})`,
                        outline:
                          fokus && fokus.i === i && fokus.j === j
                            ? "2px solid #f59e0b"
                            : "1px solid rgba(148,163,184,0.25)",
                      }}
                    >
                      {v.toFixed(1)}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <p>
        Der Kanten-Filter feuert genau dort, wo seine Kante verläuft — und
        ist überall sonst still. Genau das ist eine Feature-Map: eine
        Karte, <em>wo im Bild</em> ein bestimmtes Muster vorkommt. Eine
        Conv-Schicht lernt 32 oder 64 solcher Filter parallel.
      </p>

      <h3>Die übrigen Bausteine</h3>
      <ol className="step-list">
        <li>
          <strong>ReLU</strong> — max(0, x) auf jede Zahl der Feature-Map.
          Negative Aktivierungen werden zu 0; erst diese Nichtlinearität
          macht das Stapeln von Schichten sinnvoll (sonst wäre alles
          zusammen wieder nur eine einzige lineare Operation).
        </li>
        <li>
          <strong>MaxPooling (2×2)</strong> — aus jedem 2×2-Block bleibt
          das Maximum: halbe Auflösung, &bdquo;war das Muster hier
          irgendwo?&ldquo; statt exakter Position. Macht das Netz robust
          gegen kleine Verschiebungen und viertelt die Datenmenge.
        </li>
        <li>
          <strong>Flatten + Dense + Softmax</strong> — am Ende werden die
          letzten Feature-Maps zu einem Vektor und eine normale
          Softmax-Schicht klassifiziert: Logistic Regression auf gelernten
          Features.
        </li>
      </ol>

      <h3>Eine typische Mini-Architektur</h3>
      <div className="ml-formel" style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.85rem" }}>
        Input 128×128×3 → [Conv 32 + ReLU → MaxPool] → [Conv 64 + ReLU →
        MaxPool] → [Conv 128 + ReLU → MaxPool] → Flatten → Dense 128 →
        Softmax 38
      </div>
      <p>
        Mit jeder Stufe schrumpft die Fläche (Pooling) und wächst die Zahl
        der Filter — das Netz tauscht <em>Wo-Information</em> gegen{" "}
        <em>Was-Information</em>. Genau dieses Modell bauen wir in der
        nächsten Lektion in Keras.
      </p>

      <DepthBox variant="why" title="Warum ausgerechnet max beim Pooling?">
        Eine Feature-Map sagt, wie stark ein Muster an jeder Stelle
        vorkommt. Für die Klassifikation zählt meist <em>ob</em> es
        vorkommt, nicht der exakte Pixel — das Maximum eines Blocks ist
        genau diese Information. Mittelwert-Pooling würde ein starkes,
        kleines Signal mit drei leeren Nachbarn verwässern. Moderne
        Architekturen ersetzen Pooling teils durch Convolutions mit
        Schrittweite 2 (strided convolutions) — gleiche Wirkung, lernbar.
      </DepthBox>

      <DepthBox variant="mistake" title="Padding und Größen-Schwund vergessen">
        Ohne Padding schrumpft jede 3×3-Convolution das Bild um 2 Pixel
        (unser 8×8 → 6×6). Bei tiefen Netzen summiert sich das, und
        irgendwann passt kein Filter mehr aufs Restbild — der Klassiker
        unter den Shape-Errors in Keras.{" "}
        <code>padding=&quot;same&quot;</code> hält die Größe konstant,
        geschrumpft wird dann kontrolliert per Pooling. Faustregel: Conv
        erhält die Größe, Pooling halbiert sie.
      </DepthBox>

      <DepthBox variant="deeper" title="Receptive Field: wie weit ein Neuron sieht">
        Ein Neuron der ersten Schicht sieht 3×3 Pixel. Eines der zweiten
        Schicht sieht 3×3 <em>Feature-Map-Zellen</em>, die je 3×3 Pixel
        decken — effektiv 5×5, nach Pooling noch mehr. Mit jeder Schicht
        wächst dieses <strong>Receptive Field</strong>, bis späte Neuronen
        das halbe Blatt überblicken. Erst dadurch kann das Netz große
        Strukturen (Fleckenmuster, Blattform) erfassen, obwohl jeder
        einzelne Filter winzig ist. Zu flaches Netz + zu großes Objekt =
        das Netz kann das Muster prinzipiell nicht sehen.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>CNN-Intuition</strong> (warum diese Bausteine genau die
        drei Bild-Annahmen umsetzen), dem <strong>Keras-Training</strong>{" "}
        (nächste Lektion: dieselbe Architektur als Code) und der{" "}
        <strong>Features-Lektion</strong> — der Sobel-Filter oben ist
        exakt das, was klassische Bildverarbeitung von Hand gebaut hat.
      </DepthBox>
    </div>
  );
}

"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Pigment = {
  name: string;
  hex: string;
  /** 0..100: Färbekraft (höher = staint stärker, schlechter zu liften) */
  staining: number;
  notiz: string;
};

const PIGMENTE: Pigment[] = [
  { name: "Cobalt Blue (PB28)",      hex: "#3163a8", staining: 20, notiz: "Klassisch — liftet fast komplett, sogar nach Trocknung." },
  { name: "Ultramarine (PB29)",      hex: "#274ea8", staining: 30, notiz: "Liftet gut, leichter Geist bleibt." },
  { name: "Cerulean Blue (PB35)",    hex: "#4d8db0", staining: 25, notiz: "Sehr liftbar — viele nutzen es für Himmel mit Wolken-Lifts." },
  { name: "Burnt Sienna (PBr7)",     hex: "#a1532c", staining: 35, notiz: "Geht mit Geduld, bleibt sichtbar getönt." },
  { name: "Quinacridone (PV19)",     hex: "#c2348a", staining: 85, notiz: "Sehr staining — Lift gibt rosa Geist, ungeplant." },
  { name: "Phthalo Blue (PB15)",     hex: "#0c5b8b", staining: 95, notiz: "Praktisch un-liftbar — was rauf kommt, bleibt." },
  { name: "Alizarin Crimson (PR83)", hex: "#9f1b3b", staining: 70, notiz: "Liftet teilweise, hinterlässt verfärbten Bereich." },
  { name: "Hansa Yellow (PY3)",      hex: "#f3d83a", staining: 50, notiz: "Mittel — Geist bleibt, aber heller." },
];

type Methode = "feucht" | "schwamm" | "klingel" | "maskierfluid";

const METHODEN: { id: Methode; name: string; wann: string; staerke: number }[] = [
  { id: "feucht",       name: "Feuchter Pinsel",     wann: "Bei nicht-stainenden Pigmenten, weicher Lift",  staerke: 1.0 },
  { id: "schwamm",      name: "Naturschwamm",        wann: "Größere Flächen, weiche Wolken",                 staerke: 0.85 },
  { id: "klingel",      name: "Klinge / Cutter",     wann: "Trocken, sehr feine Lichter (z.B. Schnurrhaare)", staerke: 1.2 },
  { id: "maskierfluid", name: "Maskierflüssigkeit",  wann: "Vor dem Malen aufgetragen — Lichter aussparen", staerke: 1.5 },
];

export default function Lifting() {
  const [pigmentIdx, setPigmentIdx] = useState(0);
  const [methode, setMethode] = useState<Methode>("feucht");
  const [trocken, setTrocken] = useState(false);

  const p = PIGMENTE[pigmentIdx];
  const m = METHODEN.find((x) => x.id === methode)!;

  // Effektive Liftbarkeit = (100 - staining) * methoden-stärke * trocken-faktor
  const trockenFaktor = trocken ? 0.55 : 1.0; // trocken erschwert das Liften
  const liftbarkeitRoh = (100 - p.staining) * m.staerke * trockenFaktor;
  const liftbarkeit = Math.max(0, Math.min(100, liftbarkeitRoh));

  // Visualisierung: nach Lift bleibt ein "Geist" der ursprünglichen Farbe
  // Restanteil = 1 - liftbarkeit/100
  const rest = 1 - liftbarkeit / 100;
  // Berechne "verblasstes" Hex (Pigment → Papierweiß)
  const r1 = parseInt(p.hex.slice(1, 3), 16);
  const g1 = parseInt(p.hex.slice(3, 5), 16);
  const b1 = parseInt(p.hex.slice(5, 7), 16);
  const papier = [253, 246, 227];
  const rest_r = Math.round(r1 * rest + papier[0] * (1 - rest));
  const rest_g = Math.round(g1 * rest + papier[1] * (1 - rest));
  const rest_b = Math.round(b1 * rest + papier[2] * (1 - rest));
  const restHex = `rgb(${rest_r}, ${rest_g}, ${rest_b})`;

  return (
    <div className="lesson-card">
      <h2>Lifting &amp; Aussparung</h2>
      <p className="lesson-description">
        Aquarell kennt keinen weißen Pinsel. Helle Stellen entstehen entweder
        durch <em>Aussparung</em> (von Anfang an freilassen) oder durch
        <em>Lifting</em> (Pigment nachträglich rausnehmen). Ob Lifting klappt,
        hängt fast nur am Pigment ab — und der Methode.
      </p>

      <div className="info-box">
        <strong>Goldene Regel:</strong> wichtige Lichter immer <em>aussparen</em>.
        Lifting ist Plan B — das beste Ergebnis hat dein Bild, wenn du von
        Anfang an weißt, welche Stellen weiß bleiben.
      </div>

      <h3>Lift-Versuch — Pigment × Methode × Trocknungsphase</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="input-group">
          <label>Pigment</label>
          <select
            value={pigmentIdx}
            onChange={(e) => setPigmentIdx(parseInt(e.target.value, 10))}
            style={{
              padding: "8px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: "0.9rem",
              background: "#f9fafb",
            }}
          >
            {PIGMENTE.map((pp, i) => (
              <option key={i} value={i}>{pp.name}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Lift-Methode</label>
          <select
            value={methode}
            onChange={(e) => setMethode(e.target.value as Methode)}
            style={{
              padding: "8px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: "0.9rem",
              background: "#f9fafb",
            }}
          >
            {METHODEN.map((mm) => (
              <option key={mm.id} value={mm.id}>{mm.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={trocken}
            onChange={(e) => setTrocken(e.target.checked)}
            style={{ accentColor: "#3b82f6" }}
          />
          Pigment ist bereits getrocknet (sonst: noch feucht)
        </label>
      </div>

      {/* Vor / Nach Vergleich */}
      <div style={{ display: "flex", border: "1px solid #d1d5db", borderRadius: 10, overflow: "hidden", height: 160 }}>
        <div style={{ flex: 1, position: "relative", background: p.hex }}>
          <div style={{
            position: "absolute",
            top: 8, left: 8,
            background: "rgba(255,255,255,0.85)",
            color: "#1f2937",
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: "0.75rem",
            fontFamily: "ui-monospace, monospace",
            fontWeight: 600,
          }}>
            Vor dem Lift
          </div>
        </div>
        <div style={{ flex: 1, position: "relative", background: "#fdf6e3" }}>
          {/* "Gelifteter" Bereich als Oval mit Restfarbe */}
          <div style={{
            position: "absolute",
            top: "20%", left: "20%", width: "60%", height: "60%",
            background: restHex,
            borderRadius: "50%",
            filter: "blur(1px)",
          }} />
          <div style={{
            position: "absolute",
            top: 8, left: 8,
            background: "rgba(255,255,255,0.85)",
            color: "#1f2937",
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: "0.75rem",
            fontFamily: "ui-monospace, monospace",
            fontWeight: 600,
          }}>
            Nach dem Lift
          </div>
          <div style={{
            position: "absolute",
            bottom: 8, right: 8,
            background: liftbarkeit > 80 ? "#dcfce7" : liftbarkeit > 50 ? "#fef3c7" : "#fee2e2",
            color: liftbarkeit > 80 ? "#15803d" : liftbarkeit > 50 ? "#a16207" : "#991b1b",
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: "0.75rem",
            fontFamily: "ui-monospace, monospace",
            fontWeight: 600,
          }}>
            {Math.round(liftbarkeit)} % geliftet
          </div>
        </div>
      </div>

      <div className="kv-table" style={{ fontSize: "0.88rem" }}>
        <dt style={{ fontFamily: "inherit" }}>Pigment:</dt>
        <dd style={{ fontFamily: "inherit" }}>{p.notiz}</dd>
        <dt style={{ fontFamily: "inherit" }}>Methode passt für:</dt>
        <dd style={{ fontFamily: "inherit" }}>{m.wann}</dd>
        <dt style={{ fontFamily: "inherit", color: trocken ? "#b45309" : "#1f2937" }}>
          Trocknungsphase:
        </dt>
        <dd style={{ fontFamily: "inherit", color: trocken ? "#78350f" : "#1f2937" }}>
          {trocken
            ? "Pigment haftet stärker — Lift braucht mehr Mühe und ergibt weniger."
            : "Frisch nass — Pigment lässt sich noch fast komplett zurücknehmen."}
        </dd>
      </div>

      <h3>Aussparungs-Methoden (Plan A)</h3>
      <ol className="step-list">
        <li>
          <strong>Mental aussparen</strong> — die hellsten Stellen einfach
          nicht treffen. Mit großem flachem Pinsel funktioniert das überraschend
          gut. Erfordert klare Vorab-Werttstudie.
        </li>
        <li>
          <strong>Maskierflüssigkeit (Frisket)</strong> — gummi-artiges Latex
          aufgepinselt, malt drüber, abgerieben → Papierweiß. Für harte Kanten
          und feine Strukturen ideal.
        </li>
        <li>
          <strong>Wachskreide / weißer Wachsstift</strong> — Wachs auf Papier,
          Aquarell perlt drum herum ab. Für Sternenhimmel-Effekte, raue Texturen.
        </li>
        <li>
          <strong>Sprenkel mit Wasser oder weißer Gouache</strong> — am Ende,
          spritzt Wassertropfen ins noch-feuchte Bild → kleine Lichter.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum staint Phthalo so stark?">
        Phthalocyanin-Pigmente sind extrem klein (Submikron-Partikel) und
        chemisch sehr <em>aktiv</em>. Sie binden sich quasi an die Zellulose-
        Fasern des Papiers wie ein Klebstoff. Cobalt-Pigmente bestehen aus
        relativ großen, schweren Mineralkristallen, die einfach <em>auf</em>
        dem Papier sitzen — Wasser kann sie wieder lösen und mitreißen. Das
        Pigmentkennblatt sagt: <em>staining</em>-Wert ist quasi „wie tief
        sitzt es in den Fasern".
      </DepthBox>

      <DepthBox variant="mistake" title="Mit Gouache übermalen statt liften">
        Verlockung: dunkle Stelle übermalen mit weißer Gouache. Sieht erstmal
        gut aus, aber: Gouache ist opak und bricht das Aquarell-Prinzip — die
        Stelle leuchtet nicht mehr von innen, sie wirkt wie aufgeklebt. Nutze
        Gouache nur bei winzigen Akzenten (Sterne, Lichtreflexe in Augen), nie
        für größere Lichter. Für die: aussparen oder liften.
      </DepthBox>

      <DepthBox variant="deeper" title="Liften nach Trocknung — Tricks">
        Wenn Pigment komplett trocken ist und du noch was zurückholen willst:
        <ul>
          <li>
            <strong>Mehrfach feucht-trocken-zyklen</strong>: weich anfeuchten,
            mit Küchenpapier wegtupfen, trocknen, wiederholen. 3-4 Zyklen
            bringen mehr als ein einzelner Versuch.
          </li>
          <li>
            <strong>Magic Eraser (Melamin-Schwamm)</strong>: trocken über die
            Stelle reiben. Aggressiv, beschädigt Papier-Oberfläche — nur als
            letzter Ausweg.
          </li>
          <li>
            <strong>Sandpapier (sehr fein, 600er)</strong>: trockene Pigmentschicht
            abrubbeln. Funktioniert auf dickem Aquarellpapier, ruiniert dünnes
            sofort.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Pigment-Eigenschaften (Färbekraft &lt; 35 = perfekt zum Liften),
        Aussparungs-Workflow (Notan-Studie sagt dir, wo deine Lichter sitzen),
        Glazing (eine Glazing-Schicht kannst du selektiv liften und ein
        Mehrfach-Schicht-Effekt entsteht), Papier-Qualität (Baumwoll-Papier
        liftet besser als Holzschliff — die Fasern halten nicht so fest).
      </DepthBox>
    </div>
  );
}

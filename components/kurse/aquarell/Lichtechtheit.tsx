"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Pigment = {
  name: string;
  hex: string;
  /** ASTM I = exzellent (>100 J unter Standardbedingungen) bis V = bleicht in Monaten */
  astm: "I" | "II" | "III" | "IV" | "V";
  /** Blue-Wool-Score 1..8, höher = lichtechter */
  bws: number;
  notiz: string;
};

const PIGMENTE: Pigment[] = [
  { name: "Phthalo Blue (PB15)",        hex: "#0c5b8b", astm: "I",   bws: 8, notiz: "Modern, organisch, extrem lichtecht." },
  { name: "Ultramarine Blue (PB29)",    hex: "#274ea8", astm: "I",   bws: 8, notiz: "Synthetisch seit 1828 — bleicht praktisch nicht." },
  { name: "Cadmium Red (PR108)",        hex: "#c12d2b", astm: "I",   bws: 7, notiz: "Sehr lichtecht — die Toxizität ist das eigentliche Problem." },
  { name: "Quinacridone Rose (PV19)",   hex: "#c2348a", astm: "I",   bws: 7, notiz: "Modernes Magenta — leuchtet und hält." },
  { name: "Burnt Sienna (PBr7)",        hex: "#a1532c", astm: "I",   bws: 8, notiz: "Erdpigment, eine der ältesten und stabilsten Farben." },
  { name: "Hansa Yellow Light (PY3)",   hex: "#f3d83a", astm: "II",  bws: 6, notiz: "Gut, aber das ältere PY1 (Hansa) bleicht — Achtung beim Kauf." },
  { name: "Alizarin Crimson (PR83)",    hex: "#9f1b3b", astm: "III", bws: 4, notiz: "Klassische Tube — bleicht spürbar in Jahren. Quinacridone als Ersatz." },
  { name: "Aureolin (PY40)",            hex: "#e3c12e", astm: "III", bws: 3, notiz: "Lehrbuch-Beispiel für Bleichen — moderne Profis vermeiden es." },
  { name: "Opera Pink (BV10/Fluo)",     hex: "#f43f8a", astm: "V",   bws: 2, notiz: "Fluoreszierend, knallt — bleicht in Monaten. Nur für Skizzen." },
];

const ASTM_LABEL: Record<Pigment["astm"], { txt: string; farbe: string; bg: string; jahre: string }> = {
  I:   { txt: "exzellent",  farbe: "#065f46", bg: "#d1fae5", jahre: "100+ J" },
  II:  { txt: "sehr gut",   farbe: "#15803d", bg: "#dcfce7", jahre: "50-100 J" },
  III: { txt: "okay",       farbe: "#a16207", bg: "#fef3c7", jahre: "15-50 J" },
  IV:  { txt: "schwach",    farbe: "#c2410c", bg: "#ffedd5", jahre: "2-15 J" },
  V:   { txt: "bleicht",    farbe: "#991b1b", bg: "#fee2e2", jahre: "< 2 J" },
};

const JAHRE = [0, 5, 20, 50, 100];

export default function Lichtechtheit() {
  const [jahre, setJahre] = useState(20);
  const [vergleich, setVergleich] = useState<[number, number]>([5, 8]); // Hansa + Alizarin als Defaults

  // Vereinfachung: ASTM I → 100 J ohne Verlust; V → fast komplett weg nach 2 J
  // Lineare Interpolation per BWS-Score gegen Jahre
  function ausgebleicht(p: Pigment, j: number): { faded: string; verlust: number } {
    const halbwert = p.bws * 18; // BWS 8 → 144 J, BWS 1 → 18 J (vereinfacht)
    const t = Math.min(1, j / halbwert);
    // Mische pigment-hex mit Papierweiß (#fdf6e3) zu t
    const r1 = parseInt(p.hex.slice(1, 3), 16);
    const g1 = parseInt(p.hex.slice(3, 5), 16);
    const b1 = parseInt(p.hex.slice(5, 7), 16);
    const papier = [253, 246, 227];
    const r = Math.round(r1 * (1 - t) + papier[0] * t);
    const g = Math.round(g1 * (1 - t) + papier[1] * t);
    const b = Math.round(b1 * (1 - t) + papier[2] * t);
    const hex = "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
    return { faded: hex, verlust: Math.round(t * 100) };
  }

  return (
    <div className="lesson-card">
      <h2>Lichtechtheit (Blue Wool Scale)</h2>
      <p className="lesson-description">
        Aquarell hängt nicht hinter Glas wie ein Ölbild — Papier saugt, Licht
        trifft direkt aufs Pigment. Manche Pigmente halten 100 Jahre, andere
        sind nach 2 Jahren am Fenster nicht wiederzuerkennen. Hier siehst du,
        was wirklich bleibt — und was nicht.
      </p>

      <div className="info-box">
        <strong>Blue Wool Scale</strong> ist der Standard: 8 Stoffstreifen,
        mit blauen Farbstoffen unterschiedlicher Stabilität gefärbt, werden
        belichtet. Streifen 1 bleicht in Tagen, Streifen 8 hält Monate.
        Aquarell-Pigmente werden gleich behandelt — ihr Wert sagt, welcher
        Stoffstreifen vergleichbar bleicht. <strong>ASTM D5067</strong> ist
        die US-Variante: I (exzellent) bis V (nicht lichtecht).
      </div>

      <h3>Pigment-Vergleich über Zeit</h3>
      <div className="input-group">
        <label>Belichtungszeit: {jahre} {jahre === 1 ? "Jahr" : "Jahre"}</label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={jahre}
          onChange={(e) => setJahre(parseInt(e.target.value, 10))}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#9ca3af", fontFamily: "ui-monospace, monospace" }}>
          {JAHRE.map((j) => (
            <button
              key={j}
              type="button"
              onClick={() => setJahre(j)}
              style={{
                background: "transparent",
                border: "none",
                color: jahre === j ? "#2563eb" : "#9ca3af",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "inherit",
                fontWeight: jahre === j ? 700 : 400,
              }}
            >
              {j} J
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {vergleich.map((idx, slot) => {
          const p = PIGMENTE[idx];
          const f = ausgebleicht(p, jahre);
          const label = ASTM_LABEL[p.astm];
          return (
            <div key={slot} className="result-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div className="result-label" style={{ flex: 1 }}>{p.name}</div>
                <select
                  value={idx}
                  onChange={(e) => {
                    const next = [...vergleich] as [number, number];
                    next[slot] = parseInt(e.target.value, 10);
                    setVergleich(next);
                  }}
                  style={{
                    fontSize: "0.72rem",
                    border: "1px solid #d1d5db",
                    borderRadius: 4,
                    padding: "2px 4px",
                  }}
                >
                  {PIGMENTE.map((pp, i) => (
                    <option key={i} value={i}>{pp.name}</option>
                  ))}
                </select>
              </div>
              {/* Vor/Nach-Streifen */}
              <div style={{ display: "flex", border: "1px solid #d1d5db", borderRadius: 6, overflow: "hidden", height: 56 }}>
                <div style={{ flex: 1, background: p.hex, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 600 }}>
                  Tag 1
                </div>
                <div style={{ flex: 1, background: f.faded, display: "flex", alignItems: "center", justifyContent: "center", color: "#1f2937", fontSize: "0.72rem", fontWeight: 600 }}>
                  nach {jahre} J
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.78rem" }}>
                <span style={{
                  background: label.bg,
                  color: label.farbe,
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 700,
                  fontFamily: "ui-monospace, monospace",
                }}>
                  ASTM {p.astm}
                </span>
                <span style={{ color: "#52525b", fontFamily: "ui-monospace, monospace" }}>
                  BWS {p.bws}/8
                </span>
                <span style={{ color: "#dc2626", fontFamily: "ui-monospace, monospace", marginLeft: "auto" }}>
                  {f.verlust} % Verlust
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#52525b", fontStyle: "italic" }}>
                {p.notiz}
              </div>
            </div>
          );
        })}
      </div>

      <h3>Übersicht: die häufigsten Aquarell-Pigmente</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.82rem" }}>
        {PIGMENTE.map((p) => {
          const label = ASTM_LABEL[p.astm];
          return (
            <div
              key={p.name}
              style={{
                display: "grid",
                gridTemplateColumns: "16px 1.5fr 0.5fr 0.5fr 1fr",
                alignItems: "center",
                gap: 10,
                padding: "6px 10px",
                background: "#fafafa",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
              }}
            >
              <span style={{ width: 14, height: 14, background: p.hex, borderRadius: 3, border: "1px solid rgba(0,0,0,0.15)" }} />
              <span style={{ fontWeight: 500, color: "#1f2937" }}>{p.name}</span>
              <span style={{
                background: label.bg,
                color: label.farbe,
                padding: "2px 6px",
                borderRadius: 3,
                fontWeight: 700,
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.72rem",
                textAlign: "center",
              }}>
                ASTM {p.astm}
              </span>
              <span style={{ color: "#52525b", fontFamily: "ui-monospace, monospace", fontSize: "0.72rem" }}>
                BWS {p.bws}/8
              </span>
              <span style={{ color: "#6b7280", fontSize: "0.72rem", fontStyle: "italic" }}>
                {label.jahre}
              </span>
            </div>
          );
        })}
      </div>

      <DepthBox variant="why" title="Warum bleichen manche Pigmente so schnell?">
        Pigmentmoleküle absorbieren bestimmte Wellenlängen — das ist ihre
        Farbe. UV-Licht hat genug Energie, um chemische Bindungen aufzubrechen.
        Bei <em>organischen</em> Pigmenten (vor allem natürliche Farbstoffe wie
        klassisches Alizarin) zerfallen die Chromophor-Gruppen, die Farbe ist
        weg. <em>Mineralische</em> Pigmente (Ultramarin, Cadmium, Eisenoxide
        wie Burnt Sienna) sind chemisch stabil — sie können nicht zerfallen,
        weil sie schon im stabilsten Zustand sind. Faustregel: <strong>Mineralisch
        = lichtecht</strong>, <strong>organisch = es kommt drauf an</strong>.
      </DepthBox>

      <DepthBox variant="mistake" title="Auf das Wort 'permanent' auf der Tube hereinfallen">
        Hersteller benutzen „permanent" als Verkaufsbegriff, nicht als
        Standard. Eine Tube „Permanent Rose" sagt nichts über die tatsächliche
        Lichtechtheit aus — die steht auf der Rückseite, oft klein gedruckt,
        als ASTM- oder Blue-Wool-Wert. Verlass dich auf die <em>Zahlen</em>,
        nicht auf den Marketing-Namen.
      </DepthBox>

      <DepthBox variant="deeper" title="Was du als Aquarellist:in praktisch machst">
        <ul>
          <li>
            <strong>Skizzen und Studien:</strong> Lichtechtheit egal. Opera
            Pink, fluoreszierende Farben, klassisches Alizarin — alles ok.
          </li>
          <li>
            <strong>Verkaufsbilder, Geschenke:</strong> ASTM I und II.
            Quinacridone statt Alizarin, Hansa statt Aureolin.
          </li>
          <li>
            <strong>Original für Galerie/Sammler:</strong> nur ASTM I.
            Daniel Smith, Schmincke und Winsor &amp; Newton listen das
            transparent auf ihren Websites.
          </li>
          <li>
            <strong>Schutz:</strong> UV-Schutzglas und nicht in direktes
            Sonnenlicht hängen verdoppeln die Lebensdauer. Aber kein Glas
            ersetzt ein schlechtes Pigment.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Pigment-Eigenschaften (Transparenz/Granulierung sagen nichts über
        Lichtechtheit — bewerte beides separat), Glazing (eine Glazing-
        Schicht ist <em>weniger</em> lichtecht als ein voller Strich, weil
        das Pigment dünner liegt), Notan-Studien (auf Skizzen-Papier sind
        bleichende Pigmente egal — die Studie überlebt das Bild eh nicht).
      </DepthBox>

      <DepthBox variant="history" title="Wie das ASTM-Verfahren entstand">
        Die <strong>American Society for Testing and Materials</strong>
        veröffentlichte 1985 den Standard D4303 (heute D5067), nachdem
        Restaurator:innen zu viele Aquarelle aus dem 19. Jh. retten
        mussten, deren Alizarin- oder Indigo-Schichten verblasst waren.
        Pigmente werden 100 Stunden in einer Xenon-Lampen-Kammer belichtet
        (entspricht ca. 20 Jahren Sonne hinter Glas) und der Farbverlust
        spektrometrisch gemessen.
      </DepthBox>
    </div>
  );
}

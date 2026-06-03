"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const VIEWPORT_META = `<meta name="viewport"
      content="width=device-width, initial-scale=1">`;

const MEDIA = `/* mobile-first: Basis gilt für alle, dann nach oben erweitern */
.galerie { grid-template-columns: 1fr; }

@media (min-width: 600px) {
  .galerie { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 900px) {
  .galerie { grid-template-columns: repeat(3, 1fr); }
}`;

export default function Responsive() {
  const [breite, setBreite] = useState(420);

  const spalten = breite >= 900 ? 3 : breite >= 600 ? 2 : 1;
  const geraet =
    breite >= 900 ? "🖥️ Desktop" : breite >= 600 ? "📲 Tablet" : "📱 Handy";
  const aktiverBreakpoint =
    breite >= 900
      ? "min-width: 900px"
      : breite >= 600
        ? "min-width: 600px"
        : "Basis (kein Breakpoint)";

  return (
    <div className="lesson-card">
      <h2>Responsive Design</h2>
      <p className="lesson-description">
        Eine Seite muss vom 320px-Handy bis zum breiten Monitor funktionieren.
        Responsive Design heißt: das Layout reagiert auf die verfügbare Breite —
        mit flexiblen <strong>Einheiten</strong> und{" "}
        <strong>Media Queries</strong>, die ab einer Breite andere Regeln
        anschalten.
      </p>

      <div className="warn-box">
        <strong>Die eine Zeile, die alles entscheidet:</strong> Ohne den{" "}
        Viewport-<span className="mono">meta</span>-Tag im{" "}
        <span className="mono">&lt;head&gt;</span> zoomt das Handy die
        Desktop-Seite einfach winzig heraus — Media Queries greifen dann gar
        nicht.
      </div>
      <CodeBlock lang="html" title="muss in jeden <head>" code={VIEWPORT_META} />

      <h3>Simulierter Viewport</h3>
      <p>
        Zieh die Breite. Der Regler simuliert die{" "}
        <em>Viewport-Breite</em> — bei jedem Breakpoint schaltet das Raster auf
        mehr Spalten um (mobile-first: von wenig zu viel).
      </p>

      <div className="input-group" style={{ marginBottom: 12 }}>
        <label>
          Viewport-Breite: <span className="mono">{breite}px</span> — {geraet}
        </label>
        <input
          type="range"
          min={320}
          max={1100}
          step={10}
          value={breite}
          onChange={(e) => setBreite(parseInt(e.target.value, 10))}
        />
      </div>

      <div
        style={{
          margin: "0 auto 6px",
          width: breite,
          maxWidth: "100%",
          transition: "width 0.15s",
          border: "3px solid #1e293b",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            color: "#cbd5e1",
            fontSize: "0.7rem",
            fontFamily: "ui-monospace, monospace",
            padding: "4px 10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{geraet}</span>
          <span>{breite}px</span>
        </div>
        <div style={{ padding: 12, background: "#fff" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${spalten}, 1fr)`,
              gap: 8,
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={`hc-box b${(i % 6) + 1}`}
                style={{ minHeight: 50, fontSize: "0.8rem" }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#64748b" }}>
        aktiv: <span className="mono">{aktiverBreakpoint}</span> →{" "}
        {spalten} {spalten === 1 ? "Spalte" : "Spalten"}
      </p>

      <CodeBlock lang="css" title="genau diese Breakpoints" code={MEDIA} />

      <h3>Die Einheiten, auf die es ankommt</h3>
      <dl className="kv-table">
        <dt>px</dt>
        <dd>Absolut. Gut für feine Details (border: 1px), schlecht für Layout-Größen, die mitwachsen sollen.</dd>
        <dt>rem</dt>
        <dd>Vielfaches der Wurzel-Schriftgröße (Default 16px). <span className="mono">1.5rem</span> = 24px. Der Standard für Schrift &amp; Abstände — skaliert mit den Nutzereinstellungen.</dd>
        <dt>em</dt>
        <dd>Relativ zur Schriftgröße des <em>Elements selbst</em>. Praktisch für Innenabstände, die zur Textgröße passen.</dd>
        <dt>% </dt>
        <dd>Anteil des Eltern-Elements. <span className="mono">width: 50%</span> = halbe Elternbreite.</dd>
        <dt>vw / vh</dt>
        <dd>Prozent der Viewport-Breite/-Höhe. <span className="mono">100vh</span> = volle Bildschirmhöhe.</dd>
      </dl>

      <DepthBox variant="why" title="Warum mobile-first (min-width statt max-width)?">
        Du schreibst die einfachste Variante — eine Spalte fürs Handy — als{" "}
        <em>Basis</em>, ganz ohne Media Query. Dann <em>fügst du hinzu</em>, was
        größere Schirme zusätzlich können (<span className="mono">min-width</span>).
        Das ergibt weniger und einfacheren Code, lädt auf schwachen Geräten am
        wenigsten und zwingt dich, Prioritäten zu setzen: Was ist der Kern, was
        ist Luxus? Der umgekehrte Weg (Desktop zuerst, dann mit{" "}
        <span className="mono">max-width</span> wieder wegnehmen) endet meist in
        Sonderfall-Wust.
      </DepthBox>

      <DepthBox variant="mistake" title="Feste px-Breiten für Layout-Container">
        <span className="mono">width: 960px</span> auf einem Container sieht auf
        dem Desktop gut aus und sprengt auf dem Handy den Bildschirm
        (horizontales Scrollen!). Nutz <span className="mono">max-width</span>{" "}
        statt <span className="mono">width</span>:{" "}
        <span className="mono">max-width: 960px; width: 100%</span> heißt „höchstens
        960, aber schrumpf mit". Feste px-Breiten auf Layout-Boxen sind eine der
        häufigsten Ursachen für kaputte Mobil-Ansichten — auch in KI-Code.
      </DepthBox>

      <DepthBox variant="deeper" title="clamp() — responsive ohne Media Query">
        Manchmal willst du gar keine harten Stufen, sondern weiches Mitwachsen.{" "}
        <span className="mono">clamp(min, ideal, max)</span> macht das:
        <CodeBlock
          lang="css"
          code={`h1 {
  /* nie kleiner als 1.5rem, nie größer als 3rem,
     dazwischen wächst sie mit der Viewport-Breite */
  font-size: clamp(1.5rem, 5vw, 3rem);
}`}
        />
        Dieselbe Idee funktioniert für Abstände und Breiten — „fluid typography
        / spacing". Spart Dutzende Breakpoints.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Das Grid-Rezept <span className="mono">auto-fit / minmax</span> aus der
        Grid-Lektion ist Responsive <em>ohne</em> Media Query. Und beim Lesen
        von KI-HTML lohnt der erste Blick aufs Handy: viele KI-Layouts sehen auf
        dem Desktop top aus und brechen mobil — fehlender Viewport-Tag, feste
        Breiten, oder ein <span className="mono">overflow</span>, das niemand
        bemerkt hat.
      </DepthBox>
    </div>
  );
}

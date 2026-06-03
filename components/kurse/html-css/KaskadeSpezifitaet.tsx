"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

type Regel = {
  id: string;
  selektor: string;
  /** [inline, id, klasse, element] */
  spec: [number, number, number, number];
  farbe: string;
  farbName: string;
  inline?: boolean;
};

// Quell-Reihenfolge = Array-Reihenfolge. Bei Gleichstand gewinnt die spätere.
const REGELN: Regel[] = [
  { id: "p", selektor: "p", spec: [0, 0, 0, 1], farbe: "#6b7280", farbName: "grau" },
  { id: "lead", selektor: ".lead", spec: [0, 0, 1, 0], farbe: "#2563eb", farbName: "blau" },
  { id: "p-lead", selektor: "p.lead", spec: [0, 0, 1, 1], farbe: "#ea580c", farbName: "orange" },
  { id: "lead-text", selektor: ".lead.text", spec: [0, 0, 2, 0], farbe: "#0d9488", farbName: "petrol" },
  { id: "intro", selektor: "#intro", spec: [0, 1, 0, 0], farbe: "#7c3aed", farbName: "violett" },
  { id: "inline", selektor: 'style="color: …"', spec: [1, 0, 0, 0], farbe: "#db2777", farbName: "pink", inline: true },
];

function specGroesser(a: Regel["spec"], b: Regel["spec"]) {
  for (let i = 0; i < 4; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false; // gleich
}

export default function KaskadeSpezifitaet() {
  const [aktiv, setAktiv] = useState<Set<string>>(
    new Set(["p", "lead", "lead-text"])
  );

  const aktiveRegeln = REGELN.filter((r) => aktiv.has(r.id));

  // Gewinner: höchste Spezifität; bei Gleichstand die spätere in Quellreihenfolge.
  // Da wir in Quellreihenfolge iterieren, übernimmt eine Regel, deren Spezifität
  // NICHT kleiner ist als die des aktuellen Gewinners (≥ ⇒ spätere gewinnt).
  let gewinner: Regel | null = null;
  for (const r of aktiveRegeln) {
    if (!gewinner || !specGroesser(gewinner.spec, r.spec)) gewinner = r;
  }

  function toggle(id: string) {
    setAktiv((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const cssVorschau = aktiveRegeln
    .map((r) =>
      r.inline
        ? `<p id="intro" class="lead text" style="color: ${r.farbe}">…</p>`
        : `${r.selektor} { color: ${r.farbe}; }`
    )
    .join("\n");

  return (
    <div className="lesson-card">
      <h2>Kaskade, Vererbung &amp; Spezifität</h2>
      <p className="lesson-description">
        Wenn mehrere Regeln dasselbe Element treffen und dieselbe Eigenschaft
        setzen — wer gewinnt? Das entscheidet die <strong>Kaskade</strong>. Ihr
        wichtigster Faktor ist die <strong>Spezifität</strong>: je „genauer" ein
        Selektor zielt, desto stärker ist er.
      </p>

      <div className="info-box">
        Spezifität zählt in vier Stufen — von links nach rechts wichtiger:{" "}
        <strong>Inline-Style → IDs → Klassen → Elemente</strong>. Verglichen
        wird wie bei einer Versionsnummer: die linke Stelle schlägt alles
        rechts davon.
      </div>

      <h3>Spielen: welche Farbe gewinnt?</h3>
      <p>
        Alle Regeln zielen auf dasselbe Element{" "}
        <span className="mono">&lt;p id="intro" class="lead text"&gt;</span>.
        Schalte Regeln zu und beobachte, welche die Textfarbe bestimmt.
      </p>

      <div className="hc-preview" style={{ marginBottom: 14 }}>
        <div className="hc-preview-label">gerendertes Ergebnis</div>
        <p
          style={{
            margin: 0,
            fontSize: "1.15rem",
            fontWeight: 600,
            color: gewinner ? gewinner.farbe : "inherit",
          }}
        >
          Ada Lovelace schrieb das erste Programm.
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
          {gewinner ? (
            <>
              Gewinner: <span className="mono">{gewinner.selektor}</span> →{" "}
              {gewinner.farbName}
            </>
          ) : (
            <>keine Regel aktiv → geerbte Farbe</>
          )}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {REGELN.map((r) => {
          const an = aktiv.has(r.id);
          const istGewinner = gewinner?.id === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => toggle(r.id)}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                gap: 12,
                alignItems: "center",
                textAlign: "left",
                padding: "8px 12px",
                borderRadius: 8,
                border: istGewinner ? "2px solid #16a34a" : "1px solid #e2e8f0",
                background: an ? "#fff" : "#f8fafc",
                opacity: an ? 1 : 0.55,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: "2px solid #94a3b8",
                  background: an ? r.farbe : "transparent",
                  borderColor: an ? r.farbe : "#94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 12,
                }}
              >
                {an ? "✓" : ""}
              </span>
              <span className="mono" style={{ fontSize: "0.85rem" }}>
                {r.inline ? r.selektor : `${r.selektor} { color: … }`}
              </span>
              <span
                className="mono"
                style={{ fontSize: "0.78rem", color: "#475569" }}
                title="Spezifität: Inline-ID-Klasse-Element"
              >
                {r.spec.join(" · ")}
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#16a34a",
                  minWidth: 64,
                  textAlign: "right",
                }}
              >
                {istGewinner ? "✓ gewinnt" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 6 }}>
        Spezifität gelesen als <span className="mono">Inline · ID · Klasse · Element</span>.
      </p>

      {aktiveRegeln.length > 0 ? (
        <CodeBlock lang="css" title="aktive Regeln (Quellreihenfolge)" code={cssVorschau} />
      ) : null}

      <DepthBox variant="why" title="Warum gibt es die Spezifität überhaupt?">
        Damit gezieltere Regeln allgemeinere überschreiben können, ohne dass die
        Reihenfolge im Stylesheet alles bestimmt. Du willst:{" "}
        <span className="mono">a &#123; color: blue &#125;</span> generell, aber{" "}
        <span className="mono">.warnung a &#123; color: red &#125;</span> in
        einem bestimmten Kontext. Ohne Spezifität müsstest du peinlich genau auf
        die Zeilen-Reihenfolge achten. <em>Mit</em> ihr darf die genauere Regel
        gewinnen, egal wo sie steht.
      </DepthBox>

      <DepthBox variant="mistake" title="Mit !important gegen die Spezifität kämpfen">
        <span className="mono">!important</span> hebelt die ganze Spezifität aus
        — und ist fast immer ein Zeichen, dass etwas anderes schiefläuft. Es
        führt zu einem Wettrüsten (<span className="mono">!important</span>{" "}
        gegen <span className="mono">!important</span>) und macht CSS
        unwartbar. <strong>Besser:</strong> die zu schwache Regel spezifischer
        machen (eine Klasse mehr), statt mit der Brechstange. Inline-Styles und{" "}
        <span className="mono">!important</span> sind die zwei häufigsten Gründe,
        warum „mein CSS einfach nicht greift" — und beide tauchen oft in
        KI-Code auf.
      </DepthBox>

      <DepthBox variant="deeper" title="Die volle Kaskaden-Reihenfolge">
        Bei einem Konflikt prüft der Browser <em>in dieser Reihenfolge</em>:
        <ol className="step-list">
          <li><strong>Herkunft &amp; Wichtigkeit</strong> — u.a. ob <span className="mono">!important</span> dranhängt.</li>
          <li><strong>Spezifität</strong> — Inline {">"} ID {">"} Klasse/Attribut/Pseudo-Klasse {">"} Element.</li>
          <li><strong>Quellreihenfolge</strong> — bei Gleichstand gewinnt die zuletzt definierte Regel.</li>
        </ol>
        Genau diese Stufe 3 siehst du oben: <span className="mono">.lead</span>{" "}
        und <span className="mono">p.lead</span> haben fast gleiche Spezifität,
        aber sobald die Werte gleich sind, entscheidet die Position.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <strong>Vererbung:</strong> manche Eigenschaften (Schriftfarbe,
        Schriftart) erben Kind-Elemente automatisch vom Eltern-Element — andere
        (margin, border) nicht. Spezifität entscheidet, wenn etwas{" "}
        <em>direkt</em> gesetzt ist; Vererbung greift nur, wenn gar nichts
        gesetzt ist. Im Layout-Teil (Flexbox/Grid) und beim KI-Debugging ist
        „welche Regel gewinnt eigentlich?" eine der häufigsten Fragen — die
        DevTools zeigen es dir Zeile für Zeile.
      </DepthBox>
    </div>
  );
}

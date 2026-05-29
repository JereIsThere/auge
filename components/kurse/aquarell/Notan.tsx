"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Stufenzahl = 2 | 3 | 5 | 9;

const STUFEN_LABEL: Record<Stufenzahl, string> = {
  2: "2 Stufen (klassisches Notan)",
  3: "3 Stufen (Mini-Skala)",
  5: "5 Stufen (Standard-Wertskala)",
  9: "9 Stufen (Munsell-Vollskala)",
};

// Helligkeit von 0 (schwarz) bis 1 (weiß)
const FOTO_BEREICHE: { name: string; hell: number }[] = [
  { name: "Himmel oben",        hell: 0.95 },
  { name: "Himmel Horizont",    hell: 0.78 },
  { name: "Berge hinten",       hell: 0.55 },
  { name: "Mittelgrund-Wiese",  hell: 0.42 },
  { name: "Baum-Schatten",      hell: 0.18 },
  { name: "Vorderer Stamm",     hell: 0.08 },
  { name: "Heller Felsen",      hell: 0.85 },
  { name: "Wasser-Spiegelung",  hell: 0.32 },
];

function quantisieren(hell: number, stufen: Stufenzahl): number {
  const idx = Math.min(stufen - 1, Math.floor(hell * stufen));
  return idx / (stufen - 1);
}

export default function Notan() {
  const [stufen, setStufen] = useState<Stufenzahl>(3);

  // Sample-Bild als reduzierte SVG-Landschaft
  return (
    <div className="lesson-card">
      <h2>Notan &amp; Wertstruktur</h2>
      <p className="lesson-description">
        <strong>Notan</strong> (jap. 濃淡, „dunkel-hell") ist die Reduktion eines
        Bildes auf wenige Wertstufen. Wer Werte vor Farbe plant, baut Bilder,
        die auch in Schwarz-Weiß noch tragen — und das ist die einzige Garantie,
        dass die Komposition funktioniert.
      </p>

      <div className="info-box">
        <strong>Test:</strong> Mach von jedem fertigen Aquarell ein Foto und
        entsättige es. Wenn das Bild dann noch eine klare Hierarchie hat
        (Fokus erkennbar, Tiefenebenen lesbar), ist die Wertstruktur ok.
        Wenn alles in derselben Grau-Soße verschwindet — Werte haben nicht
        funktioniert.
      </div>

      <h3>Stufenzahl wählen</h3>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(Object.keys(STUFEN_LABEL) as unknown as Stufenzahl[]).map((s) => {
          const n = Number(s) as Stufenzahl;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setStufen(n)}
              className="toggle-code"
              style={{
                background: stufen === n ? "#eff6ff" : "transparent",
                borderColor: stufen === n ? "#2563eb" : "#d1d5db",
                color: stufen === n ? "#1d4ed8" : "#374151",
                fontWeight: stufen === n ? 700 : 500,
                fontSize: "0.78rem",
              }}
            >
              {STUFEN_LABEL[n]}
            </button>
          );
        })}
      </div>

      {/* Werttreppe */}
      <div>
        <div className="result-label" style={{ marginBottom: 6 }}>Werttreppe ({stufen} Stufen)</div>
        <div style={{ display: "flex", border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden", height: 50 }}>
          {Array.from({ length: stufen }, (_, i) => {
            const v = i / (stufen - 1);
            const c = Math.round(v * 255);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: `rgb(${c}, ${c}, ${c})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: v > 0.5 ? "#1f2937" : "#fff",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                {Math.round(v * 100)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample-Bild: Original vs Notan-Reduktion */}
      <h3>Beispiel-Landschaft</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div className="result-label" style={{ marginBottom: 4 }}>Original (Farbe)</div>
          <svg viewBox="0 0 200 160" style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff" }}>
            <rect x="0" y="0" width="200" height="60" fill="#bfdbfe" />
            <rect x="0" y="60" width="200" height="20" fill="#dbeafe" />
            <polygon points="0,80 60,55 120,75 200,60 200,100 0,100" fill="#6b7280" />
            <rect x="0" y="100" width="200" height="60" fill="#84cc16" />
            <polygon points="20,100 30,70 40,100" fill="#1e3a1e" />
            <polygon points="160,100 175,55 190,100" fill="#1e3a1e" />
            <rect x="172" y="100" width="6" height="14" fill="#3a2010" />
            <rect x="28" y="100" width="4" height="10" fill="#3a2010" />
          </svg>
        </div>
        <div>
          <div className="result-label" style={{ marginBottom: 4 }}>Notan-Reduktion ({stufen} Stufen)</div>
          <svg viewBox="0 0 200 160" style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff" }}>
            <rect x="0" y="0" width="200" height="60" fill={grauStufe(0.92, stufen)} />
            <rect x="0" y="60" width="200" height="20" fill={grauStufe(0.78, stufen)} />
            <polygon points="0,80 60,55 120,75 200,60 200,100 0,100" fill={grauStufe(0.5, stufen)} />
            <rect x="0" y="100" width="200" height="60" fill={grauStufe(0.42, stufen)} />
            <polygon points="20,100 30,70 40,100" fill={grauStufe(0.1, stufen)} />
            <polygon points="160,100 175,55 190,100" fill={grauStufe(0.1, stufen)} />
            <rect x="172" y="100" width="6" height="14" fill={grauStufe(0.05, stufen)} />
            <rect x="28" y="100" width="4" height="10" fill={grauStufe(0.05, stufen)} />
          </svg>
        </div>
      </div>

      <div style={{ fontSize: "0.85rem", color: "#52525b", lineHeight: 1.6 }}>
        {stufen === 2
          ? "Reine Schwarz-Weiß-Aufteilung. Brutal, aber genau das macht das klassische Notan stark: hat dein Bild auf 2 Stufen reduziert noch eine klare Form? Dann trägt es."
          : stufen === 3
            ? "Mini-Skala — die meisten erfolgreichen Bilder lassen sich auf 3 Stufen reduzieren. Studien-Standard."
            : stufen === 5
              ? "Standard-Wertskala — 5 Stufen reichen für fast jedes finale Bild. Mehr ist meist Optimierungsillusion."
              : "Munsell-Vollskala — analytisch, fürs Studium nützlich, in der Praxis zu fein."}
      </div>

      {/* Wertverteilungs-Tabelle */}
      <h3>Werte der Beispiel-Bereiche</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.85rem" }}>
        {FOTO_BEREICHE.map((b) => {
          const q = quantisieren(b.hell, stufen);
          const c = Math.round(q * 255);
          return (
            <div
              key={b.name}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 36px 36px 1fr",
                gap: 10,
                alignItems: "center",
                padding: "5px 10px",
                background: "#fafafa",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
              }}
            >
              <span style={{ color: "#1f2937" }}>{b.name}</span>
              <div style={{ height: 22, background: `rgb(${Math.round(b.hell * 255)}, ${Math.round(b.hell * 255)}, ${Math.round(b.hell * 255)})`, border: "1px solid #d1d5db", borderRadius: 3 }} />
              <div style={{ height: 22, background: `rgb(${c}, ${c}, ${c})`, border: "1px solid #d1d5db", borderRadius: 3 }} />
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", color: "#52525b" }}>
                {Math.round(b.hell * 100)}/100 → Stufe {Math.round(q * (stufen - 1)) + 1}/{stufen}
              </span>
            </div>
          );
        })}
      </div>

      <DepthBox variant="why" title="Warum Werte vor Farbe?">
        Das Auge sucht zuerst <em>Helligkeitsunterschiede</em>, dann erst Farbe.
        Stäbchen (Helligkeit) sitzen am Rand der Netzhaut und reagieren schneller,
        Zapfen (Farbe) in der Mitte und sind langsamer. Ein Bild mit knalligen
        Farben aber ohne Wertstruktur wirkt „flach" — das Auge findet keinen
        Anker. Ein Bild mit klarer Wertstruktur, sogar in grau, hat sofort
        Tiefe.
      </DepthBox>

      <DepthBox variant="mistake" title="Mittelgrau-Bild — die häufigste Falle">
        Das Bild lebt nur in der Mitte der Wertskala — keine richtigen Lichter,
        keine richtigen Dunkel. Wirkt zaghaft und unentschieden. Cure: ein
        Notan-Test, dann gezielt 5-10 % der Fläche als <em>sehr hell</em>
        und 5-10 % als <em>sehr dunkel</em> setzen. Der Rest sortiert sich
        dazwischen ein.
      </DepthBox>

      <DepthBox variant="deeper" title="Notan vor jedem Bild — der Workflow">
        <ol>
          <li>Briefmarken-Skizze (5×7 cm) auf billigem Papier.</li>
          <li>Mit <em>einem</em> Marker (Mid-Grau) und Schwarz die 3-Werte-Studie zeichnen.</li>
          <li>Wenn die Komposition trägt: zweite Studie, größer, 5 Werte.</li>
          <li>Erst dann das richtige Bild beginnen.</li>
        </ol>
        Klingt langsam — spart aber komplette Maltage, weil du nicht in einer
        sackgassigen Komposition feststeckst.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Komposition (Wertstruktur trägt die Komposition), Negative Painting
        (braucht klare Wertstufen zwischen Schichten), Glazing (Werte werden
        durch jede Schicht dunkler — vorher planen), Lichtechtheit (bleichende
        Pigmente verändern die Wertstruktur über Jahre).
      </DepthBox>

      <DepthBox variant="history" title="Notan in der japanischen Tradition">
        Der Begriff stammt aus der japanischen Bildtheorie und wurde Anfang
        des 20. Jh. von <strong>Arthur Wesley Dow</strong> (Lehrer u.a. von
        Georgia O&apos;Keeffe) in die westliche Kunstausbildung gebracht. Sein
        Buch <em>Composition</em> (1899) machte Notan-Studien zum Standard
        an US-Kunstschulen. Vorher dominierte das europäische „Linie und
        Schraffur"-Modell — Dow ersetzte es durch Flächen-und-Wert.
      </DepthBox>
    </div>
  );
}

function grauStufe(hell: number, stufen: 2 | 3 | 5 | 9): string {
  const idx = Math.min(stufen - 1, Math.floor(hell * stufen));
  const v = idx / (stufen - 1);
  const c = Math.round(v * 255);
  return `rgb(${c}, ${c}, ${c})`;
}

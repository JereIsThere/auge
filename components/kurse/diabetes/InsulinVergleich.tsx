"use client";
import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { MedizinHinweis } from "@/components/lessons/MedizinHinweis";
import "@/components/lessons/lesson.css";

interface InsulinProfil {
  id: string;
  name: string;
  icon: string;
  wirkstoff: string;
  onset: string;
  peak: string;
  dauer: string;
  farbe: string;
  bgFarbe: string;
  beschreibung: string;
  indikation: string;
}

const INSULINE: InsulinProfil[] = [
  {
    id: "fiasp",
    name: "Fiasp",
    icon: "⚡",
    wirkstoff: "Faster Aspart (Insulin Aspart + Niacinamid + L-Arginin)",
    onset: "2–5 min",
    peak: "45–90 min",
    dauer: "3–5 h",
    farbe: "#3b82f6",
    bgFarbe: "#eff6ff",
    beschreibung:
      "Das schnellste zugelassene Mahlzeiteninsulin. Niacinamid (Vitamin B3) und " +
      "L-Arginin sorgen durch Vasodilatation und stabilisierten pH für eine deutlich " +
      "beschleunigte Resorption gegenüber klassischen Analoginsulinen.",
    indikation:
      "Pumpe (CSII), stark fetthaltige oder eiweißreiche Mahlzeiten, nachträgliche Korrekturen.",
  },
  {
    id: "novorapid",
    name: "NovoRapid",
    icon: "💉",
    wirkstoff: "Insulin Aspart",
    onset: "10–20 min",
    peak: "1–3 h",
    dauer: "3–5 h",
    farbe: "#10b981",
    bgFarbe: "#f0fdf4",
    beschreibung:
      "Das meistverwendete Mahlzeiteninsulin weltweit. Ein einzelner Aminosäure-Austausch " +
      "(Prolin→Aspartat an Position B28) verhindert stabile Hexamer-Bildung und beschleunigt " +
      "die Resorption gegenüber Normalinsulin deutlich.",
    indikation:
      "Standard-Bolus für Mahlzeiten, Pen und Pumpe. Breiteste klinische Datenbasis aller Kurzzeit-Analoga.",
  },
  {
    id: "humalog",
    name: "Humalog",
    icon: "🔬",
    wirkstoff: "Insulin Lispro",
    onset: "15–30 min",
    peak: "30–90 min",
    dauer: "2–5 h",
    farbe: "#f59e0b",
    bgFarbe: "#fffbeb",
    beschreibung:
      "Lispro-Analoginsulin mit umgekehrten Aminosäuren an Position B28/B29. In der Praxis " +
      "sehr ähnlich zu NovoRapid, leicht kürzere Wirkdauer — für manche Patienten der " +
      "entscheidende Vorteil.",
    indikation: "Mahlzeiten, Pen und Pumpe. Besonders wenn eine kürzere Gesamtwirkdauer erwünscht ist.",
  },
];

const thStyle: React.CSSProperties = {
  padding: "10px 14px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#374151",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  color: "#1f2937",
};

export default function InsulinVergleich() {
  const [selectedId, setSelectedId] = useState("novorapid");
  const aktiv = INSULINE.find((i) => i.id === selectedId)!;

  return (
    <div className="lesson-card">
      <h2>Insulinvergleich: Fiasp, NovoRapid, Humalog</h2>
      <MedizinHinweis />
      <p className="lesson-description">
        Alle drei sind kurzwirksame Insulinanaloga — aber mit messbaren Unterschieden im
        Wirkungsbeginn und Peakzeitpunkt. Der richtige Boluszeitpunkt hängt davon ab.
      </p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {INSULINE.map((ins) => (
          <button
            key={ins.id}
            onClick={() => setSelectedId(ins.id)}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: `2px solid ${selectedId === ins.id ? ins.farbe : "#e5e7eb"}`,
              background: selectedId === ins.id ? ins.bgFarbe : "#f9fafb",
              color: selectedId === ins.id ? ins.farbe : "#374151",
              fontWeight: selectedId === ins.id ? 700 : 400,
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "all 0.15s",
            }}
          >
            {ins.icon} {ins.name}
          </button>
        ))}
      </div>

      <div
        style={{
          border: `2px solid ${aktiv.farbe}`,
          borderRadius: "12px",
          padding: "20px",
          background: aktiv.bgFarbe,
        }}
      >
        <h3 style={{ color: aktiv.farbe, marginBottom: "12px" }}>
          {aktiv.icon} {aktiv.name}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {[
            { label: "Wirkbeginn", value: aktiv.onset },
            { label: "Spitze", value: aktiv.peak },
            { label: "Dauer", value: aktiv.dauer },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "white",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center" as const,
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: aktiv.farbe }}>
                {value}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.875rem", color: "#374151", marginBottom: "8px" }}>
          <strong>Wirkstoff:</strong> {aktiv.wirkstoff}
        </p>
        <p style={{ fontSize: "0.875rem", color: "#374151", marginBottom: "12px" }}>
          {aktiv.beschreibung}
        </p>
        <p style={{ fontSize: "0.875rem", color: "#374151" }}>
          <strong>Geeignet für:</strong> {aktiv.indikation}
        </p>
      </div>

      <h3>Direktvergleich</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={thStyle}>Insulin</th>
              <th style={thStyle}>Wirkbeginn</th>
              <th style={thStyle}>Spitze</th>
              <th style={thStyle}>Dauer</th>
            </tr>
          </thead>
          <tbody>
            {INSULINE.map((ins) => (
              <tr
                key={ins.id}
                onClick={() => setSelectedId(ins.id)}
                style={{
                  cursor: "pointer",
                  background: selectedId === ins.id ? ins.bgFarbe : "white",
                  borderBottom: "1px solid #e5e7eb",
                  transition: "background 0.1s",
                }}
              >
                <td style={{ ...tdStyle, fontWeight: 600, color: ins.farbe }}>
                  {ins.icon} {ins.name}
                </td>
                <td style={tdStyle}>{ins.onset}</td>
                <td style={tdStyle}>{ins.peak}</td>
                <td style={tdStyle}>{ins.dauer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DepthBox variant="why" title="Warum manche Analoga schneller sind">
        Normalinsulin bildet stabile Hexamere (6er-Gruppen) — erst wenn diese in Dimere und
        dann Monomere zerfallen, wird das Molekül klein genug für die Resorption ins Blut.
        Das dauert 30–60 Minuten. Analoginsuline stören die Hexamer-Bildung durch gezielte
        Aminosäure-Substitutionen (Aspart bei NovoRapid/Fiasp, Lispro bei Humalog) — der
        Zerfall beginnt sofort nach der Injektion. Fiasp geht noch weiter: Niacinamid weitet
        die Kapillaren durch Vasodilatation, was die frühe Resorption zusätzlich beschleunigt.
      </DepthBox>

      <DepthBox variant="mistake" title="Haeufiger Fehler: Bolus zu spaet spritzen">
        Selbst Fiasp braucht 2–5 Minuten bis zum Wirkbeginn. Bei kohlenhydratreichen Mahlzeiten
        — Haferflocken, Toast, Pasta — schießt der Blutzucker schon 10–15 Minuten nach dem
        Essen hoch. Faustregel: kurzwirksame Insuline 10–15 Minuten vor der Mahlzeit spritzen,
        auch bei Fiasp. Nur bei unklaren Kohlenhydratmengen (Restaurant, Buffet) kann das
        Spritzen direkt nach der Mahlzeit sinnvoll sein.
      </DepthBox>

      <DepthBox variant="deeper" title="Lyumjev: noch schneller als Fiasp">
        Seit 2021 ist Lyumjev (Insulin Lispro-aabc, Eli Lilly) zugelassen — mit Treprostinil
        (einem Prostazyklin-Analogon) statt Niacinamid. Studien zeigen einen Wirkbeginn von
        unter 2 Minuten und einen früheren Peak als Fiasp. Besonders relevant für
        Pumpen-Patienten und Menschen mit sehr schneller Kohlenhydrat-Absorption
        (z.B. nach gastrointestinalen Operationen).
      </DepthBox>

      <DepthBox variant="related" title="Haengt zusammen mit: Pen vs. Pumpe">
        Wie schnell ein Insulin wirkt, hängt nicht nur vom Molekül ab — sondern auch davon,
        wie es verabreicht wird. Eine Pumpe liefert kleinere Boli als ein Pen und erzeugt
        damit ein kleineres subkutanes Depot, das gleichmäßiger resorbiert wird. Mehr dazu
        in der nächsten Lektion.
      </DepthBox>
    </div>
  );
}

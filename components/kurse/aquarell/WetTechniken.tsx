"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Technik = "wet-on-wet" | "wet-on-dry" | "dry-brush";

const TECHNIKEN: { id: Technik; titel: string; kurz: string }[] = [
  { id: "wet-on-wet", titel: "Wet-on-Wet", kurz: "Feuchtes Papier, feuchter Pinsel" },
  { id: "wet-on-dry", titel: "Wet-on-Dry", kurz: "Trockenes Papier, feuchter Pinsel" },
  { id: "dry-brush",  titel: "Dry-Brush",  kurz: "Trockenes Papier, fast trockener Pinsel" },
];

const DETAIL: Record<Technik, {
  papierWasser: number;
  pinselWasser: number;
  ergebnis: string;
  einsatz: string;
  vorsicht: string;
}> = {
  "wet-on-wet": {
    papierWasser: 85,
    pinselWasser: 60,
    ergebnis: "Weiche, fließende Übergänge ohne harte Kanten. Pigmente wandern unkontrolliert.",
    einsatz: "Himmel, Nebel, weiche Hintergründe, Stoff-Falten.",
    vorsicht: "Sehr wenig Kontrolle. Frische Farbe in zu nasses Papier → 'cauliflowers' (Pilzrand).",
  },
  "wet-on-dry": {
    papierWasser: 0,
    pinselWasser: 55,
    ergebnis: "Saubere, scharfe Kanten. Pigment bleibt, wo du es absetzt.",
    einsatz: "Konturen, Glazing (zweite Schicht über trockene erste), Details.",
    vorsicht: "Striche bleiben sichtbar — schnell und gleichmäßig arbeiten.",
  },
  "dry-brush": {
    papierWasser: 0,
    pinselWasser: 15,
    ergebnis: "Texturen, Lücken, angerissene Linien — Papier zeigt durch.",
    einsatz: "Holz, Fell, Steine, alles mit Oberflächentextur. Zum Schluss eines Bildes.",
    vorsicht: "Zu wenig Wasser → kratzige Linien, die später kaum überarbeitbar sind.",
  },
};

export default function WetTechniken() {
  const [aktiv, setAktiv] = useState<Technik>("wet-on-wet");
  const d = DETAIL[aktiv];

  // Visualisierung: Wasseranteil als horizontale Balken
  const tropfen = (anteil: number, farbe: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "ui-monospace, monospace",
        fontSize: "0.78rem",
      }}
    >
      <span style={{ width: 110 }}>{anteil} %</span>
      <div
        style={{
          flex: 1,
          height: 12,
          background: "#e5e7eb",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${anteil}%`,
            height: "100%",
            background: farbe,
            borderRadius: 99,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="lesson-card">
      <h2>Wet-on-Wet, Wet-on-Dry, Dry-Brush</h2>
      <p className="lesson-description">
        Drei Grundtechniken — und das einzige, was sich zwischen ihnen
        unterscheidet, ist <strong>wie viel Wasser auf Papier und Pinsel
        sind</strong>. Wähl eine Technik, dann siehst du die Wasser-Verhältnisse
        und wofür sie sich eignet.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TECHNIKEN.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setAktiv(t.id)}
            className="toggle-code"
            style={{
              background: aktiv === t.id ? "#eff6ff" : "transparent",
              borderColor: aktiv === t.id ? "#2563eb" : "#d1d5db",
              color: aktiv === t.id ? "#1d4ed8" : "#374151",
              fontWeight: aktiv === t.id ? 700 : 500,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div>{t.titel}</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.7, fontWeight: 400 }}>{t.kurz}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Wasser-Visualisierung */}
      <div className="result-box">
        <div className="result-label">Wasser-Verhältnis</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 4 }}>Papier</div>
            {tropfen(d.papierWasser, "#60a5fa")}
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 4 }}>Pinsel</div>
            {tropfen(d.pinselWasser, "#a78bfa")}
          </div>
        </div>
      </div>

      {/* Schematische Pinselstrich-Darstellung */}
      <svg
        viewBox="0 0 400 80"
        style={{
          width: "100%",
          height: 80,
          background: "#fefce8",
          border: "1px solid #fcd34d",
          borderRadius: 8,
        }}
      >
        <defs>
          <filter id="wet" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={aktiv === "wet-on-wet" ? "6" : "0"} />
          </filter>
          <filter id="dry-brush-filter">
            <feTurbulence baseFrequency="0.9" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" scale={aktiv === "dry-brush" ? "8" : "0"} />
          </filter>
        </defs>
        {/* Beispiel-Pinselstrich */}
        <ellipse
          cx="200"
          cy="40"
          rx={aktiv === "wet-on-wet" ? "150" : "120"}
          ry={aktiv === "wet-on-wet" ? "22" : "12"}
          fill="#1f4ea8"
          opacity={aktiv === "dry-brush" ? 0.5 : aktiv === "wet-on-wet" ? 0.6 : 0.9}
          filter={
            aktiv === "wet-on-wet"
              ? "url(#wet)"
              : aktiv === "dry-brush"
                ? "url(#dry-brush-filter)"
                : undefined
          }
        />
        <text x="10" y="14" fontSize="9" fontFamily="ui-monospace, monospace" fill="#92400e">
          Wie ein Pinselstrich aussieht:
        </text>
      </svg>

      <div className="kv-table" style={{ fontSize: "0.9rem" }}>
        <dt style={{ fontFamily: "inherit" }}>Ergebnis:</dt>
        <dd style={{ fontFamily: "inherit" }}>{d.ergebnis}</dd>
        <dt style={{ fontFamily: "inherit" }}>Einsatz:</dt>
        <dd style={{ fontFamily: "inherit" }}>{d.einsatz}</dd>
        <dt style={{ fontFamily: "inherit", color: "#b45309" }}>Achtung:</dt>
        <dd style={{ fontFamily: "inherit", color: "#78350f" }}>{d.vorsicht}</dd>
      </div>

      <DepthBox variant="why" title="Warum entstehen die Cauliflowers beim Wet-on-Wet?">
        Wenn frische, wässrige Farbe auf eine bereits halb-getrocknete Stelle
        trifft, drängt das neue Wasser das bestehende Pigment <em>nach
        außen</em> — es entsteht ein pilzförmiger Rand mit dunkler Kante. Im
        Englischen heißen die „blooms" oder „cauliflowers". Profis nutzen
        das gezielt für Textureffekte; Anfänger:innen sehen es als Fehler.
      </DepthBox>

      <DepthBox variant="mistake" title="Zu viel Wasser auf zu nasses Papier">
        Klassische Falle bei Wet-on-Wet: das Papier ist <em>so</em> nass,
        dass Pigmente komplett verlaufen — du verlierst alle Kontrolle und
        bekommst einen einheitlichen Brei. Faustregel: das Papier sollte
        <em>matt-glänzend</em> sein (Wasser sichtbar, aber keine Pfütze),
        nicht spiegelnd-nass.
      </DepthBox>

      <DepthBox variant="deeper" title="Kontrolle über Trocknungsphasen">
        Profi-Move: gezielt mit der Trocknungsphase arbeiten. Innerhalb der
        ersten ~30 Sekunden ist Papier glänzend-nass (volle Verläufe). Nach
        ~1 Minute matt-feucht (kontrollierte Verläufe). Nach 2–3 Minuten
        trocken-genug für Detail. Sergei Andriaka und Joseph Zbukvic sind
        Meister dieser Mehrphasen-Bilder, in denen jede Phase einen anderen
        Detailgrad bekommt.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Pigment-Granulierung (granulierende Pigmente wie Ultramarin verstärken
        Wet-on-Wet-Texturen), Papier-Qualität (Baumwoll-Papier verzeiht mehr
        Wasser, Wood-pulp wellt sich), Glazing (zweite Schicht nur dann
        sauber, wenn die erste komplett trocken ist).
      </DepthBox>
    </div>
  );
}

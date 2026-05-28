"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

// Vereinfachtes Modell: Synapsenstärke als Funktion von Wiederholungen + Tagen.
// Inspiriert von der Hebbschen Regel + LTP-Kinetik.
function synapsenStaerke(wdh: number, tage: number, abstand: number): number {
  // Wiederholungen: logarithmisch saturierend
  const wdhEffekt = Math.log(1 + wdh / 10) * 25;
  // Tage: leichter Aufbau, aber ohne Wiederholung Verfall (~7-Tage-Halbwertszeit)
  const tageEffekt = wdh > 0 ? (1 - Math.exp(-tage / 14)) * 30 : 0;
  // Abstand zwischen Sessions (Massed vs Spaced Practice)
  const abstandEffekt = abstand === 0 ? 0 : Math.min(20, abstand * 4);
  // Verfall: ohne Wiederholung baut sich Plastizität wieder ab
  const verfall = wdh === 0 ? Math.max(0, tage * 1.5) : 0;
  return Math.max(0, Math.min(100, wdhEffekt + tageEffekt + abstandEffekt - verfall));
}

export default function Neuroplastizitaet() {
  const [wdh, setWdh] = useState(50);
  const [tage, setTage] = useState(14);
  const [abstand, setAbstand] = useState(2);

  const staerke = useMemo(() => synapsenStaerke(wdh, tage, abstand), [wdh, tage, abstand]);

  // Anzahl Verbindungen visualisieren (1-12 Synapsen-Linien)
  const synapsenAnzahl = Math.max(1, Math.round(staerke / 8));

  return (
    <div className="lesson-card">
      <h2>Neuroplastizität</h2>
      <p className="lesson-description">
        Das Gehirn ist <em>nicht</em> nach der Pubertät fertig — es
        verändert sich ein Leben lang. Jede Wiederholung verstärkt
        Synapsen (LTP), jede Pause baut sie wieder ab (LTD). Genau diese
        Dynamik ist die Basis jeder Reha: <strong>Übung formt das
        Gehirn buchstäblich um</strong>.
      </p>

      <div className="info-box">
        Donald Hebbs Regel (1949): „Cells that fire together, wire
        together." Wenn zwei Neurone wiederholt gleichzeitig feuern,
        verstärkt sich ihre synaptische Verbindung. Klingt simpel — ist
        die Mechanik hinter allem Lernen.
      </div>

      <div className="result-grid">
        <div className="input-group">
          <label>Wiederholungen pro Session: {wdh}</label>
          <input
            type="range"
            min={0}
            max={200}
            step={10}
            value={wdh}
            onChange={(e) => setWdh(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="input-group">
          <label>Tage des Trainings: {tage}</label>
          <input
            type="range"
            min={0}
            max={90}
            step={1}
            value={tage}
            onChange={(e) => setTage(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
      <div className="input-group">
        <label>Abstand zwischen Sessions in Tagen: {abstand} (0 = alle gleichzeitig)</label>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={abstand}
          onChange={(e) => setAbstand(parseInt(e.target.value, 10))}
        />
      </div>

      {/* Synapsen-Visualisierung */}
      <svg
        viewBox="0 0 400 180"
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          display: "block",
        }}
      >
        {/* Neuron A links */}
        <circle cx="60" cy="90" r="28" fill="#5e7bb8" stroke="#1d4ed8" strokeWidth="2" />
        <text x="60" y="94" textAnchor="middle" fontSize="11" fill="white" fontFamily="ui-monospace, monospace" fontWeight="bold">
          Neuron A
        </text>

        {/* Neuron B rechts */}
        <circle cx="340" cy="90" r="28" fill="#5e7bb8" stroke="#1d4ed8" strokeWidth="2" />
        <text x="340" y="94" textAnchor="middle" fontSize="11" fill="white" fontFamily="ui-monospace, monospace" fontWeight="bold">
          Neuron B
        </text>

        {/* Synapsen-Verbindungen */}
        {Array.from({ length: synapsenAnzahl }, (_, i) => {
          const yOff = (i - synapsenAnzahl / 2 + 0.5) * 10;
          return (
            <line
              key={i}
              x1="88"
              y1={90 + yOff}
              x2="312"
              y2={90 + yOff}
              stroke={staerke > 60 ? "#10b981" : staerke > 30 ? "#f59e0b" : "#9ca3af"}
              strokeWidth={Math.max(1, staerke / 30)}
              opacity={0.4 + staerke / 200}
            />
          );
        })}
      </svg>

      <div className="result-box">
        <div className="result-label">Synapsen-Stärke</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <div style={{ flex: 1, height: 20, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
            <div
              style={{
                width: `${staerke}%`,
                height: "100%",
                background: staerke > 60 ? "#10b981" : staerke > 30 ? "#f59e0b" : "#9ca3af",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#0f172a", minWidth: 50, textAlign: "right" }}>
            {staerke.toFixed(0)} %
          </span>
        </div>
        <div style={{ fontSize: "0.82rem", color: "#374151", marginTop: 8 }}>
          {staerke < 20 && "Schwach — die Verbindung ist (noch) nicht etabliert."}
          {staerke >= 20 && staerke < 60 && "Im Aufbau — neuronale Bahn beginnt sich zu festigen."}
          {staerke >= 60 && staerke < 85 && "Stabil — die Bewegung wird zunehmend automatisch."}
          {staerke >= 85 && "Konsolidiert — auch ohne weiteres Training für Wochen erhalten."}
        </div>
      </div>

      <DepthBox variant="why" title="Warum funktioniert Spaced Practice besser?">
        Konzentriertes Üben (z.B. 100 Wiederholungen am Stück) erschöpft
        die synaptischen Ressourcen — die letzten 50 Wiederholungen wirken
        kaum noch. Verteiltes Üben (z.B. 4× 25 Wiederholungen über die
        Woche) gibt den Synapsen Zeit zu konsolidieren, und jedes Mal
        startet das System aus einem erholten Zustand. Empirisch zeigt
        sich: derselbe Aufwand, verteilt geübt, ergibt ~2× nachhaltigere
        Lernergebnisse.
      </DepthBox>

      <DepthBox variant="mistake" title="Plastizität braucht Aktivität — auch unsichtbare">
        Selbst wenn keine willkürliche Bewegung möglich ist (z.B. komplette
        Lähmung nach Schlaganfall), kann <em>mentale Vorstellung</em> oder
        <em>passive Bewegung</em> plastische Prozesse anstoßen. Eine
        sechswöchige Phase „nichts machen, bis es besser wird" verschenkt
        Plastizitätsfenster, die später nur schwerer wieder zu öffnen sind.
      </DepthBox>

      <DepthBox variant="deeper" title="LTP und LTD molekular">
        LTP (Long-Term Potentiation): wiederholte Aktivierung führt zu
        mehr AMPA-Rezeptoren an der postsynaptischen Membran und
        morphologischen Veränderungen am Dendritenkopf (dendritic spine
        growth). Dauert Stunden bis Tage. LTD (Long-Term Depression):
        umgekehrt — unbenutzte Synapsen verlieren Rezeptoren und werden
        durch Glia-Zellen sogar physisch abgebaut. „Use it or lose it"
        ist molekular wörtlich gemeint.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Motor Imagery (mentales Üben löst messbare LTP aus, auch ohne
        Bewegung), CIMT (forciert intensive Übung der schwächeren Seite
        und zwingt Plastizität), Schlaf (schlafgebundene Konsolidierung
        macht aus kurzfristiger Plastizität langfristige Veränderung).
      </DepthBox>
    </div>
  );
}

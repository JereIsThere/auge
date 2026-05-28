"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Doc = {
  id: string;
  inhalt: string;
  meta: { datum: string; team: "engineering" | "produkt" | "sales"; sensibilitaet: "öffentlich" | "intern" | "geheim" };
};

const KORPUS: Doc[] = [
  { id: "1", inhalt: "Q3 Sales-Pipeline-Auswertung", meta: { datum: "2024-09-15", team: "sales", sensibilitaet: "intern" } },
  { id: "2", inhalt: "Sales-Pipeline-Review für 2026 Q1", meta: { datum: "2026-04-20", team: "sales", sensibilitaet: "intern" } },
  { id: "3", inhalt: "Architektur-Doku Auth-Service v2", meta: { datum: "2026-03-08", team: "engineering", sensibilitaet: "intern" } },
  { id: "4", inhalt: "Produktroadmap H2/2026", meta: { datum: "2026-05-02", team: "produkt", sensibilitaet: "geheim" } },
  { id: "5", inhalt: "Onboarding-Guide für neue Engineers", meta: { datum: "2026-01-12", team: "engineering", sensibilitaet: "öffentlich" } },
  { id: "6", inhalt: "Alte Sales-Pipeline-Doku 2022", meta: { datum: "2022-11-03", team: "sales", sensibilitaet: "intern" } },
];

type Filter = {
  nachDatum?: string;
  team?: Doc["meta"]["team"];
  maxSensibilitaet?: Doc["meta"]["sensibilitaet"];
};

const SENSI_RANG: Record<Doc["meta"]["sensibilitaet"], number> = {
  öffentlich: 0,
  intern: 1,
  geheim: 2,
};

function filtern(docs: Doc[], f: Filter): Doc[] {
  return docs.filter((d) => {
    if (f.nachDatum && d.meta.datum < f.nachDatum) return false;
    if (f.team && d.meta.team !== f.team) return false;
    if (f.maxSensibilitaet && SENSI_RANG[d.meta.sensibilitaet] > SENSI_RANG[f.maxSensibilitaet]) return false;
    return true;
  });
}

export default function Metadaten() {
  const [team, setTeam] = useState<string>("");
  const [datum, setDatum] = useState<string>("");
  const [sensi, setSensi] = useState<string>("");

  const gefiltert = filtern(KORPUS, {
    nachDatum: datum || undefined,
    team: (team as Doc["meta"]["team"]) || undefined,
    maxSensibilitaet: (sensi as Doc["meta"]["sensibilitaet"]) || undefined,
  });

  return (
    <div className="lesson-card">
      <h2>Metadaten &amp; Filter</h2>
      <p className="lesson-description">
        Vektor-Ähnlichkeit findet semantisch passende Stücke — aber sie kennt
        weder <em>Datum</em> noch <em>Berechtigung</em> noch <em>Dokumenttyp</em>.
        Für diese Schichten braucht es <strong>strukturierte Metadaten + Pre-Filter</strong>.
      </p>

      <div className="warn-box">
        Suche nach &bdquo;Sales-Pipeline&ldquo; ohne Filter findet auch die alte
        Doku von 2022. Mit einem Datums-Filter (&bdquo;nach 2024&ldquo;)
        verschwindet sie automatisch.
      </div>

      <div className="result-grid">
        <div className="input-group">
          <label>Team</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          >
            <option value="">— alle —</option>
            <option value="engineering">engineering</option>
            <option value="produkt">produkt</option>
            <option value="sales">sales</option>
          </select>
        </div>
        <div className="input-group">
          <label>Erstellt nach</label>
          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
          />
        </div>
      </div>
      <div className="input-group">
        <label>Maximale Sensibilität (was darfst du sehen?)</label>
        <select
          value={sensi}
          onChange={(e) => setSensi(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            fontSize: "0.95rem",
            fontFamily: "inherit",
          }}
        >
          <option value="">— alle (kein Filter) —</option>
          <option value="öffentlich">öffentlich</option>
          <option value="intern">intern (inkl. öffentlich)</option>
          <option value="geheim">geheim (alles)</option>
        </select>
      </div>

      <div className="success-box">
        <strong>{gefiltert.length}</strong> von {KORPUS.length} Dokumenten
        bleiben durch den Filter übrig — <em>danach</em> würde die Vektorsuche
        auf diesem Sub-Set laufen.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {KORPUS.map((d) => {
          const drin = gefiltert.includes(d);
          return (
            <div
              key={d.id}
              className="result-box"
              style={{
                opacity: drin ? 1 : 0.35,
                borderLeft: drin ? "3px solid #10b981" : "3px solid #d1d5db",
              }}
            >
              <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{d.inhalt}</div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 4,
                  fontSize: "0.78rem",
                  color: "#52525b",
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                <span>{d.meta.datum}</span>
                <span>·</span>
                <span>{d.meta.team}</span>
                <span>·</span>
                <span>{d.meta.sensibilitaet}</span>
              </div>
            </div>
          );
        })}
      </div>

      <DepthBox variant="why" title="Pre-Filter vs. Post-Filter">
        Du kannst Metadaten entweder <em>vor</em> der Vektorsuche anwenden
        (&bdquo;suche nur in Dokumenten mit team=engineering&ldquo;) oder{" "}
        <em>nach</em> der Suche aus den Top-k filtern. Pre-Filter ist korrekter
        (alle Treffer durchsucht), aber teurer für die Index-Struktur. Post-Filter
        ist schneller, kann aber leere Ergebnisse liefern, wenn die Top-k
        ausgerechnet vom Filter entfernt werden.
      </DepthBox>

      <DepthBox variant="mistake" title="Embeddings für Metadaten misbrauchen">
        Klassischer Fail: jemand schreibt &bdquo;Sales-Pipeline 2026&ldquo;
        in den Embedding-Input, hoffend dass das Modell die Jahreszahl
        respektiert. Tut es nicht — Embeddings lernen <em>Semantik</em>,
        nicht <em>Filter</em>. Die Jahreszahl gehört in ein
        <code>year</code>-Feld, nicht in den Embedding-Text.
      </DepthBox>

      <DepthBox variant="deeper" title="Berechtigungen — der heikle Teil">
        ACLs (Access Control Lists) müssen <em>im selben System</em> wie die
        Vektor-DB leben, sonst sind sie umgehbar. Faustregel: filter auf
        Berechtigungs-Tags <strong>vor</strong> der Vektorsuche, niemals erst
        bei der Antwort &bdquo;den Treffer darf der User eigentlich gar nicht
        sehen&ldquo; — das LLM hat ihn längst im Kontext und kann den Inhalt
        durchsickern lassen.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Vector-DB-Filter-Support (pgvector + WHERE-clause ist hier Trumpf,
        gegenüber managed Diensten wie Pinecone), Hybrid Retrieval (BM25
        kann manche &bdquo;Filter&ldquo;-artigen Queries besser als
        Embeddings) und Re-Ranking (Cross-Encoder profitiert von einer
        guten Pre-Filter-Auswahl).
      </DepthBox>
    </div>
  );
}

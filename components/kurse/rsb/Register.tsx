"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

// 8-Bit-Register zum Anfassen: Bits per Klick kippen, Wert live ablesen.
function RegisterDemo() {
  const [bits, setBits] = useState<number[]>([0, 1, 0, 0, 1, 0, 0, 1]);

  const wert = bits.reduce((acc, b, i) => acc + (b ? 2 ** (7 - i) : 0), 0);
  const hex = wert.toString(16).toUpperCase().padStart(2, "0");

  const kippen = (i: number) =>
    setBits((b) => b.map((bit, j) => (j === i ? (bit ? 0 : 1) : bit)));

  const setze = (v: number) => {
    const clamped = ((v % 256) + 256) % 256;
    setBits(
      Array.from({ length: 8 }, (_, i) => (clamped >> (7 - i)) & 1)
    );
  };

  return (
    <div
      style={{
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: 12,
        padding: 16,
        margin: "1rem 0",
        background: "var(--surface, #f9fafb)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 4,
          color: "var(--fg, #111827)",
        }}
      >
        Register R0 — 8 Bit breit
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          opacity: 0.75,
          marginBottom: 12,
          color: "var(--fg, #111827)",
        }}
      >
        Klick auf ein Bit, um es zu kippen. Ein Register hält genau einen Wert —
        hier 8 Bit, also 0–255.
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {bits.map((bit, i) => (
          <button
            key={i}
            onClick={() => kippen(i)}
            aria-label={`Bit ${7 - i} kippen`}
            style={{
              width: 44,
              height: 56,
              borderRadius: 8,
              border: "1px solid #94a3b8",
              cursor: "pointer",
              fontFamily: "ui-monospace, monospace",
              fontSize: "1.3rem",
              fontWeight: 700,
              background: bit ? "#10b981" : "#1e293b",
              color: bit ? "#06281d" : "#64748b",
              transition: "background 0.12s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {bit}
            <span style={{ fontSize: "0.6rem", opacity: 0.7, marginTop: 2 }}>
              2<sup>{7 - i}</sup>
            </span>
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 14,
          flexWrap: "wrap",
          fontFamily: "ui-monospace, monospace",
          color: "var(--fg, #111827)",
        }}
      >
        <span>
          dezimal: <strong>{wert}</strong>
        </span>
        <span>
          binär: <strong>{bits.join("")}</strong>
        </span>
        <span>
          hex: <strong>0x{hex}</strong>
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button onClick={() => setze(wert + 1)} style={btnStyle}>
          +1 (wie ein Zähler)
        </button>
        <button onClick={() => setze(wert * 2)} style={btnStyle}>
          ×2 (Shift links)
        </button>
        <button onClick={() => setze(0)} style={btnStyle}>
          löschen (0)
        </button>
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          opacity: 0.7,
          marginTop: 8,
          color: "var(--fg, #111827)",
        }}
      >
        Tipp: Drück mehrfach <em>+1</em> und beobachte, was bei 255 passiert — das
        Register läuft über und beginnt wieder bei 0 (Overflow).
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #94a3b8",
  background: "#0ea5e9",
  color: "white",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: 600,
};

export default function Register() {
  return (
    <div className="lesson-card">
      <h2>Register: der schnellste Speicher der CPU</h2>
      <p className="lesson-description">
        Bevor eine CPU rechnet, muss sie die Zahlen <em>irgendwo</em> halten —
        und zwar dort, wo das Rechenwerk in einem einzigen Takt drankommt. Dieser
        Ort heißt Register. Sie sind der kleinste, schnellste und teuerste
        Speicher im ganzen Rechner.
      </p>

      <div className="info-box">
        Ein <strong>Register</strong> ist eine winzige Speicherzelle <em>direkt
        in der CPU</em>, die genau einen Wert hält (typisch 8, 16, 32 oder 64
        Bit). Die ALU liest ihre Operanden aus Registern und schreibt das
        Ergebnis wieder in ein Register — alles im selben Taktzyklus.
      </div>

      <h3>Probier es aus</h3>
      <p>
        Ein 8-Bit-Register ist nichts weiter als acht Bits nebeneinander. Jedes
        Bit steht für eine Zweierpotenz. Kipp ein paar Bits und sieh, welchen
        Wert das Register dann hält:
      </p>

      <RegisterDemo />

      <h3>Warum überhaupt Register?</h3>
      <p>
        Der Hauptspeicher (RAM) ist riesig, aber im Vergleich zur CPU{" "}
        <strong>quälend langsam</strong>: Ein RAM-Zugriff kostet die CPU schnell
        100+ Takte Wartezeit. Ein Registerzugriff dauert dagegen{" "}
        <strong>einen Takt</strong>. Würde die ALU jeden Operanden frisch aus dem
        RAM holen, stünde der Prozessor die meiste Zeit nur herum. Register sind
        das Notizpapier direkt unter der Hand des Rechenwerks.
      </p>

      <ol className="step-list">
        <li>
          Befehl lädt Werte aus dem RAM <em>einmalig</em> in Register.
        </li>
        <li>Die ALU rechnet beliebig oft register-zu-register — jeweils 1 Takt.</li>
        <li>Erst das Endergebnis wird zurück in den RAM geschrieben.</li>
      </ol>

      <h3>Welche Sorten von Registern gibt es?</h3>
      <p>
        Nicht jedes Register darf alles. Grob teilt man sie in zwei Gruppen:
      </p>

      <div className="actors">
        <div className="actor-card">
          <div className="actor-title">🧮 Universalregister</div>
          <p>
            Freies Notizpapier für Berechnungen — Operanden und Zwischenergebnisse.
            Auf x86-64 heißen sie z.&nbsp;B. <span className="mono">RAX</span>,{" "}
            <span className="mono">RBX</span>, …, auf ARM{" "}
            <span className="mono">X0</span>–<span className="mono">X30</span>.
          </p>
        </div>
        <div className="actor-card">
          <div className="actor-title">⚙️ Spezialregister</div>
          <p>
            Haben eine feste Aufgabe für den Ablauf des Programms — der
            Programmierer fasst sie selten direkt an.
          </p>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">Die wichtigsten Spezialregister</div>
          <div className="actor-row">
            <span className="mono">PC / IP</span>
            <span>Program Counter — Adresse des nächsten Befehls</span>
          </div>
          <div className="actor-row">
            <span className="mono">IR</span>
            <span>Instruction Register — der gerade geladene Befehl</span>
          </div>
          <div className="actor-row">
            <span className="mono">SP</span>
            <span>Stack Pointer — Spitze des Stacks</span>
          </div>
          <div className="actor-row">
            <span className="mono">FLAGS</span>
            <span>Statusregister — Zero, Carry, Overflow, Sign …</span>
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum ist die Registerbreite so eine große Sache?">
        <p>
          Die Breite eines Universalregisters (32 vs. 64 Bit) bestimmt, wie
          große Zahlen die CPU <em>in einem Stück</em> verarbeiten kann und wie
          viel Adressraum sie direkt ansprechen kann. 64-Bit-Register können
          Adressen bis 2<sup>64</sup> halten — der eigentliche Grund, warum
          „64-Bit-Systeme" mehr als 4&nbsp;GB RAM nutzen können. Mit dem
          interaktiven 8-Bit-Register oben siehst du das Limit im Kleinen: bei 8
          Bit ist nach 255 Schluss.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Register ≠ RAM ≠ Cache">
        <p>
          Häufige Verwechslung: „Variablen liegen im Register." Meist nicht —
          Variablen leben im RAM, und der Compiler <em>lädt</em> sie nur bei
          Bedarf in Register. Auch <strong>Cache und Register sind nicht
          dasselbe</strong>: Der Cache ist ein automatischer, vom Programm
          unsichtbarer Zwischenspeicher zwischen CPU und RAM. Register dagegen
          haben Namen und werden von den Befehlen <em>explizit</em> benannt
          (<span className="mono">add rax, rbx</span>).
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Das Statusregister steuert if und Schleifen">
        <p>
          Nach einer Rechnung setzt die ALU Flags im Statusregister: das{" "}
          <strong>Zero-Flag</strong>, wenn das Ergebnis 0 war, das{" "}
          <strong>Carry-/Overflow-Flag</strong> beim Überlauf usw. Ein{" "}
          <span className="mono">if (a == b)</span> wird in Maschinensprache zu{" "}
          „rechne <span className="mono">a - b</span>, und springe, <em>wenn das
          Zero-Flag gesetzt ist</em>". So entstehen Verzweigungen und Schleifen
          aus einem einzigen kleinen Register.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <p>
          Das <strong>PC-Register</strong> ist der Motor des{" "}
          <em>Befehlszyklus</em> (Fetch–Decode–Execute) — die nächste Lektion.
          Und die Frage „warum sind Register so schnell und der RAM so langsam?"
          führt direkt zur <em>Speicherhierarchie</em>: Register → Cache → RAM →
          SSD, jede Stufe größer und langsamer als die davor.
        </p>
      </DepthBox>
    </div>
  );
}

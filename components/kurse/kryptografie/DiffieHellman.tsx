"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/components/lessons/lesson.css";
import { KryptoQuelle } from "./KryptoQuelle";

function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp & 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

const implCode = `// Öffentlich vereinbart
const p = 23; // Primzahl
const g = 5;  // Generator

// Alice
const a = 6;             // privat
const A = (g ** a) % p;  // öffentlich

// Bob
const b = 15;            // privat
const B = (g ** b) % p;  // öffentlich

// Beide berechnen den gemeinsamen Schlüssel
const sharedAlice = (B ** a) % p; // = 2
const sharedBob   = (A ** b) % p; // = 2`;

export default function DiffieHellman() {
  const [p, setP] = useState(23);
  const [g, setG] = useState(5);
  const [a, setA] = useState(6);
  const [b, setB] = useState(15);

  const A = modPow(g, a, p);
  const B = modPow(g, b, p);
  const sharedAlice = modPow(B, a, p);
  const sharedBob = modPow(A, b, p);

  return (
    <div className="lesson-card">
      <h2>Diffie-Hellman-Schlüsselaustausch</h2>
      <p className="lesson-description">
        Das Problem: Alice und Bob wollen ein gemeinsames Geheimnis vereinbaren –
        aber jeder, der die Leitung mithört, soll es <strong>nicht</strong>{" "}
        herausfinden können. Diffie-Hellman (1976) löst genau das, ohne dass je
        ein Schlüssel direkt übertragen wird.
      </p>

      <div className="info-box">
        <strong>Die Farben-Analogie:</strong> Alice und Bob einigen sich öffentlich
        auf eine gelbe Farbe. Jeder mischt heimlich seine geheime Farbe dazu und
        schickt das Ergebnis. Beide mischen die empfangene Mischung noch einmal mit
        ihrer eigenen geheimen Farbe – und erhalten dieselbe Endfarbe. Ein
        Lauscher hat nur die Mischungen gesehen und kann die geheimen Farben nicht
        rückwärts herauslösen.
      </div>

      <h3>1. Öffentliche Parameter</h3>
      <div className="input-group">
        <label>p (Primzahl)</label>
        <input
          type="number"
          value={p}
          min={5}
          max={9973}
          onChange={(e) => setP(Math.max(5, Number(e.target.value) || 5))}
        />
      </div>
      <div className="input-group">
        <label>g (Generator)</label>
        <input
          type="number"
          value={g}
          min={2}
          max={p - 1}
          onChange={(e) => setG(Math.max(2, Number(e.target.value) || 2))}
        />
      </div>

      <h3>2. Private Geheimnisse</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">👩 Alice</div>
          <div className="input-group">
            <label>a (geheim)</label>
            <input
              type="number"
              value={a}
              min={1}
              max={p - 1}
              onChange={(e) => setA(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div className="actor-row">
            <span>A = g<sup>a</sup> mod p</span>
            <span className="mono">= {A}</span>
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🧑 Bob</div>
          <div className="input-group">
            <label>b (geheim)</label>
            <input
              type="number"
              value={b}
              min={1}
              max={p - 1}
              onChange={(e) => setB(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div className="actor-row">
            <span>B = g<sup>b</sup> mod p</span>
            <span className="mono">= {B}</span>
          </div>
        </div>

        <div className="actor-card shared">
          <div className="actor-title">🔑 Gemeinsamer Schlüssel</div>
          <div className="actor-row">
            <span>Alice rechnet B<sup>a</sup> mod p</span>
            <span className="mono">= {sharedAlice}</span>
          </div>
          <div className="actor-row">
            <span>Bob rechnet A<sup>b</sup> mod p</span>
            <span className="mono">= {sharedBob}</span>
          </div>
          {sharedAlice === sharedBob && (
            <div className="success-box" style={{ marginTop: 10 }}>
              ✔ Beide kommen auf <strong>{sharedAlice}</strong> – ohne dass dieser
              Wert je übertragen wurde.
            </div>
          )}
        </div>
      </div>

      <h3>Was sieht ein Angreifer?</h3>
      <dl className="kv-table">
        <dt>Öffentlich bekannt:</dt>
        <dd>p = {p}, g = {g}, A = {A}, B = {B}</dd>
        <dt>Geheim:</dt>
        <dd>a, b und der gemeinsame Schlüssel</dd>
      </dl>
      <p>
        Um aus A das geheime a zu bekommen, müsste der Angreifer den{" "}
        <span className="pill">diskreten Logarithmus</span> berechnen –
        bei großen Primzahlen (z. B. 2048 Bit) praktisch unmöglich.
      </p>

      <div className="warn-box">
        <strong>Wichtig:</strong> Reines Diffie-Hellman schützt nicht vor{" "}
        <strong>Man-in-the-Middle</strong>. Ein Angreifer könnte sich gegenüber
        Alice als Bob ausgeben und umgekehrt. In der Praxis kombiniert man DH
        deshalb mit Authentifizierung (Zertifikate, Signaturen) – z. B. bei TLS.
      </div>

      <h3>Schritt für Schritt</h3>
      <ol className="step-list">
        <li>Alice und Bob einigen sich öffentlich auf p (Primzahl) und g (Generator).</li>
        <li>Alice wählt geheim a, Bob wählt geheim b.</li>
        <li>Alice schickt A = gᵃ mod p. Bob schickt B = gᵇ mod p.</li>
        <li>Alice rechnet Bᵃ mod p, Bob rechnet Aᵇ mod p – beide erhalten denselben Wert (gᵃᵇ mod p).</li>
        <li>Dieser Wert dient als Schlüssel für ein symmetrisches Verfahren (z. B. AES).</li>
      </ol>

      <KryptoQuelle
        id="diffie1976-newdirections"
        kernaussagen={[
          "Das Paper von 1976 begründete asymmetrische Kryptografie: erstmals konnte man Schlüssel über einen offen abhörbaren Kanal austauschen.",
          "Diffie und Hellman formulierten gleichzeitig das Konzept digitaler Signaturen — die konkrete Umsetzung (RSA) folgte 1978.",
          "Die Sicherheit des Protokolls beruht auf dem diskreten Logarithmus: g^x mod p ist einfach zu berechnen, x daraus zu bestimmen aber praktisch unmöglich.",
        ]}
      />

      <SyntaxHighlighter language="typescript" style={oneLight}>
        {implCode}
      </SyntaxHighlighter>
    </div>
  );
}

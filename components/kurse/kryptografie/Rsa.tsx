"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/components/lessons/lesson.css";
import { KryptoQuelle } from "./KryptoQuelle";

function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function modInverse(e: number, phi: number): number {
  let [old_r, r] = [e, phi];
  let [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return ((old_s % phi) + phi) % phi;
}

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

const implCode = `// Stark vereinfacht – echte RSA nutzt Primzahlen mit 1024+ Bit
const p = 61, q = 53;
const n = p * q;                    // 3233
const phi = (p - 1) * (q - 1);      // 3120
const e = 17;                       // öffentlich
const d = modInverse(e, phi);       // privat = 2753

// Öffentlicher Schlüssel: (n, e)
// Privater Schlüssel:     (n, d)

// Verschlüsseln einer Zahl m < n:
const c = (m ** e) % n;
// Entschlüsseln:
const m_back = (c ** d) % n;`;

export default function Rsa() {
  const [p, setP] = useState(61);
  const [q, setQ] = useState(53);
  const [e, setE] = useState(17);
  const [m, setM] = useState(42);

  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const eValid = e > 1 && e < phi && gcd(e, phi) === 1;
  const d = eValid ? modInverse(e, phi) : 0;
  const mValid = m > 0 && m < n;

  const c = mValid && eValid ? modPow(m, e, n) : 0;
  const mBack = mValid && eValid ? modPow(c, d, n) : 0;

  return (
    <div className="lesson-card">
      <h2>RSA – Asymmetrische Verschlüsselung</h2>
      <p className="lesson-description">
        Bei symmetrischen Verfahren (Caesar, XOR, AES) brauchen Sender und
        Empfänger denselben Schlüssel – aber wie sicher austauschen? RSA löst das
        mit einem <strong>Schlüsselpaar</strong>: einem öffentlichen zum
        Verschlüsseln und einem privaten zum Entschlüsseln.
      </p>

      <div className="info-box">
        <strong>Die Idee:</strong> Multiplizieren ist leicht (61 × 53 = 3233),
        aber eine große Zahl in ihre Primfaktoren zerlegen ist extrem schwer.
        Darauf baut RSA die ganze Sicherheit auf.
      </div>

      <h3>1. Schlüssel erzeugen</h3>
      <div className="result-grid">
        <div className="input-group">
          <label>p (Primzahl)</label>
          <input
            type="number"
            value={p}
            onChange={(ev) => setP(Math.max(2, Number(ev.target.value) || 2))}
          />
        </div>
        <div className="input-group">
          <label>q (Primzahl)</label>
          <input
            type="number"
            value={q}
            onChange={(ev) => setQ(Math.max(2, Number(ev.target.value) || 2))}
          />
        </div>
      </div>

      <dl className="kv-table">
        <dt>n = p · q</dt>
        <dd>{n}  (Modulus, öffentlich)</dd>
        <dt>φ(n) = (p−1)(q−1)</dt>
        <dd>{phi}  (geheim)</dd>
      </dl>

      <div className="input-group">
        <label>e (öffentlicher Exponent, teilerfremd zu φ(n))</label>
        <input
          type="number"
          value={e}
          onChange={(ev) => setE(Math.max(2, Number(ev.target.value) || 2))}
        />
      </div>

      {!eValid && (
        <div className="warn-box">
          e = {e} ist nicht zu φ(n) = {phi} teilerfremd. Bitte anderes e wählen
          (typisch: 3, 17, 65537).
        </div>
      )}

      {eValid && (
        <div className="actors">
          <div className="actor-card alice">
            <div className="actor-title">🌐 Öffentlicher Schlüssel</div>
            <div className="actor-row"><span>n</span><span className="mono">{n}</span></div>
            <div className="actor-row"><span>e</span><span className="mono">{e}</span></div>
          </div>
          <div className="actor-card bob">
            <div className="actor-title">🔒 Privater Schlüssel</div>
            <div className="actor-row"><span>n</span><span className="mono">{n}</span></div>
            <div className="actor-row"><span>d (= e⁻¹ mod φ(n))</span><span className="mono">{d}</span></div>
          </div>
        </div>
      )}

      <h3>2. Verschlüsseln & Entschlüsseln</h3>
      <div className="input-group">
        <label>Nachricht m (Zahl mit 0 &lt; m &lt; n = {n})</label>
        <input
          type="number"
          value={m}
          onChange={(ev) => setM(Number(ev.target.value) || 0)}
        />
      </div>

      {mValid && eValid && (
        <div className="result-grid">
          <div className="result-box">
            <span className="result-label">Chiffre c = mᵉ mod n</span>
            <span className="result-value encrypted mono">{c}</span>
          </div>
          <div className="result-box">
            <span className="result-label">Wieder m = cᵈ mod n</span>
            <span className="result-value decrypted mono">{mBack}</span>
          </div>
        </div>
      )}

      <h3>Wie wird RSA in der Praxis genutzt?</h3>
      <ol className="step-list">
        <li>
          RSA verschlüsselt selten ganze Nachrichten – es ist zu langsam. Stattdessen
          verschlüsselt man damit einen <strong>AES-Schlüssel</strong> und überträgt den.
        </li>
        <li>
          Auch fürs <strong>digitale Signieren</strong>: Mit dem <em>privaten</em> Schlüssel
          verschlüsseln = signieren, mit dem <em>öffentlichen</em> prüfen.
        </li>
        <li>
          Heute oft ersetzt durch Verfahren auf <strong>elliptischen Kurven</strong>{" "}
          (ECDSA, Ed25519) – kleinere Schlüssel, gleiche Sicherheit.
        </li>
      </ol>

      <KryptoQuelle
        id="rivest1978-rsa"
        kernaussagen={[
          "Rivest, Shamir und Adleman lösten 1978 das von Diffie gestellte Problem: eine konkrete Einwegfunktion mit Trapdoor auf Basis der Primzahlfaktorisierung.",
          "Die Sicherheit basiert auf dem Integer-Factorization-Problem: n = p × q ist trivial zu berechnen; p und q aus n zurückzurechnen ist bei großen Zahlen praktisch unmöglich.",
          "Das Paper wurde 2002 mit dem Turing Award ausgezeichnet — es ist eines der meistzitierten Werke der Informatikgeschichte.",
        ]}
      />

      <div className="warn-box">
        <strong>Wichtig:</strong> Echte RSA-Schlüssel haben heute mindestens
        2048 Bit (das obige Beispiel hat 12 Bit!). Außerdem braucht man Padding
        (OAEP), sonst ist das Verfahren unsicher.
      </div>

      <SyntaxHighlighter language="typescript" style={oneLight}>
        {implCode}
      </SyntaxHighlighter>
    </div>
  );
}

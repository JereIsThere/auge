"use client";

import { useState } from "react";
import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

function xorOTP(message: string, key: string): string {
  let out = "";
  for (let i = 0; i < message.length; i++) {
    const m = message.charCodeAt(i);
    const k = key.charCodeAt(i % key.length);
    out += String.fromCharCode(m ^ k);
  }
  return out;
}

function toHex(s: string): string {
  return Array.from(s)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

function randomKey(len: number): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => String.fromCharCode(b)).join("");
}

export default function EnigmaOTP() {
  const [msg, setMsg] = useState("ANGRIFF BEI MORGENGRAUEN");
  const [key, setKey] = useState(() => randomKey(24));

  const cipher = xorOTP(msg, key);

  return (
    <div className="lesson-card">
      <h2>Enigma & das One-Time-Pad</h2>

      <DepthBox variant="basic" title="Zwei sehr unterschiedliche Geschichten" defaultOpen>
        <p>
          <strong>Enigma</strong> war eine mechanische Verschlüsselungsmaschine
          der Wehrmacht. Galt als unknackbar — wurde aber gebrochen, und der
          Bruch verkürzte den 2. Weltkrieg vermutlich um Jahre.
        </p>
        <p>
          Das <strong>One-Time-Pad (OTP)</strong> dagegen ist das einzige
          Verfahren, das <em>nachweislich</em> unknackbar ist — wenn man es
          richtig benutzt. Was praktisch fast nie passiert.
        </p>
      </DepthBox>

      <h3>One-Time-Pad — live</h3>
      <p className="lesson-description">
        Idee: XOR die Nachricht mit einem <strong>zufälligen Schlüssel
        derselben Länge</strong>. Schlüssel danach wegwerfen. Niemand
        wiederverwenden. Niemals.
      </p>

      <div className="input-group">
        <label>Nachricht</label>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Zufalls-Pad (Hex, gleich lang)</label>
        <div className="hash-output">{toHex(key.slice(0, msg.length))}</div>
        <button className="toggle-code" onClick={() => setKey(randomKey(Math.max(msg.length, 24)))}>
          Neuen Schlüssel würfeln
        </button>
      </div>

      <div className="input-group">
        <label>Geheimtext (XOR)</label>
        <div className="hash-output">{toHex(cipher)}</div>
      </div>

      <DepthBox variant="why" title="Warum ist das OTP unknackbar?">
        <p>
          Weil der Geheimtext zu <em>jeder möglichen</em> gleichlangen
          Klartext-Nachricht passt. Ein Angreifer mit unbegrenzter Rechenpower
          kann nicht zwischen „ANGRIFF UM 6 UHR", „RUECKZUG NACH NORDEN" und
          „NUDELN MIT TOMATENSAUCE" unterscheiden — alle drei sind gleich
          plausible Klartexte, abhängig vom (geheimen) Schlüssel.
        </p>
        <p>
          Das nennt man <em>perfekte Geheimhaltung</em> (Shannon 1949) und es
          ist beweisbar das stärkstmögliche Sicherheitsniveau.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Warum nutzen wir dann nicht alle OTP?">
        <p>
          Die Bedingungen sind brutal:
        </p>
        <ol className="step-list">
          <li>
            <strong>Schlüssel = Nachrichtenlänge.</strong> Für ein 4-GB-Video
            brauchst du 4 GB Schlüssel — und musst die vorher sicher tauschen.
            Wenn du das kannst, kannst du auch gleich das Video tauschen.
          </li>
          <li>
            <strong>Echt zufällig.</strong> Nicht „aus einem Generator", sondern
            physikalisch zufällig.
          </li>
          <li>
            <strong>Genau einmal benutzen.</strong> Sobald derselbe Schlüssel
            zweimal verwendet wird, ist das System tot (siehe nächste Box).
          </li>
        </ol>
        <p>
          Deshalb nutzt OTP in der Praxis fast niemand — außer Diplomatie und
          Spionage mit handgekurbelten Zahlenstationen.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Two-Time-Pad: der berühmte Fehler">
        <p>
          Verschlüsselst du zwei Nachrichten <code>M₁</code> und <code>M₂</code>{" "}
          mit demselben Schlüssel <code>K</code>, gilt:
        </p>
        <p>
          <code>C₁ ⊕ C₂ = (M₁ ⊕ K) ⊕ (M₂ ⊕ K) = M₁ ⊕ M₂</code>
        </p>
        <p>
          Der Schlüssel fällt komplett raus. Aus <code>M₁ ⊕ M₂</code> lassen
          sich beide Klartexte über Sprachstatistik rekonstruieren —{" "}
          das nennt man <em>Crib-Dragging</em>. Genau so brachen die USA in
          den 1940ern das sowjetische VENONA-System: die Sowjets hatten Pads
          doppelt benutzt.
        </p>
      </DepthBox>

      <h3>Enigma in zwei Minuten</h3>
      <p className="lesson-description">
        Enigma war im Kern eine motorisierte Vigenère-Chiffre mit
        astronomisch langer Periode: 3–4 rotierende Walzen, ein Reflektor und
        ein Steckerbrett. Beim Tippen drehten sich die Walzen weiter — jeder
        Buchstabe wurde anders verschlüsselt. Theoretischer Schlüsselraum:{" "}
        ~10²³.
      </p>

      <DepthBox variant="history" title="Wie wurde Enigma gebrochen?">
        <p>
          Drei Hebel:
        </p>
        <ol className="step-list">
          <li>
            <strong>Designfehler:</strong> Enigma verschlüsselt einen Buchstaben{" "}
            <em>nie auf sich selbst</em>. Wenn der Klartext „WETTER" enthalten
            sollte, konnte man Positionen ausschließen.
          </li>
          <li>
            <strong>Bedienfehler:</strong> Funker nutzten oft vorhersagbare
            Tagesschlüssel („AAA"), grüßten mit „HEIL HITLER", oder begannen
            Wetterberichte gleich.
          </li>
          <li>
            <strong>Bombe:</strong> Eine elektromechanische Maschine, die
            Turing & Welchman in Bletchley Park bauten. Sie probierte Walzen-Stellungen
            durch und nutzte „Cribs" (vermutete Klartextstücke) zum Ausschluss.
          </li>
        </ol>
        <p>
          Die Lehre: ein riesiger Schlüsselraum schützt nicht, wenn das
          Verfahren strukturelle Lecks hat oder Nutzer nachlässig sind.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Was ist davon heute relevant?">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/xor">XOR</Link> — der innere Mechanismus des
            OTP, auch Basis vieler moderner Stromchiffren.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/entropie">Zufall & Entropie</Link> — OTP
            braucht <em>echten</em> Zufall, sonst ist es nutzlos.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/aes">AES</Link> — der moderne Nachfolger: kurzer
            Schlüssel, aber rechenmäßig nicht zu brechen.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

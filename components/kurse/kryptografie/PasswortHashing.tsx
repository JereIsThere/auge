"use client";

import { useState } from "react";
import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";
import { KryptoQuelle } from "./KryptoQuelle";

// Toy "slow hash" — repeated SHA-256 to simulate cost factor.
async function slowHash(pw: string, salt: string, iterations: number): Promise<{ hex: string; ms: number }> {
  const enc = new TextEncoder();
  const start = performance.now();
  let buf = await crypto.subtle.digest("SHA-256", enc.encode(salt + pw));
  for (let i = 1; i < iterations; i++) {
    buf = await crypto.subtle.digest("SHA-256", buf);
  }
  const ms = performance.now() - start;
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { hex, ms };
}

function randomSalt(): string {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function PasswortHashing() {
  const [pw, setPw] = useState("hunter2");
  const [salt, setSalt] = useState(() => randomSalt());
  const [cost, setCost] = useState(12); // 2^12 iterations
  const [out, setOut] = useState<{ hex: string; ms: number } | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const result = await slowHash(pw, salt, Math.pow(2, cost));
    setOut(result);
    setBusy(false);
  }

  return (
    <div className="lesson-card">
      <h2>Passwort-Hashing (bcrypt, Argon2, …)</h2>

      <DepthBox variant="basic" title="Warum ein eigener Hash für Passwörter?" defaultOpen>
        <p>
          Normale Hashes wie SHA-256 sind <strong>absichtlich schnell</strong> —
          Milliarden pro Sekunde auf einer GPU. Für Datei-Integrität super, für
          Passwörter eine Katastrophe: Angreifer können geleakte
          Passwort-Datenbanken massenhaft per Brute-Force durchtesten.
        </p>
        <p>
          Passwort-Hashes sind das Gegenteil: <strong>absichtlich langsam</strong>{" "}
          und speicherhungrig, damit Massen-Raten unbezahlbar wird.
        </p>
      </DepthBox>

      <h3>Probier's aus: Kostenfaktor</h3>
      <p className="lesson-description">
        Wir simulieren das mit wiederholtem SHA-256 (echtes bcrypt/Argon2 ist
        anders gebaut, aber das Prinzip ist dasselbe). Schieb den Slider hoch
        — die Hash-Berechnung wird exponentiell langsamer.
      </p>

      <div className="input-group">
        <label>Passwort</label>
        <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Salt (zufällig pro Nutzer)</label>
        <div className="hash-output">{salt}</div>
        <button className="toggle-code" onClick={() => setSalt(randomSalt())}>
          Neuen Salt würfeln
        </button>
      </div>

      <div className="input-group">
        <label>Kostenfaktor: 2^{cost} = {Math.pow(2, cost).toLocaleString("de-DE")} Iterationen</label>
        <input
          type="range"
          min={4}
          max={20}
          value={cost}
          onChange={(e) => setCost(parseInt(e.target.value))}
        />
      </div>

      <button className="toggle-code" onClick={run} disabled={busy}>
        {busy ? "Rechne…" : "Hash berechnen"}
      </button>

      {out && (
        <>
          <div className="input-group">
            <label>Hash</label>
            <div className="hash-output">{out.hex}</div>
          </div>
          <div className={out.ms > 100 ? "success-box" : "info-box"}>
            Berechnung dauerte <strong>{out.ms.toFixed(0)} ms</strong>. Auf
            deinem Gerät — auf einer Angreifer-GPU eher{" "}
            <strong>{(out.ms / 1000).toFixed(2)} µs</strong> pro Versuch. Reale
            Empfehlung: Hash sollte mindestens 100–500 ms auf einem Server
            kosten (Kostenfaktor entsprechend hoch).
          </div>
        </>
      )}

      <DepthBox variant="why" title="Salt — wofür und warum zufällig?">
        <p>
          Ohne Salt: zwei Nutzer mit demselben Passwort haben denselben Hash.
          Angreifer können vorberechnete <em>Rainbow Tables</em> bauen — riesige
          Listen „Hash → Passwort" — und alle Nutzer der DB auf einen Schlag
          knacken.
        </p>
        <p>
          Mit zufälligem Salt pro Nutzer ist jeder Hash einzigartig, selbst bei
          identischem Passwort. Rainbow Tables werden nutzlos, der Angreifer
          muss für <em>jeden Nutzer einzeln</em> brute-forcen.
        </p>
        <p>
          <strong>Salt darf öffentlich sein</strong> — es wird zusammen mit dem
          Hash in der DB gespeichert. Es muss nur <em>einzigartig</em> und{" "}
          <em>zufällig</em> sein.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="bcrypt vs. scrypt vs. Argon2">
        <ul>
          <li>
            <strong>bcrypt (1999):</strong> Auf Blowfish basiert. Hat einen
            einstellbaren Kostenfaktor (Iterationen). Lange der Standard, aber
            limitiert auf 72 Zeichen Eingabe und nur CPU-hart — eine GPU bringt
            schon einen Vorteil.
          </li>
          <li>
            <strong>scrypt (2009):</strong> Zusätzlich <em>speicherhart</em>.
            Braucht viel RAM, was GPUs (mit wenig RAM pro Core) ausbremst.
          </li>
          <li>
            <strong>Argon2 (2015):</strong> Gewinner der Password Hashing
            Competition. Drei Parameter: Iterationen, Speicher, Parallelität.
            <em>Argon2id</em> ist heute die empfohlene Variante.
          </li>
          <li>
            <strong>PBKDF2 (1999):</strong> Älter, nur CPU-hart, aber sehr weit
            verbreitet (in WiFi/WPA2, im OS-Keystore). OK als Notlösung, nicht
            mehr erste Wahl.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="mistake" title="Häufige Fehler in Login-Code">
        <ol className="step-list">
          <li>
            <strong>SHA-256 statt bcrypt/Argon2.</strong> Klassischer
            Anfängerfehler. Schon mehrfach in echten Leaks gesehen.
          </li>
          <li>
            <strong>Globaler Salt</strong> statt einer pro Nutzer. Bringt fast
            nichts: ein vorberechneter Tisch reicht.
          </li>
          <li>
            <strong>Kein Pepper.</strong> Ein <em>Pepper</em> ist ein
            zusätzlicher geheimer Wert, der nicht in der DB liegt (z. B. im
            App-Server-Config). Falls die DB allein leakt, sind alle Hashes
            ohne Pepper nutzlos.
          </li>
          <li>
            <strong>Timing-Leaks</strong> beim Vergleichen: <code>===</code>
            kann früh abbrechen und Bits über den richtigen Hash verraten.
            Lösung: konstanter Vergleich (<code>crypto.timingSafeEqual</code>{" "}
            in Node).
          </li>
        </ol>
      </DepthBox>

      <KryptoQuelle
        id="rfc-9106"
        kernaussagen={[
          "RFC 9106 standardisiert Argon2 als Ergebnis der Password Hashing Competition 2015 — Argon2id ist die empfohlene Variante für allgemeine Anwendungen.",
          "Argon2id kombiniert Resistenz gegen Side-Channel-Angriffe (Argon2i) und GPU-Brute-Force (Argon2d) — Angreifer müssen Speicher und Zeit pro Versuch aufwenden.",
          "Empfohlene Mindestparameter: 64 MiB Speicher, 3 Iterationen — macht massenhaftes Raten auf GPUs finanziell unattraktiv.",
        ]}
      />

      <DepthBox variant="related" title="Drumherum">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/hash">Hashes</Link> — die Basis. Hier
            siehst du, warum reine Hashes nicht reichen.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/entropie">Zufall & Entropie</Link> — woher
            der Salt kommt.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/hmac">HMAC</Link> — Pepper wird oft als
            HMAC-mit-geheimem-Schlüssel realisiert.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

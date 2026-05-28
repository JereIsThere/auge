"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

function passwordEntropy(pw: string): { bits: number; pool: number } {
  if (!pw) return { bits: 0, pool: 0 };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  const bits = pw.length * Math.log2(pool || 1);
  return { bits, pool };
}

function crackTime(bits: number): string {
  // assume 10^11 guesses/sec (modern GPU on fast hash)
  const guesses = Math.pow(2, bits) / 2;
  const seconds = guesses / 1e11;
  if (seconds < 1) return "< 1 Sekunde";
  if (seconds < 60) return `${seconds.toFixed(1)} Sekunden`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} Minuten`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} Stunden`;
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} Tage`;
  const years = seconds / 31536000;
  if (years < 1000) return `${years.toFixed(1)} Jahre`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)} Tausend Jahre`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} Millionen Jahre`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1)} Milliarden Jahre`;
  return "länger als das Universum alt ist";
}

export default function Entropie() {
  const [pw, setPw] = useState("Passwort123");
  const { bits, pool } = useMemo(() => passwordEntropy(pw), [pw]);
  const time = crackTime(bits);

  const strength =
    bits < 28 ? { label: "sehr schwach", cls: "warn-box" } :
    bits < 50 ? { label: "schwach", cls: "warn-box" } :
    bits < 70 ? { label: "ok", cls: "info-box" } :
    bits < 90 ? { label: "stark", cls: "success-box" } :
                { label: "sehr stark", cls: "success-box" };

  return (
    <div className="lesson-card">
      <h2>Zufall & Entropie</h2>

      <DepthBox variant="basic" title="Was meinen wir mit Entropie?" defaultOpen>
        <p>
          Entropie ist ein schickes Wort für <strong>„wie schwer ist das zu
          erraten?"</strong>. Eine Münze hat 1 Bit Entropie (Kopf oder Zahl),
          ein Würfel etwa 2,58 Bit, ein zufälliges 8-Zeichen-Passwort aus
          Kleinbuchstaben rund 37 Bit.
        </p>
        <p>
          Je mehr Bits, desto mehr Versuche braucht ein Angreifer. Pro Bit
          verdoppelt sich der Aufwand.
        </p>
      </DepthBox>

      <p className="lesson-description">
        Krypto steht und fällt mit echtem Zufall: Schlüssel, Nonces, Salts,
        Initialisierungsvektoren — alles davon muss unvorhersagbar sein.{" "}
        <strong>Schlechter Zufall ist die häufigste Ursache praktischer Krypto-Brüche</strong>{" "}
        — nicht zerbrochene Algorithmen.
      </p>

      <div className="input-group">
        <label>Probier ein Passwort aus</label>
        <input
          type="text"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Tippe etwas..."
        />
      </div>

      <div className="result-grid">
        <div className="result-box">
          <span className="result-label">Zeichenpool</span>
          <span className="result-value">{pool}</span>
        </div>
        <div className="result-box">
          <span className="result-label">Entropie</span>
          <span className="result-value">{bits.toFixed(1)} Bit</span>
        </div>
      </div>

      <div className={strength.cls}>
        <strong>Stärke: {strength.label}.</strong> Bei {Math.pow(10, 11).toExponential(0)}{" "}
        Versuchen pro Sekunde (moderne GPU auf schnellem Hash) wäre dieses
        Passwort im Schnitt nach <strong>{time}</strong> geknackt.
      </div>

      <DepthBox variant="mistake" title="„Passwort123!“ sieht doch komplex aus?">
        <p>
          Sieht so aus, ist es nicht. Diese Rechnung hier geht von{" "}
          <em>zufälligen</em> Zeichen aus. Echte Passwörter folgen Mustern:
          Worte, dann ein paar Ziffern, dann ein Sonderzeichen. Angreifer
          nutzen <em>Wörterbuch-Angriffe</em>, die genau diese Muster
          ausprobieren — die effektive Entropie eines „kreativen" Passworts
          ist oft <strong>um Größenordnungen niedriger</strong> als das, was
          die Rechnung oben anzeigt.
        </p>
        <p>
          Daher: lieber <strong>vier zufällige Worte</strong> („richtig pferd
          batterie heftklammer", ~44 Bit) oder ein Passwort-Manager mit
          generierten Passwörtern (~80–100 Bit). Komplexitätsregeln à la
          „mindestens 1 Sonderzeichen" sind weitgehend Sicherheitstheater.
        </p>
      </DepthBox>

      <DepthBox variant="why" title="Warum braucht Krypto so viel Zufall?">
        <p>
          Praktisch jedes moderne Verfahren braucht <em>frische</em> Zufallswerte:
        </p>
        <ul>
          <li><strong>Schlüssel</strong> — sonst sind sie ratbar.</li>
          <li>
            <strong>Nonces / IVs</strong> (in AES-GCM, CTR) — derselbe Nonce
            mit demselben Schlüssel kann ganze Nachrichten leaken.
          </li>
          <li>
            <strong>Salts</strong> beim Passwort-Hashing — damit gleiche
            Passwörter nicht gleiche Hashes ergeben.
          </li>
          <li>
            <strong>Ephemerale Schlüssel</strong> in Diffie-Hellman — für{" "}
            <em>Forward Secrecy</em>.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="deeper" title="Echter vs. pseudo-Zufall">
        <p>
          Computer sind deterministisch — sie können von Natur aus keinen
          Zufall erzeugen. Lösung: man sammelt <em>Entropie</em> aus
          unvorhersagbaren physikalischen Quellen (Maus, Tastatur-Timing,
          Festplatten-Jitter, Hardware-RNG in modernen CPUs) und füttert
          damit einen <strong>kryptografischen PRNG</strong> (CSPRNG), der
          daraus beliebig viele „zufällige" Bytes generiert.
        </p>
        <p>
          Beispiel: <code>/dev/urandom</code> unter Linux, <code>BCryptGenRandom</code>{" "}
          unter Windows, <code>crypto.getRandomValues()</code> im Browser. Nutze{" "}
          <strong>niemals</strong> <code>Math.random()</code> für Sicherheit —
          das ist ein einfacher PRNG, dessen interner Zustand nach wenigen
          Ausgaben rekonstruierbar ist.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Berühmte Zufalls-Disaster">
        <ul>
          <li>
            <strong>Debian OpenSSL 2008:</strong> Ein Patch entfernte aus
            Versehen die Entropie-Sammlung. Zwei Jahre lang erzeugte Debian
            SSL-Schlüssel aus nur 32.768 möglichen Werten — trivial knackbar.
          </li>
          <li>
            <strong>PlayStation 3 (2010):</strong> Sony nutzte für ECDSA-Signaturen
            denselben Zufallswert <em>k</em> immer wieder. Aus zwei Signaturen
            ließ sich der private Schlüssel direkt ausrechnen — Konsole
            komplett geöffnet.
          </li>
          <li>
            <strong>Bitcoin-Wallets:</strong> Mehrere frühe Wallet-Apps nutzten
            schwachen Zufall — Coins wurden gezielt geleert.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Weiterführend">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/passwort">Passwort-Hashing</Link> — Salts und
            warum sie zufällig sein müssen.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/modi">Betriebsmodi</Link> — Nonce-Wiederverwendung
            bricht GCM und CTR komplett.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/signaturen">Digitale Signaturen</Link> —
            ECDSA mit wiederholtem <em>k</em> ist tödlich (siehe PS3).
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

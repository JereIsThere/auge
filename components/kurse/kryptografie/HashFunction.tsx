"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const implCode = `async function sha256(text: string) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}`;

function diffChars(a: string, b: string) {
  const max = Math.max(a.length, b.length);
  const out: { ch: string; diff: boolean }[] = [];
  for (let i = 0; i < max; i++) {
    out.push({ ch: b[i] ?? "·", diff: a[i] !== b[i] });
  }
  return out;
}

export default function HashFunction() {
  const [textA, setTextA] = useState("Hallo Welt");
  const [textB, setTextB] = useState("Hallo Welt!");
  const [hashA, setHashA] = useState("");
  const [hashB, setHashB] = useState("");
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    sha256(textA).then(setHashA);
  }, [textA]);

  useEffect(() => {
    sha256(textB).then(setHashB);
  }, [textB]);

  const diffCount = hashA && hashB ? diffChars(hashA, hashB).filter((c) => c.diff).length : 0;
  const diffPct = hashA && hashB ? Math.round((diffCount / hashA.length) * 100) : 0;

  return (
    <div className="lesson-card">
      <h2>Hash-Funktionen (SHA-256)</h2>

      <DepthBox variant="basic" title="Was ist ein Hash, in einem Satz?" defaultOpen>
        <p>
          Stell dir einen <strong>Mixer</strong> vor: Du wirfst irgendwas rein
          (ein Wort, ein Buch, einen Film) und raus kommt immer ein gleich
          großer, bunter Smoothie. Gleiche Zutaten → gleicher Smoothie.
          Eine winzige andere Zutat → komplett anderer Smoothie. Und das
          Wichtigste: <strong>aus dem Smoothie kannst du die Zutaten nicht
          zurückbekommen</strong>.
        </p>
        <p>
          Genau das macht eine Hash-Funktion mit Daten — sie erzeugt einen
          „Fingerabdruck", der immer gleich groß ist, egal wie groß die Eingabe.
        </p>
      </DepthBox>

      <p className="lesson-description">
        Etwas formaler: eine Hash-Funktion macht aus einem beliebig langen Text
        einen <strong>Fingerabdruck fester Länge</strong>. SHA-256 liefert immer
        256 Bit (= 64 Hex-Zeichen). Drei zentrale Eigenschaften:{" "}
        <strong>deterministisch</strong>, <strong>einweg</strong> (nicht
        umkehrbar) und <strong>kollisionsresistent</strong> (zwei verschiedene
        Eingaben sollten praktisch nie denselben Hash ergeben).
      </p>

      <div className="info-box">
        <strong>Wofür?</strong> Passwortspeicherung, Integritätsprüfung von Downloads,
        digitale Signaturen, Blockchains, Git-Commits – überall wo man prüfen will
        &bdquo;hat sich etwas verändert?&ldquo;, ohne den Inhalt selbst zu speichern.
      </div>

      <DepthBox variant="why" title="Warum braucht man das überhaupt?">
        <p>
          Stell dir vor, eine Website speichert dein Passwort im Klartext. Wenn
          die Datenbank geklaut wird, kennen die Angreifer dein Passwort — und
          wahrscheinlich auch dein E-Mail-Passwort, weil viele Leute Passwörter
          wiederverwenden.
        </p>
        <p>
          Speichert die Website stattdessen nur den <em>Hash</em>, kann sie beim
          Login prüfen „ergibt das eingegebene Passwort denselben Hash?" — ohne
          das Passwort selbst je zu kennen. Bei einem Datenleck haben die
          Angreifer nur die Fingerabdrücke, nicht die Originale.
        </p>
        <p>
          Dieselbe Idee löst noch mehr Probleme: „Wurde diese Datei unterwegs
          verändert?", „Sind diese zwei Dokumente identisch, ohne dass ich sie
          beide herumschicken muss?", „Wie verkette ich Blöcke fälschungssicher
          zu einer Blockchain?"
        </p>
      </DepthBox>

      <div className="input-group">
        <label>Eingabe A</label>
        <input
          type="text"
          value={textA}
          onChange={(e) => setTextA(e.target.value)}
          placeholder="Beliebiger Text..."
        />
        <div className="hash-output">{hashA || "…"}</div>
      </div>

      <div className="input-group">
        <label>Eingabe B</label>
        <input
          type="text"
          value={textB}
          onChange={(e) => setTextB(e.target.value)}
          placeholder="Leicht abweichender Text..."
        />
        <div className="hash-output">
          {hashB
            ? diffChars(hashA, hashB).map((c, i) => (
                <span key={i} className={c.diff ? "diff-char-diff" : "diff-char-same"}>
                  {c.ch}
                </span>
              ))
            : "…"}
        </div>
      </div>

      <div className={diffPct > 30 ? "success-box" : "info-box"}>
        <strong>Avalanche-Effekt:</strong> {diffCount} von {hashA.length || 64} Hex-Zeichen
        sind unterschiedlich ({diffPct} %). Schon eine winzige Änderung an der
        Eingabe verändert den Hash komplett – das ist gewollt und macht Hashes für
        Sicherheitszwecke nutzbar.
      </div>

      <DepthBox variant="deeper" title="Warum genau die Hälfte? (Avalanche, formal)">
        <p>
          Eine ideale kryptografische Hash-Funktion verhält sich wie eine
          <em> zufällige Orakel-Funktion</em>: jedes Bit der Ausgabe ist mit
          Wahrscheinlichkeit 50 % gesetzt, unabhängig von der Eingabe. Ändert
          sich auch nur ein Eingabe-Bit, kippt jedes Ausgabe-Bit mit
          Wahrscheinlichkeit 50 % — das ist das <strong>Strict Avalanche
          Criterion (SAC)</strong>.
        </p>
        <p>
          In Hex-Zeichen umgerechnet: zwei zufällige Hashes stimmen pro Zeichen
          nur mit Wahrscheinlichkeit 1/16 überein. Erwartete Übereinstimmung
          bei 64 Zeichen: 4 — also rund <strong>94 % unterschiedlich</strong>.
          Genau das siehst du oben.
        </p>
      </DepthBox>

      <h3>Eigenschaften im Überblick</h3>
      <ol className="step-list">
        <li>
          <strong>Deterministisch:</strong> Gleiche Eingabe → immer gleicher Hash.
        </li>
        <li>
          <strong>Einweg:</strong> Aus dem Hash lässt sich die Eingabe nicht
          zurückrechnen – nur durch Raten (Brute-Force).
        </li>
        <li>
          <strong>Kollisionsresistent:</strong> Es ist praktisch unmöglich, zwei
          verschiedene Eingaben mit demselben Hash zu finden.
        </li>
        <li>
          <strong>Schnell zu berechnen:</strong> Aber für Passwörter nimmt man
          absichtlich langsame Varianten (bcrypt, scrypt, Argon2).
        </li>
      </ol>

      <DepthBox variant="mistake" title="„Aber 2²⁵⁶ Möglichkeiten sind doch unknackbar…“">
        <p>
          Stimmt für direktes Erraten — aber nicht für <strong>Kollisionen</strong>.
          Dank des <em>Geburtstagsparadoxons</em> brauchst du nur etwa{" "}
          <code>√(2²⁵⁶) = 2¹²⁸</code> Versuche, um <em>irgendeine</em> Kollision
          zu finden. Das ist immer noch astronomisch viel, aber halb so viele
          Bits wie naiv gedacht.
        </p>
        <p>
          Deshalb gilt die Faustregel: ein <em>n</em>-Bit-Hash bietet nur{" "}
          <em>n/2</em> Bit Kollisionssicherheit. Genau aus diesem Grund ist
          SHA-1 (160 Bit → 80 Bit Sicherheit) heute zu schwach.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Wie ist SHA-256 innen aufgebaut?">
        <p>
          SHA-256 gehört zur Familie der <strong>Merkle–Damgård</strong>-Konstruktionen:
          die Eingabe wird gepaddet, in 512-Bit-Blöcke geteilt, und jeder Block
          wird zusammen mit dem bisherigen Zustand durch eine
          <em> Kompressionsfunktion</em> geschickt. Die besteht aus 64 Runden
          mit Bit-Rotationen, XORs, modularen Additionen und festen
          Konstanten (abgeleitet aus den Kubikwurzeln von Primzahlen).
        </p>
        <p>
          Die Konstruktion hat eine bekannte Schwäche: <em>Length-Extension</em>.
          Aus <code>H(secret ‖ msg)</code> kann ein Angreifer{" "}
          <code>H(secret ‖ msg ‖ padding ‖ extra)</code> berechnen, ohne das
          Secret zu kennen. Lösung: <strong>HMAC</strong> statt nackter Hash.
        </p>
      </DepthBox>

      <div className="warn-box">
        <strong>Achtung:</strong> MD5 und SHA-1 gelten als gebrochen – für
        Sicherheit immer mindestens SHA-256 nehmen. Für Passwörter nie reine
        Hashes, sondern <strong>Argon2</strong> oder <strong>bcrypt</strong> mit
        Salt.
      </div>

      <DepthBox variant="why" title="Warum für Passwörter ein „langsamer“ Hash?">
        <p>
          SHA-256 ist mit Absicht schnell — eine moderne GPU rechnet Milliarden
          pro Sekunde. Genau das wollen Angreifer beim <em>Brute-Forcen</em>
          geleakter Passwort-Datenbanken. Algorithmen wie
          <strong> Argon2</strong>, <strong>scrypt</strong> oder{" "}
          <strong>bcrypt</strong> sind absichtlich langsam und brauchen viel
          Speicher, damit massenhaftes Raten unbezahlbar wird.
        </p>
        <p>
          Plus <strong>Salt</strong>: ein zufälliger Wert pro Passwort sorgt
          dafür, dass zwei Nutzer mit demselben Passwort trotzdem
          unterschiedliche Hashes haben — Rainbow Tables nutzlos.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Wie alt ist SHA-256?">
        <p>
          SHA-256 wurde 2001 von der NSA entworfen und vom NIST standardisiert
          (FIPS 180-2), als Teil der SHA-2-Familie. Vorgänger SHA-1 (1995) wurde
          2017 öffentlichkeitswirksam gebrochen, als Google die erste
          praktische Kollision (<em>SHAttered</em>) demonstrierte. SHA-2 gilt
          weiterhin als sicher; daneben existiert seit 2015 SHA-3 mit einer
          ganz anderen Konstruktion (Keccak-Schwamm).
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Was du als nächstes anschauen kannst">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/hmac">HMAC</Link> — wie man Hashes nutzt, um
            Nachrichten <em>authentifizierbar</em> zu machen (löst das
            Length-Extension-Problem).
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/rsa">RSA</Link> — digitale Signaturen
            kombinieren Hash + asymmetrische Krypto: man signiert nicht die
            ganze Datei, sondern ihren Hash.
          </li>
          <li>
            <em>Passwort-Hashing (Argon2/bcrypt)</em> — kommt noch als eigene
            Lektion.
          </li>
          <li>
            <em>Merkle-Bäume & Blockchains</em> — kommt noch; zeigt, wie man
            mit Hashes ganze Datenstrukturen fälschungssicher verkettet.
          </li>
        </ul>
      </DepthBox>

      <button className="toggle-code" onClick={() => setShowCode(!showCode)}>
        {showCode ? "Code ausblenden" : "Implementierung anzeigen"}
      </button>

      {showCode && (
        <SyntaxHighlighter language="typescript" style={oneLight}>
          {implCode}
        </SyntaxHighlighter>
      )}
    </div>
  );
}

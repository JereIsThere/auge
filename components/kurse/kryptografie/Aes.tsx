"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";
import { KryptoQuelle } from "./KryptoQuelle";

async function aesEncrypt(plain: string, password: string): Promise<{ cipher: string; iv: string }> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password.padEnd(16, "x")).slice(0, 16),
    { name: "AES-GCM" }, false, ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, keyMaterial, enc.encode(plain)
  );
  const toHex = (b: Uint8Array) => Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
  return { cipher: toHex(new Uint8Array(cipher)), iv: toHex(iv) };
}

export default function Aes() {
  const [plain, setPlain] = useState("Geheim: das Treffen ist um 18 Uhr.");
  const [pw, setPw] = useState("hunter2");
  const [cipher, setCipher] = useState("");
  const [iv, setIv] = useState("");

  useEffect(() => {
    aesEncrypt(plain, pw).then(({ cipher, iv }) => { setCipher(cipher); setIv(iv); });
  }, [plain, pw]);

  return (
    <div className="lesson-card">
      <h2>AES — der Standard der symmetrischen Verschlüsselung</h2>

      <DepthBox variant="basic" title="Was macht AES, in einfach?" defaultOpen>
        <p>
          AES nimmt deine Daten in <strong>16-Byte-Häppchen</strong> und mischt
          jedes Häppchen so durcheinander, dass es ohne den Schlüssel wie
          purer Zufall aussieht. Dasselbe macht es beim Entschlüsseln
          rückwärts.
        </p>
        <p>
          Du gibst zwei Sachen rein — <em>Daten</em> und <em>Schlüssel</em> —
          und bekommst Bytes raus, die niemand ohne den Schlüssel lesen kann.
        </p>
      </DepthBox>

      <p className="lesson-description">
        AES (<strong>Advanced Encryption Standard</strong>, 2001) ist eine
        <strong> Blockchiffre</strong>: sie verschlüsselt Blöcke von genau
        128 Bit (= 16 Bytes) auf einmal. Schlüssel sind 128, 192 oder 256 Bit
        lang. AES steckt in <em>quasi allem</em>: HTTPS, WPA2/3-WLAN,
        verschlüsselte Festplatten, Signal, WhatsApp.
      </p>

      <h3>Live: AES-GCM im Browser</h3>
      <div className="input-group">
        <label>Klartext</label>
        <textarea value={plain} onChange={(e) => setPlain(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Passwort (wird zum Schlüssel)</label>
        <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} />
      </div>
      <div className="result-grid">
        <div className="result-box">
          <span className="result-label">IV (zufällig pro Verschlüsselung)</span>
          <span className="result-value mono" style={{ fontSize: "0.8rem" }}>{iv}</span>
        </div>
        <div className="result-box">
          <span className="result-label">Geheimtext (hex)</span>
          <span className="result-value mono" style={{ fontSize: "0.8rem" }}>{cipher}</span>
        </div>
      </div>
      <div className="info-box">
        Tipp: Ändere ein einziges Zeichen am Klartext — der Geheimtext ändert
        sich komplett. Drücke nochmal Enter im Passwort-Feld — auch ohne
        Klartext-Änderung sieht der Geheimtext anders aus, weil der{" "}
        <strong>IV</strong> jedes Mal frisch zufällig ist.
        <br />
        <em>Hinweis:</em> Diese Demo nutzt das Passwort vereinfacht direkt als
        Schlüssel. In echt leitet man den Schlüssel nie roh aus dem Passwort ab,
        sondern über eine KDF wie PBKDF2, HKDF oder Argon2.
      </div>

      <DepthBox variant="why" title="Warum hat AES sich durchgesetzt?">
        <p>
          1997 startete das NIST einen offenen Wettbewerb für einen
          DES-Nachfolger. 15 Algorithmen aus aller Welt traten an, wurden
          jahrelang öffentlich von Kryptografen zerlegt. Gewinner 2000: das
          belgische <em>Rijndael</em> von Daemen und Rijmen — wegen guter
          Sicherheit, guter Performance auf allen Plattformen und einfacher
          Beschreibung.
        </p>
        <p>
          Moderne CPUs haben sogar dedizierte AES-Instruktionen (AES-NI), die
          Verschlüsselung mit mehreren Gigabyte pro Sekunde erlauben — ohne
          merkliche CPU-Last.
        </p>
      </DepthBox>

      <KryptoQuelle
        id="nist-fips-197"
        kernaussagen={[
          "Rijndael gewann 2000 den offenen NIST-Wettbewerb gegen 14 andere Kandidaten — nach 3 Jahren öffentlicher Kryptoanalyse.",
          "AES definiert drei Schlüssellängen: 128, 192 und 256 Bit, mit 10, 12 bzw. 14 Runden.",
          "Der Standard ist frei verfügbar und beschreibt den Algorithmus vollständig — kein Security-through-Obscurity.",
        ]}
      />

      <DepthBox variant="deeper" title="Wie funktioniert AES innen?">
        <p>
          Ein 16-Byte-Block wird als 4×4-Matrix angeordnet. Dann laufen 10–14
          Runden (je nach Schlüssellänge), die jeweils 4 Schritte machen:
        </p>
        <ol className="step-list">
          <li>
            <strong>SubBytes:</strong> Jedes Byte wird durch ein anderes
            ersetzt — über eine feste, nichtlineare Tabelle (die <em>S-Box</em>).
            Sorgt für „Konfusion".
          </li>
          <li>
            <strong>ShiftRows:</strong> Die Zeilen der Matrix werden zyklisch
            verschoben (Zeile 0 gar nicht, Zeile 1 um 1, etc.).
          </li>
          <li>
            <strong>MixColumns:</strong> Jede Spalte wird mit einer festen
            Matrix multipliziert (im Galois-Körper GF(2⁸)). Sorgt für
            „Diffusion" — jedes Eingabe-Byte beeinflusst alle Ausgabe-Bytes.
          </li>
          <li>
            <strong>AddRoundKey:</strong> XOR mit einem aus dem Hauptschlüssel
            abgeleiteten Rundenschlüssel.
          </li>
        </ol>
        <p>
          Die <em>Konfusion + Diffusion</em>-Kombination geht auf Shannon zurück
          und ist das Designprinzip jeder modernen Blockchiffre.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="„AES allein reicht zum Verschlüsseln“">
        <p>
          Nein. AES verschlüsselt <em>einen Block</em>. Für eine Nachricht
          mit mehreren Blöcken brauchst du einen <strong>Betriebsmodus</strong>{" "}
          (CBC, CTR, GCM…) — der ist mindestens so wichtig wie AES selbst.
          Wähle den falschen, und AES wird unsicher.
        </p>
        <p>
          Außerdem brauchst du <strong>Authentizität</strong>: AES allein
          schützt vor Mitlesen, aber nicht vor <em>gezielter Manipulation</em>
          des Geheimtexts. Lösung: <strong>AES-GCM</strong> oder ein separater
          MAC. Daher der heutige Standard: AES-GCM oder ChaCha20-Poly1305.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Vorher: DES und 3DES">
        <p>
          Davor regierte <strong>DES</strong> (1977) mit nur 56 Bit Schlüssel.
          In den 90ern wurde DES per Brute-Force in Tagen geknackt — die
          dedizierte EFF-Maschine <em>Deep Crack</em> brauchte 1998 rund
          56 Stunden, zusammen mit dem distributed.net-Netz 1999 nur noch
          22 Stunden. <strong>3DES</strong> (DES dreifach hintereinander) war
          eine Notlösung, bis AES kam. 3DES ist seit 2023 offiziell verboten
          für neue Anwendungen.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Was als nächstes">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/modi">Betriebsmodi & Padding</Link> — wie
            man AES auf längere Nachrichten anwendet (entscheidend!).
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/xor">XOR</Link> — der innere Klebstoff aller
            Modi (CTR und GCM sind im Kern XOR).
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/symm-asymm">Symm. vs. asymm.</Link> — warum
            AES allein das Schlüsseltausch-Problem nicht löst.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

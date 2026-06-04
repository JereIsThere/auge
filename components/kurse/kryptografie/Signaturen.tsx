"use client";

import { useState } from "react";
import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";
import { KryptoQuelle } from "./KryptoQuelle";

type KeyPair = { publicKey: CryptoKey; privateKey: CryptoKey };

async function genKeys(): Promise<KeyPair> {
  return await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  ) as KeyPair;
}

async function sign(privateKey: CryptoKey, msg: string): Promise<string> {
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(msg)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verify(publicKey: CryptoKey, msg: string, sigHex: string): Promise<boolean> {
  const sig = new Uint8Array(sigHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  return await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    publicKey,
    sig,
    new TextEncoder().encode(msg)
  );
}

export default function Signaturen() {
  const [keys, setKeys] = useState<KeyPair | null>(null);
  const [msg, setMsg] = useState("Ich überweise 100 € an Bob.");
  const [tampered, setTampered] = useState("");
  const [sig, setSig] = useState("");
  const [valid, setValid] = useState<null | boolean>(null);

  async function makeKeys() {
    const k = await genKeys();
    setKeys(k);
    setSig("");
    setValid(null);
  }

  async function doSign() {
    if (!keys) return;
    const s = await sign(keys.privateKey, msg);
    setSig(s);
    setTampered(msg);
    setValid(null);
  }

  async function doVerify() {
    if (!keys || !sig) return;
    setValid(await verify(keys.publicKey, tampered, sig));
  }

  return (
    <div className="lesson-card">
      <h2>Digitale Signaturen</h2>

      <DepthBox variant="basic" title="Was ist eine digitale Signatur?" defaultOpen>
        <p>
          Wie eine Unterschrift unter einem Dokument — nur fälschungssicher
          und mathematisch. Du benutzt deinen <strong>privaten Schlüssel</strong>,
          um eine Nachricht zu „unterschreiben", und jeder kann mit deinem{" "}
          <strong>öffentlichen Schlüssel</strong> prüfen, dass:
        </p>
        <ul>
          <li>die Nachricht wirklich von dir kommt (Authentizität),</li>
          <li>sie unterwegs nicht verändert wurde (Integrität),</li>
          <li>du sie nicht später abstreiten kannst (Nichtabstreitbarkeit).</li>
        </ul>
      </DepthBox>

      <h3>Live: ECDSA im Browser</h3>
      <p className="lesson-description">
        Wir erzeugen ein Schlüsselpaar, unterschreiben eine Nachricht und
        prüfen die Signatur. Probier dann: <em>verändere die Nachricht</em> —
        die Verifikation schlägt fehl.
      </p>

      {!keys && (
        <button className="toggle-code" onClick={makeKeys}>
          Schlüsselpaar erzeugen
        </button>
      )}

      {keys && (
        <>
          <div className="success-box">
            ✓ Schlüsselpaar (ECDSA / P-256) erzeugt. Der private bleibt im
            Browser, der öffentliche dürfte veröffentlicht werden.
          </div>

          <div className="input-group">
            <label>Nachricht zum Unterschreiben</label>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <button className="toggle-code" onClick={doSign}>
            Unterschreiben
          </button>

          {sig && (
            <>
              <div className="input-group">
                <label>Signatur (hex)</label>
                <div className="hash-output">{sig}</div>
              </div>

              <div className="input-group">
                <label>
                  Nachricht beim Empfänger (versuch sie zu manipulieren!)
                </label>
                <textarea
                  value={tampered}
                  onChange={(e) => setTampered(e.target.value)}
                />
              </div>
              <button className="toggle-code" onClick={doVerify}>
                Signatur prüfen
              </button>

              {valid !== null && (
                <div className={valid ? "success-box" : "warn-box"}>
                  {valid
                    ? "✓ Signatur gültig — Nachricht stammt vom Inhaber des privaten Schlüssels und ist unverändert."
                    : "✗ Signatur ungültig — Nachricht wurde verändert oder gehört nicht zu diesem Schlüssel."}
                </div>
              )}
            </>
          )}
        </>
      )}

      <DepthBox variant="why" title="Wofür braucht man das im Alltag?">
        <ul>
          <li>
            <strong>Software-Updates:</strong> Dein OS prüft, dass das Update
            wirklich von Apple/Microsoft signiert ist — nicht von einem
            Angreifer im Netzwerk.
          </li>
          <li>
            <strong>TLS-Zertifikate:</strong> Eine Zertifizierungsstelle
            unterschreibt, dass dieser öffentliche Schlüssel wirklich zu
            „bank.de" gehört.
          </li>
          <li>
            <strong>Git-Commits:</strong> Mit <code>git commit -S</code>{" "}
            kannst du beweisen, dass ein Commit wirklich von dir kam.
          </li>
          <li>
            <strong>Kryptowährungen:</strong> Eine Bitcoin-Transaktion ist
            nichts anderes als eine signierte Nachricht „ich verschicke X an Y".
          </li>
          <li>
            <strong>PDF-/Vertrags-Signaturen, JWT-Tokens, …</strong>
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="deeper" title="Verschlüsseln ≠ signieren">
        <p>
          Bei RSA sieht's so aus, als wären beide Operationen „dasselbe rückwärts" —
          das stimmt nur grob. In der Praxis:
        </p>
        <ul>
          <li>
            <strong>Verschlüsseln:</strong> Empfänger-Public-Key wird benutzt,
            nur Empfänger kann mit seinem Private-Key entschlüsseln.
          </li>
          <li>
            <strong>Signieren:</strong> Absender-Private-Key wird benutzt,
            jeder kann mit dem Public-Key prüfen.
          </li>
        </ul>
        <p>
          Außerdem: man signiert nicht die ganze Nachricht, sondern ihren
          <strong> Hash</strong> (sonst wäre die Signatur so groß wie die
          Nachricht und unfassbar langsam). Das ist auch der Grund, warum
          Hash-Kollisionen für Signaturen so gefährlich sind.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Die berühmten Signatur-Fails">
        <ul>
          <li>
            <strong>PS3 (2010):</strong> Sony nutzte für ECDSA denselben
            Zufallswert <em>k</em> in jeder Signatur. Aus zwei Signaturen ließ
            sich der private Master-Schlüssel direkt ausrechnen. fail0verflow
            demonstrierte das auf der CCC-Konferenz.
          </li>
          <li>
            <strong>Bleichenbacher-Angriff (1998, 2017 neu):</strong> RSA-Signaturen
            ohne ordentliches Padding ließen sich fälschen — Angreifer konnten
            beliebige Werte als „signiert" durchgehen lassen.
          </li>
          <li>
            <strong>SHA-1-Kollisionen (SHAttered 2017):</strong> Mit dem ersten
            praktischen Bruch von SHA-1 konnte man zwei PDFs basteln, die
            denselben Hash hatten — also dieselbe Signatur. Eine harmlose
            Version signieren, später durch eine bösartige austauschen.
          </li>
        </ul>
      </DepthBox>

      <KryptoQuelle
        id="nist-fips-186-5"
        kernaussagen={[
          "FIPS 186-5 (2023) standardisiert ECDSA und EdDSA als offizielle Signaturalgorithmen — DSA selbst wird darin als veraltet markiert und soll nicht mehr neu eingesetzt werden.",
          "ECDSA mit P-256 bietet bei 256-Bit-Schlüsseln Sicherheit vergleichbar mit 3072-Bit-RSA — deutlich kompaktere Signaturen bei gleicher Stärke.",
          "EdDSA (Ed25519) wurde in FIPS 186-5 neu aufgenommen: deterministisch, schnell und ohne Anfälligkeit für schlechten Zufall wie klassisches ECDSA.",
        ]}
      />

      <DepthBox variant="related" title="Wo Signaturen weiterwirken">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/hash">Hashes</Link> — was wirklich signiert
            wird.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/rsa">RSA</Link> & <Link href="/thema/kryptografie/lektionen/ecc">ECC</Link>{" "}
            — die zwei Familien für Signaturen.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/tls">TLS & PKI</Link> — Zertifikate sind
            signierte Aussagen über Public Keys.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/components/lessons/lesson.css";
import { KryptoQuelle } from "./KryptoQuelle";

async function hmacSha256(key: string, message: string): Promise<string> {
  if (!key) return "";
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(message)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const implCode = `// HMAC-SHA256 mit Web Crypto API
async function hmac(key: string, message: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(message)
  );
  return [...new Uint8Array(sig)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}`;

export default function Hmac() {
  const [message, setMessage] = useState("Überweise 100 €");
  const [key, setKey] = useState("geheim123");
  const [tampered, setTampered] = useState("Überweise 10000 €");
  const [tag, setTag] = useState("");
  const [tagTampered, setTagTampered] = useState("");

  useEffect(() => {
    hmacSha256(key, message).then(setTag);
    hmacSha256(key, tampered).then(setTagTampered);
  }, [key, message, tampered]);

  return (
    <div className="lesson-card">
      <h2>HMAC – Nachrichten authentifizieren</h2>
      <p className="lesson-description">
        Ein Hash allein zeigt nur, ob sich eine Nachricht verändert hat – aber
        jeder kann einen Hash neu berechnen. <strong>HMAC</strong> (Hash-based
        Message Authentication Code) kombiniert die Nachricht mit einem
        <strong> geheimen Schlüssel</strong>. Nur wer den Schlüssel kennt, kann den
        Tag erzeugen oder prüfen.
      </p>

      <div className="info-box">
        <strong>Wozu?</strong> API-Webhooks (Stripe, GitHub), JWT-Signaturen,
        Cookies vor Manipulation schützen, Daten zwischen Microservices vertrauen
        können – HMAC ist überall, wo Integrität <em>und</em> Authentizität
        zählen, ein gemeinsames Geheimnis aber okay ist.
      </div>

      <div className="input-group">
        <label>Geheimer Schlüssel (beide Seiten kennen ihn)</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Originalnachricht</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="hash-output">{tag || "…"}</div>
      </div>

      <div className="input-group">
        <label>Manipulierte Nachricht (Angreifer ohne Schlüssel)</label>
        <input
          type="text"
          value={tampered}
          onChange={(e) => setTampered(e.target.value)}
        />
        <div className="hash-output">{tagTampered || "…"}</div>
      </div>

      {tag && tagTampered && (
        <div className={tag === tagTampered ? "info-box" : "warn-box"}>
          {tag === tagTampered ? (
            <>Tags identisch – Nachricht unverändert.</>
          ) : (
            <>
              <strong>Tags unterschiedlich →</strong> Der Empfänger erkennt sofort,
              dass die Nachricht manipuliert wurde. Ohne den Schlüssel kann der
              Angreifer keinen gültigen Tag für die neue Nachricht erzeugen.
            </>
          )}
        </div>
      )}

      <h3>Hash vs. HMAC</h3>
      <dl className="kv-table">
        <dt>Hash (SHA-256)</dt>
        <dd>Zeigt nur, dass etwas <em>verändert</em> wurde. Jeder kann ihn neu berechnen.</dd>
        <dt>HMAC</dt>
        <dd>Zeigt, dass die Nachricht von jemandem mit dem geheimen Schlüssel kommt.</dd>
        <dt>Digitale Signatur (RSA / Ed25519)</dt>
        <dd>Wie HMAC, aber asymmetrisch – jeder kann prüfen, nur der Inhaber des privaten Schlüssels kann signieren.</dd>
      </dl>

      <div className="warn-box">
        <strong>Klassischer Fehler:</strong> Beim Vergleich von Tags{" "}
        <strong>nie</strong> <code>a === b</code> mit normaler String-Gleichheit
        nutzen – das kann über Timing-Unterschiede angreifbar sein. Stattdessen
        eine <em>constant-time comparison</em> verwenden.
      </div>

      <KryptoQuelle
        id="rfc-2104"
        kernaussagen={[
          "RFC 2104 definiert HMAC als doppelte Hash-Konstruktion: H((K ⊕ opad) ‖ H((K ⊕ ipad) ‖ m)) — schützt damit vor Length-Extension-Angriffen auf nackte Hashes.",
          "HMAC braucht nicht einmal Kollisionsresistenz der Hash-Funktion — es genügt, dass deren Kompressionsfunktion ein PRF ist. Deshalb gilt selbst HMAC-MD5 als MAC weiterhin als sicher, obwohl MD5 kollisionsgebrochen ist.",
          "Krawczyk et al. bewiesen die Sicherheit von HMAC formal — eine seltene Eigenschaft für praktisch weit verbreitete Konstruktionen.",
        ]}
      />

      <SyntaxHighlighter language="typescript" style={oneLight}>
        {implCode}
      </SyntaxHighlighter>
    </div>
  );
}

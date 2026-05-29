"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/components/lessons/lesson.css";

function xorEncrypt(text: string, key: string): string {
  if (!key) return text;
  return text
    .split("")
    .map((char, i) => {
      const keyChar = key[i % key.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    })
    .join("");
}

function toHex(str: string): string {
  return Array.from(str)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

const implCode = `function xorEncrypt(text: string, key: string): string {
  return text.split("").map((char, i) => {
    const keyChar = key[i % key.length];
    return String.fromCharCode(
      char.charCodeAt(0) ^ keyChar.charCodeAt(0)
    );
  }).join("");
}

// XOR ist selbstinvers: encrypt(encrypt(text, key), key) === text`;

export default function XorCipher() {
  const [text, setText] = useState("Hallo");
  const [key, setKey] = useState("K");
  const [showCode, setShowCode] = useState(false);

  const activeKey = key || "A";
  const encrypted = xorEncrypt(text, activeKey);
  const decrypted = xorEncrypt(encrypted, activeKey);

  return (
    <div className="lesson-card">
      <h2>XOR-Verschlüsselung</h2>
      <p className="lesson-description">
        XOR (exklusives Oder) ist eine fundamentale Bitoperation in der
        Kryptografie. Das Schöne: Verschlüsselung und Entschlüsselung sind
        identisch — XOR ist selbstinvers.
      </p>

      <div className="input-group">
        <label>Klartext</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text eingeben..."
        />
      </div>

      <div className="input-group">
        <label>Schlüssel</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Schlüssel eingeben..."
        />
      </div>

      <div className="xor-table">
        <div className="xor-row header">
          <span>Zeichen</span>
          <span>Klartext (Hex)</span>
          <span>Schlüssel (Hex)</span>
          <span>XOR (Hex)</span>
        </div>
        {text.split("").map((char, i) => {
          const keyChar = activeKey[i % activeKey.length];
          const result = char.charCodeAt(0) ^ keyChar.charCodeAt(0);
          return (
            <div key={i} className="xor-row">
              <span className="mono">{char}</span>
              <span className="mono">{char.charCodeAt(0).toString(16).padStart(2, "0")}</span>
              <span className="mono">{keyChar.charCodeAt(0).toString(16).padStart(2, "0")}</span>
              <span className="mono xor-result">{result.toString(16).padStart(2, "0")}</span>
            </div>
          );
        })}
      </div>

      <div className="result-grid">
        <div className="result-box">
          <span className="result-label">Verschlüsselt (Hex)</span>
          <span className="result-value encrypted mono">{toHex(encrypted)}</span>
        </div>
        <div className="result-box">
          <span className="result-label">Wieder entschlüsselt</span>
          <span className="result-value decrypted">{decrypted}</span>
        </div>
      </div>

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

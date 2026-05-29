"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/components/lessons/lesson.css";

function caesarEncrypt(text: string, shift: number): string {
  return text
    .split("")
    .map((char) => {
      if (/[a-z]/.test(char))
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      if (/[A-Z]/.test(char))
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      return char;
    })
    .join("");
}

const implCode = `function caesarEncrypt(text: string, shift: number): string {
  return text.split("").map((char) => {
    if (/[a-z]/.test(char))
      return String.fromCharCode(
        ((char.charCodeAt(0) - 97 + shift) % 26) + 97
      );
    if (/[A-Z]/.test(char))
      return String.fromCharCode(
        ((char.charCodeAt(0) - 65 + shift) % 26) + 65
      );
    return char;
  }).join("");
}`;

export default function CaesarCipher() {
  const [text, setText] = useState("Hallo Welt");
  const [shift, setShift] = useState(3);
  const [showCode, setShowCode] = useState(false);

  const encrypted = caesarEncrypt(text, shift);
  const decrypted = caesarEncrypt(encrypted, 26 - shift);

  return (
    <div className="lesson-card">
      <h2>Caesar-Verschlüsselung</h2>
      <p className="lesson-description">
        Eine der ältesten Verschlüsselungsmethoden: Jeder Buchstabe wird um eine
        feste Anzahl von Stellen im Alphabet verschoben. Julius Caesar nutzte
        eine Verschiebung von 3.
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
        <label>Verschiebung: <strong>{shift}</strong></label>
        <input
          type="range"
          min={1}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
        />
      </div>

      <div className="result-grid">
        <div className="result-box">
          <span className="result-label">Verschlüsselt</span>
          <span className="result-value encrypted">{encrypted}</span>
        </div>
        <div className="result-box">
          <span className="result-label">Entschlüsselt</span>
          <span className="result-value decrypted">{decrypted}</span>
        </div>
      </div>

      <div className="alphabet-visual">
        {Array.from({ length: 26 }, (_, i) => {
          const plain = String.fromCharCode(65 + i);
          const cipher = String.fromCharCode(((i + shift) % 26) + 65);
          return (
            <div key={i} className="char-pair">
              <span className="plain-char">{plain}</span>
              <span className="cipher-arrow">↓</span>
              <span className="cipher-char">{cipher}</span>
            </div>
          );
        })}
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

"use client";

import { useState, useMemo } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

const DEFAULT_TEXT = `Retrieval-Augmented Generation kombiniert klassisches Information Retrieval mit moderner Generierung durch Large Language Models. Die zentrale Idee ist einfach: Bevor das Modell antwortet, wird eine Wissensbasis nach relevanten Dokumenten durchsucht. Diese Dokumente werden dem Modell als Kontext mitgegeben.

Die Herausforderung dabei: Wie zerlegt man die Wissensbasis in durchsuchbare Einheiten? Zu klein, und der Kontext geht verloren. Zu groß, und das Embedding wird unscharf. Hier kommt Chunking ins Spiel.

Typische Chunk-Größen liegen zwischen 200 und 1000 Tokens. Ein Overlap zwischen aufeinanderfolgenden Chunks verhindert, dass wichtige Information genau an einer Grenze abgeschnitten wird.`;

function chunkText(text: string, size: number, overlap: number): string[] {
  if (size <= 0) return [text];
  const safeOverlap = Math.min(overlap, size - 1);
  const stride = Math.max(1, size - safeOverlap);
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += stride) {
    chunks.push(text.slice(i, i + size));
    if (i + size >= text.length) break;
  }
  return chunks;
}

export default function Chunking() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [size, setSize] = useState(180);
  const [overlap, setOverlap] = useState(40);

  const chunks = useMemo(() => chunkText(text, size, overlap), [text, size, overlap]);

  return (
    <div className="lesson-card">
      <h2>Chunking</h2>
      <p className="lesson-description">
        Bevor ein Dokument durchsuchbar wird, muss es in kleinere Stücke
        zerlegt werden — Chunks. Die Größe und der Überlapp sind die zwei
        wichtigsten Stellschrauben.
      </p>

      <div className="input-group">
        <label>Dokument</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
      </div>

      <div className="result-grid">
        <div className="input-group">
          <label>Chunk-Größe: {size} Zeichen</label>
          <input
            type="range"
            min={60}
            max={400}
            step={10}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="input-group">
          <label>Overlap: {overlap} Zeichen</label>
          <input
            type="range"
            min={0}
            max={Math.max(0, size - 10)}
            step={5}
            value={overlap}
            onChange={(e) => setOverlap(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      <div className="success-box">
        <strong>{chunks.length}</strong> Chunk{chunks.length === 1 ? "" : "s"}
        {" "}
        bei einer durchschnittlichen Länge von ~{Math.round(text.length / Math.max(1, chunks.length))}{" "}
        Zeichen.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {chunks.map((c, i) => (
          <div key={i} className="result-box">
            <div className="result-label">Chunk {i + 1}</div>
            <div style={{ fontSize: "0.88rem", lineHeight: 1.55 }}>{c}</div>
          </div>
        ))}
      </div>

      <DepthBox variant="why" title="Warum überhaupt überlappen?">
        Ohne Overlap kann ein wichtiger Satz genau an der Chunk-Grenze
        durchgeschnitten werden — das Embedding eines Chunks &bdquo;…in den
        Prompt&ldquo; bedeutet etwas anderes als &bdquo;in den Prompt eingebaut
        und mit Quellenangabe versehen&ldquo;. Overlap (typischerweise 10–20 %
        der Chunk-Größe) sorgt dafür, dass beide Varianten an einem Chunk-Rand
        landen.
      </DepthBox>

      <DepthBox variant="mistake" title="Naives zeichenbasiertes Chunking">
        Was du hier siehst, schneidet stumpf nach Zeichenzahl — Sätze, Absätze
        und sogar Wörter werden mitten durchgeschnitten. In der Praxis chunkt
        man besser <em>semantisch</em>: an Satz- oder Absatzgrenzen,
        Markdown-Headings, oder mit einem rekursiven Splitter (LangChain
        <code>RecursiveCharacterTextSplitter</code>), der mehrere Separatoren
        durchprobiert.
      </DepthBox>

      <DepthBox variant="deeper" title="Token vs. Zeichen">
        LLMs zählen in <em>Tokens</em>, nicht in Zeichen. Ein Token ist
        durchschnittlich ~4 Zeichen (Englisch) bzw. ~2 Zeichen (Deutsch).
        Embedding-Modelle haben harte Token-Limits (typisch 8.192 für
        text-embedding-3-small). Wenn du Chunks an Token-Grenzen schneiden
        willst, brauchst du einen Tokenizer wie <code>tiktoken</code>.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Embedding-Limit (du kannst nicht beliebig große Chunks einbetten),
        Kontextfenster (zu viele große Chunks fressen den LLM-Kontext), und
        Re-Ranking (mit Cross-Encodern auf den Top-50-Chunks Sinn der
        Reihenfolge wiederherstellen).
      </DepthBox>
    </div>
  );
}

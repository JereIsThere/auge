"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

async function sha(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12); // shortened for display
}

async function buildTree(leaves: string[]): Promise<string[][]> {
  const levels: string[][] = [];
  let layer = await Promise.all(leaves.map((l) => sha(l)));
  levels.push(layer);
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const a = layer[i];
      const b = layer[i + 1] ?? layer[i];
      next.push(await sha(a + b));
    }
    layer = next;
    levels.push(layer);
  }
  return levels;
}

export default function Merkle() {
  const [items, setItems] = useState(["Alice→Bob: 5€", "Bob→Carol: 2€", "Carol→Dan: 1€", "Dan→Alice: 3€"]);
  const [tree, setTree] = useState<string[][]>([]);

  useEffect(() => {
    buildTree(items).then(setTree);
  }, [items]);

  function changeItem(i: number, v: string) {
    const next = [...items];
    next[i] = v;
    setItems(next);
  }

  return (
    <div className="lesson-card">
      <h2>Merkle-Bäume & Blockchains</h2>

      <DepthBox variant="basic" title="Was ist ein Merkle-Baum?" defaultOpen>
        <p>
          Ein Stammbaum aus Hashes. Du hasht jede Transaktion einzeln (die
          Blätter), dann hasht du je zwei Hashes zusammen (die Äste), und
          immer so weiter — bis ganz oben ein einziger Hash steht, die{" "}
          <strong>Wurzel</strong>.
        </p>
        <p>
          Magie: ändert sich irgendwas an irgendeiner Transaktion, ändert sich
          die Wurzel. Sie ist ein Fingerabdruck der gesamten Datenmenge —
          nur 32 Bytes lang.
        </p>
      </DepthBox>

      <h3>Live: Merkle-Baum aus 4 Transaktionen</h3>

      {items.map((it, i) => (
        <div key={i} className="input-group">
          <label>Transaktion {i + 1}</label>
          <input type="text" value={it} onChange={(e) => changeItem(i, e.target.value)} />
        </div>
      ))}

      {tree.length > 0 && (
        <div className="info-box" style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.78rem" }}>
          {tree
            .slice()
            .reverse()
            .map((layer, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <strong>
                  {i === 0 ? "Root" : i === tree.length - 1 ? "Leaves" : `Level ${tree.length - 1 - i}`}:{" "}
                </strong>
                {layer.join("  •  ")}
              </div>
            ))}
        </div>
      )}

      <div className="warn-box">
        Ändere eine Transaktion — beobachte, wie die Wurzel oben sich verändert.
        Das ist die Basis von Blockchains und Git.
      </div>

      <DepthBox variant="why" title="Wofür der ganze Aufwand?">
        <ul>
          <li>
            <strong>Effiziente Beweise:</strong> Will jemand zeigen „Transaktion
            X ist Teil dieses Blocks", braucht er nur einen{" "}
            <em>Merkle-Beweis</em> — log₂(n) Hashes. Bei 1 Million Transaktionen:
            20 Hashes statt 1 Million. Light-Clients (z. B. Bitcoin auf dem
            Handy) machen genau das.
          </li>
          <li>
            <strong>Integrität großer Datenmengen:</strong> Statt eine ganze
            Datenbank zu vergleichen, vergleichen zwei Knoten nur ihre
            Wurzeln. Bei Unterschied: rekursiv nach unten, bis die abweichende
            Stelle gefunden ist.
          </li>
          <li>
            <strong>Inhalts-Adressierung:</strong> Git, IPFS, Docker-Layers — alle
            adressieren Daten über ihren Hash. Merkle-Strukturen erlauben das
            effizient für ganze Verzeichnisbäume.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="deeper" title="Blockchain = Merkle-Baum + Hash-Kette">
        <p>
          Eine Blockchain besteht aus zwei Hash-Strukturen:
        </p>
        <ol className="step-list">
          <li>
            <strong>Innerhalb eines Blocks:</strong> Die Transaktionen werden
            zu einem Merkle-Baum verdichtet. Im Block-Header steht nur die
            Wurzel.
          </li>
          <li>
            <strong>Zwischen Blöcken:</strong> Jeder Block-Header enthält den
            Hash des vorigen Blocks. Eine simple verkettete Liste — aber
            kryptografisch.
          </li>
        </ol>
        <p>
          Folge: ändert ein Angreifer eine alte Transaktion, ändert sich deren
          Block-Hash, also auch der Verweis im nächsten Block, also dessen
          Hash, etc. — die <em>gesamte</em> Kette ab da müsste neu berechnet
          werden. Bei Bitcoin kommt dann noch Proof-of-Work obendrauf, was das
          praktisch unmöglich macht.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Wer hat das erfunden?">
        <p>
          <strong>Ralph Merkle</strong>, 1979 in seiner Stanford-Doktorarbeit —
          eigentlich als Mittel für effiziente digitale Signaturen{" "}
          (<em>Merkle-Signatures</em>, eines der ersten Public-Key-Verfahren
          überhaupt). Die Datenstruktur fand erst Jahrzehnte später Anwendung
          in Git (2005) und Bitcoin (2008).
        </p>
        <p>
          Ironie der Geschichte: Merkle-Signaturen sind heute wieder
          hochaktuell — als <strong>Post-Quantum</strong>-Verfahren, weil sie
          nur Hashes brauchen und gegen Shor's Algorithmus immun sind.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Weiterführend">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/hash">Hashes</Link> — der Baustein für
            alles hier.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/signaturen">Signaturen</Link> — jede
            Bitcoin-Transaktion ist eine ECDSA-Signatur auf einem Hash.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/post-quantum">Post-Quantum</Link> —
            Hash-basierte Signaturen sind quantenresistent.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

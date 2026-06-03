"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const HTML_BEISPIEL = `<article class="profil">
  <img src="avatar.png" alt="Foto von Ada">
  <h2>Ada Lovelace</h2>
  <p class="rolle">Erste Programmiererin</p>
  <button>Folgen</button>
</article>`;

const CSS_BEISPIEL = `.profil {
  max-width: 240px;
  padding: 20px;
  border-radius: 14px;
  background: #eef2ff;
  text-align: center;
  font-family: system-ui, sans-serif;
}
.profil img  { width: 72px; border-radius: 50%; }
.profil h2   { margin: 12px 0 2px; font-size: 1.1rem; }
.rolle       { color: #6366f1; font-size: 0.85rem; }
.profil button {
  margin-top: 12px;
  padding: 8px 18px;
  border: 0;
  border-radius: 999px;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
}`;

export default function Grundlagen() {
  const [css, setCss] = useState(true);

  // Inline-Styles, die das obige CSS nachbilden — nur aktiv, wenn css === true.
  const cardStyle = css
    ? {
        maxWidth: 240,
        padding: 20,
        borderRadius: 14,
        background: "#eef2ff",
        textAlign: "center" as const,
        fontFamily: "system-ui, sans-serif",
        margin: "0 auto",
      }
    : {};

  return (
    <div className="lesson-card">
      <h2>Was HTML &amp; CSS sind</h2>
      <p className="lesson-description">
        Jede Webseite besteht aus zwei Schichten, die nichts voneinander wissen
        müssen: <strong>HTML</strong> sagt, <em>was</em> da ist (Überschrift,
        Absatz, Bild, Knopf). <strong>CSS</strong> sagt, <em>wie</em> es
        aussieht (Farbe, Abstand, Größe, Anordnung). Trennst du die beiden,
        kannst du das Aussehen komplett umbauen, ohne ein einziges Wort am
        Inhalt zu ändern.
      </p>

      <div className="info-box">
        <strong>Merksatz:</strong> HTML ist das Skelett, CSS die Kleidung.
        Ein Skelett steht auch nackt — es sieht nur nicht gut aus.
      </div>

      <h3>Die drei Beteiligten</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🧱 HTML</div>
          <div className="actor-row">
            Markup-Sprache. Verschachtelte <span className="mono">&lt;tags&gt;</span>{" "}
            geben dem Inhalt <em>Bedeutung</em> und <em>Struktur</em>. Keine
            Logik, keine Schleifen — nur „hier ist eine Überschrift, da ein
            Absatz".
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🎨 CSS</div>
          <div className="actor-row">
            Stylesheet-Sprache. Regeln der Form{" "}
            <span className="mono">Selektor &#123; eigenschaft: wert &#125;</span>{" "}
            wählen HTML-Elemente aus und geben ihnen Aussehen und Position.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">🌐 Browser</div>
          <div className="actor-row">
            Liest beides, baut daraus einen Baum (das DOM), legt das CSS drüber
            und malt das Ergebnis auf den Bildschirm. Der Regisseur.
          </div>
        </div>
      </div>

      <h3>Dasselbe HTML — einmal mit, einmal ohne CSS</h3>
      <p>
        Klick den Schalter: der <strong>Inhalt bleibt identisch</strong>, nur
        das Stylesheet wird an- und abgeschaltet. Genau diese Trennung ist der
        ganze Trick.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button
          type="button"
          className={`hc-chip ${css ? "active" : ""}`}
          onClick={() => setCss(true)}
        >
          CSS an
        </button>
        <button
          type="button"
          className={`hc-chip ${!css ? "active" : ""}`}
          onClick={() => setCss(false)}
        >
          CSS aus
        </button>
      </div>

      <div className="hc-preview">
        <div className="hc-preview-label">So zeigt der Browser es an</div>
        <article style={cardStyle}>
          <div
            aria-hidden
            style={{
              width: css ? 72 : 56,
              height: css ? 72 : 56,
              borderRadius: css ? "50%" : 0,
              background: "#c7d2fe",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              margin: css ? "0 auto" : 0,
            }}
          >
            👩‍💻
          </div>
          <h2
            style={
              css
                ? { margin: "12px 0 2px", fontSize: "1.1rem" }
                : { fontSize: "1.5rem", margin: "8px 0" }
            }
          >
            Ada Lovelace
          </h2>
          <p
            style={
              css
                ? { color: "#6366f1", fontSize: "0.85rem", margin: 0 }
                : { margin: "4px 0" }
            }
          >
            Erste Programmiererin
          </p>
          <button
            style={
              css
                ? {
                    marginTop: 12,
                    padding: "8px 18px",
                    border: 0,
                    borderRadius: 999,
                    background: "#4f46e5",
                    color: "#fff",
                    cursor: "pointer",
                  }
                : {}
            }
          >
            Folgen
          </button>
        </article>
      </div>

      <div className="hc-compare">
        <div className="hc-compare-col">
          <CodeBlock lang="html" title="immer gleich" code={HTML_BEISPIEL} />
        </div>
        <div className="hc-compare-col">
          <CodeBlock
            lang="css"
            title={css ? "aktiv" : "abgeschaltet"}
            code={CSS_BEISPIEL}
          />
        </div>
      </div>

      <DepthBox variant="why" title="Warum trennt man Struktur und Aussehen?">
        Drei Gründe. <strong>Wartbarkeit:</strong> Ein Designwechsel ist eine
        Änderung im CSS, nicht in 200 HTML-Dateien. <strong>Wiederverwendung:</strong>{" "}
        dieselbe <span className="mono">.profil</span>-Regel stylt jede Karte
        auf der Seite. <strong>Zugänglichkeit &amp; Maschinenlesbarkeit:</strong>{" "}
        Suchmaschinen und Screenreader lesen die HTML-Struktur — sie ist die
        echte Bedeutung, das CSS ist nur Lack.
      </DepthBox>

      <DepthBox variant="mistake" title="HTML ist eine Programmiersprache">
        Ist es nicht. HTML hat keine Variablen, keine Bedingungen, keine
        Schleifen — es <em>beschreibt</em> nur. Es ist eine{" "}
        <em>Markup</em>-Sprache (Auszeichnungssprache). CSS übrigens auch keine
        Programmiersprache: es ist eine deklarative Regelsprache. Logik kommt
        erst mit JavaScript dazu. Wer das verinnerlicht, sucht in HTML/CSS nicht
        nach „Fehlern im Ablauf", sondern nach falscher Struktur oder falschen
        Regeln.
      </DepthBox>

      <DepthBox variant="deeper" title="Was der Browser daraus macht">
        Beim Laden passiert grob:
        <ol className="step-list">
          <li>
            <strong>Parsen</strong> — der HTML-Text wird zum{" "}
            <span className="mono">DOM</span>-Baum (Document Object Model),
            einer Baumstruktur aus Knoten.
          </li>
          <li>
            <strong>CSS parsen</strong> — die Stylesheets werden zum{" "}
            <span className="mono">CSSOM</span>.
          </li>
          <li>
            <strong>Render-Tree</strong> — DOM + CSSOM werden zusammengeführt:
            welcher Knoten bekommt welche Stile.
          </li>
          <li>
            <strong>Layout &amp; Paint</strong> — der Browser rechnet Positionen
            und Größen aus und malt die Pixel.
          </li>
        </ol>
        Wenn du später per JavaScript etwas änderst, fasst du <em>das DOM</em>{" "}
        an — nicht den ursprünglichen HTML-Text.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Als Nächstes: das HTML-Grundgerüst (welche Tags es gibt und wie man sie
        verschachtelt) und wie CSS überhaupt ans HTML kommt (drei Wege). Später
        wird die DOM-Idee wichtig, wenn wir KI-generiertes Markup mit den
        DevTools lesen.
      </DepthBox>
    </div>
  );
}

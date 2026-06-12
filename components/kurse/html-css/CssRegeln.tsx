import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const EXTERN = `<!-- in der HTML-Datei, im <head> -->
<link rel="stylesheet" href="styles.css">`;

const INTERN = `<head>
  <style>
    body { font-family: system-ui; }
    h1   { color: #4f46e5; }
  </style>
</head>`;

const INLINE = `<h1 style="color: #4f46e5; margin: 0;">Titel</h1>`;

const SELEKTOREN = `/* Element — alle <p> */
p { line-height: 1.6; }

/* Klasse — alle mit class="hinweis" */
.hinweis { color: #b45309; }

/* ID — das eine Element mit id="hero" */
#hero { min-height: 100vh; }

/* Nachfahre — <a> irgendwo in einem <nav> */
nav a { text-decoration: none; }

/* Gruppierung — gleiche Regel für mehrere */
h1, h2, h3 { font-family: Georgia, serif; }

/* Zustand (Pseudo-Klasse) — beim Drüberfahren */
button:hover { background: #4338ca; }`;

export default function CssRegeln() {
  return (
    <div className="lesson-card">
      <h2>CSS einbinden &amp; die Anatomie einer Regel</h2>
      <p className="lesson-description">
        Bevor CSS irgendetwas stylt, muss es überhaupt mit dem HTML verbunden
        sein. Es gibt drei Wege — und nur einer ist für echte Projekte gemeint.
        Danach: wie eine CSS-Regel aufgebaut ist und wie du Elemente triffst.
      </p>

      <h3>Drei Wege, CSS einzubinden</h3>

      <h4 style={{ marginBottom: 4 }}>1. Extern (der richtige Weg) ✅</h4>
      <p style={{ marginTop: 0 }}>
        Stile in einer eigenen <span className="mono">.css</span>-Datei, per{" "}
        <span className="mono">&lt;link&gt;</span> eingebunden. Eine Datei stylt
        die ganze Website, der Browser kann sie cachen.
      </p>
      <CodeBlock lang="html" code={EXTERN} />

      <h4 style={{ marginBottom: 4 }}>2. Intern (für eine einzelne Seite) ◐</h4>
      <p style={{ marginTop: 0 }}>
        Ein <span className="mono">&lt;style&gt;</span>-Block im{" "}
        <span className="mono">&lt;head&gt;</span>. Okay für eine schnelle Demo
        oder eine einzige Seite.
      </p>
      <CodeBlock lang="html" code={INTERN} />

      <h4 style={{ marginBottom: 4 }}>3. Inline (Notlösung) ⚠️</h4>
      <p style={{ marginTop: 0 }}>
        Direkt am Element per <span className="mono">style</span>-Attribut. Nicht
        wiederverwendbar, schwer zu überschreiben, bläht das HTML auf — und{" "}
        <em>genau das streuen KI-Tools gern in Massen</em>.
      </p>
      <CodeBlock lang="html" code={INLINE} />

      <h3>Die Anatomie einer Regel</h3>
      <p>Eine CSS-Regel besteht immer aus denselben Teilen:</p>

      <div
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: "1rem",
          background: "#0f172a",
          color: "#e2e8f0",
          borderRadius: 10,
          padding: "18px 16px",
          margin: "12px 0",
          lineHeight: 2,
          overflowX: "auto",
        }}
      >
        <span style={{ color: "#7dd3fc" }}>.button</span>
        <span style={{ color: "#94a3b8" }}> &#123;</span>
        <br />
        <span style={{ paddingLeft: 24 }} />
        <span style={{ color: "#fdba74" }}>background</span>
        <span style={{ color: "#94a3b8" }}>: </span>
        <span style={{ color: "#86efac" }}>#4f46e5</span>
        <span style={{ color: "#94a3b8" }}>;</span>
        <br />
        <span style={{ paddingLeft: 24 }} />
        <span style={{ color: "#fdba74" }}>padding</span>
        <span style={{ color: "#94a3b8" }}>: </span>
        <span style={{ color: "#86efac" }}>8px 16px</span>
        <span style={{ color: "#94a3b8" }}>;</span>
        <br />
        <span style={{ color: "#94a3b8" }}>&#125;</span>
      </div>

      <ul className="step-list">
        <li>
          <strong style={{ color: "#0ea5e9" }}>Selektor</strong>{" "}
          (<span className="mono">.button</span>) — <em>welche</em> Elemente?
        </li>
        <li>
          <strong style={{ color: "#d97706" }}>Eigenschaft / Property</strong>{" "}
          (<span className="mono">background</span>) — <em>was</em> ändern?
        </li>
        <li>
          <strong style={{ color: "#16a34a" }}>Wert</strong>{" "}
          (<span className="mono">#4f46e5</span>) — <em>worauf</em> setzen?
        </li>
        <li>
          Property + Wert zusammen = eine <strong>Deklaration</strong>, beendet
          mit einem <span className="mono">;</span>. Mehrere stehen in{" "}
          <span className="mono">&#123; &#125;</span>.
        </li>
      </ul>

      <h3>Die Grund-Selektoren</h3>
      <CodeBlock lang="css" title="die wichtigsten Treffer-Arten" code={SELEKTOREN} />

      <div className="info-box">
        <strong>Faustregel:</strong> Style nach <span className="mono">.klasse</span>,
        nicht nach <span className="mono">#id</span> oder Tag-Namen. Klassen sind
        wiederverwendbar und halten die Spezifität niedrig (warum das wichtig
        ist, kommt in der nächsten Lektion).
      </div>

      <DepthBox variant="why" title="Warum ist externes CSS dem Inline-Style überlegen?">
        <ul>
          <li>
            <strong>Eine Quelle der Wahrheit:</strong> die Button-Farbe steht an
            einer Stelle, nicht 50-mal verstreut.
          </li>
          <li>
            <strong>Caching:</strong> der Browser lädt die CSS-Datei einmal und
            wiederverwendet sie auf allen Seiten.
          </li>
          <li>
            <strong>Trennung:</strong> Inhalt (HTML) und Aussehen (CSS) bleiben
            getrennt — du kannst das eine ändern, ohne das andere anzufassen.
          </li>
        </ul>
        Inline-Styles haben außerdem eine sehr hohe Spezifität und sind dadurch
        schwer zu überschreiben — ein häufiger Grund, warum „mein CSS greift
        nicht".
      </DepthBox>

      <DepthBox variant="mistake" title="Überall style-Attribute (das KI-Muster)">
        Wenn jedes Element sein eigenes <span className="mono">style="…"</span>{" "}
        trägt, hast du kein wartbares CSS mehr, sondern 200 Einzelfälle. Genau
        das produzieren manche KI-Tools, weil sie Element für Element
        „dekorieren". Lösung: wiederkehrende Stile zu Klassen zusammenfassen.
        Wir greifen das in der KI-HTML-Sektion gezielt wieder auf.
      </DepthBox>

      <DepthBox variant="deeper" title="Pseudo-Klassen, Pseudo-Elemente & Kombinatoren">
        <ul>
          <li>
            <strong>Pseudo-Klassen</strong> beschreiben einen Zustand:{" "}
            <span className="mono">:hover, :focus, :first-child, :nth-child(2n)</span>.
          </li>
          <li>
            <strong>Pseudo-Elemente</strong> erzeugen/treffen Teile:{" "}
            <span className="mono">::before, ::after, ::placeholder</span>.
          </li>
          <li>
            <strong>Kombinatoren</strong> verbinden Selektoren:{" "}
            <span className="mono">A B</span> (Nachfahre),{" "}
            <span className="mono">A &gt; B</span> (direktes Kind),{" "}
            <span className="mono">A + B</span> (direkt danach),{" "}
            <span className="mono">A ~ B</span> (Geschwister danach).
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Jetzt weißt du <em>wie</em> man trifft — als Nächstes das Box-Modell
        (was die Werte für Abstand &amp; Größe bedeuten) und danach die
        Kaskade/Spezifität (welche Regel gewinnt, wenn mehrere dasselbe Element
        treffen).
      </DepthBox>
    </div>
  );
}

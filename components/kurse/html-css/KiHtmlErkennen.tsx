import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const DIVSUPPE = `<div class="card-wrapper">
  <div class="card-container">
    <div class="card-inner">
      <div class="card-content">
        <div class="title-wrapper">
          <div class="title">Hallo</div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const UTILITY = `<div class="flex flex-col items-center justify-center
  gap-4 rounded-2xl bg-white p-6 shadow-lg
  hover:shadow-xl transition-all duration-300
  dark:bg-gray-800 md:flex-row md:gap-6">
  ...
</div>`;

const KLICKBAR = `<!-- ⚠️ ein div, das so tut als wäre es ein Button -->
<div class="btn" onclick="senden()">Absenden</div>

<!-- ✅ das hier kann Tastatur, Screenreader, Enter -->
<button type="button" onclick="senden()">Absenden</button>`;

const PLATZHALTER = `<a href="#" class="link">Mehr erfahren</a>
<img src="placeholder.jpg" alt="image">
<p>Lorem ipsum dolor sit amet, consectetur...</p>
<span class="badge">John Doe</span>`;

export default function KiHtmlErkennen() {
  return (
    <div className="lesson-card">
      <h2>KI-HTML erkennen</h2>
      <p className="lesson-description">
        KI-Tools schreiben in Sekunden funktionierendes Markup — aber mit einem
        erkennbaren Stil. Wer die Fingerabdrücke kennt, weiß sofort, worauf zu
        achten ist: wo Code aufgebläht ist, wo Bedeutung fehlt und wo sich
        typische Fehler verstecken. Es geht <em>nicht</em> ums Bashing — die
        Muster zu kennen macht dich beim Lesen und Reparieren schlicht
        schneller.
      </p>

      <div className="info-box">
        Faustregel: KI-HTML <em>funktioniert</em> meistens — es ist nur oft{" "}
        <strong>verbose, generisch und semantisch arm</strong>. Genau diese drei
        Eigenschaften sind die Spur.
      </div>

      <h3>Fingerabdruck 1 — div-Suppe &amp; Wrapper-Inflation</h3>
      <p>
        Verschachtelte <span className="mono">&lt;div&gt;</span>s, von denen die
        meisten nichts tun. Oft fünf Ebenen, wo eine reicht — mit Namen wie{" "}
        <span className="mono">wrapper</span> ›{" "}
        <span className="mono">container</span> ›{" "}
        <span className="mono">inner</span> ›{" "}
        <span className="mono">content</span>.
      </p>
      <CodeBlock lang="html" title="sechs divs für eine Überschrift" code={DIVSUPPE} />

      <h3>Fingerabdruck 2 — Utility-Klassen-Wüsten</h3>
      <p>
        Lange Ketten von Tailwind-artigen Klassen direkt im{" "}
        <span className="mono">class</span>-Attribut. Nicht per se schlecht
        (siehe unten) — aber wenn sich <em>derselbe</em> 15-Klassen-Block
        dutzendfach wiederholt, statt einmal zentral zu stehen, riecht es nach
        Copy-Paste-Generierung.
      </p>
      <CodeBlock lang="html" title="15 Klassen pro Element, x-fach wiederholt" code={UTILITY} />

      <h3>Fingerabdruck 3 — semantische Armut</h3>
      <p>
        Das verräterischste Muster: <span className="mono">&lt;div&gt;</span> mit{" "}
        <span className="mono">onclick</span> statt{" "}
        <span className="mono">&lt;button&gt;</span>,{" "}
        <span className="mono">&lt;div&gt;</span> statt{" "}
        <span className="mono">&lt;nav&gt;</span>/<span className="mono">&lt;main&gt;</span>,
        Überschriften, die nur per CSS „groß" sind statt{" "}
        <span className="mono">&lt;h1&gt;</span>.
      </p>
      <CodeBlock lang="html" title="funktioniert mit Maus — sonst nicht" code={KLICKBAR} />

      <h3>Fingerabdruck 4 — Platzhalter, die liegen blieben</h3>
      <p>
        <span className="mono">href="#"</span>,{" "}
        <span className="mono">alt="image"</span>, Lorem ipsum,{" "}
        <span className="mono">John Doe</span>, leere{" "}
        <span className="mono">onClick</span>-Stubs. Die KI füllt Lücken mit
        Generischem — was beim Übernehmen leicht vergessen wird.
      </p>
      <CodeBlock lang="html" title="alles Platzhalter" code={PLATZHALTER} />

      <h3>Die Schnell-Checkliste</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🧱 Struktur</div>
          <div className="actor-row">
            Auffällig viele <span className="mono">div</span>s? Tiefe
            Verschachtelung ohne Zweck? Kaum semantische Tags
            (<span className="mono">header/main/nav</span>)?
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🎨 Styling</div>
          <div className="actor-row">
            Riesige <span className="mono">class</span>-Ketten oder viele{" "}
            <span className="mono">style="…"</span>? Dieselben Stile mehrfach
            wiederholt statt einer Klasse?
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">♿ Bedeutung</div>
          <div className="actor-row">
            <span className="mono">div</span> mit{" "}
            <span className="mono">onclick</span>? Fehlende{" "}
            <span className="mono">alt</span>/<span className="mono">label</span>?{" "}
            <span className="mono">href="#"</span> und Lorem ipsum?
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum produzieren KIs genau diese Muster?">
        Drei Gründe. <strong>Trainingsdaten:</strong> das halbe Web <em>ist</em>{" "}
        div-Suppe — die KI lernt den Durchschnitt, nicht die Best Practice.{" "}
        <strong>Token-für-Token:</strong> ein Modell generiert linear und „spielt
        auf Nummer sicher" — ein zusätzlicher Wrapper kostet nichts und kann
        nicht schaden, also kommt er rein. <strong>Kontext-Verlust:</strong> ohne
        die ganze Datei im Blick dupliziert die KI Stile, statt eine bestehende
        Klasse wiederzuverwenden. Das Ergebnis funktioniert — es ist nur nicht
        DRY.
      </DepthBox>

      <DepthBox variant="mistake" title="Verbose = kaputt">
        Aufgeblähtes HTML ist nicht automatisch fehlerhaft. Sechs Wrapper-divs
        rendern völlig korrekt — sie sind nur unnötig. Verschwende keine Zeit
        damit, „Bugs" in funktionierendem, aber verbosem Code zu suchen.
        Trenne die zwei Fragen: <strong>Funktioniert es?</strong> (dann ggf.
        später aufräumen) vs. <strong>Ist es kaputt?</strong> (dann debuggen —
        nächste Lektion). Beides zu vermischen kostet am meisten Zeit.
      </DepthBox>

      <DepthBox variant="deeper" title="Tailwind ist nicht das Problem">
        Utility-CSS (Tailwind) ist eine bewusste, legitime Methode — kurze
        Klassen statt eigener CSS-Dateien. Der Unterschied zu „KI-Wüste":
        <ul>
          <li>
            <strong>Absicht:</strong> wiederkehrende Komponenten werden zu{" "}
            <em>einer</em> Komponente extrahiert (in React/Vue), nicht 30-mal
            kopiert.
          </li>
          <li>
            <strong>Konsistenz:</strong> Abstände/Farben kommen aus dem
            Design-System (<span className="mono">p-4</span>, nicht{" "}
            <span className="mono">p-[13px]</span>).
          </li>
        </ul>
        Erkennungszeichen für <em>schlechte</em> Nutzung: derselbe lange
        Klassen-Block wortwörtlich wiederholt, willkürliche{" "}
        <span className="mono">[arbitrary-values]</span>, und{" "}
        <span className="mono">flex</span> neben{" "}
        <span className="mono">grid</span> neben{" "}
        <span className="mono">block</span> am selben Element (widersprüchlich).
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Erkennen ist Schritt eins. Als Nächstes: dieses Markup{" "}
        <em>schnell lesen</em> (Struktur-zuerst-Strategie, DevTools), und dann{" "}
        <em>systematisch reparieren</em>. Die semantischen Tags aus dem
        Grundlagen-Teil sind dein wichtigstes Werkzeug beim Aufräumen.
      </DepthBox>
    </div>
  );
}

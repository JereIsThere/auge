"use client";

import { useState, type ReactNode } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

type Bug = {
  id: string;
  kurz: string;
  symptom: string;
  badLang: "html" | "css";
  bad: string;
  fix: string;
  erklaerung: ReactNode;
};

const BUGS: Bug[] = [
  {
    id: "overflow",
    kurz: "Horizontaler Scrollbalken",
    symptom: "Die Seite lässt sich seitlich scrollen, obwohl nichts erkennbar zu breit ist.",
    badLang: "css",
    bad: `.box {
  width: 100%;
  padding: 24px;   /* kommt OBEN DRAUF */
}`,
    fix: `*, *::before, *::after {
  box-sizing: border-box;   /* padding zählt rein */
}`,
    erklaerung: (
      <>
        Mit dem Default <span className="mono">content-box</span> ergibt{" "}
        <span className="mono">width: 100% + padding: 24px</span> eine Box, die{" "}
        <em>breiter</em> als ihr Eltern-Element ist → Überlauf.{" "}
        <span className="mono">border-box</span> rechnet das padding ein. In den
        DevTools verrät sich der Übeltäter, wenn du am{" "}
        <span className="mono">&lt;body&gt;</span> hin und her klickst und die
        markierte Breite den Viewport übersteigt.
      </>
    ),
  },
  {
    id: "zindex",
    kurz: "z-index greift nicht",
    symptom: "Das Dropdown/Modal liegt hinter dem Inhalt — egal wie hoch der z-index ist.",
    badLang: "css",
    bad: `.menu {
  z-index: 9999;   /* wirkungslos */
}`,
    fix: `.menu {
  position: relative;   /* erst jetzt ...   */
  z-index: 10;          /* ... wirkt z-index */
}`,
    erklaerung: (
      <>
        <span className="mono">z-index</span> wirkt nur auf{" "}
        <em>positionierte</em> Elemente (relative/absolute/fixed/sticky). Ohne{" "}
        <span className="mono">position</span> ist die Zahl egal. Wenn auch das
        nicht hilft: ein Vorfahr mit{" "}
        <span className="mono">transform</span> oder{" "}
        <span className="mono">opacity &lt; 1</span> hat einen eigenen Stacking
        Context aufgemacht — siehe Lektion „Position &amp; Stacking".
      </>
    ),
  },
  {
    id: "center",
    kurz: "Zentrierung in falscher Richtung",
    symptom: "justify-content/align-items zentrieren nicht so, wie man erwartet.",
    badLang: "css",
    bad: `.row {
  display: flex;
  flex-direction: column;     /* übersehen! */
  justify-content: center;    /* zentriert jetzt VERTIKAL */
}`,
    fix: `.row {
  display: flex;
  /* keine column → Hauptachse ist horizontal */
  justify-content: center;    /* horizontal */
  align-items: center;        /* vertikal   */
}`,
    erklaerung: (
      <>
        <span className="mono">justify-content</span> wirkt auf die{" "}
        <em>Hauptachse</em> — und die kippt bei{" "}
        <span className="mono">flex-direction: column</span> auf vertikal. Eine
        übersehene <span className="mono">column</span> ist der häufigste Grund,
        warum „zentrieren in die falsche Richtung geht".
      </>
    ),
  },
  {
    id: "div-onclick",
    kurz: "Klickbares div statt Button",
    symptom: "Der Button reagiert nicht auf Tab/Enter; Screenreader kündigen nichts an.",
    badLang: "html",
    bad: `<div class="btn" onclick="senden()">
  Absenden
</div>`,
    fix: `<button type="button" onclick="senden()">
  Absenden
</button>`,
    erklaerung: (
      <>
        Ein <span className="mono">&lt;div&gt;</span> ist nicht fokussierbar,
        hört nicht auf Enter/Leertaste und hat keine Button-Rolle für
        Screenreader. <span className="mono">&lt;button&gt;</span> bringt das
        alles gratis mit. Klassischer KI-Reflex — und ein echter Bug
        (Tastatur-Nutzer können die Funktion nicht auslösen), kein
        Schönheitsfehler.
      </>
    ),
  },
  {
    id: "nesting",
    kurz: "Falsch verschachtelt / nicht geschlossen",
    symptom: "Ab einer bestimmten Stelle rutscht das ganze Layout, Elemente landen außerhalb ihres Containers.",
    badLang: "html",
    bad: `<ul>
  <li>Erster
  <li>Zweiter      <!-- li nie geschlossen -->
  <p>Text</p>      <!-- p gehört nicht in ul -->
</ul>`,
    fix: `<ul>
  <li>Erster</li>
  <li>Zweiter</li>
</ul>
<p>Text</p>`,
    erklaerung: (
      <>
        Der Browser „repariert" ungültiges Markup nach eigenen Regeln — meist
        anders als gedacht. Vergleich den{" "}
        <strong>Elements-Baum in den DevTools</strong> (= was der Browser
        wirklich baute) mit deinem Quelltext: wo sie abweichen, sitzt das nicht
        geschlossene oder falsch verschachtelte Tag.
      </>
    ),
  },
  {
    id: "dup-id",
    kurz: "Doppelte ID",
    symptom: "Nur das erste von mehreren gleichen Elementen reagiert auf CSS oder JavaScript.",
    badLang: "html",
    bad: `<div id="card">A</div>
<div id="card">B</div>

<!-- #card / getElementById trifft nur das ERSTE -->`,
    fix: `<div class="card">A</div>
<div class="card">B</div>

<!-- Klassen dürfen sich wiederholen, IDs nicht -->`,
    erklaerung: (
      <>
        IDs müssen pro Seite <strong>eindeutig</strong> sein.{" "}
        <span className="mono">document.getElementById</span> und der
        CSS-Selektor <span className="mono">#card</span> liefern nur das erste
        Vorkommen — der Rest wird stillschweigend ignoriert. KI-Tools vergeben
        gern dieselbe ID an wiederholte Komponenten. Für „viele gleiche Dinge"
        immer Klassen nehmen.
      </>
    ),
  },
];

export default function KiHtmlBugfixen() {
  const [aktiv, setAktiv] = useState(0);
  const bug = BUGS[aktiv];

  return (
    <div className="lesson-card">
      <h2>KI-HTML systematisch bugfixen</h2>
      <p className="lesson-description">
        KI-generiertes Markup hat einen überschaubaren Katalog typischer
        Fehler. Wer diese „üblichen Verdächtigen" kennt und ein festes
        Verfahren hat, findet die meisten Bugs in Minuten — statt blind im Code
        zu wühlen.
      </p>

      <h3>Das 5-Schritte-Verfahren</h3>
      <ol className="step-list">
        <li>
          <strong>Reproduzieren &amp; eingrenzen</strong> — was genau ist falsch,
          und auf welchem Element? Element-Picker drauf.
        </li>
        <li>
          <strong>Funktioniert vs. kaputt trennen</strong> — ist es ein echter
          Bug oder nur verbose? Nicht an Kosmetik verlieren.
        </li>
        <li>
          <strong>DevTools befragen</strong> — Styles-Panel (welche Regel
          gewinnt?), Box-Modell (Abstände), Konsole (Fehler?).
        </li>
        <li>
          <strong>Hypothese testen</strong> — Wert direkt im Styles-Panel ändern
          und live sehen, ob es das war. Erst dann im Code fixen.
        </li>
        <li>
          <strong>An der Wurzel fixen</strong> — nicht mit{" "}
          <span className="mono">!important</span> übermalen, sondern die
          Ursache beheben.
        </li>
      </ol>

      <h3>Die Bug-Galerie — die üblichen Verdächtigen</h3>
      <p>Wähl einen Bug und sieh Symptom, Ursache und Fix:</p>

      <div className="hc-seg" style={{ marginBottom: 14 }}>
        {BUGS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            className={`hc-chip ${aktiv === i ? "active" : ""}`}
            onClick={() => setAktiv(i)}
          >
            {b.kurz}
          </button>
        ))}
      </div>

      <div className="warn-box">
        <strong>Symptom:</strong> {bug.symptom}
      </div>

      <div className="hc-compare">
        <div className="hc-compare-col">
          <h4>🐞 So sieht es im KI-Code aus</h4>
          <CodeBlock lang={bug.badLang} code={bug.bad} />
        </div>
        <div className="hc-compare-col">
          <h4>✅ Der Fix</h4>
          <CodeBlock lang={bug.badLang} code={bug.fix} />
        </div>
      </div>

      <div className="success-box">
        <strong>Warum:</strong> {bug.erklaerung}
      </div>

      <DepthBox variant="why" title="Warum zuerst in den DevTools fixen, nicht im Code?">
        Im Styles-Panel änderst du einen Wert und siehst das Ergebnis{" "}
        <em>sofort</em>, ohne Speichern/Neuladen. Das macht aus „ich glaube, es
        liegt am padding" ein 5-Sekunden-Experiment. Du verifizierst die
        Hypothese, <em>bevor</em> du die echte Datei anfasst — so fixt du die
        Ursache und nicht das nächstbeste Symptom. Übernimm die geänderte Zeile
        erst danach in den Quellcode.
      </DepthBox>

      <DepthBox variant="mistake" title="Mit !important und Inline-Styles drübermalen">
        Wenn etwas „einfach nicht greift", ist die Versuchung groß,{" "}
        <span className="mono">!important</span> dranzuhängen oder ein
        Inline-<span className="mono">style</span> zu setzen. Das versteckt das
        Problem nur und erzeugt das nächste (jetzt greift die <em>andere</em>{" "}
        Regel nicht mehr). In KI-Code findest du oft schon Schichten solcher
        Pflaster. Schäl sie ab statt nachzulegen: das Styles-Panel zeigt dir per
        Durchstreichung, welche Regel von wem überschrieben wird.
      </DepthBox>

      <DepthBox variant="deeper" title="Lass die KI gezielt debuggen — mit Kontext">
        Eine KI kann ihren eigenen Bug oft finden, wenn du ihr den{" "}
        <em>beobachteten Effekt</em> gibst, nicht nur den Code:
        <CodeBlock
          lang="text"
          code={`"Dieses Element scrollt horizontal über den Viewport hinaus.
 Hier ist das HTML + CSS. Finde die Ursache, erkläre sie kurz,
 und gib NUR die minimale Änderung — kein Umbau, kein !important."`}
        />
        Wichtig: die <strong>minimale</strong> Änderung verlangen. Sonst baut
        die KI gern das halbe Layout neu und du hast einen neuen Satz Bugs.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Fast jeder Bug oben hängt an einem Grundlagen-Konzept: Box-Modell
        (Overflow), Spezifität (greift nicht), Flexbox (Zentrierung), Position
        (z-index), Semantik (div-Button). Wer die Grundlagen sitzen hat,
        diagnostiziert schneller. In den Übungsaufgaben fixt du als Nächstes ein
        bewusst kaputtes Layout selbst.
      </DepthBox>
    </div>
  );
}

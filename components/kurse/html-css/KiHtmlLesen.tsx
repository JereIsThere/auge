"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const NOISY = `<div class="mx-auto max-w-4xl px-4 py-8">
  <div class="mb-6 flex items-center justify-between">
    <div class="text-2xl font-bold text-gray-900">Produkte</div>
    <div class="rounded-lg bg-indigo-600 px-4 py-2
                text-white cursor-pointer" onclick="add()">+ Neu</div>
  </div>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div class="rounded-xl border border-gray-200 p-4 shadow-sm">
      <img src="p.jpg" alt="image"
           class="mb-3 h-40 w-full rounded-lg object-cover">
      <div class="text-lg font-semibold">Kamera</div>
      <div class="text-sm text-gray-500">129 €</div>
    </div>
  </div>
</div>`;

const SKELETT = `<div>                        ← Seiten-Container
  <div>                      ← Kopfzeile (flex)
    <div>Produkte</div>          sollte <h1> sein
    <div onclick>+ Neu</div>     sollte <button> sein
  </div>
  <div>                      ← Karten-Raster (grid)
    <div>                    ← eine Karte
      <img alt="image">          alt ist Platzhalter
      <div>Kamera</div>          Produktname
      <div>129 €</div>           Preis
    </div>
  </div>
</div>`;

export default function KiHtmlLesen() {
  const [klassenWeg, setKlassenWeg] = useState(true);

  return (
    <div className="lesson-card">
      <h2>KI-HTML schnell lesen &amp; verstehen</h2>
      <p className="lesson-description">
        Vor dir liegen 300 Zeilen Markup mit Klassen-Ketten an jedem Element.
        Der Reflex, alles von oben nach unten zu lesen, ist die langsamste
        Methode. Profis lesen <strong>Struktur zuerst</strong> und nutzen die
        DevTools als Röntgengerät. Hier sind die fünf Techniken.
      </p>

      <h3>Technik 1 — blende die Klassen mental aus</h3>
      <p>
        Beim ersten Durchgang interessieren dich nur <strong>Tag-Namen</strong>{" "}
        und <strong>Verschachtelung</strong> — die Klassen sind reines
        Rauschen. Klick den Schalter und sieh, wie dieselben 14 Zeilen plötzlich
        eine klare Geschichte erzählen.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          className={`hc-chip ${klassenWeg ? "active" : ""}`}
          onClick={() => setKlassenWeg(true)}
        >
          nur Struktur
        </button>
        <button
          type="button"
          className={`hc-chip ${!klassenWeg ? "active" : ""}`}
          onClick={() => setKlassenWeg(false)}
        >
          mit allen Klassen
        </button>
      </div>

      <CodeBlock
        lang={klassenWeg ? "text" : "html"}
        title={klassenWeg ? "das Gerüst — so liest du es zuerst" : "wie es wirklich dasteht"}
        code={klassenWeg ? SKELETT : NOISY}
      />

      <div className="info-box">
        Die Klassen-Wüste rechts und das Gerüst links sind dasselbe Markup. Das
        Gerüst beantwortet in fünf Sekunden: „Überschrift, Button, ein Raster
        aus Karten" — und zeigt nebenbei die semantischen Sünden auf.
      </div>

      <h3>Technik 2 — die DevTools als Röntgengerät</h3>
      <p>
        Rechtsklick auf ein Element →{" "}
        <strong>„Untersuchen" / „Inspect"</strong> (oder F12). Das ist der
        schnellste Weg vom „was ich sehe" zum „welcher Code es ist":
      </p>
      <ul className="step-list">
        <li>
          <strong>Element-Picker</strong> (das Pfeil-Icon oben links): auf etwas
          auf der Seite klicken → springt direkt zur Stelle im DOM-Baum.
        </li>
        <li>
          <strong>Styles-Panel:</strong> zeigt <em>jede</em> Regel, die greift —
          durchgestrichene sind überschrieben (Spezifität!). Du siehst sofort,
          wer gewinnt.
        </li>
        <li>
          <strong>Box-Modell-Diagramm:</strong> visualisiert margin/border/
          padding mit echten Pixeln — Gold beim Abstands-Debugging.
        </li>
        <li>
          <strong>Layout-Badges:</strong> neben einem Element steht{" "}
          <span className="mono">flex</span> oder{" "}
          <span className="mono">grid</span> — Klick überlagert die Linien.
        </li>
      </ul>

      <h3>Technik 3 — suchen statt scrollen</h3>
      <p>
        Du siehst auf der Seite den Text „129 €" und willst zum Code? Im
        DevTools-Elements-Panel <span className="mono">Strg/Cmd + F</span> und
        den sichtbaren Text eintippen — der Baum springt hin. Genauso im Editor:
        nie scrollen, immer den Text suchen, den du auf dem Schirm siehst.
      </p>

      <h3>Technik 4 — formatieren &amp; einklappen</h3>
      <p>
        Minifiziertes oder einzeiliges HTML? Im Editor{" "}
        <span className="mono">Format Document</span> (Prettier) macht es lesbar.
        Dann die <strong>Falt-Pfeile</strong> nutzen: klappe Blöcke zu, bis nur
        die oberste Ebene steht — das ist deine Landkarte.
      </p>

      <h3>Technik 5 — lass die KI ihren Code erklären</h3>
      <p>
        Du darfst zurückfragen. Drei Prompts, die fast immer helfen:
      </p>
      <CodeBlock
        lang="text"
        code={`• "Fasse die Struktur dieses HTML in einer kommentierten
   Gliederung zusammen — nur Tags und Bereiche, ohne Klassen."

• "Welche dieser <div>s sind reine Wrapper und könnten weg,
   ohne die Optik zu ändern?"

• "Schreib das mit semantischen Tags (header/main/nav/...) neu,
   ohne das Aussehen zu verändern."`}
      />

      <DepthBox variant="why" title="Warum ist Struktur-zuerst so viel schneller?">
        Weil Klassen beantworten <em>„wie sieht es aus"</em>, aber die
        Verschachtelung beantwortet <em>„was ist es"</em> — und „was ist es" ist
        fast immer die Frage, die du gerade hast. Eine Klasse wie{" "}
        <span className="mono">mb-6 flex items-center justify-between</span>{" "}
        sagt nichts über die <em>Rolle</em> des Elements; dass es ein{" "}
        <span className="mono">&lt;div&gt;</span> mit einer Überschrift und
        einem Button drin ist, sagt alles. Dein Gehirn kann maximal 14 Zeilen
        Gerüst auf einmal halten, aber keine 14 Zeilen à 15 Klassen.
      </DepthBox>

      <DepthBox variant="mistake" title="Den Code von oben nach unten lesen">
        HTML ist ein <em>Baum</em>, kein Text — linear von Zeile 1 zu lesen ist,
        als würdest du ein Inhaltsverzeichnis Wort für Wort buchstabieren. Lies
        stattdessen <strong>von außen nach innen</strong>: erst die obersten
        Container (header/main/footer), dann in den interessanten Ast
        hineinzoomen. Die meiste Zeit brauchst du 90 % des Baums gar nicht
        anzusehen.
      </DepthBox>

      <DepthBox variant="deeper" title="DevTools-Profi-Tricks">
        <ul>
          <li>
            <span className="mono">$0</span> in der Konsole = das gerade
            ausgewählte Element. <span className="mono">$0.classList</span>,{" "}
            <span className="mono">getComputedStyle($0)</span> liefern alles.
          </li>
          <li>
            Rechtsklick im DOM-Baum → <strong>Break on → attribute
            modifications</strong>: hält an, wenn JS eine Klasse ändert — findet
            den Übeltäter bei „das ändert sich von selbst"-Bugs.
          </li>
          <li>
            <strong>Copy → Copy element / Copy styles</strong>: nimmt das
            gerenderte Markup mit, inklusive von JS gesetzter Attribute.
          </li>
          <li>
            <strong>Geräte-Toolbar</strong> (Strg/Cmd + Shift + M): die Seite in
            Handy-Breite ansehen — deckt Responsive-Bugs in Sekunden auf.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Das Styles-Panel zeigt dir live die Kaskade/Spezifität aus dem
        Grundlagen-Teil. Und sobald du die Struktur gelesen hast, geht es ans{" "}
        <em>Reparieren</em> — mit genau diesen DevTools als Hauptwerkzeug.
      </DepthBox>
    </div>
  );
}

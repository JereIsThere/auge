import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const KAPUTT = `<div id="card" style="width: 100%; padding: 30px;">
  <div id="card">
    <div class="title">Galerie</div>
    <div class="menu" onclick="oeffneMenu()">&#9776;</div>
  </div>

  <div style="display: flex; flex-direction: column;
              justify-content: center;">
    <img src="a.jpg">
    <img src="b.jpg">
  </div>
</div>

<style>
  .menu { z-index: 999; }
</style>`;

const PROMPT_KARTE = `Du bist ein freundlicher, sehr genauer Frontend-Mentor und
gibst strukturiertes Code-Review zu HTML/CSS.

ICH LERNE: HTML/CSS-Grundlagen — semantische Tags, das Box-Modell,
box-sizing und Flexbox.

AUFGABE: Ich habe von Grund auf eine "Profilkarte" gebaut (Avatar,
Name, eine Zeile Rolle, ein Button) — eigenes HTML + CSS, ohne
Framework. Ich hänge meinen Code an.

BITTE PRÜFE:
1. Semantik — nutze ich passende Tags (z.B. eine echte Überschrift
   statt einem gestylten div, ein <button> statt einem klickbaren
   div, alt-Text am Bild)? Oder ist es div-Suppe?
2. Box-Modell — steht box-sizing: border-box global? Sind Abstände
   konsistent über padding/margin gelöst statt willkürlich?
3. Flexbox — ist die innere Anordnung sauber mit display: flex und
   gap gelöst, oder mit margins zusammengeschoben?
4. Wiederverwendung — stylst du über Klassen statt über IDs oder
   inline-styles? Wären zwei Karten nebeneinander problemlos möglich?
5. Responsivität — bricht die Karte auf 320px Breite? Nutzt du
   max-width statt fester width?

Sei konkret und nenne Zeilen. Gib mir am Ende die ZWEI größten
Verbesserungs-Hebel — wo der Sprung aufs nächste Level liegt.`;

const PROMPT_FIX = `Du bist ein präziser Frontend-Mentor und prüfst Bug-Fixes
in HTML/CSS.

KONTEXT: Mir wurde ein bewusst kaputtes Snippet gegeben, das mehrere
typische Fehler enthält (Stichworte: horizontaler Überlauf durch
box-sizing, doppelte ID, falsche Flex-Zentrierung, z-index ohne
position, klickbares div statt button, fehlender alt-Text). Ich habe
es repariert und hänge MEINE korrigierte Version an.

BITTE PRÜFE GENAU:
1. Habe ich ALLE sechs Fehler gefunden und behoben — oder ist einer
   übrig geblieben? Liste pro Fehler: gefunden ja/nein, korrekt
   gefixt ja/nein.
2. Habe ich an der WURZEL gefixt (z.B. box-sizing: border-box global)
   oder nur Symptome übermalt (feste Pixelwerte, !important)?
3. Habe ich versehentlich NEUE Probleme eingebaut (z.B. die Optik
   verändert, obwohl nur die Bugs raus sollten)?
4. Ist das Ergebnis jetzt semantisch korrekt und tastatur-bedienbar?

Sei streng — markiere übersehene Fehler klar. Nenne am Ende die ZWEI
wichtigsten Dinge, die ich beim Debuggen noch verbessern sollte.`;

const PROMPT_REFACTOR = `Du bist ein erfahrener Frontend-Mentor und bewertest
Refactorings von KI-generiertem HTML.

AUFGABE: Ich habe ein verbose, von einer KI generiertes Stück HTML
(viele Wrapper-divs, lange Utility-Klassen-Ketten, semantisch arm)
genommen und es aufgeräumt — semantische Tags, weniger
Verschachtelung, wiederverwendbare Klassen. Die OPTIK soll exakt
gleich geblieben sein. Ich hänge VORHER und NACHHER an (oder beschreibe
das Vorher).

BITTE PRÜFE:
1. Semantik — habe ich Wrapper-divs durch header/nav/main/section/
   article/footer ersetzt, wo es passt? Echte Überschriften-Hierarchie
   (genau ein h1, sinnvolle h2/h3)?
2. Verschlankung — habe ich überflüssige Wrapper entfernt, ohne dass
   sich das Layout ändert? Oder waren manche divs doch nötig (z.B. als
   Flex-/Grid-Container)?
3. DRY — wiederholt sich derselbe Stil-Block noch, oder ist er zu
   einer Klasse zusammengefasst?
4. Optik-Treue — ist das Ergebnis pixelgleich, oder hat sich beim
   Aufräumen versehentlich etwas verschoben?
5. Zugänglichkeit — alt-Texte, echte Buttons/Links, Labels?

Sei konkret. Nenne am Ende die ZWEI größten verbleibenden Hebel,
um aus "funktioniert" sauberes, wartbares Markup zu machen.`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben</h2>
      <p className="lesson-description">
        Drei Aufgaben aufsteigender Schwierigkeit — bauen, reparieren,
        aufräumen. Jede deckt mehrere Konzepte des Kurses ab und kommt mit einem{" "}
        <strong>KI-Review-Prompt</strong>: du schickst deinen Code (als Text
        oder Screenshot) an Claude, ChatGPT oder Gemini, hängst den Prompt davor
        und bekommst strukturiertes Feedback genau zu den relevanten Punkten.
      </p>

      <div className="info-box">
        <strong>So holst du am meisten raus:</strong> Mach die Aufgabe{" "}
        <em>zuerst selbst</em>, ohne KI. Lass sie dann reviewen — und arbeite
        nur die zwei wichtigsten Hinweise ab, statt alles auf einmal. Beim
        Reparieren und Refactoren gilt: erst in den DevTools testen, dann im
        Code fixen.
      </div>

      <Aufgabe titel="Aufgabe 1 — Profilkarte von Grund auf" schwierigkeit="leicht" zeit="45 min">
        <p>
          Baue eine Profilkarte mit <em>eigenem</em> HTML + CSS (kein
          Framework): rundes Avatar-Bild, Name als Überschrift, eine Zeile
          Rolle, ein „Folgen"-Button. Zentriert, mit Schatten, abgerundet.
        </p>
        <AufgabeCheckliste
          items={[
            "Semantische Tags: echte Überschrift (h2/h3), <button>, <img> mit aussagekräftigem alt",
            "box-sizing: border-box global gesetzt (*, *::before, *::after)",
            "Innere Anordnung mit display: flex + gap, nicht mit margins zusammengeschoben",
            "Gestylt über Klassen — keine IDs, keine inline style-Attribute",
            "max-width statt fester width; bricht auf 320px nicht aus dem Schirm",
          ]}
        />
        <KiReview prompt={PROMPT_KARTE} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 2 — kaputtes Layout reparieren" schwierigkeit="mittel" zeit="1 h">
        <p>
          Dieses Snippet enthält <strong>sechs</strong> typische KI-Fehler.
          Kopiere es in eine Datei, öffne es im Browser, finde mit den DevTools
          jeden Fehler und repariere ihn <em>an der Wurzel</em> — ohne{" "}
          <span className="mono">!important</span> und ohne das beabsichtigte
          Aussehen zu verändern.
        </p>
        <CodeBlock lang="html" title="repariere mich (6 Fehler)" code={KAPUTT} />
        <AufgabeCheckliste
          items={[
            "Horizontaler Überlauf (box-sizing / width + padding) behoben",
            "Doppelte id=\"card\" aufgelöst (Klassen statt IDs)",
            "Flex-Zentrierung korrigiert (column vs. justify/align verstanden)",
            "z-index zum Greifen gebracht (position gesetzt)",
            "Klickbares div durch <button type=\"button\"> ersetzt",
            "Fehlende alt-Texte an den Bildern ergänzt",
          ]}
        />
        <KiReview prompt={PROMPT_FIX} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 3 — KI-div-Suppe entwirren" schwierigkeit="schwer" zeit="1,5 h">
        <p>
          Lass dir von einer KI eine kleine Komponente generieren (z.B. „eine
          Preis-Tabelle mit drei Plänen" oder „eine Navbar mit Logo und drei
          Links"). Nimm die rohe Ausgabe und <strong>refactore</strong> sie:
          semantische Tags, weniger Wrapper, wiederverwendbare Klassen — bei{" "}
          <em>exakt gleicher</em> Optik. Behalte Vorher und Nachher.
        </p>
        <AufgabeCheckliste
          items={[
            "Wrapper-divs durch semantische Tags ersetzt (header/nav/main/section/article/footer), wo passend",
            "Überschriften-Hierarchie korrekt: genau ein h1, darunter h2/h3 nach Bedeutung",
            "Überflüssige Verschachtelung entfernt — jeder verbliebene Container hat einen Grund",
            "Wiederholte Stil-Blöcke zu einer Klasse zusammengefasst (DRY)",
            "Optik pixelgleich zum Original (im Browser nebeneinander vergleichen)",
            "Zugänglichkeit: echte Buttons/Links, alt-Texte, Labels",
          ]}
        />
        <KiReview prompt={PROMPT_REFACTOR} />
      </Aufgabe>

      <div className="success-box">
        <strong>Wenn du alle drei geschafft hast:</strong> du kannst HTML/CSS
        nicht nur schreiben, sondern auch lesen, beurteilen und reparieren — die
        eigentliche Superkraft im Zeitalter der KI-Generatoren. Wiederhole
        Aufgabe 3 in ein paar Wochen mit einer komplexeren Komponente; wie viel
        schneller du die Struktur siehst, ist dein echter Fortschritt.
      </div>
    </div>
  );
}

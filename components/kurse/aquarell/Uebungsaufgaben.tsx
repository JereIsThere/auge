import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

const PROMPT_WERTTREPPE = `Du bist Aquarell-Mentor und gibst freundliches,
strukturiertes Feedback zu Aquarell-Studien.

ICH ÜBE: Aquarell-Grundlagen, speziell Wasser-Kontrolle, Notan-Wertstufen
und saubere Wash-Schichten.

ÜBUNGSAUFGABE: "Werttreppe + Wertstudie" — eine fünf-Stufen-Werttreppe
in EINEM Pigment (z.B. Ultramarin), plus eine kleine Landschafts-Studie
(maximal Postkartengröße) mit GENAU drei Wertstufen aus derselben Farbe.

BITTE BEURTEILE MEINE ARBEIT AUF:
1. Werttreppe — sind die fünf Stufen gleichmäßig abgestuft, oder gibt
   es Sprünge zwischen den Stufen? Ist Stufe 1 wirklich hell und Stufe 5
   wirklich dunkel — voller Tonwertumfang?
2. Wash-Qualität — sind die Flächen gleichmäßig (keine Cauliflowers,
   keine harten Kanten innerhalb einer Fläche)?
3. Wertstudie — kann man auf 2 Meter Abstand klar drei Werte erkennen,
   oder verschwimmen Mid und Dark? Gibt es einen klaren Fokus?
4. Pigment-Kontrolle — gleichmäßige Verdünnung, kein „Aufblühen" durch
   zu viel Wasser?
5. Trocknungs-Disziplin — sind die Wash-Kanten sauber (alle Schichten
   durchgetrocknet) oder verlaufen sie?

Gib mir am Ende die ZWEI größten Verbesserungs-Hebel — wo der Sprung
auf das nächste Level liegt. Sei direkt, freundlich, spezifisch.`;

const PROMPT_GLAZING = `Du bist Aquarell-Mentor und gibst strukturiertes
Feedback zu Aquarell-Übungen.

ICH ÜBE: Aquarell-Glazing — das Bauen von Tiefe durch transparente
Schichten, statt durch physisches Mischen.

ÜBUNGSAUFGABE: "Glazing-Vergleich" — zwei kleine identische Motive
(z.B. eine grüne Kugel), Variante A komplett aus physisch gemischtem
Grün (z.B. Phthalo Blau + Hansa Gelb auf Palette gemischt), Variante B
aus zwei Glazing-Schichten (Schicht 1 Hansa Gelb dünn, voll trocknen
lassen, Schicht 2 Phthalo Blau dünn drüber). Plus: eine kleine
Schatten-Modellierung in beiden Varianten.

BITTE BEURTEILE MEINE ARBEIT AUF:
1. Leuchtkraft-Unterschied — leuchtet Variante B (geglast) deutlich
   mehr von innen als Variante A (gemischt)? Wenn nein, woran liegt es?
2. Sauberkeit der Schichten — sieht man bei B die Schichten getrennt
   übereinander, oder hat sich Schicht 2 in Schicht 1 reingelöst (zu
   früh gemalt, nicht trocken genug)?
3. Pigment-Wahl — sind die verwendeten Pigmente transparent genug für
   Glazing? Cadmium-Familie würde z.B. nicht funktionieren.
4. Schatten-Modellierung — wirkt der Schatten dunkler durch eine
   zusätzliche dunkle Schicht (z.B. Burnt Sienna oder Ultramarin
   verdünnt) oder hast du physisches Mischen mit Schwarz/Grau benutzt?
5. Sauberkeit der Kanten — Glazing-Kanten sollten scharf sein (Wet-on-Dry),
   nicht verwaschen.

Identifiziere am Ende: welche der beiden Varianten ist visuell stärker,
und WARUM — sei spezifisch, nicht „weil B geglast ist". Nenne die
EINE Sache, die ich an Variante B noch verbessern könnte.`;

const PROMPT_STILLLEBEN = `Du bist Aquarell-Mentor und gibst sehr direktes,
strukturiertes Feedback zu Aquarell-Bildern.

ICH ÜBE: Aquarell-Vollbild — alle Konzepte kombiniert: Pigmentwahl,
Notan/Wertstruktur, Glazing/Schichtaufbau, Aussparung, Komposition.

ÜBUNGSAUFGABE: "Stillleben mit drei Objekten" — ein Aquarell-Stillleben
(A5 bis A4) mit DREI verschiedenfarbigen Objekten (z.B. Zitrone, Apfel,
blaue Vase) auf neutralem Untergrund. Eine klare Lichtquelle von
links oder rechts. Komposition nach Drittelregel oder goldenem Schnitt.

BITTE BEURTEILE MEINE ARBEIT AUF:
1. Komposition — sitzt der Hauptfokus auf einem Drittel-/Phi-Punkt
   oder in der Mitte? Tragen die drei Massen ungleichmäßig (1:2:3 oder
   1:1:5) oder sind sie gleich groß?
2. Wertstruktur — drei klare Werte erkennbar, wenn ich das Bild
   entsättige? Wo ist der dunkelste Punkt, wo der hellste? Liegen die
   beiden nah beieinander (= guter Kontrast am Fokus)?
3. Glazing vs Mischen — sieht man unterscheidbare Schichten in
   Schatten und Mittel-Tönen, oder ist alles aus einer Pigment-Soße
   gemalt?
4. Aussparung — sind die hellsten Stellen wirklich Papierweiß (von
   Anfang an freigelassen oder maskiert), oder hast du sie mit Gouache
   nachträglich „repariert"?
5. Pigment-Wahl — sind die Schatten kalt-warm-modelliert (z.B. Ultramarin
   für blaue Schatten, Burnt Sienna für warme) oder grau-tot? Liegt
   Komplementär-Kontrast irgendwo im Bild als Akzent?
6. Wasser-Kontrolle — gleichmäßige Washes, keine ungewollten
   Cauliflowers, klare Kanten wo gewollt, weiche Kanten wo gewollt?

Bewerte am Ende auf einer Skala 1-10 für jede der drei Achsen:
KOMPOSITION, WERTSTRUKTUR, AQUARELL-HANDWERK. Nenne die EINE Stelle
im Bild, die am besten funktioniert, und die EINE Stelle, die am
schwächsten ist — mit konkretem Verbesserungs-Vorschlag.`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben</h2>
      <p className="lesson-description">
        Drei Aufgaben aufsteigender Schwierigkeit. Jede deckt mehrere
        Konzepte aus dem Thema ab. Für jede gibt es einen{" "}
        <strong>KI-Review-Prompt</strong> — du fotografierst dein Bild,
        kopierst den Prompt nach Claude, ChatGPT oder Gemini, hängst das
        Foto dran und bekommst strukturiertes Feedback zu den jeweils
        relevanten Punkten.
      </p>

      <div className="info-box">
        <strong>So bekommst du am meisten raus:</strong> Mach die Übung
        zuerst <em>ohne</em> KI-Hilfe. Lade sie hoch und lass dich
        bewerten. Dann male <em>nicht</em> dieselbe Variante mit
        Korrekturen drüber — sondern arbeite die zwei wichtigsten
        Hinweise an einer <em>neuen Version</em> ab. Mehrere Iterationen
        sind wertvoller als ein einziges „perfektes" Bild.
      </div>

      <Aufgabe titel="Aufgabe 1 — Werttreppe + Mini-Wertstudie" schwierigkeit="leicht" zeit="45 min">
        <p>
          Zwei Teile auf einem A4-Blatt. Erst: eine fünf-Stufen-Werttreppe
          in EINEM einzigen Pigment (Ultramarin ist ideal, weil es sich
          gut verdünnen lässt). Dann: eine kleine Landschafts-Studie
          (Postkartengröße) mit GENAU drei Wertstufen aus derselben Farbe.
        </p>
        <AufgabeCheckliste
          items={[
            "Werttreppe: fünf gleichmäßig abgestufte Felder, Stufe 1 fast weiß, Stufe 5 fast schwarz",
            "Studie: drei klare Wertstufen (hell/mittel/dunkel), nicht mehr",
            "Komposition: Horizont nicht in der Mitte, ein klarer Fokus",
            "Saubere Washes — keine Cauliflowers, keine streifigen Schmierungen",
            "Trocknungs-Disziplin: zwischen jeder Schicht komplett durchgetrocknet",
          ]}
        />
        <KiReview prompt={PROMPT_WERTTREPPE} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 2 — Glazing-Vergleich" schwierigkeit="mittel" zeit="1 h">
        <p>
          Zwei gleich große Kreise oder Kugeln nebeneinander. Variante A:
          komplett aus <em>physisch gemischtem</em> Grün (Hansa Yellow +
          Phthalo Blue auf der Palette mischen, dann auftragen). Variante B:
          erst eine dünne <em>Hansa Yellow</em>-Schicht, komplett trocknen
          lassen, dann eine dünne <em>Phthalo Blue</em>-Schicht drüber. In
          beiden auch eine Schatten-Modellierung — wahlweise wieder gemischt
          (A) oder geglast (B).
        </p>
        <AufgabeCheckliste
          items={[
            "Identische Form, identische Größe der beiden Kugeln",
            "A: Pigmente auf der Palette gemischt, dann in EINER Schicht aufgetragen",
            "B: Schicht 1 (Gelb) komplett trocken, BEVOR Schicht 2 (Blau) kommt",
            "Schatten in beiden Varianten — bei B als zusätzliche dünne Glazing-Schicht",
            "Transparente Pigmente (keine Cadmium-Farben) für Glazing",
          ]}
        />
        <KiReview prompt={PROMPT_GLAZING} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 3 — Stillleben mit drei Objekten" schwierigkeit="schwer" zeit="2-3 h">
        <p>
          Ein vollständiges Aquarell-Stillleben (A5 bis A4) mit drei
          farblich unterschiedlichen Objekten — etwa eine gelbe Zitrone,
          ein roter Apfel, eine blaue Vase. Eine klare seitliche Lichtquelle.
          Komposition nach Drittelregel oder goldenem Schnitt geplant.
          Vor dem Malen: <strong>Notan-Studie</strong> auf separatem Blatt.
        </p>
        <AufgabeCheckliste
          items={[
            "Notan-Studie (3 Werte) auf separatem Blatt — bevor du anfängst",
            "Komposition: Fokus-Objekt auf Drittel-/Phi-Schnittpunkt",
            "Drei Massen unterschiedlicher Größe (1:2:3 oder 1:1:5), nicht gleich groß",
            "Hellste Stellen ausgespart von Anfang an (oder maskiert), nicht mit Gouache rein",
            "Schatten kalt-warm modelliert: Ultramarin + Burnt Sienna statt grau",
            "Mindestens eine geglaste Stelle (z.B. Vasen-Schatten)",
            "Komplementär-Akzent irgendwo im Bild (z.B. winziges Rot in einer grünen Stelle)",
          ]}
        />
        <KiReview prompt={PROMPT_STILLLEBEN} />
      </Aufgabe>

      <div className="success-box">
        <strong>Wenn du alle drei geschafft hast:</strong> wiederhole den
        Block in vier Wochen — dieselben drei Aufgaben, dieselben drei
        Prompts. Vergleiche die beiden Versionen direkt nebeneinander.
        Was sich verbessert hat, ist echtes Lernen. Was gleich geblieben
        ist, ist deine nächste Übungsbaustelle.
      </div>
    </div>
  );
}

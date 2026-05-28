import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

const PROMPT_CAFE = `Du bist Concept-Art-Mentor und gibst freundliches,
strukturiertes Feedback zu Illustrationen.

ICH ÜBE: Procreate-Rendering, speziell Lichtbereiche, Schatten und
Material-Differenzierung.

ÜBUNGSAUFGABE: "Café mit vielen Schatten" — ein kleines Café-Interieur
mit klar erkennbarer Lichtquelle, Schlagschatten unter allen Objekten,
und mindestens drei verschiedenen Materialien.

BITTE BEURTEILE MEIN BILD AUF:
1. Lichtquelle — ist sie konsistent? Alle Schatten in dieselbe Richtung?
2. Werte (Schwarz/Weiß-Hierarchie) — wenn man die Sättigung wegnimmt,
   trägt das Bild noch? Drei klare Wert-Stufen erkennbar?
3. Materialien — sehen Holz, Stoff und Keramik wirklich unterschiedlich
   aus, oder hat alles denselben Oberflächen-Charakter?
4. Cast Shadows — weich, richtige Richtung, nicht zu dunkel?
5. Atmosphäre — fühlt sich der Raum bewohnt an?

Gib mir am Ende die ZWEI größten Verbesserungs-Hebel — die, die am
meisten Wirkung pro Aufwand bringen würden. Sei direkt, freundlich,
spezifisch.`;

const PROMPT_PORTRAIT = `Du bist Portrait-Painting-Mentor und gibst
freundliches, strukturiertes Feedback zu digitalen Illustrationen.

ICH ÜBE: Procreate-Rendering, speziell Haut, Rim Light und atmosphärische
Beleuchtung.

ÜBUNGSAUFGABE: "Portrait mit kaltem Rim Light" — ein Halbfigur-Portrait
mit warmem Frontallicht (z.B. Kerze, Lampe) und kaltem Rim Light von
hinten (z.B. Fenster, Mond).

BITTE BEURTEILE MEIN BILD AUF:
1. Subsurface Scattering — leuchten die dünnen Stellen (Ohrkanten,
   Nasenflügel, Fingerränder) leicht rötlich-warm?
2. Rim Light — klar erkennbarer kühler Saum entlang der Konturkante,
   die zur Hinterquelle zeigt? Nicht 360° um die Figur?
3. Color-Temperature-Kontrast — Schatten und Lichtseite haben
   gegensätzliche Temperaturen?
4. Haut-Wertstruktur — drei klare Stufen (hell/mittel/dunkel) auf
   Stirn, Wange, Kinn?
5. Übergänge — weich modelliert (Soft Round), nicht gepatcht?

Identifiziere am Ende die EINE Stelle im Bild, an der das Rendering
am stärksten ist, und die EINE Stelle, an der es am schwächsten ist.`;

const PROMPT_STILLLEBEN = `Du bist Materialdarstellungs-Mentor und
gibst freundliches, sehr direktes Feedback zu Illustrationen.

ICH ÜBE: Procreate-Rendering, speziell die Differenzierung verschiedener
Materialien an demselben Lichtsetup.

ÜBUNGSAUFGABE: "Stillleben Material-Mix" — ein kleines Stillleben mit:
- einer Glasflasche (transparent, mit Highlights und Brechung)
- einem Stück Metall (gebürstet oder Chrom)
- einem Stoff (z.B. zerknitterter Stoff oder gefaltete Decke)
- Optional: ein matter Gegenstand (Apfel, Ton, etc.) als Vergleich

BITTE BEURTEILE MEIN BILD AUF:
1. Material-Lesbarkeit — kann man auf einen Blick erkennen, was Glas
   ist, was Metall, was Stoff? Oder vermischt sich der Eindruck?
2. Specular vs Diffuse — Metall hat scharfe Reflexe, Stoff weiche
   Übergänge, Glas hat klare Highlights UND zeigt den Hintergrund?
3. Umgebungsreflexionen — sind im Metall (und ggf. Glas) Andeutungen
   der Umgebung zu sehen? Auch ohne echten Hintergrund — fiktive
   Umgebung darf angedeutet werden.
4. Wertstruktur über alle Materialien — nicht alles in derselben
   Helligkeitszone, klare Hierarchie was vorne und was hinten ist?
5. Konsistenz der Lichtquelle — alle Highlights aus derselben
   Richtung?

Bewerte am Ende auf einer Skala 1-10, wie gut die DREI Materialien
voneinander unterscheidbar sind. Sei spezifisch und nenne konkrete
Pinselstrich-Ratschläge für die Stellen, die nicht funktionieren.`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben</h2>
      <p className="lesson-description">
        Drei Aufgaben aufsteigender Schwierigkeit. Jede deckt mehrere
        Konzepte aus dem Thema ab. Für jede gibt es einen{" "}
        <strong>KI-Review-Prompt</strong> — du kopierst ihn nach deinem
        Bild in Claude, ChatGPT oder Gemini, hängst dein Bild dran und
        bekommst strukturiertes Feedback zu den jeweils relevanten
        Punkten.
      </p>

      <div className="info-box">
        <strong>So bekommst du am meisten raus:</strong> Mach das Bild
        zuerst <em>ohne</em> KI-Hilfe. Lade es dann hoch und lass dich
        bewerten. Häng danach <em>nicht</em> die KI-Verbesserung dran —
        sondern arbeite die zwei wichtigsten Hinweise an einer{" "}
        <em>neuen Version</em> ab. Iteration über mehrere Versionen ist
        wertvoller als ein einziges „perfektes" Bild.
      </div>

      <Aufgabe titel="Aufgabe 1 — Café mit vielen Schatten" schwierigkeit="leicht" zeit="45 min">
        <p>
          Mal ein kleines Café-Interieur. Klein heißt: vielleicht ein
          Tisch mit Tasse, eine Lampe, ein Fenster im Hintergrund. Lass
          dich nicht von Detail-Verlockung verleiten — der Fokus liegt
          auf Lichtführung und Material-Andeutung.
        </p>
        <AufgabeCheckliste
          items={[
            "Eine klar dominante Lichtquelle (Fenster oder Lampe)",
            "Mindestens 3 verschiedene Materialien (Holz, Keramik, Stoff/Polster)",
            "Schlagschatten unter jedem Objekt — alle in derselben Richtung",
            "Notan-Studie zuerst: drei Wertstufen (hell/mittel/dunkel) klar verteilt",
            "Atmosphäre — eine Stimmung, nicht nur eine Beleuchtung",
          ]}
        />
        <KiReview prompt={PROMPT_CAFE} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 2 — Portrait mit kaltem Rim Light" schwierigkeit="mittel" zeit="1 h">
        <p>
          Halbfigur-Portrait (Schulter aufwärts) mit zwei Lichtquellen:
          warme Hauptbeleuchtung von vorn (Kerze, Tischlampe, Lagerfeuer)
          und ein kaltes Rim Light von hinten (Fenster, Mondlicht, Neon).
          Hier kommen mehrere Konzepte zusammen.
        </p>
        <AufgabeCheckliste
          items={[
            "Warme Frontalbeleuchtung — Highlight und Mid-Tones sichtbar",
            "Kaltes Rim Light — nur entlang einer Konturkante, nicht rundum",
            "Subsurface Scattering — Ohren, Nasenflügel, Übergangszonen leicht rötlich-warm",
            "Color-Temperature-Kontrast — kalte Schatten gegen warme Lichter (oder andersrum)",
            "Haut-Schatten nie reines Grau — immer ein Hauch Wärme drin",
          ]}
        />
        <KiReview prompt={PROMPT_PORTRAIT} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 3 — Stillleben Material-Mix" schwierigkeit="schwer" zeit="2 h">
        <p>
          Ein Stillleben mit drei (oder vier) sehr unterschiedlichen
          Materialien — Glas, Metall, Stoff, optional ein matter
          Vergleich. Eine einzige Lichtquelle. Die Herausforderung: alle
          Materialien stehen unter <em>derselben</em> Beleuchtung, aber
          müssen sich trotzdem klar voneinander unterscheiden.
        </p>
        <AufgabeCheckliste
          items={[
            "Glasflasche — Highlights + Brechung + Hintergrund-Andeutung",
            "Metall — kleines scharfes Specular + Umgebungsbänder + Fresnel-Kante",
            "Stoff — viele kleine weiche Übergänge, keine harten Highlights",
            "Optional: matter Gegenstand (Apfel, Ton) als Lese-Anker",
            "EINE Lichtquelle, alle Schatten konsistent",
            "Konsistente Color-Temperature (z.B. warmes Studiolicht überall)",
          ]}
        />
        <KiReview prompt={PROMPT_STILLLEBEN} />
      </Aufgabe>

      <div className="success-box">
        <strong>Wenn du alle drei geschafft hast:</strong> mach denselben
        Drei-Aufgaben-Block nochmal in zwei Wochen. Vergleiche die Bilder.
        Was sich dann verbessert hat, ist echtes Lernen. Was gleich
        geblieben ist, ist deine nächste Übungsbaustelle.
      </div>
    </div>
  );
}

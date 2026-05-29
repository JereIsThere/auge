import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

const PROMPT_GREIFMUSTER = `Du bist Mentor:in in Ergotherapie-Ausbildung
und gibst freundliches, strukturiertes Feedback zu Beobachtungs-
Reflexionen.

ICH ÜBE: Greifmuster-Klassifikation aus der Handtherapie-Lektion.

AUFGABE: Ich habe über 24h notiert, welche Greifmuster ich in
verschiedenen Alltagssituationen benutze. Meine Notizen folgen.

BITTE BEWERTE MEINE BEOBACHTUNG:
1. Klassifikation — habe ich die Griffe korrekt den Standard-Mustern
   zugeordnet (Pinzetten, Schlüssel, Tripod, Zylinder, Kugel, Haken)?
2. Vollständigkeit — habe ich alle sechs Muster mindestens einmal
   gefunden? Wenn nicht — was hätte ich übersehen können?
3. Wechsel-Pattern — siehst du in meinen Notizen interessante Übergänge
   (z.B. häufiger Wechsel zwischen Griffen bei einer Aufgabe)?
4. Übungsempfehlung — falls ich (oder ein:e Klient:in) ein bestimmtes
   Greifmuster trainieren wollte, welches taucht in meinen Notizen am
   seltensten auf — und welche Alltagsaufgaben würden es trainieren?

Sei konkret, freundlich, und denk wie eine erfahrene Ergo-Lehrkraft.`;

const PROMPT_BEWEGUNG_VERLANGSAMT = `Du bist Bewegungsanalyse-Mentor:in
in Ergotherapie und gibst freundliches, präzises Feedback zu
Selbstbeobachtungen von Bewegungsabläufen.

ICH ÜBE: Bewegungsbeobachtung — eine alltägliche Bewegung in
slow-motion ausgeführt und in Phasen zerlegt.

AUFGABE: Ich habe die Bewegung "Tasse zum Mund führen" verlangsamt
und in folgende Phasen beschrieben. Meine Beschreibung folgt.

BITTE BEWERTE:
1. Phasen-Vollständigkeit — habe ich alle Reach-to-Grasp-Phasen
   identifiziert (Antizipation, Reach, Pre-Shape, Grasp, Lift, Transport,
   Release)? Welche habe ich übersehen?
2. Propriozeptive Aspekte — habe ich Gelenk-Positionen, Muskelspannungen,
   sensorisches Feedback in den verschiedenen Phasen erwähnt? Wo fehlen
   Details?
3. Klinische Übertragung — welche Phase würde bei welcher häufigen
   Pathologie (z.B. Hemiparese, Apraxie, Parkinson) am ehesten gestört
   sein?
4. Übungsidee — nenne mir eine konkrete therapeutische Übung, die genau
   eine der von mir beschriebenen Phasen gezielt trainiert.

Sei differenziert und detailorientiert — Bewegungsanalyse braucht Genauigkeit.`;

const PROMPT_FALL_SKIZZE = `Du bist Supervisor:in in der Neuro-Reha und
gibst freundliches, strukturiertes Feedback zu Therapieplänen von
Auszubildenden.

ICH ÜBE: Therapieplanung für einen Modell-Fall (kein realer Klient).

FALL UND MEIN VORSCHLAG: Beschreibung des Modell-Falls + skizzierter
Therapieplan für die ersten 2 Wochen folgt.

BITTE BEWERTE:
1. Diagnose-Verständnis — passen meine Annahmen über betroffene Bahnen,
   Cortex-Areale, motorische Symptome zur beschriebenen Läsion?
2. Reha-Phasen — Beachte ich die richtigen Lernphasen (kognitiv,
   assoziativ, autonom)? Ist die Reihenfolge der Interventionen
   sinnvoll für die akute/subakute Phase?
3. Intervention-Auswahl — sind die gewählten Methoden (Spiegeltherapie,
   CIMT, Motor Imagery, etc.) für das Fallprofil indiziert? Gibt es
   Kontraindikationen, die ich übersehen habe?
4. Konkrete Übungen — sind meine Übungs-Vorschläge funktional
   (ADL-bezogen) und der Phase angemessen, oder zu abstrakt/zu
   schwierig/zu trivial?
5. Was fehlt — welche wichtigen Aspekte einer Reha-Planung sind nicht
   in meinem Plan (Angehörigen-Anleitung, Hilfsmittel, Domain-
   spezifische Assessments, etc.)?

Sei eine wohlwollende, aber kritisch-spitze Stimme. Stell mir am Ende
EINE Frage zurück, die meinen Plan vertieft.`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben für Ergo-Praxis</h2>
      <p className="lesson-description">
        Drei Reflexions-Aufgaben aufsteigender Tiefe. Jede deckt mehrere
        Konzepte aus dem Thema ab. Für jede gibt es einen{" "}
        <strong>KI-Review-Prompt</strong> — du machst die Beobachtung
        bzw. den Plan selbst, kopierst dann den Prompt mit deinem Text
        in Claude/ChatGPT/Gemini und bekommst strukturiertes Feedback,
        wie es eine erfahrene Ergo-Lehrkraft geben würde.
      </p>

      <div className="info-box">
        <strong>Wichtig:</strong> Die Aufgaben arbeiten mit{" "}
        <em>eigenen Beobachtungen</em> oder <em>Modell-Fällen</em> — nie
        mit realen Patient:innen. Datenschutz und ethische Grenzen
        bleiben unverändert. Für echte Fallbesprechungen ist Supervision
        mit Mensch das richtige Setting, nicht eine KI.
      </div>

      <Aufgabe titel="Aufgabe 1 — 24h Greifmuster-Tagebuch" schwierigkeit="leicht" zeit="24h Beobachtung, 30 min Auswertung">
        <p>
          Notier dir über 24h jede Greifaktion, die dir auffällt. Ziel:
          alle sechs Standard-Greifmuster mindestens einmal beobachten
          und korrekt klassifizieren.
        </p>
        <AufgabeCheckliste
          items={[
            "Mindestens 15 verschiedene Greifaktionen über den Tag verteilt",
            "Pro Aktion notiert: was wurde gehalten, welcher Griff, mit welcher Hand",
            "Versuch jeden der sechs Standard-Griffe zu finden (Pinzette, Schlüssel, Tripod, Zylinder, Kugel, Haken)",
            "Eine kurze Beobachtung: wann hast du im Verlauf einer Aktion zwischen Griffen gewechselt?",
          ]}
        />
        <KiReview prompt={PROMPT_GREIFMUSTER} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 2 — Bewegung in slow-motion zerlegen" schwierigkeit="mittel" zeit="45 min">
        <p>
          Wähl eine alltägliche Bewegung — z.B. „Tasse zum Mund führen",
          „Schuh binden", „Stift aus Federmappe holen". Führe sie
          mehrmals bewusst sehr langsam aus und beschreibe sie in
          Phasen. Achte auf:
        </p>
        <AufgabeCheckliste
          items={[
            "Antizipation — was passiert, BEVOR die Bewegung anfängt? (Blick, Vorbereitung der Hand-Form)",
            "Reach — wie ist die Armführung? Schultern, Ellbogen, Handgelenk?",
            "Pre-Shape — wie formt sich die Hand schon, BEVOR sie das Objekt berührt?",
            "Grasp — der eigentliche Kontakt: welche Finger zuerst, wieviel Kraft?",
            "Transport — wie verändert sich die Bewegung, wenn das Objekt mitbewegt wird?",
            "Release — wie wird losgelassen, gibt es eine Korrekturphase?",
          ]}
        />
        <KiReview prompt={PROMPT_BEWEGUNG_VERLANGSAMT} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 3 — Modell-Fall + Therapieplan" schwierigkeit="schwer" zeit="1.5 h">
        <p>
          Schreib einen kompletten Modell-Fall (keine reale Person!) und
          skizziere einen Therapieplan für die ersten 2 Wochen. Beispiel-
          Skelett:
        </p>
        <AufgabeCheckliste
          items={[
            "Modell-Profil: Alter, Geschlecht, kurz: was ist passiert (z.B. Schlaganfall rechts, Hemiparese links, vor 6 Tagen)",
            "Status: was geht, was nicht (motorisch, sensorisch, ADL-Funktionen)",
            "Reha-Ziele: konkret, messbar, mit Klient:in ausgehandelt",
            "Wochenplan: 5 Tage à 45 min — welche Interventionen, in welcher Phasen-Logik",
            "Begründungen: warum genau diese Methoden, gestützt auf Theorie (Lernphasen, Plastizität, MMC, etc.)",
            "Mögliche Anpassungen, falls etwas nicht klappt",
          ]}
        />
        <KiReview prompt={PROMPT_FALL_SKIZZE} />
      </Aufgabe>

      <div className="success-box">
        <strong>Tipp für die Auswertung:</strong> Mach die Aufgabe immer
        ZUERST komplett selbst, OHNE KI-Vorschläge anzufordern. Dann
        Prompt kopieren, dein Material reinpacken. Wenn das Feedback dich
        überrascht, ist das ein echter Lernmoment — wertvoller als ein
        rundes erstes Ergebnis.
      </div>
    </div>
  );
}

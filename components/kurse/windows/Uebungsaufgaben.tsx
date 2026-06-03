import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import { CmdBlock } from "./CmdBlock";
import "@/components/lessons/lesson.css";
import "./windows.css";

const PROMPT_SHORTCUTS = `Du bist ein geduldiger Windows-Produktivitäts-Coach
und prüfst spielerisch mein Shortcut-Wissen.

KONTEXT: Ich übe gerade, Windows mehr über die Tastatur zu bedienen.
Ich habe mir vorgenommen, einen Vormittag lang die Maus so weit wie
möglich liegen zu lassen und mindestens 10 Shortcuts bewusst zu nutzen.

BITTE MACH FOLGENDES:
1. Quiz mich ab: Stell mir nacheinander 10 Situationen ("Du willst
   schnell den PC sperren", "Du willst zwei Fenster nebeneinander",
   "Du willst den Task-Manager öffnen", …) und lass MICH die Taste(n)
   nennen — verrate die Lösung erst nach meiner Antwort.
2. Decke dabei diese Bereiche ab: Sperren/Desktop, Fenster-Snap,
   virtuelle Desktops, Fenster wechseln, Programm öffnen (Win-tippen),
   Ausführen-Dialog, Zwischenablage-Verlauf, Screenshot, Task-Manager,
   Emoji-Picker.
3. Korrigiere mich freundlich, wenn ich eine veraltete oder falsche
   Kombi nenne, und gib jeweils eine Eselsbrücke.

Werte am Ende aus, wie viele ich sicher konnte, und nenne mir die
ZWEI Shortcuts, die ich als Nächstes ins Muskelgedächtnis bringen
sollte — gemessen daran, wie oft man sie wirklich braucht.`;

const PROMPT_AUFRAEUMEN = `Du bist ein vorsichtiger PowerShell-Mentor und
reviewst meine Befehle, BEVOR ich sie ausführe.

AUFGABE: Mein Downloads-Ordner ist ein Chaos aus PDFs, Bildern, ZIPs
und Installer-EXEs. Ich will ihn NUR mit PowerShell aufräumen: pro
Dateityp einen Unterordner (pdf, bilder, archive, installer) anlegen
und die Dateien per Wildcard dorthin verschieben. Ich hänge meine
geplante Befehls-Abfolge an.

BITTE PRÜFE GENAU:
1. Sicherheit zuerst — habe ich vor dem Verschieben/Löschen mit
   Get-ChildItem oder -WhatIf kontrolliert, was getroffen wird? Wenn
   nicht, zeig mir, wo ich das einbauen muss.
2. Korrektheit — stimmen die Cmdlets (New-Item -ItemType Directory,
   Move-Item) und die Wildcards (*.pdf, *.jpg/*.png, *.zip, *.exe)?
   Fange ich auch .jpeg und .gif mit ab?
3. Reihenfolge — lege ich die Zielordner an, BEVOR ich hineinschiebe?
4. Robustheit — was passiert mit Dateien, die schon existieren, oder
   wenn ein Ordner leer bleibt? Gibt es einen Tippfehler, der Daten
   gefährdet?
5. Eleganz — ließe sich das mit einer ForEach-Object-Schleife oder
   einer Hashtable (Endung → Ordner) kürzer und sicherer schreiben?

Sei streng bei allem, was Daten löschen oder am falschen Ort landen
lassen könnte. Nenne am Ende die ZWEI wichtigsten Verbesserungen.`;

const PROMPT_EINZEILER = `Du bist ein erfahrener PowerShell-Reviewer und
bewertest einen Einzeiler (one-liner).

AUFGABE: Ich soll eine einzige Pipeline schreiben, die die 10 GRÖSSTEN
Dateien unterhalb eines Ordners (inkl. aller Unterordner) findet und
übersichtlich ausgibt: Dateiname und Größe in MB, absteigend sortiert.
Ich hänge meinen Einzeiler an.

BITTE BEURTEILE:
1. Korrektheit — rekursiv gesucht (Get-ChildItem -Recurse -File)?
   Nach Größe absteigend sortiert (Sort-Object Length -Descending)?
   Auf 10 begrenzt (Select-Object -First 10)?
2. Lesbarkeit der Ausgabe — zeige ich Name und Größe sinnvoll an,
   z.B. mit einer berechneten Eigenschaft für MB
   (@{Name='MB'; Expression={ ... }}), oder dumpe ich rohe Byte-Zahlen?
3. Robustheit — was passiert bei Ordnern (haben keine sinnvolle Länge)
   und bei Zugriffsfehlern (-ErrorAction SilentlyContinue)?
4. Stil — ist die Pipeline gut lesbar (Where/Sort/Select in logischer
   Reihenfolge), oder unnötig verschachtelt?

Wenn mein Einzeiler funktioniert, zeig mir EINE elegantere Variante und
erkläre den Unterschied. Wenn er Fehler hat, benenne sie konkret. Nenne
am Schluss die ZWEI größten Hebel, um meine PowerShell-Pipelines besser
zu machen.`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben</h2>
      <p className="lesson-description">
        Drei Aufgaben, die das Gelernte verbinden — von den Shortcuts bis zur
        PowerShell-Pipeline. Jede kommt mit einem{" "}
        <strong>KI-Review-Prompt</strong>: du beschreibst (oder fügst ein), was
        du gemacht hast, kopierst den Prompt nach Claude, ChatGPT oder Gemini
        und bekommst strukturiertes Feedback.
      </p>

      <div className="info-box">
        <strong>Wichtig bei den Shell-Aufgaben:</strong> Teste heikle Befehle
        zuerst mit <span className="mono">-WhatIf</span> oder einem vorgeschalteten{" "}
        <span className="mono">Get-ChildItem</span> mit derselben Wildcard. Und
        übe in einem Test-Ordner, nicht an wichtigen Daten.
      </div>

      <Aufgabe titel="Aufgabe 1 — Der tastatur-freie Vormittag" schwierigkeit="leicht" zeit="halber Tag">
        <p>
          Nimm dir einen Vormittag vor, an dem du die Maus so selten wie möglich
          anfasst. Ziel: mindestens <strong>10 Shortcuts</strong> bewusst und
          wiederholt nutzen, bis sie sich natürlich anfühlen.
        </p>
        <AufgabeCheckliste
          items={[
            "Programme nur per Win-tippen-Enter öffnen (nicht mehr klicken)",
            "Fenster mit Win+Pfeilen anordnen statt mit der Maus ziehen",
            "Mit Alt+Tab und Win+Tab zwischen Fenstern/Desktops wechseln",
            "PC bei jedem Aufstehen mit Win+L sperren",
            "Screenshot mit Win+Shift+S statt PrtSc+Paint",
            "Win+V (Zwischenablage-Verlauf) mindestens einmal sinnvoll nutzen",
            "Am Ende: welche 3 Shortcuts saßen, welche 3 nicht?",
          ]}
        />
        <KiReview prompt={PROMPT_SHORTCUTS} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 2 — Downloads aufräumen, nur mit PowerShell" schwierigkeit="mittel" zeit="45 min">
        <p>
          Räum einen unordentlichen Ordner ausschließlich per PowerShell auf:
          Unterordner pro Dateityp anlegen und die Dateien per Wildcard
          einsortieren. Plane die Befehle, teste mit{" "}
          <span className="mono">-WhatIf</span>, führe sie dann aus. Ein
          Grundgerüst zum Weiterdenken:
        </p>
        <CmdBlock
          tag="PowerShell"
          title="Startpunkt — erweitere & sichere es ab"
          code={`cd ~\\Downloads
New-Item -ItemType Directory pdf, bilder, archive -Force

# ERST prüfen, was getroffen würde:
Get-ChildItem *.pdf

# dann verschieben:
Move-Item *.pdf .\\pdf\\ -WhatIf   # -WhatIf weg, wenn es passt`}
        />
        <AufgabeCheckliste
          items={[
            "Zielordner anlegen, BEVOR du verschiebst (New-Item -ItemType Directory)",
            "Vor jedem Move mit Get-ChildItem oder -WhatIf prüfen, was getroffen wird",
            "Bilder-Wildcards vollständig (*.jpg, *.jpeg, *.png, *.gif)",
            "Installer (*.exe, *.msi) und Archive (*.zip, *.7z, *.rar) abdecken",
            "Keinen Befehl blind ausführen, der löscht oder überschreibt",
            "Bonus: mit ForEach-Object oder einer Endung→Ordner-Zuordnung kürzen",
          ]}
        />
        <KiReview prompt={PROMPT_AUFRAEUMEN} />
      </Aufgabe>

      <Aufgabe titel="Aufgabe 3 — Dein erster Einzeiler" schwierigkeit="schwer" zeit="1 h">
        <p>
          Schreib eine <em>einzige</em> Pipeline, die die <strong>10 größten
          Dateien</strong> unterhalb eines Ordners (inklusive Unterordner)
          findet und sauber ausgibt: Dateiname und Größe in MB, absteigend
          sortiert. Nutze <span className="mono">Get-ChildItem</span>,{" "}
          <span className="mono">Sort-Object</span>,{" "}
          <span className="mono">Select-Object</span> — und für die MB-Spalte
          eine berechnete Eigenschaft.
        </p>
        <AufgabeCheckliste
          items={[
            "Rekursiv und nur Dateien: Get-ChildItem -Recurse -File",
            "Absteigend nach Größe: Sort-Object Length -Descending",
            "Auf 10 begrenzt: Select-Object -First 10",
            "Größe in MB als berechnete Eigenschaft (gerundet), nicht roh in Bytes",
            "Zugriffsfehler abfangen: -ErrorAction SilentlyContinue",
            "Alles als EINE lesbare Pipeline, nicht in mehreren Zeilen-Variablen",
          ]}
        />
        <KiReview prompt={PROMPT_EINZEILER} />
      </Aufgabe>

      <div className="success-box">
        <strong>Wenn du alle drei geschafft hast:</strong> du bedienst Windows
        über die Tastatur, navigierst und verwaltest Dateien in der Shell und
        schreibst eigene Pipelines. Damit bist du von „benutzt Windows" zu
        „beherrscht Windows" gewechselt. Nächster Schritt: ein wiederkehrendes
        Mini-Problem aus deinem Alltag als kleines <span className="mono">.ps1</span>-Skript
        festhalten — und nie wieder von Hand machen.
      </div>
    </div>
  );
}

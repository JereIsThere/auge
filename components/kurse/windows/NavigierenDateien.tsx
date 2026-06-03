import { DepthBox } from "@/components/lessons/DepthBox";
import { Kbd } from "./Kbd";
import { Terminal } from "./Terminal";
import { CmdBlock } from "./CmdBlock";
import "@/components/lessons/lesson.css";
import "./windows.css";

export default function NavigierenDateien() {
  return (
    <div className="lesson-card">
      <h2>Navigieren &amp; Dateien verwalten</h2>
      <p className="lesson-description">
        Ordner wechseln, Dateien anlegen, kopieren, umbenennen, löschen — die
        Brot-und-Butter-Aufgaben. In der Shell gehen sie oft schneller als mit
        Maus und Explorer, vor allem bei vielen Dateien oder festen Abläufen.
      </p>

      <div className="info-box">
        <strong>Pfade verstehen:</strong>{" "}
        <span className="mono">C:\Users\du\Documents</span> ist ein{" "}
        <em>absoluter</em> Pfad (vom Laufwerk an).{" "}
        <span className="mono">.</span> = aktueller Ordner,{" "}
        <span className="mono">..</span> = ein Ordner höher,{" "}
        <span className="mono">~</span> = dein Benutzerordner.
      </div>

      <h3>Navigieren</h3>
      <CmdBlock
        tag="PowerShell"
        title="wo bin ich, und wie komme ich woanders hin?"
        code={`Get-Location              # wo bin ich? (Alias: pwd)
Set-Location Documents    # in Unterordner wechseln (Alias: cd)
cd ..                     # einen Ordner nach oben
cd \\                      # zur Laufwerks-Wurzel C:\\
cd ~                      # in den Benutzerordner
Get-ChildItem             # was liegt hier? (Alias: ls / dir)
Get-ChildItem -Force      # auch versteckte Dateien anzeigen`}
      />
      <p style={{ fontSize: "0.85rem", color: "#475569" }}>
        Spar dir das Tippen: ein paar Buchstaben des Ordnernamens +{" "}
        <Kbd>Tab</Kbd> vervollständigt den Pfad. Mehrfach <Kbd>Tab</Kbd> blättert
        durch die Treffer.
      </p>

      <h3>Anlegen, lesen, kopieren, verschieben, löschen</h3>
      <CmdBlock
        tag="PowerShell"
        title="die fünf Datei-Operationen"
        code={`New-Item -ItemType Directory projekt   # Ordner anlegen (Alias: mkdir)
New-Item notizen.txt                   # leere Datei anlegen (Alias: ni)
Get-Content notizen.txt                # Inhalt anzeigen (Alias: cat)

Copy-Item notizen.txt backup.txt       # kopieren (Alias: cp)
Move-Item backup.txt .\\projekt\\        # verschieben (Alias: mv)
Rename-Item notizen.txt todo.txt       # umbenennen

Remove-Item todo.txt                   # löschen (Alias: rm / del)
Remove-Item projekt -Recurse           # Ordner samt Inhalt löschen`}
      />

      <h3>Ein kleiner Ablauf, Schritt für Schritt</h3>
      <Terminal
        title="Windows PowerShell"
        lines={[
          { typ: "comment", text: "Ein Projekt-Ordner anlegen und reingehen" },
          { typ: "cmd", text: "cd ~\\Documents" },
          { typ: "cmd", text: "mkdir auge-demo" },
          { typ: "out", text: "    Verzeichnis: C:\\Users\\du\\Documents\n\nMode   LastWriteTime      Name\n----   -------------      ----\nd----  03.06.2026 14:40   auge-demo" },
          { typ: "cmd", text: "cd auge-demo" },
          { typ: "cmd", text: "New-Item readme.md" },
          { typ: "out", text: "    Verzeichnis: C:\\Users\\du\\Documents\\auge-demo\n\nMode   LastWriteTime      Length Name\n----   -------------      ------ ----\n-a---  03.06.2026 14:40        0 readme.md" },
          { typ: "cmd", text: "Get-Location" },
          { typ: "out", text: "Path\n----\nC:\\Users\\du\\Documents\\auge-demo" },
        ]}
      />

      <h3>Wildcards: viele Dateien auf einmal</h3>
      <CmdBlock
        tag="PowerShell"
        title="* steht für „irgendwas“"
        code={`Get-ChildItem *.txt          # alle .txt-Dateien hier
Copy-Item *.jpg .\\bilder\\     # alle JPGs in den Ordner bilder
Remove-Item temp-*           # alles, was mit temp- beginnt`}
      />

      <DepthBox variant="why" title="Wann ist die Shell schneller als der Explorer?">
        Bei <strong>Wiederholung und Menge</strong>. „Verschiebe alle 200 PDFs
        in einen Unterordner" ist ein Befehl mit Wildcard statt 200 Klicks. „Mach
        das jeden Montag" lässt sich als Skript speichern. Und auf einem Server
        ohne Bildschirm (per Fernzugriff) ist die Shell oft der einzige Weg.
        Für eine einzelne Datei mal eben verschieben ist der Explorer völlig
        okay — die Shell glänzt, sobald es mehr oder regelmäßig wird.
      </DepthBox>

      <DepthBox variant="mistake" title="Remove-Item landet NICHT im Papierkorb">
        Anders als das Löschen im Explorer wandert{" "}
        <span className="mono">Remove-Item</span> <strong>direkt in die ewige
        Leere</strong> — kein Papierkorb, kein Wiederherstellen. Besonders mit{" "}
        <span className="mono">-Recurse</span> und Wildcards kann ein Tippfehler
        teuer werden. Zwei Schutzmaßnahmen: vorher mit{" "}
        <span className="mono">Get-ChildItem</span> (gleiche Wildcard!) prüfen,{" "}
        <em>was</em> getroffen würde, und bei heiklen Befehlen{" "}
        <span className="mono">-WhatIf</span> anhängen — das zeigt nur an, was
        passieren würde, ohne es zu tun.
      </DepthBox>

      <DepthBox variant="deeper" title="Pfade mit Leerzeichen, Anführungszeichen & -WhatIf">
        <ul>
          <li>
            Pfade mit Leerzeichen <strong>müssen in Anführungszeichen</strong>:{" "}
            <span className="mono">cd "Meine Bilder"</span>. Ohne sie denkt
            PowerShell, „Bilder" sei ein zweites Argument.
          </li>
          <li>
            <span className="mono">-WhatIf</span> ist dein Sicherheitsnetz:{" "}
            <span className="mono">Remove-Item *.tmp -WhatIf</span> sagt dir, was
            es <em>täte</em>, löscht aber nichts.
          </li>
          <li>
            <Kbd>Tab</Kbd> vervollständigt auch Befehls- und Parameternamen, nicht
            nur Pfade — spart Tippen und Tippfehler.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Bis hier hast du einzelne Befehle benutzt. Ihre wahre Stärke entfalten
        sie, wenn du sie <em>verkettest</em> — die Pipeline. „Finde die größten
        Dateien", „beende ein hängendes Programm", „durchsuche Logs" sind
        Einzeiler, sobald du sie verbindest. Das ist die nächste Lektion.
      </DepthBox>
    </div>
  );
}

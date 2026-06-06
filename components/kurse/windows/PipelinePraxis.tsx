import { DepthBox } from "@/components/lessons/DepthBox";
import { Combo } from "./Kbd";
import { Terminal } from "./Terminal";
import { CmdBlock } from "./CmdBlock";
import "@/components/lessons/lesson.css";
import "./windows.css";

export default function PipelinePraxis() {
  return (
    <div className="lesson-card">
      <h2>Die Pipeline &amp; Praxis</h2>
      <p className="lesson-description">
        Einzelne Befehle sind nützlich — verkettet werden sie mächtig. Der{" "}
        senkrechte Strich <span className="mono">|</span> (die „Pipe") reicht das
        Ergebnis eines Befehls an den nächsten weiter. Weil PowerShell{" "}
        <strong>Objekte</strong> durchreicht, kannst du filtern, sortieren und
        auswählen, ohne Text zu zerschneiden.
      </p>

      <div className="info-box">
        <strong>Lies die Pipe als „und dann":</strong>{" "}
        <span className="mono">Get-Process | Sort-Object CPU | Select-Object -First 5</span>{" "}
        = „hol die Prozesse <em>und dann</em> sortiere nach CPU{" "}
        <em>und dann</em> nimm die ersten fünf".
      </div>

      <h3>Die drei Pipeline-Arbeitspferde</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🔎 Where-Object</div>
          <div className="actor-row">
            <strong>Filtern</strong> — behält nur Objekte, die eine Bedingung
            erfüllen. <span className="mono">Where-Object Length -gt 1MB</span>.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">↕️ Sort-Object</div>
          <div className="actor-row">
            <strong>Sortieren</strong> — nach einer Eigenschaft, auf- oder
            absteigend. <span className="mono">Sort-Object CPU -Descending</span>.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">✂️ Select-Object</div>
          <div className="actor-row">
            <strong>Auswählen</strong> — bestimmte Spalten oder die ersten N.{" "}
            <span className="mono">Select-Object Name, CPU -First 5</span>.
          </div>
        </div>
      </div>

      <h3>Praktische Einzeiler</h3>
      <CmdBlock
        tag="PowerShell"
        title="zum Kopieren & Ausprobieren"
        code={`# Die 5 Programme, die gerade am meisten CPU ziehen
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5

# Alle Dateien im Ordner, die größer als 1 MB sind
Get-ChildItem | Where-Object Length -gt 1MB

# Wie viele .log-Dateien liegen hier (auch in Unterordnern)?
Get-ChildItem -Recurse -Filter *.log | Measure-Object

# Alle Zeilen mit "TODO" in allen .txt-Dateien finden (wie grep)
Select-String "TODO" *.txt

# Ein hängendes Programm beenden
Stop-Process -Name notepad`}
      />

      <h3>So sieht das live aus</h3>
      <Terminal
        title="Windows PowerShell"
        lines={[
          { typ: "comment", text: "Top 3 CPU-Fresser" },
          {
            typ: "cmd",
            text: "Get-Process | Sort-Object CPU -Descending | Select-Object Name, CPU -First 3",
          },
          {
            typ: "out",
            text:
              "Name           CPU\n" +
              "----           ---\n" +
              "chrome      842,19\n" +
              "Code        311,77\n" +
              "explorer     96,05",
          },
        ]}
      />

      <h3>Manches braucht Admin-Rechte</h3>
      <p>
        Dienste beenden, systemweite Einstellungen, Software installieren —
        dafür brauchst du eine <strong>erhöhte</strong> Shell. Öffne sie über{" "}
        <Combo keys="Win+X" /> → <em>Terminal (Administrator)</em> (oder
        Rechtsklick aufs Icon → <em>Als Administrator ausführen</em>). Erkennbar
        am <span className="mono">Administrator:</span> im Fenstertitel.
      </p>

      <h3>Skripte ausführen (.ps1)</h3>
      <p>
        Aus Sicherheitsgründen blockiert Windows das Ausführen von
        PowerShell-Skripten standardmäßig. Einmalig pro Benutzer freischalten:
      </p>
      <CmdBlock
        tag="PowerShell (als Admin nicht nötig)"
        title="Skripte für deinen Benutzer erlauben"
        code={`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`}
      />
      <p style={{ fontSize: "0.85rem", color: "#475569" }}>
        <span className="mono">RemoteSigned</span> heißt: deine eigenen Skripte
        laufen, aus dem Internet geladene nur, wenn sie signiert sind — ein
        guter Mittelweg. Ein Skript startest du dann mit{" "}
        <span className="mono">.\\meinskript.ps1</span>.
      </p>

      <DepthBox variant="why" title="Warum ist eine Objekt-Pipeline besser als Text?">
        In Bash/CMD gibt jeder Befehl Text aus, und der nächste muss ihn mühsam
        zerschneiden (welche Spalte ist die Größe? wie ist das Datum
        formatiert?). PowerShell reicht <strong>echte Objekte</strong> weiter:{" "}
        <span className="mono">Sort-Object Length</span> weiß ohne Parsen, was
        die Größe ist, weil jedes Datei-Objekt eine{" "}
        <span className="mono">.Length</span>-Eigenschaft hat. Du beschreibst{" "}
        <em>was</em> du willst (nach Größe sortieren), nicht <em>wie</em> man es
        aus Text herauspult. Das macht Einzeiler kurz und robust.
      </DepthBox>

      <DepthBox variant="mistake" title="„Die Ausführung von Skripts ist deaktiviert“">
        Diese rote Fehlermeldung schreckt viele ab — dabei ist sie nur die
        Standard-Sicherheitseinstellung, kein echtes Problem. Einmal{" "}
        <span className="mono">Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</span>{" "}
        und deine Skripte laufen. <strong>Nicht</strong> empfehlenswert ist{" "}
        <span className="mono">Unrestricted</span> oder das Setzen für{" "}
        <em>alle</em> Benutzer — bleib bei <span className="mono">CurrentUser</span>{" "}
        und <span className="mono">RemoteSigned</span>.
      </DepthBox>

      <DepthBox variant="deeper" title="ForEach-Object und die $_ -Variable">
        Manchmal willst du <em>pro Objekt</em> etwas tun.{" "}
        <span className="mono">ForEach-Object</span> macht das, und{" "}
        <span className="mono">$_</span> ist dabei „das aktuelle Objekt":
        <CmdBlock
          tag="PowerShell"
          code={`# Jede .txt in GROSS umbenennen
Get-ChildItem *.txt | ForEach-Object {
  Rename-Item $_ ($_.BaseName.ToUpper() + ".txt")
}

# Where mit komplexer Bedingung — auch hier $_
Get-ChildItem | Where-Object { $_.Length -gt 1MB -and $_.Extension -eq ".zip" }`}
        />
        Die ausführliche <span className="mono">{`{ $_.… }`}</span>-Schreibweise
        brauchst du, sobald die Bedingung mehr als einen einfachen Vergleich
        hat.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Damit hast du das Terminal-Fundament: Befehle, Navigation, Dateien und
        die Pipeline. Im letzten Teil kommen die grafischen Power-Tools dazu
        (Task-Manager, Zwischenablage-Verlauf, Screenshots) — und dann verbindest
        du in den Übungen alles.
      </DepthBox>
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import { Combo } from "./Kbd";
import { Terminal } from "./Terminal";
import "@/components/lessons/lesson.css";
import "./windows.css";

export default function TerminalLandschaft() {
  return (
    <div className="lesson-card">
      <h2>CMD, PowerShell, Terminal &amp; WSL</h2>
      <p className="lesson-description">
        „Terminal", „Konsole", „Eingabeaufforderung", „PowerShell" — auf Windows
        schwirren vier, fünf Namen herum, und Einsteiger verwechseln sie
        ständig. Diese Lektion räumt auf: was ist was, und wann nimmst du
        welches?
      </p>

      <div className="info-box">
        <strong>Die wichtigste Unterscheidung:</strong> Eine{" "}
        <strong>Shell</strong> ist das <em>Programm, das Befehle versteht</em>{" "}
        (CMD, PowerShell, Bash). Ein <strong>Terminal</strong> ist das{" "}
        <em>Fenster, das eine Shell anzeigt</em>. Das Terminal ist die Bühne,
        die Shell der Schauspieler.
      </div>

      <h3>Die vier, die du kennen solltest</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">⬛ Eingabeaufforderung (CMD)</div>
          <div className="actor-row">
            Die <em>alte</em> Shell aus DOS-Zeiten. Einfach, überall vorhanden,
            aber begrenzt. Arbeitet mit reinem <strong>Text</strong>. Skripte
            sind <span className="mono">.bat</span>-Dateien. Heute v.a. für
            schnelle Kommandos und alte Anleitungen.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">💠 PowerShell</div>
          <div className="actor-row">
            Die <em>moderne</em> Shell. Arbeitet mit <strong>Objekten</strong>{" "}
            statt Text, hat tausende Befehle (Cmdlets) und ist eine echte
            Skriptsprache. Skripte sind <span className="mono">.ps1</span>. Dein
            Haupt-Werkzeug — der Rest des Kurses dreht sich darum.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">🖥️ Windows Terminal</div>
          <div className="actor-row">
            Das <em>moderne Fenster</em> (Bühne), das CMD, PowerShell <em>und</em>{" "}
            WSL in <strong>Tabs</strong> hostet. Schick, anpassbar, mit Splits.
            Keine eigene Shell — es zeigt nur die anderen an.
          </div>
        </div>
        <div className="actor-card alice">
          <div className="actor-title">🐧 WSL</div>
          <div className="actor-row">
            „Windows Subsystem for Linux" — echtes <strong>Linux</strong>{" "}
            (Ubuntu &amp; Co.) mitten in Windows, gestartet per{" "}
            <span className="mono">wsl</span>. Für Entwicklung, Docker und alles,
            was Bash-Befehle erwartet.
          </div>
        </div>
      </div>

      <h3>So öffnest du sie</h3>
      <p>
        Am schnellsten über <Combo keys="Win+R" /> (Kürzel tippen,{" "}
        Enter) oder das Power-User-Menü <Combo keys="Win+X" />:
      </p>
      <Terminal
        title="Win+R — was du tippst"
        prompt="Ausführen ›"
        lines={[
          { typ: "cmd", text: "cmd          " },
          { typ: "out", text: "→ Eingabeaufforderung" },
          { typ: "cmd", text: "powershell   " },
          { typ: "out", text: "→ Windows PowerShell" },
          { typ: "cmd", text: "wt           " },
          { typ: "out", text: "→ Windows Terminal (falls installiert)" },
          { typ: "cmd", text: "wsl          " },
          { typ: "out", text: "→ Linux-Shell (falls installiert)" },
        ]}
      />
      <p style={{ fontSize: "0.85rem", color: "#475569" }}>
        Tipp: Im Datei-Explorer in der Adressleiste{" "}
        <span className="mono">powershell</span> tippen und Enter — die Shell
        öffnet direkt im aktuellen Ordner.
      </p>

      <DepthBox variant="why" title="Warum gibt es überhaupt so viele?">
        Geschichte. <strong>CMD</strong> stammt aus den 80ern (MS-DOS) und blieb
        aus Kompatibilität erhalten. <strong>PowerShell</strong> kam 2006, um die
        Grenzen von CMD zu sprengen — objektbasiert, skriptfähig, für
        Administration gemacht. <strong>Windows Terminal</strong> (2019) löste
        das hässliche, unflexible Konsolenfenster ab und bündelt alles in Tabs.{" "}
        <strong>WSL</strong> kam, weil Entwickler Linux-Werkzeuge wollten, ohne
        den Rechner zu wechseln. Jede Schicht ist eine Antwort auf die Grenzen
        der vorigen.
      </DepthBox>

      <DepthBox variant="mistake" title="PowerShell für „das schwarze Fenster“ halten">
        CMD und PowerShell sehen sich ähnlich (dunkles Fenster, blinkender
        Cursor), sind aber grundverschieden. Erkennungszeichen: Der{" "}
        PowerShell-Prompt beginnt mit <span className="mono">PS</span>{" "}
        (<span className="mono">PS C:\Users\du&gt;</span>), CMD nur mit dem Pfad
        (<span className="mono">C:\Users\du&gt;</span>). Viele alte Anleitungen
        zeigen CMD-Befehle — die meisten laufen in PowerShell auch, aber nicht
        alle umgekehrt. Im Zweifel: PowerShell nehmen.
      </DepthBox>

      <DepthBox variant="deeper" title="Windows PowerShell 5.1 vs. PowerShell 7">
        Es gibt zwei PowerShells: <strong>Windows PowerShell 5.1</strong>{" "}
        (<span className="mono">powershell.exe</span>, blau, in Windows
        eingebaut, wird nicht mehr weiterentwickelt) und{" "}
        <strong>PowerShell 7+</strong> (<span className="mono">pwsh.exe</span>,
        schwarz, plattformübergreifend, muss man installieren, aktiv gepflegt).
        Für den Alltag reicht die eingebaute 5.1 völlig; für ernsthaftes
        Skripten lohnt 7. Beide verstehen dieselben Grundlagen aus diesem Kurs.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Ab jetzt arbeiten wir in <strong>PowerShell</strong>. Die nächste
        Lektion zeigt, wie ihre Befehle aufgebaut sind (Verb-Noun) und warum sie
        bequemer ist, als sie aussieht — mit einem Konsolen-Simulator zum
        Ausprobieren.
      </DepthBox>
    </div>
  );
}

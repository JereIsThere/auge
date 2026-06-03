import { DepthBox } from "@/components/lessons/DepthBox";
import { Kbd, Combo } from "./Kbd";
import { TerminalSim, type SimCommand } from "./Terminal";
import { CmdBlock } from "./CmdBlock";
import "@/components/lessons/lesson.css";
import "./windows.css";

const SIM: SimCommand[] = [
  {
    label: "Get-Date",
    cmd: "Get-Date",
    out: "Dienstag, 3. Juni 2026 14:32:08",
  },
  {
    label: "Get-Location (pwd)",
    cmd: "Get-Location",
    out: "Path\n----\nC:\\Users\\du",
  },
  {
    label: "Get-ChildItem (ls)",
    cmd: "Get-ChildItem",
    out:
      "    Verzeichnis: C:\\Users\\du\n\n" +
      "Mode   LastWriteTime        Length Name\n" +
      "----   -------------        ------ ----\n" +
      "d----  01.06.2026 09:14            Desktop\n" +
      "d----  28.05.2026 17:02            Documents\n" +
      "d----  30.05.2026 11:48            Downloads\n" +
      "-a---  02.06.2026 22:10      1480  notizen.txt",
  },
  {
    label: "Rechnen",
    cmd: '"1 + 2 ergibt $(1 + 2)"',
    out: "1 + 2 ergibt 3",
  },
  {
    label: "Get-Command *Process*",
    cmd: "Get-Command *Process*",
    out:
      "CommandType  Name            Source\n" +
      "-----------  ----            ------\n" +
      "Cmdlet       Get-Process     Microsoft.PowerShell...\n" +
      "Cmdlet       Start-Process   Microsoft.PowerShell...\n" +
      "Cmdlet       Stop-Process    Microsoft.PowerShell...\n" +
      "Cmdlet       Wait-Process    Microsoft.PowerShell...",
  },
];

const ALIASE: { alias: string; cmdlet: string }[] = [
  { alias: "ls / dir / gci", cmdlet: "Get-ChildItem" },
  { alias: "cd / sl", cmdlet: "Set-Location" },
  { alias: "pwd / gl", cmdlet: "Get-Location" },
  { alias: "cat / gc", cmdlet: "Get-Content" },
  { alias: "cp / copy", cmdlet: "Copy-Item" },
  { alias: "mv / move", cmdlet: "Move-Item" },
  { alias: "rm / del", cmdlet: "Remove-Item" },
  { alias: "cls / clear", cmdlet: "Clear-Host" },
  { alias: "man", cmdlet: "Get-Help" },
  { alias: "ps", cmdlet: "Get-Process" },
];

export default function PowershellGrundlagen() {
  return (
    <div className="lesson-card">
      <h2>PowerShell-Grundlagen</h2>
      <p className="lesson-description">
        PowerShell wirkt einschüchternd — ist aber bemerkenswert logisch
        aufgebaut. Wenn du das Benennungs-Muster und drei Hilfs-Befehle kennst,
        kannst du dir den Rest selbst erschließen, statt alles auswendig zu
        lernen.
      </p>

      <div className="info-box">
        <strong>Das Grundgesetz:</strong> Jeder Befehl (ein „Cmdlet") heißt{" "}
        <span className="mono">Verb-Nomen</span> — eine Tätigkeit und ein Ding.{" "}
        <span className="mono">Get-Process</span>,{" "}
        <span className="mono">Stop-Service</span>,{" "}
        <span className="mono">Get-ChildItem</span>. Errätst du das Verb und das
        Nomen, errätst du den Befehl.
      </div>

      <h3>Probier es aus</h3>
      <p>
        Klick die Befehle — der Simulator zeigt, was PowerShell antworten würde:
      </p>
      <TerminalSim commands={SIM} />

      <h3>Die wichtigsten Verben</h3>
      <p>
        Mit einer Handvoll Verben deckst du fast alles ab:{" "}
        <span className="mono">Get</span> (holen/anzeigen),{" "}
        <span className="mono">Set</span> (ändern),{" "}
        <span className="mono">New</span> (erstellen),{" "}
        <span className="mono">Remove</span> (löschen),{" "}
        <span className="mono">Start</span> / <span className="mono">Stop</span>.
        Kombiniert mit einem Nomen ergibt das den Befehl.
      </p>

      <h3>Du kennst die Befehle schon — als Aliase</h3>
      <p>
        PowerShell akzeptiert viele vertraute Kurzformen aus CMD und Linux. Sie
        sind nur <em>Spitznamen</em> für die echten Cmdlets:
      </p>
      <div className="cheats">
        {ALIASE.map((a) => (
          <div className="cheat" key={a.alias}>
            <span className="cheat-keys mono" style={{ minWidth: 130 }}>{a.alias}</span>
            <span className="cheat-desc mono">→ {a.cmdlet}</span>
          </div>
        ))}
      </div>

      <h3>Die drei Befehle, mit denen du dich selbst rettest</h3>
      <CmdBlock
        tag="PowerShell"
        title="Hilfe zur Selbsthilfe"
        code={`Get-Help Get-ChildItem          # erklärt einen Befehl
Get-Help Get-ChildItem -Examples # zeigt Beispiele (am nützlichsten!)
Get-Command *service*            # findet Befehle nach Stichwort
Get-Member                       # zeigt, was ein Objekt kann (per Pipe)`}
      />

      <DepthBox variant="why" title="Warum das starre Verb-Nomen-Schema ein Geschenk ist">
        Weil es Befehle <em>vorhersagbar</em> macht. Du willst Prozesse
        beenden? Das Verb fürs Beenden ist <span className="mono">Stop</span>,
        das Nomen <span className="mono">Process</span> →{" "}
        <span className="mono">Stop-Process</span>. Du musst den Befehl nicht
        kennen, du <em>konstruierst</em> ihn. Mit{" "}
        <Kbd>Tab</Kbd>-Vervollständigung tippst du{" "}
        <span className="mono">Get-Ch</span> + <Kbd>Tab</Kbd> und PowerShell
        vervollständigt zu <span className="mono">Get-ChildItem</span>. Das ist
        der ganze Trick: raten, Tab, fertig.
      </DepthBox>

      <DepthBox variant="mistake" title="Annehmen, dass ls sich wie unter Linux verhält">
        <span className="mono">ls</span> ist in PowerShell nur ein Alias für{" "}
        <span className="mono">Get-ChildItem</span> — und das nimmt{" "}
        <em>andere</em> Optionen als das Linux-<span className="mono">ls</span>.{" "}
        <span className="mono">ls -la</span> funktioniert nicht;{" "}
        richtig ist <span className="mono">Get-ChildItem -Force</span>. Die
        Aliase helfen beim Einstieg, aber die <em>Parameter</em> gehören dem
        Cmdlet. Im Zweifel <span className="mono">Get-Help &lt;befehl&gt; -Examples</span>.
      </DepthBox>

      <DepthBox variant="deeper" title="Der große Unterschied: Objekte statt Text">
        In CMD und Bash fließt zwischen Befehlen reiner <em>Text</em>, den man
        mühsam zerschneiden muss. PowerShell gibt <strong>Objekte</strong>{" "}
        weiter — strukturierte Dinge mit benannten Eigenschaften.{" "}
        <span className="mono">Get-ChildItem</span> liefert nicht Text, sondern
        Datei-Objekte mit <span className="mono">.Name</span>,{" "}
        <span className="mono">.Length</span>,{" "}
        <span className="mono">.LastWriteTime</span>. Deshalb kannst du sofort
        nach Größe sortieren oder filtern, ohne Spalten zu parsen. Genau das
        macht die Pipeline so mächtig — die übernächste Lektion.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Jetzt kennst du den Aufbau. Als Nächstes nutzt du ihn praktisch: durch
        Ordner navigieren und Dateien anlegen, kopieren, löschen — die
        alltäglichsten Aufgaben, nur ohne Maus.
      </DepthBox>
    </div>
  );
}

import { DepthBox } from "@/components/lessons/DepthBox";
import { Combo } from "./Kbd";
import "@/components/lessons/lesson.css";
import "./windows.css";

const TOOLS: { keys: string; desc: string }[] = [
  { keys: "Ctrl+Shift+Esc", desc: "Task-Manager — hängende Programme beenden, Autostart, Auslastung" },
  { keys: "Win+V", desc: "Zwischenablage-Verlauf — die letzten kopierten Dinge, anpinnbar" },
  { keys: "Win+Shift+S", desc: "Ausschnitt-Screenshot in die Zwischenablage (Snipping)" },
  { keys: "Win+PrtSc", desc: "Screenshot als Datei (Bilder\\Bildschirmfotos)" },
  { keys: "Win+.", desc: "Emoji-, Symbol- & GIF-Picker" },
  { keys: "Win+H", desc: "Diktieren — Sprache zu Text in jedem Textfeld" },
  { keys: "Win+;", desc: "Emoji-Picker (Alternative zu Win+.)" },
  { keys: "Win+X", desc: "Power-User-Menü: Terminal, Geräte-Manager, Apps & Features…" },
];

export default function PowerTools() {
  return (
    <div className="lesson-card">
      <h2>Eingebaute Power-Tools</h2>
      <p className="lesson-description">
        Windows bringt mächtige Werkzeuge mit, die kaum jemand kennt — von einem
        Zwischenablage-Verlauf bis zu OCR per Mausklick. Hier die, die im Alltag
        am meisten bringen.
      </p>

      <div className="cheats">
        {TOOLS.map((t) => (
          <div className="cheat" key={t.keys}>
            <span className="cheat-keys">
              {t.keys.split(" / ").map((s, i) => (
                <span key={i}>
                  {i > 0 ? <span style={{ color: "#94a3b8" }}> / </span> : null}
                  <Combo keys={s} />
                </span>
              ))}
            </span>
            <span className="cheat-desc">{t.desc}</span>
          </div>
        ))}
      </div>

      <h3>Die drei, die deinen Alltag ändern</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">📋 Zwischenablage-Verlauf</div>
          <div className="actor-row">
            <Combo keys="Win+V" /> statt nur <Combo keys="Ctrl+V" />: Windows
            merkt sich die letzten <em>mehreren</em> kopierten Texte und Bilder.
            Du kannst gezielt einen älteren auswählen und wichtige anpinnen.
            Beim ersten Mal einmalig aktivieren.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">✂️ Snipping (Win+Shift+S)</div>
          <div className="actor-row">
            Bildschirm wird abgedunkelt, du ziehst ein Rechteck — fertig ist der
            Screenshot in der Zwischenablage. Rechteck, Fenster, Freihand oder
            Vollbild. Schlägt „PrtSc → Paint → zuschneiden" um Längen.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">📊 Task-Manager</div>
          <div className="actor-row">
            <Combo keys="Ctrl+Shift+Esc" /> öffnet ihn direkt (ohne Umweg über
            Strg+Alt+Entf). Hängende App beenden, im Tab <em>Autostart</em>{" "}
            Bremsklötze beim Hochfahren abschalten, Auslastung im Blick.
          </div>
        </div>
      </div>

      <h3>Noch eine Stufe weiter: PowerToys</h3>
      <p>
        <strong>PowerToys</strong> ist ein kostenloses Zusatzpaket von Microsoft
        (über den Microsoft Store oder <span className="mono">winget install Microsoft.PowerToys</span>).
        Es rüstet Funktionen nach, die vielen fehlen:
      </p>
      <dl className="kv-table">
        <dt>PowerToys Run</dt>
        <dd>Alt+Space — Spotlight-artiger Schnellstarter für Apps, Dateien, Rechnen</dd>
        <dt>FancyZones</dt>
        <dd>eigene Fenster-Raster definieren (mehr als Snap kann)</dd>
        <dt>Color Picker</dt>
        <dd>Farbe von jedem Pixel auf dem Bildschirm abgreifen</dd>
        <dt>Text Extractor</dt>
        <dd>OCR — Text aus jedem Bildbereich kopieren</dd>
        <dt>Image Resizer</dt>
        <dd>Bilder per Rechtsklick stapelweise verkleinern</dd>
        <dt>Always on Top</dt>
        <dd>ein Fenster immer im Vordergrund halten</dd>
      </dl>

      <DepthBox variant="why" title="Warum der Zwischenablage-Verlauf so viel spart">
        Die normale Zwischenablage hält genau <em>eine</em> Sache — kopierst du
        etwas Neues, ist das Alte weg. Beim Zusammentragen aus mehreren Quellen
        (drei Werte aus einer Tabelle, zwei Links, ein Codeschnipsel) springst
        du sonst ständig hin und her. <Combo keys="Win+V" /> hebt die letzten
        Einträge auf — du kopierst alles in einem Rutsch und fügst dann der Reihe
        nach ein. Was du oft brauchst (deine Adresse, eine Signatur), pinnst du
        fest an.
      </DepthBox>

      <DepthBox variant="mistake" title="PrtSc → Paint → zuschneiden">
        Der klassische Umweg: ganze Taste <em>Druck</em>, in Paint einfügen,
        mühsam zuschneiden, speichern. <Combo keys="Win+Shift+S" /> macht all das
        in einer Geste — Bereich ziehen, fertig im Clipboard, direkt einfügen.
        Brauchst du eine Datei statt Zwischenablage, nimm{" "}
        <Combo keys="Win+PrtSc" /> (landet automatisch unter{" "}
        <span className="mono">Bilder\\Bildschirmfotos</span>).
      </DepthBox>

      <DepthBox variant="deeper" title="winget — der Paketmanager für Apps">
        Was <span className="mono">apt</span> für Linux ist, ist{" "}
        <span className="mono">winget</span> für Windows: Programme per Befehl
        installieren, ohne Browser und Setup-Assistenten.{" "}
        <span className="mono">winget install Mozilla.Firefox</span>,{" "}
        <span className="mono">winget upgrade --all</span> aktualisiert alles auf
        einmal. Ist in modernen Windows-Versionen eingebaut und läuft direkt in
        PowerShell — die perfekte Verbindung von Terminal und Alltag.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        FancyZones knüpft an die Snap-Lektion an, PowerToys Run an „Programme
        schnell öffnen", <span className="mono">winget</span> an PowerShell.
        Alles greift ineinander — und in den Übungsaufgaben bringst du es
        zusammen.
      </DepthBox>
    </div>
  );
}

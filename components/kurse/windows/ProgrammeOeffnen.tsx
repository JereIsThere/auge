"use client";

import { useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { Combo, Kbd } from "./Kbd";
import "@/components/lessons/lesson.css";
import "./windows.css";

type App = { name: string; typ: string; icon: string };

const APPS: App[] = [
  { name: "Editor", typ: "App", icon: "📝" },
  { name: "Eingabeaufforderung", typ: "App", icon: "⬛" },
  { name: "Einstellungen", typ: "App", icon: "⚙️" },
  { name: "Explorer", typ: "App", icon: "📁" },
  { name: "Geräte-Manager", typ: "Systemsteuerung", icon: "🔧" },
  { name: "Paint", typ: "App", icon: "🎨" },
  { name: "PowerShell", typ: "App", icon: "💠" },
  { name: "Rechner", typ: "App", icon: "🧮" },
  { name: "Snipping Tool", typ: "App", icon: "✂️" },
  { name: "Systemsteuerung", typ: "App", icon: "🛠️" },
  { name: "Task-Manager", typ: "App", icon: "📊" },
  { name: "Terminal", typ: "App", icon: "🖥️" },
  { name: "Bluetooth-Einstellungen", typ: "Einstellung", icon: "📶" },
  { name: "Sound-Einstellungen", typ: "Einstellung", icon: "🔊" },
];

type RunCmd = { cmd: string; oeffnet: string };

const RUN: RunCmd[] = [
  { cmd: "cmd", oeffnet: "Eingabeaufforderung (CMD)" },
  { cmd: "powershell", oeffnet: "Windows PowerShell" },
  { cmd: "wt", oeffnet: "Windows Terminal (falls installiert)" },
  { cmd: "ms-settings:", oeffnet: "Einstellungen-App" },
  { cmd: "control", oeffnet: "klassische Systemsteuerung" },
  { cmd: "calc", oeffnet: "Rechner" },
  { cmd: "notepad", oeffnet: "Editor" },
  { cmd: "taskmgr", oeffnet: "Task-Manager" },
  { cmd: "regedit", oeffnet: "Registrierungs-Editor (Vorsicht!)" },
  { cmd: "services.msc", oeffnet: "Dienste-Verwaltung" },
  { cmd: "devmgmt.msc", oeffnet: "Geräte-Manager" },
  { cmd: "ncpa.cpl", oeffnet: "Netzwerkadapter" },
  { cmd: "appwiz.cpl", oeffnet: "Programme deinstallieren" },
  { cmd: "%appdata%", oeffnet: "AppData\\Roaming-Ordner" },
  { cmd: "%temp%", oeffnet: "temporärer Ordner" },
  { cmd: ".", oeffnet: "dein Benutzerordner im Explorer" },
];

export default function ProgrammeOeffnen() {
  const [q, setQ] = useState("");

  const treffer = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s === "") return [];
    return APPS.filter((a) => a.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="lesson-card">
      <h2>Programme blitzschnell öffnen</h2>
      <p className="lesson-description">
        Es gibt drei Geschwindigkeiten, ein Programm zu starten. Die langsamste
        (Maus → Startmenü → suchen → klicken) ist die, die die meisten benutzen.
        Hier sind die zwei schnellen.
      </p>

      <h3>1. Start-Suche: <Kbd>Win</Kbd> → tippen → <Kbd>Enter</Kbd></h3>
      <p>
        Drück <Kbd>Win</Kbd>, tippe die ersten Buchstaben, drück{" "}
        <Kbd>Enter</Kbd>. Probier es im Simulator — tippe z.B.{" "}
        <span className="mono">power</span>, <span className="mono">rech</span>{" "}
        oder <span className="mono">explo</span>:
      </p>

      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #cbd5e1",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
        }}
        className="start-sim"
      >
        {treffer.length > 0 ? (
          <div
            style={{
              fontSize: "0.7rem",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "2px 0 8px",
            }}
          >
            Beste Übereinstimmung
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
          {treffer.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "0.88rem", padding: "6px 4px" }}>
              {q.trim() === ""
                ? "↓ Hier tippen — die Treffer erscheinen wie im echten Startmenü."
                : "Keine App gefunden. (Im echten Windows käme jetzt die Web-Suche.)"}
            </div>
          ) : (
            treffer.map((a, i) => (
              <div
                key={a.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 9px",
                  borderRadius: 8,
                  background: i === 0 ? "#e0edff" : "transparent",
                }}
              >
                <span style={{ fontSize: 20 }} aria-hidden>
                  {a.icon}
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: i === 0 ? 700 : 500, color: "#0f172a" }}>
                    {a.name}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{a.typ}</span>
                </span>
                {i === 0 ? (
                  <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#2563eb" }}>
                    ↵ Enter
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>

        <input
          type="text"
          className="win-search"
          placeholder="🔍 Suchen — App, Einstellung, Datei…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>

      <h3 style={{ marginTop: 22 }}>2. Taskleiste: <Kbd>Win</Kbd>+<Kbd>1</Kbd> bis <Kbd>9</Kbd></h3>
      <p>
        Häng deine wichtigsten Programme an die Taskleiste (Rechtsklick →{" "}
        <em>An Taskleiste anheften</em>). Dann startet{" "}
        <Combo keys="Win+1" /> das erste, <Combo keys="Win+2" /> das zweite usw.
        — feste Plätze, blind erreichbar. Ist das Programm schon offen, wechselt
        der Shortcut dorthin.
      </p>

      <h3>3. Ausführen-Dialog: <Combo keys="Win+R" /></h3>
      <p>
        Der schnellste Weg zu System-Werkzeugen und Ordnern. <Combo keys="Win+R" />,
        Kürzel tippen, <Kbd>Enter</Kbd>. Die wichtigsten:
      </p>
      <div className="cheats">
        {RUN.map((r) => (
          <div className="cheat" key={r.cmd}>
            <span className="cheat-keys mono" style={{ color: "#2563eb", fontWeight: 600 }}>
              {r.cmd}
            </span>
            <span className="cheat-desc">{r.oeffnet}</span>
          </div>
        ))}
      </div>

      <DepthBox variant="why" title="Warum die Such-Methode jeden Menü-Klick schlägt">
        Im Startmenü zu klicken heißt: das richtige Kachel-/Listen-Element mit
        den Augen finden und treffen — bei jedem Start neu. Die Suche braucht nur
        die <em>ersten Buchstaben</em>, die du ohnehin im Kopf hast. „pow"+Enter
        ist immer gleich, egal wo das Icon gerade liegt oder wie voll das Menü
        ist. Du musst nichts <em>finden</em>, nur <em>benennen</em> — und das
        geht blind.
      </DepthBox>

      <DepthBox variant="mistake" title="Den ganzen Namen tippen (und auf das Menü warten)">
        Zwei Anfänger-Bremsen: (1) Du tippst „Eingabeaufforderung" komplett —
        dabei reichen „cmd" oder „einga". (2) Du drückst <Kbd>Win</Kbd> und{" "}
        <em>wartest</em>, bis das Menü fertig aufgebaut ist, bevor du tippst.
        Nicht nötig: tipp sofort los, Windows sammelt die Anschläge. <Kbd>Win</Kbd>,
        „cmd", <Kbd>Enter</Kbd> — in unter einer Sekunde durch.
      </DepthBox>

      <DepthBox variant="deeper" title="Eigene Hotkeys & Umgebungs-Ordner">
        <ul>
          <li>
            <strong>Eigener Tastatur-Start:</strong> Rechtsklick auf eine
            Verknüpfung → <em>Eigenschaften</em> → Feld <em>Tastenkombination</em>.
            Tippst du dort z.B. <Combo keys="Ctrl+Alt+N" />, startet das Programm
            künftig per dieser Kombi.
          </li>
          <li>
            <strong>Umgebungsvariablen als Ordner:</strong> In{" "}
            <Combo keys="Win+R" /> oder der Explorer-Adressleiste öffnen{" "}
            <span className="mono">%appdata%</span>,{" "}
            <span className="mono">%temp%</span>,{" "}
            <span className="mono">%userprofile%</span> direkt den jeweiligen
            Ordner — egal unter welchem Benutzernamen.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        <Combo keys="Win+R" /> mit <span className="mono">cmd</span>,{" "}
        <span className="mono">powershell</span> oder{" "}
        <span className="mono">wt</span> ist schon die Brücke zum nächsten
        Kapitel: dem Terminal. Was diese drei eigentlich sind und wann du welche
        nimmst, klärt die nächste Lektion.
      </DepthBox>
    </div>
  );
}

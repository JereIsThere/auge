"use client";

import { Fragment, useMemo, useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { Kbd, Combo } from "./Kbd";
import "@/components/lessons/lesson.css";
import "./windows.css";

type Kat = "grundlagen" | "fenster" | "text" | "oeffnen" | "browser" | "profi";

const KATEGORIEN: { id: Kat; label: string }[] = [
  { id: "grundlagen", label: "🧩 Grundlagen" },
  { id: "fenster", label: "🪟 Fenster" },
  { id: "text", label: "✍️ Text" },
  { id: "oeffnen", label: "🚀 Öffnen" },
  { id: "browser", label: "🌐 Browser" },
  { id: "profi", label: "⭐ Profi" },
];

type SC = { keys: string; desc: string; kat: Kat };

const SHORTCUTS: SC[] = [
  { keys: "Win", desc: "Startmenü öffnen — danach lostippen, um zu suchen", kat: "grundlagen" },
  { keys: "Win+D", desc: "Desktop anzeigen / alle Fenster ausblenden", kat: "grundlagen" },
  { keys: "Win+L", desc: "PC sperren (immer beim Weggehen!)", kat: "grundlagen" },
  { keys: "Win+E", desc: "Datei-Explorer öffnen", kat: "grundlagen" },
  { keys: "Win+I", desc: "Einstellungen öffnen", kat: "grundlagen" },
  { keys: "Alt+F4", desc: "Aktives Programm schließen", kat: "grundlagen" },
  { keys: "Ctrl+Shift+Esc", desc: "Task-Manager direkt öffnen", kat: "grundlagen" },

  { keys: "Alt+Tab", desc: "Zwischen offenen Fenstern wechseln (halten + Tab)", kat: "fenster" },
  { keys: "Win+Tab", desc: "Task-Ansicht: alle Fenster und Desktops", kat: "fenster" },
  { keys: "Win+← / Win+→", desc: "Fenster links/rechts andocken (Snap)", kat: "fenster" },
  { keys: "Win+↑ / Win+↓", desc: "Fenster maximieren / minimieren", kat: "fenster" },
  { keys: "Win+Shift+← / Win+Shift+→", desc: "Fenster auf den anderen Monitor schieben", kat: "fenster" },
  { keys: "Win+Ctrl+D", desc: "Neuen virtuellen Desktop erstellen", kat: "fenster" },
  { keys: "Win+Ctrl+← / Win+Ctrl+→", desc: "Virtuellen Desktop wechseln", kat: "fenster" },
  { keys: "Win+M", desc: "Alle Fenster minimieren", kat: "fenster" },

  { keys: "Ctrl+C / Ctrl+X / Ctrl+V", desc: "Kopieren / Ausschneiden / Einfügen", kat: "text" },
  { keys: "Ctrl+Z / Ctrl+Y", desc: "Rückgängig / Wiederherstellen", kat: "text" },
  { keys: "Ctrl+A", desc: "Alles markieren", kat: "text" },
  { keys: "Ctrl+S", desc: "Speichern", kat: "text" },
  { keys: "Ctrl+F", desc: "Im Dokument / auf der Seite suchen", kat: "text" },
  { keys: "Ctrl+← / Ctrl+→", desc: "Wortweise statt buchstabenweise springen", kat: "text" },
  { keys: "Shift+Entf", desc: "Endgültig löschen (am Papierkorb vorbei)", kat: "text" },
  { keys: "F2", desc: "Datei im Explorer umbenennen", kat: "text" },

  { keys: "Win+R", desc: "Ausführen-Dialog (Programme/Befehle direkt starten)", kat: "oeffnen" },
  { keys: "Win+S", desc: "Suche öffnen (App, Datei, Web)", kat: "oeffnen" },
  { keys: "Win+1", desc: "Erstes Programm in der Taskleiste starten/wechseln (Win+1..9)", kat: "oeffnen" },
  { keys: "Win+T", desc: "Durch die Taskleisten-Symbole blättern", kat: "oeffnen" },

  { keys: "Ctrl+T", desc: "Neuen Tab öffnen", kat: "browser" },
  { keys: "Ctrl+W", desc: "Aktuellen Tab schließen", kat: "browser" },
  { keys: "Ctrl+Shift+T", desc: "Versehentlich geschlossenen Tab zurückholen", kat: "browser" },
  { keys: "Ctrl+L", desc: "Adressleiste fokussieren (auch Alt+D)", kat: "browser" },

  { keys: "Win+V", desc: "Zwischenablage-Verlauf (mehrere kopierte Dinge)", kat: "profi" },
  { keys: "Win+Shift+S", desc: "Ausschnitt-Screenshot (Snipping)", kat: "profi" },
  { keys: "Win+.", desc: "Emoji- & Symbol-Picker", kat: "profi" },
  { keys: "Win+P", desc: "Anzeige projizieren (zweiter Bildschirm/Beamer)", kat: "profi" },
  { keys: "Win+X", desc: "Power-User-Menü (Geräte-Manager, Terminal, …)", kat: "profi" },
];

function Keys({ combo }: { combo: string }) {
  const alts = combo.split(" / ");
  return (
    <>
      {alts.map((a, i) => (
        <Fragment key={i}>
          {i > 0 ? <span style={{ color: "#94a3b8", margin: "0 4px" }}>/</span> : null}
          <Combo keys={a} />
        </Fragment>
      ))}
    </>
  );
}

export default function Shortcuts() {
  const [kat, setKat] = useState<Kat | "alle">("alle");
  const [suche, setSuche] = useState("");

  const gefiltert = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return SHORTCUTS.filter((s) => {
      const katOk = kat === "alle" || s.kat === kat;
      const sucheOk =
        q === "" ||
        s.desc.toLowerCase().includes(q) ||
        s.keys.toLowerCase().includes(q);
      return katOk && sucheOk;
    });
  }, [kat, suche]);

  return (
    <div className="lesson-card">
      <h2>Die Shortcuts, die wirklich zählen</h2>
      <p className="lesson-description">
        Der Unterschied zwischen Maus-Nutzer und Power-User ist selten Wissen —
        es ist die <strong>Tastatur</strong>. Wer zehn Shortcuts im Muskel-
        gedächtnis hat, arbeitet spürbar schneller. Das Zentrum von allem ist
        die <strong>Windows-Taste</strong> <Kbd>Win</Kbd>.
      </p>

      <div className="info-box">
        <strong>Die eine Gewohnheit, die am meisten bringt:</strong>{" "}
        <Kbd>Win</Kbd> drücken und <em>lostippen</em>. Nicht mehr im Startmenü
        klicken — tippen, Enter, fertig. Das ersetzt 90 % aller Programmstarts.
      </div>

      <h3>Durchsuchbare Übersicht</h3>
      <p style={{ marginBottom: 8 }}>
        Filter nach Kategorie oder tipp ins Suchfeld (z.B.{" "}
        <span className="mono">desktop</span>,{" "}
        <span className="mono">tab</span>,{" "}
        <span className="mono">snap</span>):
      </p>

      <input
        type="text"
        className="win-search"
        placeholder="Shortcut suchen…"
        value={suche}
        onChange={(e) => setSuche(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <div className="win-seg" style={{ marginBottom: 6 }}>
        <button
          type="button"
          className={`win-chip ${kat === "alle" ? "active" : ""}`}
          onClick={() => setKat("alle")}
        >
          Alle
        </button>
        {KATEGORIEN.map((k) => (
          <button
            key={k.id}
            type="button"
            className={`win-chip ${kat === k.id ? "active" : ""}`}
            onClick={() => setKat(k.id)}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="cheats">
        {gefiltert.length === 0 ? (
          <div className="cheats-empty">Nichts gefunden — andere Suche probieren.</div>
        ) : (
          gefiltert.map((s, i) => (
            <div className="cheat" key={i}>
              <span className="cheat-keys">
                <Keys combo={s.keys} />
              </span>
              <span className="cheat-desc">{s.desc}</span>
            </div>
          ))
        )}
      </div>
      <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
        {gefiltert.length} von {SHORTCUTS.length} Shortcuts angezeigt.
      </p>

      <DepthBox variant="why" title="Warum ist die Tastatur schneller als die Maus?">
        Die Maus braucht <em>Zielen</em> — Auge sucht den Button, Hand führt den
        Cursor, klickt. Das sind jedes Mal Sekundenbruchteile plus ein Kontext-
        wechsel weg von der Tastatur. Ein Shortcut ist eine einzige, gelernte
        Bewegung ohne Zielen. Einzeln winzig, über den Tag summiert es sich zu
        Minuten — und wichtiger: der Gedankenfluss reißt nicht ab, weil die
        Hände auf der Tastatur bleiben.
      </DepthBox>

      <DepthBox variant="mistake" title="Alle 35 auf einmal lernen wollen">
        Das funktioniert nicht — und frustriert nur. Nimm dir <strong>drei</strong>{" "}
        vor und nutze sie eine Woche bewusst, bis sie sitzen. Guter Start:{" "}
        <Combo keys="Win+L" /> (sperren), <Combo keys="Alt+Tab" /> (wechseln),
        und <Kbd>Win</Kbd>-tippen-Enter (öffnen). Erst wenn die automatisch
        gehen, die nächsten drei. Muskelgedächtnis schlägt Listen.
      </DepthBox>

      <DepthBox variant="deeper" title="Logik statt Auswendiglernen">
        Viele Shortcuts folgen einem System: <Kbd>Ctrl</Kbd> wirkt meist{" "}
        <em>innerhalb</em> eines Programms (Ctrl+C, Ctrl+S, Ctrl+T), die{" "}
        <Kbd>Win</Kbd>-Taste wirkt <em>system­weit</em> (Win+E, Win+D, Win+L).{" "}
        <Kbd>Shift</Kbd> bedeutet oft „erweitern/umkehren" (Shift+Pfeil
        markiert, Ctrl+Shift+T macht Ctrl+W rückgängig). Wer das Muster sieht,
        rät richtige Shortcuts, statt sie nachzuschlagen.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Die Fenster-Shortcuts (<Combo keys="Win+←" />, <Combo keys="Win+Tab" />)
        bekommen in der nächsten Lektion einen eigenen Platz mit Snap-Demo. Und
        die Öffnen-Shortcuts (<Combo keys="Win+R" />, <Combo keys="Win+1" />)
        vertiefen wir in „Programme blitzschnell öffnen".
      </DepthBox>
    </div>
  );
}

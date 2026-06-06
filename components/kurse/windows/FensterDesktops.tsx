"use client";

import { useState, type CSSProperties } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import { Combo, Kbd } from "./Kbd";
import "@/components/lessons/lesson.css";
import "./windows.css";

type Layout = {
  id: string;
  label: string;
  shortcut: string;
  grid: CSSProperties;
  fenster: number;
  hinweis: string;
};

const LAYOUTS: Layout[] = [
  {
    id: "voll",
    label: "Maximiert",
    shortcut: "Win+↑",
    grid: { gridTemplateColumns: "1fr", gridTemplateRows: "1fr" },
    fenster: 1,
    hinweis: "Ein Fenster füllt den ganzen Bildschirm.",
  },
  {
    id: "haelften",
    label: "Zwei Hälften",
    shortcut: "Win+← / Win+→",
    grid: { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr" },
    fenster: 2,
    hinweis: "Links/rechts andocken — perfekt für „Dokument neben Browser“.",
  },
  {
    id: "drittel",
    label: "Drei Spalten",
    shortcut: "Snap-Layouts",
    grid: { gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr" },
    fenster: 3,
    hinweis: "Auf breiten Monitoren: drei Fenster nebeneinander.",
  },
  {
    id: "quadranten",
    label: "Vier Quadranten",
    shortcut: "Win+← dann Win+↑",
    grid: { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" },
    fenster: 4,
    hinweis: "Erst links/rechts andocken, dann hoch/runter in die Ecke.",
  },
];

export default function FensterDesktops() {
  const [aktiv, setAktiv] = useState(1);
  const l = LAYOUTS[aktiv];

  return (
    <div className="lesson-card">
      <h2>Fenster &amp; virtuelle Desktops</h2>
      <p className="lesson-description">
        Fenster mit der Maus an den Rand ziehen und in der Größe zupfen — das
        muss nicht sein. Windows dockt Fenster auf Tastendruck sauber an
        (<strong>Snap</strong>), und mit <strong>virtuellen Desktops</strong>{" "}
        trennst du Arbeit und Privates auf getrennte Bildschirme, ohne ein
        zweites Display.
      </p>

      <h3>Snap: Fenster andocken</h3>
      <p>Wähl ein Layout — so ordnet Windows die Fenster an:</p>

      <div className="snap-stage" style={l.grid}>
        {Array.from({ length: l.fenster }, (_, i) => (
          <div key={i} className={`snap-win w${i + 1}`}>
            {i + 1}
          </div>
        ))}
      </div>

      <div className="win-seg" style={{ justifyContent: "center", margin: "14px 0 8px" }}>
        {LAYOUTS.map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            className={`win-chip ${aktiv === i ? "active" : ""}`}
            onClick={() => setAktiv(i)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="info-box">
        <strong>{l.label}:</strong> {l.hinweis}{" "}
        <span style={{ display: "inline-block", marginTop: 6 }}>
          Shortcut:{" "}
          {l.shortcut.split(" / ").map((s, i) => (
            <span key={i}>
              {i > 0 ? <span style={{ color: "#94a3b8" }}> / </span> : null}
              <Combo keys={s} />
            </span>
          ))}
        </span>
      </div>

      <h3>Virtuelle Desktops</h3>
      <p>
        Ein virtueller Desktop ist ein zweiter (dritter, vierter…) leerer
        Bildschirm auf demselben Monitor. Ideal, um Kontexte zu trennen:
        Desktop 1 = Arbeit, Desktop 2 = Kommunikation, Desktop 3 = Privat.
      </p>
      <div className="cheats">
        <div className="cheat">
          <span className="cheat-keys"><Combo keys="Win+Tab" /></span>
          <span className="cheat-desc">Task-Ansicht — zeigt alle Fenster und Desktops.</span>
        </div>
        <div className="cheat">
          <span className="cheat-keys"><Combo keys="Win+Ctrl+D" /></span>
          <span className="cheat-desc">Neuen virtuellen Desktop anlegen.</span>
        </div>
        <div className="cheat">
          <span className="cheat-keys"><Combo keys="Win+Ctrl+→" /></span>
          <span className="cheat-desc">Zwischen den Desktops wechseln (auch ←).</span>
        </div>
        <div className="cheat">
          <span className="cheat-keys"><Combo keys="Win+Ctrl+F4" /></span>
          <span className="cheat-desc">Aktuellen Desktop schließen.</span>
        </div>
      </div>

      <h3>Wechseln: Alt+Tab vs. Win+Tab</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">⚡ Alt+Tab</div>
          <div className="actor-row">
            Schnell zwischen <em>Fenstern</em> wechseln. Halt <Kbd>Alt</Kbd>{" "}
            gedrückt und tippe <Kbd>Tab</Kbd> bis zum Ziel. Für den ständigen
            Hin-und-Her-Wechsel.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🗺️ Win+Tab</div>
          <div className="actor-row">
            Die große Übersicht: alle Fenster <em>und</em> alle virtuellen
            Desktops. Bleibt offen, du kannst in Ruhe per Maus/Pfeil wählen und
            Fenster zwischen Desktops ziehen.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">🖥️ Win+Shift+← / →</div>
          <div className="actor-row">
            Mehrere Monitore? Schiebt das aktive Fenster auf den Bildschirm
            daneben — ohne Maus. <Combo keys="Win+P" /> wählt den Anzeige-Modus
            (Duplizieren/Erweitern).
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum Snap statt Fenster von Hand ziehen?">
        Manuelles Resizing ist fummelig: du triffst die Kante nicht, die Größen
        passen nie exakt, und nach dem nächsten Fenster ist alles wieder
        verrutscht. Snap legt Fenster <em>pixelgenau</em> auf feste Hälften,
        Drittel oder Ecken — reproduzierbar und in einem Tastendruck. Das
        klassische Setup „Editor links, Vorschau/Browser rechts" ist mit{" "}
        <Combo keys="Win+←" /> und <Combo keys="Win+→" /> in zwei Sekunden
        gebaut.
      </DepthBox>

      <DepthBox variant="mistake" title="„Meine Fenster sind verschwunden!“">
        Zwei häufige Schreckmomente: (1) Du warst auf einem anderen{" "}
        <em>virtuellen Desktop</em> — <Combo keys="Win+Tab" /> zeigt sie wieder.
        (2) Ein zweiter Monitor wurde abgesteckt, und Fenster „kleben" nun
        außerhalb des sichtbaren Bereichs — <Combo keys="Win+Shift+←" /> holt das
        aktive Fenster zurück, oder <Combo keys="Win+P" /> →{" "}
        <strong>Nur PC-Bildschirm</strong>. Nichts ist weg, nur woanders.
      </DepthBox>

      <DepthBox variant="deeper" title="Snap-Layouts & PowerToys FancyZones">
        Wenn du in Windows 11 mit der Maus über den <em>Maximieren</em>-Knopf
        eines Fensters schwebst (oder <Combo keys="Win+Z" /> drückst), erscheinen{" "}
        <strong>Snap-Layouts</strong> — vorgefertigte Raster, in die du das
        Fenster per Klick einsetzt. Wer noch mehr Kontrolle will, nimmt{" "}
        <strong>FancyZones</strong> aus Microsofts <em>PowerToys</em>: dort malst
        du dir eigene Zonen-Raster und ziehst Fenster mit gedrückter{" "}
        <Kbd>Shift</Kbd>-Taste hinein. Mehr zu PowerToys in „Eingebaute
        Power-Tools".
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Die Fenster-Shortcuts kamen schon in der Übersicht vor — hier hast du
        gesehen, was sie tun. Als Nächstes: Programme so schnell öffnen, dass
        du sie gar nicht erst suchen musst.
      </DepthBox>
    </div>
  );
}

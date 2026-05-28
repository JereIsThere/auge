"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

type Modus = "ohne" | "mit" | "alpha-lock";

export default function ClippingMasks() {
  const [modus, setModus] = useState<Modus>("ohne");

  // Vereinfachtes "Layer-Stack"-Mockup als SVG.
  // Form: ein blauer Kreis (Lokalfarbe).
  // Über-Layer: ein lila Schatten-Strich, der absichtlich über die Kreis-Kante hinausragt.
  // - "ohne": Strich liegt frei → über den Kreis hinaus sichtbar
  // - "mit": Clipping Mask → nur innerhalb des Kreises sichtbar
  // - "alpha-lock": wie Clipping Mask, aber direkt auf der Form (destruktiv)

  const istGeklippt = modus !== "ohne";

  return (
    <div className="lesson-card">
      <h2>Clipping Masks &amp; Alpha Lock</h2>
      <p className="lesson-description">
        Wenn du Schatten oder Highlights auf einer Form rendern willst,
        sollen sie <em>nur auf der Form</em> erscheinen, nicht außenrum.
        Procreate kennt dafür zwei Mechanismen: <strong>Clipping Mask</strong>{" "}
        (auf separatem Layer, nicht-destruktiv) und <strong>Alpha Lock</strong>{" "}
        (direkt auf der Form, destruktiv).
      </p>

      <div className="input-group">
        <label>Modus</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {([
            { id: "ohne",       label: "Ohne (frei)" },
            { id: "mit",        label: "Clipping Mask" },
            { id: "alpha-lock", label: "Alpha Lock" },
          ] as { id: Modus; label: string }[]).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModus(m.id)}
              className="toggle-code"
              style={{
                background: modus === m.id ? "#eef2ff" : "transparent",
                borderColor: modus === m.id ? "#3b82f6" : "#d1d5db",
                color: modus === m.id ? "#1d4ed8" : "#374151",
                fontWeight: modus === m.id ? 700 : 500,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 220px",
          gap: 16,
          alignItems: "center",
        }}
      >
        {/* Bildvorschau */}
        <svg
          viewBox="0 0 320 220"
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            width: "100%",
          }}
        >
          <defs>
            <clipPath id="form-clip">
              <circle cx="160" cy="110" r="80" />
            </clipPath>
          </defs>

          {/* Boden-Schatten dezent */}
          <ellipse cx="170" cy="200" rx="75" ry="6" fill="#000" opacity="0.08" />

          {/* Lokalfarbe der Form */}
          <circle cx="160" cy="110" r="80" fill="#5e7bb8" />

          {/* Schatten-Strich (über die Form hinausragend) */}
          <g
            clipPath={istGeklippt ? "url(#form-clip)" : undefined}
            style={{ mixBlendMode: "multiply" }}
          >
            <ellipse
              cx="200"
              cy="140"
              rx="90"
              ry="55"
              fill="#3d2a5e"
              opacity="0.6"
              transform="rotate(20 200 140)"
            />
          </g>

          {/* Beschriftung */}
          <text x="160" y="210" textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="ui-monospace, monospace">
            {modus === "ohne"
              ? "Schatten-Strich ragt über die Form hinaus"
              : modus === "mit"
                ? "Schatten ist auf separaten Layer geklippt"
                : "Schatten ist direkt in die Form gemalt"}
          </text>
        </svg>

        {/* Layer-Panel rechts */}
        <div
          style={{
            background: "#fafafa",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 10,
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.78rem",
          }}
        >
          <div style={{ fontWeight: 700, color: "#374151", marginBottom: 8, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Layer-Panel
          </div>
          {modus !== "alpha-lock" && (
            <div
              style={{
                padding: "8px 10px",
                border: "1px solid #d1d5db",
                borderRadius: 5,
                background: "#fff",
                marginBottom: 4,
                position: "relative",
                paddingLeft: modus === "mit" ? 22 : 10,
              }}
            >
              {modus === "mit" && (
                <span
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#dc2626",
                  }}
                  title="Clipping Mask aktiv (rotes ↳)"
                >
                  ↳
                </span>
              )}
              <strong style={{ color: "#3d2a5e" }}>Schatten</strong>
              <span style={{ color: "#6b7280" }}> · Multiply</span>
            </div>
          )}
          <div
            style={{
              padding: "8px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 5,
              background: "#fff",
              position: "relative",
            }}
          >
            {modus === "alpha-lock" && (
              <span
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#d97706",
                  fontSize: "0.78rem",
                }}
                title="Alpha Lock aktiv (kleines Schloss)"
              >
                🔒
              </span>
            )}
            <strong style={{ color: "#5e7bb8" }}>Form</strong>
            <span style={{ color: "#6b7280" }}> · Normal</span>
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Clipping Mask vs. Alpha Lock — wann was?">
        <ul>
          <li>
            <strong>Clipping Mask</strong> ist <em>nicht-destruktiv</em>: der
            Schatten lebt auf einem eigenen Layer und kann jederzeit
            ausgeblendet, verschoben oder gelöscht werden. Default-Wahl
            für den ganzen Rendering-Prozess.
          </li>
          <li>
            <strong>Alpha Lock</strong> ist <em>destruktiv</em>: du malst
            direkt in die Form, der Layer kennt aber seine Transparenz und
            sperrt alles außerhalb. Praktisch für späte, kleine
            Detail-Korrekturen, bei denen du dir sicher bist.
          </li>
        </ul>
        Faustregel: Rendering → Clipping Mask. Letzter Schliff → Alpha Lock.
      </DepthBox>

      <DepthBox variant="mistake" title="Clipping Mask auf den falschen Layer">
        Eine Clipping Mask greift auf den <em>direkt darunter liegenden</em>{" "}
        Layer. Wenn du zwischen Form und Schatten einen anderen Layer
        einschiebst, klippt der Schatten plötzlich auf diesen Zwischenlayer
        — meistens ungewollt. Symptom: Schatten verschwindet oder erscheint
        an unerwarteter Stelle. Lösung: Layer-Reihenfolge prüfen, ggf.
        Clipping Mask neu setzen (in Procreate: zweimaliges Antippen
        deaktiviert und re-aktiviert sie).
      </DepthBox>

      <DepthBox variant="deeper" title="Clipping Mask Group">
        Mehrere Layer (Schatten, Highlight, Glow) können alle auf <em>dieselbe</em>{" "}
        Form geklippt sein — du stapelst sie übereinander, jeden mit
        Clipping Mask auf den Form-Layer. In Procreate eleganter: pack die
        Form + alle Renderings in eine Folder-Group, dann auf den Folder
        klippen (geht seit Procreate 5). Bewahrt die Layer-Hierarchie,
        wenn dein Bild größer wird.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Layer-Modi (Clipping Mask scopt z.B. Multiply-Schatten), Masks
        (richtige Vektor-/Pixel-Masks für komplexere Auswahl-Logik), und
        Reference Layer (kombinierbar mit ColorDrop für „malen nur innerhalb
        der Linien").
      </DepthBox>
    </div>
  );
}

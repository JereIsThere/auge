"use client";

import { useState } from "react";
import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Metall() {
  const [politur, setPolitur] = useState(80); // 0..100 (0=matt, 100=spiegelnd)
  const [umgebung, setUmgebung] = useState(60); // wie viel Umgebungsreflexion sichtbar ist

  // Wir simulieren eine Kugel aus Metall mit verstellbarer Politur.
  // - hohe Politur = scharfes kleines Highlight, viel Umgebungsreflexion
  // - niedrige Politur = großes weiches Highlight, kaum Umgebung
  const hlGroesse = 8 + (100 - politur) * 0.6;
  const hlOpacity = 0.4 + (politur / 100) * 0.55;
  const hlBlur = (100 - politur) / 12;

  return (
    <div className="lesson-card">
      <h2>Metall</h2>
      <p className="lesson-description">
        Metall reflektiert die <em>Umgebung</em>, nicht nur das direkte
        Licht. Das ist der Schlüssel: ein Metallstück in einem leeren
        Studio sieht anders aus als dasselbe Stück in einem bunten Raum.
        Procreate-Trick: für überzeugendes Metall musst du <strong>fiktive
        Umgebung andeuten</strong> — auch wenn der Hintergrund weiß ist.
      </p>

      <div className="result-grid">
        <div className="input-group">
          <label>Politur: {politur} %</label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={politur}
            onChange={(e) => setPolitur(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="input-group">
          <label>Umgebungsreflexion: {umgebung} %</label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={umgebung}
            onChange={(e) => setUmgebung(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      <svg
        viewBox="0 0 320 280"
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          width: "100%",
          maxWidth: 360,
          margin: "0 auto",
        }}
      >
        <defs>
          {/* Lokalfarbe Metall: kühler Grauton */}
          <radialGradient id="metall-base" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9aa3b8" />
            <stop offset="1" stopColor="#3a4055" />
          </radialGradient>
          {/* Umgebungs-Bands (heller Himmel oben, dunkler Boden unten) */}
          <linearGradient id="env-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0e8f0" stopOpacity={umgebung / 100} />
            <stop offset="0.45" stopColor="#7a8090" stopOpacity={(umgebung / 100) * 0.4} />
            <stop offset="0.55" stopColor="#2a2f3a" stopOpacity={(umgebung / 100) * 0.7} />
            <stop offset="1" stopColor="#101218" stopOpacity={umgebung / 100} />
          </linearGradient>
          <clipPath id="kugel-clip">
            <circle cx="160" cy="130" r="90" />
          </clipPath>
          <filter id="hl-blur">
            <feGaussianBlur stdDeviation={hlBlur} />
          </filter>
        </defs>

        {/* Boden-Schatten */}
        <ellipse cx="160" cy="245" rx="70" ry="8" fill="#000" opacity="0.18" />

        {/* Kugel-Basis */}
        <circle cx="160" cy="130" r="90" fill="url(#metall-base)" />

        {/* Umgebungs-Bands innerhalb der Kugel */}
        <rect x="70" y="40" width="180" height="180" fill="url(#env-band)" clipPath="url(#kugel-clip)" />

        {/* Core Shadow (Übergang) */}
        <circle cx="160" cy="130" r="90" fill="#000" opacity="0.18" clipPath="url(#kugel-clip)" />

        {/* Highlight */}
        <g clipPath="url(#kugel-clip)" filter="url(#hl-blur)">
          <ellipse
            cx="125"
            cy="95"
            rx={hlGroesse}
            ry={hlGroesse * 1.4}
            fill="#fff"
            opacity={hlOpacity}
          />
        </g>

        {/* Reflected Light am unteren Rand */}
        <g clipPath="url(#kugel-clip)">
          <ellipse cx="195" cy="200" rx="60" ry="20" fill="#a0a8b8" opacity={0.18 + umgebung / 350} />
        </g>

        <text x="160" y="265" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="ui-monospace, monospace">
          {politur > 70 ? "poliertes Chrom" : politur > 30 ? "gebürstetes Metall" : "matt-lackiert"}
        </text>
      </svg>

      <DepthBox variant="why" title="Warum gibt es auf Metall kaum Lokalfarbe?">
        Auf einer matten Oberfläche siehst du hauptsächlich die
        diffuse Reflection — also die <em>Farbe des Pigments</em>. Auf
        Metall reflektiert die Oberfläche fast ausschließlich specular:
        was du siehst, sind <em>Reflexionen der Umgebung</em>, getönt
        durch die Metallfarbe (Gold gelblich, Kupfer rötlich, Stahl
        bläulich). Daher: ein chromglänzendes Stück in einer farbigen
        Umgebung sieht völlig anders aus als dasselbe Stück in einem
        Studio mit weißen Wänden.
      </DepthBox>

      <DepthBox variant="mistake" title="Ich male einfach hellgrau und schreibe Metall drüber">
        Klassisches Problem: Metall ohne Umgebungsandeutung wirkt wie
        Plastik. Selbst eine vereinfachte horizontale Helligkeits-Band-
        Struktur (heller oben = Himmel, dunkler unten = Boden) macht
        es sofort lesbar als Metall. Dann erst Highlight oben drauf.
      </DepthBox>

      <DepthBox variant="deeper" title="Fresnel-Effekt">
        An den <em>Kanten</em> einer Form (wo die Oberflächen-Normale
        steil zum Betrachter steht) wird Reflexion stärker, selbst bei
        unpolierten Materialien. Das ist der Fresnel-Effekt. Praktisch:
        die Außenkante einer Metallkugel ist heller als ihre Mitte —
        umgekehrt zur Lichtkugel-Logik bei matten Oberflächen. Bewusst
        einsetzen für Kontur-Lesbarkeit.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Lichtkugel (Vergleich: matt vs Haut vs Metall), Specular vs
        Diffuse (Theorie hinter dem Effekt), und Color-Temperature
        (Stahl ist kühl, Gold ist warm, Kupfer ist rotorange — Metalle
        haben einen <em>Tint</em>, der die Umgebungsreflexion einfärbt).
      </DepthBox>

      <DepthBox variant="history" title="Disney's BRDF-Demystifizierung">
        Was du heute „PBR" nennst (Physically Based Rendering, in
        3D-Engines und Cinema 4D / Blender), basiert auf einem Paper
        von Disney/Pixar 2012, das genau diese Material-Parameter
        (Roughness, Metalness, Specular) standardisiert hat. Wenn du
        in Procreate &bdquo;Roughness&ldquo; verstehst, hilft dir das in
        Blender oder Unreal Engine 1:1.
      </DepthBox>
    </div>
  );
}

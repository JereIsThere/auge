import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function ReferenceCompanion() {
  return (
    <div className="lesson-card">
      <h2>Reference Companion</h2>
      <p className="lesson-description">
        Procreate's <strong>Reference Companion</strong> ist ein
        schwebendes Fenster über dem Canvas, das ein Referenzbild zeigt —
        oder den Canvas selbst im Mini-Format. Klein, aber game-changing:
        beim Rendern hast du das Original neben dem Bild, ohne ständig
        zwischen Apps zu switchen.
      </p>

      <div className="info-box">
        Aktivieren: <code>Actions → Canvas → Reference</code>. Modus
        umschaltbar zwischen <em>Image</em> (eigenes Foto),{" "}
        <em>Canvas</em> (Mini-Vorschau deines Bildes) und <em>Face</em>{" "}
        (FaceTime-Kamera für Live-Selbstporträt).
      </div>

      <h3>Die drei Modi im Detail</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🖼️ Image</div>
          <div className="actor-row">
            Foto oder Skizze importieren. Bleibt sichtbar, während du
            malst. <strong>Eyedropper zoom auf das Referenzbild</strong>{" "}
            funktioniert — du kannst Farben direkt aus der Referenz picken.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🔍 Canvas</div>
          <div className="actor-row">
            Mini-Vorschau deines aktuellen Bildes. Klingt nutzlos, ist aber
            <em>essentiell</em>: beim Reinzoomen auf Details verlierst du
            den Gesamteindruck. Die Mini-Vorschau zeigt, ob die Werte noch
            stimmen.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">📷 Face</div>
          <div className="actor-row">
            Front-Kamera des iPads als Live-Referenz. Praktisch für Mimik,
            Selbstporträts, Hände in bestimmten Posen — die du dir selbst
            in den Spiegel halten kannst, ohne das iPad abzulegen.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum nicht einfach ein zweites App-Fenster?">
        Procreate erlaubt Split-View mit anderen iPad-Apps, aber das
        Reference Companion-Fenster hat zwei entscheidende Vorteile:
        (1) es schwebt <em>über</em> dem Canvas, frisst keine
        Canvas-Fläche; (2) Eyedropper aus dem Reference-Fenster pickt
        direkt in die Procreate-Palette. Mit Split-View müsstest du
        zwischen Apps switchen.
      </DepthBox>

      <DepthBox variant="mistake" title="Referenz zu groß auf den Bildschirm">
        Verlockend, das Referenzbild groß zu ziehen — dann sieht man
        Details besser. Falsch: dein eigener Canvas wird klein, du verlierst
        den Bezug zum Bild, was du gerade malst. Reference Companion
        sollte <em>klein</em> sein (~150-250 px Breite), Canvas dominiert.
      </DepthBox>

      <DepthBox variant="deeper" title="Multi-Referenz mit eigenen Layern">
        Reference Companion zeigt nur <em>ein</em> Bild zur Zeit. Für
        Komplex-Setups (mehrere Referenzen, Beleuchtungsvarianten):
        importiere die Referenzbilder als <em>eigene Layer</em> auf einem
        zweiten Canvas, schiebe sie an den Bildrand und halte sie
        ausgeblendet/transparent. Im Split-View mit Procreate-Procreate
        (Procreate kann sich selbst zweimal öffnen) → links das Bild,
        rechts die Referenz-Sammlung. Aufwendig, aber für lange Projekte
        Gold wert.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        ColorDrop (Farbe aus Referenz droppen statt malen),
        Eyedropper-Workflow (Apple Pencil halten → Eyedropper, häufiger
        Wechsel = Farbharmonie), Drawing Guides (Perspektivraster über
        dem Canvas, zeigt sich auch im Reference-Modus konsistent).
      </DepthBox>

      <DepthBox variant="history" title="Procreate vor Reference Companion">
        Bis Procreate 4 (2018) musste man entweder das Referenzbild als
        Layer mit niedriger Opacity übers Bild legen oder zwischen Apps
        switchen. Reference Companion war ein Killer-Feature des
        4.1-Updates und einer der Gründe, warum Procreate professionelle
        Illustrator:innen aus Photoshop abgeworben hat — Photoshop hat
        bis heute kein direktes Äquivalent.
      </DepthBox>
    </div>
  );
}

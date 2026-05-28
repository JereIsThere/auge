import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Was Rendering wirklich bedeutet</h2>
      <p className="lesson-description">
        Rendering ist die Phase, in der aus deiner Skizze ein Bild mit{" "}
        <em>Volumen</em>, <em>Material</em> und <em>Atmosphäre</em> wird. Du
        gehst vom flachen &bdquo;was zeigt es?&ldquo; zum überzeugenden{" "}
        &bdquo;wie fühlt es sich an?&ldquo;. Procreate ist nur das Werkzeug;
        Rendering ist die Disziplin.
      </p>

      <div className="info-box">
        <strong>Die Grundregel:</strong> erst Form, dann Licht, dann Detail.
        Anfänger:innen polieren Details, bevor die Form sitzt — und wundern
        sich, warum das Bild flach wirkt.
      </div>

      <h3>Die vier Phasen einer Illustration</h3>
      <ol className="step-list">
        <li>
          <strong>Skizze</strong> — Komposition, Werte, Bewegung. Klein und
          schnell, mehrere Varianten. Procreate-Trick: in eine Folder-Gruppe
          packen und mit Opazität ausblenden, sobald die nächste Phase
          anfängt.
        </li>
        <li>
          <strong>Flat Color</strong> — jede Form bekommt ihre Lokalfarbe
          (die Farbe ohne Licht). Alles auf separaten Layern. Procreate-Trick:
          <code>Reference Mode</code> + <code>ColorDrop</code> beschleunigt
          das massiv.
        </li>
        <li>
          <strong>Rendering</strong> — Licht und Schatten. Hier entscheidet
          sich, ob das Bild plastisch wirkt. Layer-Modi wie <code>Multiply</code>{" "}
          für Schatten, <code>Add</code> für Highlights. <em>Das ist diese
          Lektion.</em>
        </li>
        <li>
          <strong>Detail &amp; Effekte</strong> — Texturen, Glanzlichter,
          Rim Light, Subsurface Scattering. Erst <em>jetzt</em>, nicht
          früher.
        </li>
      </ol>

      <h3>Die drei Lichtbestandteile</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">☀️ Highlight</div>
          <div className="actor-row">
            Direkter Lichtpunkt. Die hellste Stelle — meist klein und nahe
            am Reflexionsmittelpunkt. <strong>Härte hängt vom Material ab:</strong>{" "}
            Metall scharf, Haut weich.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🌗 Core Shadow</div>
          <div className="actor-row">
            Der dunkelste Bereich auf der Form selbst (nicht der Schlagschatten).
            Liegt am Übergang von Licht zu Schatten. <strong>Hier passiert
            das meiste Volumen.</strong>
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">✨ Reflected Light</div>
          <div className="actor-row">
            Im Schatten leuchtet die Form leicht zurück — Licht von der
            Umgebung gebounct. Sehr dezent, aber das, was den
            &bdquo;Anfänger-3D-Look&ldquo; vom &bdquo;atmenden Bild&ldquo;
            trennt.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum vor dem Rendering die Werte planen?">
        Werte (Hell-Dunkel-Verteilung) tragen ~80 % der Bildwirkung, Farbe
        nur ~20 %. Ein gut gerendertes Bild funktioniert auch in
        Schwarz-Weiß. Procreate-Trick: einen{" "}
        <code>Saturation: -100</code>-Adjustment-Layer oben anlegen und
        beim Rendern immer mal kurz einschalten. Wenn das S/W-Bild bröselt,
        bröselt es auch in Farbe.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich rendere direkt auf dem Flat-Color-Layer"'>
        Klassischer Fail. Wenn du Schatten direkt auf den Flat-Color-Layer
        malst, kannst du die Farbe nicht mehr ändern, ohne den Schatten
        mitzudrehen. Besser: <strong>Schatten auf eigenen Multiply-Layer</strong>{" "}
        mit Clipping Mask auf den Flat-Color-Layer. Dann bleibt alles
        flexibel.
      </DepthBox>

      <DepthBox variant="deeper" title="Lichtquellen-Logik">
        Drei Klassen, drei Lichtverhalten:
        <ul>
          <li>
            <strong>Direkte Sonne</strong> — harte Kanten, klarer Schatten,
            hoher Kontrast. Komplementärfarbe in den Schattenbereichen
            (Sonne gelb → Schatten leicht blau).
          </li>
          <li>
            <strong>Bewölkter Himmel</strong> — weiches Licht, kaum
            Schlagschatten, niedriger Kontrast. Schatten und Licht haben
            ähnliche Sättigung.
          </li>
          <li>
            <strong>Innenraum mit gemischtem Licht</strong> — mehrere
            Lichtquellen mit verschiedenen Farbtemperaturen (warmes
            Glühlampenlicht + kaltes Fensterlicht). Schatten können
            <em>verschiedene Farben</em> haben, je nachdem, welche Quelle
            sie wirft.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Lichtkugel (nächste Lektion — die fünf klassischen Lichtbereiche
        an einer Standardform), Layer-Modi (wie du Multiply, Add, Overlay
        in Procreate konkret einsetzt), Farbtheorie (warm/kalt-Kontrast
        Licht ↔ Schatten — wie in der Aquarell-Lektion „Farbkreis").
      </DepthBox>

      <DepthBox variant="history" title="Wie kam das digitale Rendering hierhin?">
        Vor Procreate: Photoshop seit 1990, Painter seit 1991. Die
        Rendering-Philosophie selbst ist aber älter — Andrew Loomis schrieb
        sie in den 1940ern für Werbeillustration auf (&bdquo;Creative
        Illustration&ldquo;, 1947). Die heutigen iPad-Workflows haben das
        Werkzeug demokratisiert; die Konzepte sind dieselben geblieben.
      </DepthBox>
    </div>
  );
}

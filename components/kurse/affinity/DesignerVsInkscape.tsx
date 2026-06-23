import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function DesignerVsInkscape() {
  return (
    <div className="lesson-card">
      <h2>Affinity Designer vs. Inkscape</h2>
      <p className="lesson-description">
        Beide sind Vektor-Editoren — aber Designer fuhlt sich polierter an,
        reagiert schneller auf groen Dateien und hat das Pixel-Persona als
        Bonus. Inkscape ist Open Source und sehr gut, aber langsamer und
        stilistisch naher an alten Illustrator-Versionen.
      </p>

      <div className="info-box">
        <strong>Kern-Unterschied:</strong> Inkscape speichert nativ als SVG
        (offen, lesbar). Designer speichert nativ als .afdesign (proprietary),
        kann aber jederzeit als SVG exportieren. Wer am SVG-Quellcode rumschraubt,
        bleibt bei Inkscape. Wer mit dem Ergebnis designt, wird mit Designer
        schneller.
      </div>

      <h3>Was sofort anders ist</h3>
      <ol className="step-list">
        <li>
          <strong>Reaktionsgeschwindigkeit</strong> — Designer ist merklich
          schneller beim Rendern komplexer Pfade und beim Zoom. Inkscape hat
          bei groen SVGs oft Lag. Der Unterschied wird ab ~200 Pfaden deutlich.
        </li>
        <li>
          <strong>Kurvenwerkzeug</strong> — Designer hat Pen-Tool und Node-Tool
          als getrennte Werkzeuge (P und A). Pen zeichnet Pfade, Node editiert
          Anker. In Inkscape gibt es auch beide, aber die Handle-Interaktion
          fuhlt sich weniger prasize an.
        </li>
        <li>
          <strong>Pixel-Persona</strong> — per Klick oben links wechselt
          Designer in einen vollstandigen Raster-Editor. Man kann direkt auf
          eingebettete Pixel-Ebenen malen, ohne die Datei zu exportieren. Inkscape
          hat keinen eigenen Raster-Modus.
        </li>
        <li>
          <strong>Artboards</strong> — Designer kennt Artboards (mehrere
          Zeichenflachen in einem Dokument). In Inkscape gibt es Seiten seit
          v1.2, aber Artboards im Designer-Stil sind kompakter. Nutzlich fur
          Icon-Sets oder App-Screens in einer Datei.
        </li>
      </ol>

      <h3>Node-Editing im Vergleich</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">Inkscape Node-Tool</div>
          <div className="actor-row">
            <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>
              <li>N-Taste aktiviert Node-Tool</li>
              <li>Handles sichtbar per Tab-Durchklick</li>
              <li>Cusp/Smooth per Toolbar-Button</li>
              <li>Boolean-Operationen: Path-Menu</li>
              <li>Node-Alignment in der Toolbar</li>
            </ul>
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">Designer Node-Tool (A)</div>
          <div className="actor-row">
            <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>
              <li>A-Taste aktiviert Node-Tool</li>
              <li>Handles immer sichtbar bei aktivem Node</li>
              <li>Sharp/Smooth per Kontextleiste oben</li>
              <li>Boolean: Geometry-Panel oder Toolbar</li>
              <li>Smart-Curves: Handle mit Alt umschalten</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>SVG-Export: Was zu beachten ist</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>Szenario</th>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>Ergebnis in Designer</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Einfaches Icon exportieren', 'File → Export → SVG, sauber'],
            ['Schriften als Pfade exportieren', 'Layer → Expand Stroke / Text to Curves, dann Export'],
            ['Animiertes SVG erstellen', 'Nicht moglich — dafur Inkscape oder Code'],
            ['SVG fur Web (optimiert)', 'Export-Persona → SVG, "Flatten transforms" aktivieren'],
            ['SVG in anderer App offnen', 'SVG-Export kompatibel, aber afdesign-spezifische Effekte fallen weg'],
          ].map(([szenario, ergebnis]) => (
            <tr key={szenario} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.45rem 0.75rem' }}>{szenario}</td>
              <td style={{ padding: '0.45rem 0.75rem' }}>{ergebnis}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <DepthBox variant="why" title="Warum Designer schneller ist als Inkscape">
        Inkscape verwendet intern Cairo als Rendering-Engine und ein
        XML-basiertes Datenmodell, das historisch auf SVG ausgerichtet ist.
        Affinity Designer hat eine eigene GPU-beschleunigte Rendering-Pipeline
        (Metal auf Mac, DirectX auf Windows). Bei 500+ Pfaden wird der
        Unterschied praktisch spurbar: Zoom flussig, Pan ohne Ruckler. Das
        ist kein kleines Detail wenn man stundenlang an einem Detail-Illustration arbeitet.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich importiere mein Inkscape-SVG und alles funktioniert"'>
        Meistens ja, manchmal nein. Kritische Punkte: (1) Inkscape-spezifische
        SVG-Extensions (sodipodi, inkscape-Namespace) werden ignoriert.
        (2) Pfade mit &quot;Object to Path&quot; konvertiert in Inkscape kommen sauber
        rein. (3) Gekachelte Muster (Inkscape-Pattern-Fills) konnen sich verandern.
        Faustregel: bevor man ein Inkscape-SVG importiert, in Inkscape erst
        &quot;File → Clean Up Document&quot; und alle Objekte zu Pfaden konvertieren.
      </DepthBox>

      <DepthBox variant="deeper" title="Was Inkscape kann, Designer nicht">
        Inkscape hat einen sehr guten SVG-Animationseditor (SMIL), kann
        LaTeX-Formeln einbetten (Erweiterung), hat ein echtes Connector-Werkzeug
        fur Flussschemata und ist komplett Open Source (modifizierbar, keine
        Lizenzkosten). Fur technische Illustration, Schaltplane, Diagramme
        ist Inkscape oft besser aufgestellt. Designer hat kein Connector-Werkzeug
        und keine Scripting-API.
      </DepthBox>

      <DepthBox variant="related" title="Hangt zusammen mit...">
        Das Pixel-Persona in Designer (nauste Lektion) erlaubt Raster-Effekte
        direkt in der Vektor-Datei. Der erste Workflow zeigt, wie man einen
        typischen Icon-Erstellungs-Flow von Anfang bis SVG-Export durchzieht.
      </DepthBox>
    </div>
  );
}

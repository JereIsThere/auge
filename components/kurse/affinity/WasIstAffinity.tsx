import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function WasIstAffinity() {
  return (
    <div className="lesson-card">
      <h2>Die Affinity Suite</h2>
      <p className="lesson-description">
        Affinity ist eine Bildbearbeitungs- und Design-Suite von Serif: drei Apps,
        einmaliger Kauf, kein Abo. Photo, Designer und Publisher decken zusammen
        das ab, wofür Adobe sonst Photoshop, Illustrator und InDesign verkauft.
      </p>

      <div className="info-box">
        <strong>Die Kurzformel:</strong> Photo = Photoshop-Ersatz, Designer = Illustrator-Ersatz,
        Publisher = InDesign-Ersatz. Alle drei sind eigenständig nutzbar und tauschen
        Dateien verlustfrei aus.
      </div>

      <h3>Die drei Apps im Vergleich</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">📷 Affinity Photo</div>
          <div className="actor-row">
            <strong>Raster-Editor.</strong> RAW-Entwicklung, Retusche,
            Compositing, Farbkorrektur. Denkt in Pixeln, Ebenen und
            Masken — wie Photoshop, nicht wie Paint.NET.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">✏️ Affinity Designer</div>
          <div className="actor-row">
            <strong>Vektor-Editor.</strong> Logos, Illustrationen, UI-Design.
            Hat ein eingebettetes Pixel-Persona, sodass Raster und Vektor
            in einem Dokument existieren — etwas, das Inkscape nicht kann.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">📰 Affinity Publisher</div>
          <div className="actor-row">
            <strong>Layout-Editor.</strong> Mehrseitige Dokumente, Bücher,
            Magazine, Flyer. Masterseiten, Textsatz, druckfertige PDF-Ausgabe.
            Weniger relevant, wenn man nur Bilder oder Grafiken erstellt.
          </div>
        </div>
      </div>

      <h3>Was alle drei gemeinsam haben</h3>
      <ol className="step-list">
        <li>
          <strong>Einmaliger Kauf</strong> — kein Abo, keine Cloud-Pflicht,
          keine Creative-Cloud-Installation die beim Start 500 MB RAM frisst.
          Updates innerhalb einer Hauptversion (v2.x) sind kostenlos.
        </li>
        <li>
          <strong>Non-destructives Editing</strong> — alle Anpassungen
          (Kurven, Farbkorrekturen, Unschärfen) bleiben als Ebenen erhalten
          und lassen sich jederzeit anpassen oder löschen. Das Original-Pixel
          bleibt unangetastet.
        </li>
        <li>
          <strong>Studio Link</strong> — in Publisher kann man mit einem Klick
          zu Photo- oder Designer-Persona wechseln, ohne die Datei zu exportieren.
          Das Dokument bleibt offen, die Werkzeuge wechseln.
        </li>
        <li>
          <strong>Professionelle Farbräume</strong> — RGB, CMYK, LAB, Graustufen
          mit 16-Bit-Tiefe. Wer drucken will, kann von Anfang an im
          CMYK-Modus arbeiten.
        </li>
      </ol>

      <h3>Welche App wofuer?</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>Aufgabe</th>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>App</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Foto bearbeiten, retuschieren', 'Photo'],
            ['Logo, Icon, Illustration erstellen', 'Designer'],
            ['Flyer, Buch, mehrseitiges PDF', 'Publisher'],
            ['Screenshot annotieren', 'Photo oder Designer'],
            ['SVG für Web exportieren', 'Designer'],
            ['Compositing (Bild + Freistellen)', 'Photo'],
          ].map(([aufgabe, app]) => (
            <tr key={aufgabe} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.45rem 0.75rem' }}>{aufgabe}</td>
              <td style={{ padding: '0.45rem 0.75rem', fontWeight: 600 }}>{app}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <DepthBox variant="why" title="Warum kein Abo ein echtes Argument ist">
        Adobe CC kostet rund 60 EUR/Monat fur die komplette Suite — bei 3 Jahren
        sind das uber 2000 EUR. Affinity v2 kostet einmalig ca. 70 EUR pro App
        (oder 165 EUR als Bundle). Fur Hobby-Nutzer, Freelancer oder kleine
        Studios ist das ein klares Rechenbeispiel. Der einzige Nachteil: grosse
        Kollaborationen mit Adobe-Agenturen werden umstandlicher, weil PSD- und
        AI-Kompatibilitat gut, aber nicht perfekt ist.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich nehme einfach Photo fur alles"'>
        Photo kann auch Vektoren, aber schlecht. Fur Logos oder Symbole, die
        in jeder Groe scharf sein mussen, ist Designer die richtige Wahl.
        Faustregel: wenn das Ergebnis ein Foto oder eine Photomontage ist,
        nimm Photo. Wenn es eine Grafik ist, die auch als SVG oder auf einem
        3-Meter-Banner funktionieren muss, nimm Designer.
      </DepthBox>

      <DepthBox variant="deeper" title="Affinity v1 vs. v2">
        Version 2 (2022) brachte u.a. einen uberarbeiteten RAW-Entwickler
        in Photo, Kurven-Pfade in Designer und bessere Publisher-Vorlagen.
        Die Dateiformate sind nicht vollstandig abwartskompatibel — .afphoto,
        .afdesign und .afpub von v2 offnen sich in v1 nicht immer korrekt.
        Wer neu einsteigt, kauft immer v2.
      </DepthBox>

      <DepthBox variant="related" title="Hangt zusammen mit...">
        Die nachsten Lektionen schauen konkret auf die Unterschiede zu
        Paint.NET (Photo-Perspektive) und Inkscape (Designer-Perspektive) —
        was man verlernen muss und was man direkt wiedererkennt.
      </DepthBox>
    </div>
  );
}

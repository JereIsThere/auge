import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function Haare() {
  return (
    <div className="lesson-card">
      <h2>Haare</h2>
      <p className="lesson-description">
        Haare einzeln zu zeichnen ist ein Anfänger-Reflex — und ein Fehler.
        Realistisches Haar funktioniert in <strong>Strähnen</strong>
        (Gruppen), die als <em>Form mit Lichtband</em> gerendert werden.
        Erst zum Schluss kommen einzelne Härchen als Akzent dazu.
      </p>

      <div className="info-box">
        <strong>Die Kurzfassung:</strong> Haare = Stoff aus parallelen
        zylindrischen Fasern. Ihr Hauptmerkmal ist das{" "}
        <em>anisotrope Highlight</em>: ein Lichtband, das senkrecht zur
        Faserrichtung läuft.
      </div>

      <h3>Die vier Phasen</h3>
      <ol className="step-list">
        <li>
          <strong>Gesamtform (Silhouette)</strong> — das Haar als eine
          große Form mit Lokalfarbe. Wie ein „Helm". Ignoriere alle
          Strähnen.
        </li>
        <li>
          <strong>Große Strähnen</strong> — 3-7 dicke Strähnen, die der
          Hauptrichtung folgen (Pony, Seitenpartie, hinten). Jede
          bekommt einen <em>Multiply-Schatten</em> wo sie über/unter
          andere geht.
        </li>
        <li>
          <strong>Lichtband (Anisotropic Highlight)</strong> — ein
          horizontales Band aus Highlights, senkrecht zur Faserrichtung.
          Bei geraden Haaren oben am Kopf, bei lockigem Haar auf jeder
          Lockenwelle.
        </li>
        <li>
          <strong>Akzent-Härchen (Flyaways)</strong> — wenige (5-15)
          einzelne Haare, die aus der Form springen. Bringt
          Lebendigkeit, ohne ins kleinliche zu kippen.
        </li>
      </ol>

      <h3>Die drei Lichtkomponenten im Haar</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">✨ Primary Highlight</div>
          <div className="actor-row">
            Direkte Reflexion vom Licht. Scharfes Band oben auf dem Haar
            (oder auf der Welle bei Locken). Hellster Punkt, klein.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">🌅 Secondary Highlight</div>
          <div className="actor-row">
            Färbtes Reflex unter dem Primary (oft warm-orange bei
            blondem Haar, durch Pigment getönt). Weicher und breiter.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">🌫️ Tiefes Volumen</div>
          <div className="actor-row">
            In den Schattenbereichen <em>kaum</em> einzelne Härchen
            zeichnen — sonst wird das Haar unruhig. Hier dominiert die
            große dunkle Form.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Was ist anisotropes Highlight?">
        Anisotrop = richtungsabhängig. Eine glatte Kugel reflektiert
        gleichmäßig in alle Richtungen (isotrop). Ein Haar ist ein
        Zylinder — Licht reflektiert nur senkrecht zur Faserachse.
        Beim Bündel paralleler Fasern (= Strähne) summieren sich diese
        Reflexionen zu einem Band. Daher das charakteristische
        „Lichtstreifen quer übers Haar"-Phänomen, das du auf jedem
        Shampoo-Plakat siehst.
      </DepthBox>

      <DepthBox variant="mistake" title="Einzelne Haare im Schatten zeichnen">
        Klassischer Fehler: stundenlang feine Linien überall einzeichnen,
        auch in den dunklen Stellen. Ergebnis: das Haar verliert seine
        Form, wirkt wie Drahtgewebe. <strong>Lösung</strong>: Strähnen
        statt Haare; einzelne Härchen nur an Highlight-Kanten und als
        Flyaway-Akzent.
      </DepthBox>

      <DepthBox variant="deeper" title="Brush-Strategie für Haare in Procreate">
        Stufe 1 (Gesamtform): Hard Round oder Studio Pen. Stufe 2
        (Strähnen): Soft Round mit Pressure-Size-Mapping. Stufe 3
        (Highlight): scharfer Brush wie Studio Pen mit niedriger
        Opacity, mehrere übereinander. Stufe 4 (Flyaways): ein
        Spezial-Brush mit <em>Streamline 60-80 %</em> für sehr feine,
        glatte Einzellinien — z.B. der „Hair" Brush aus Procreate's
        Painting-Set.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Stoff (Haare folgen ähnlicher Falten-Logik — Schwerkraft,
        Knickkanten), Layer-Modi (Add-Layer für das Lichtband, Multiply
        für Strähnen-Schatten), und Composition (langes Haar bestimmt
        die Komposition oft mit — denk an Mucha's Art Nouveau).
      </DepthBox>
    </div>
  );
}

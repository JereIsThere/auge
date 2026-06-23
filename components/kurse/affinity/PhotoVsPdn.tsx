import { DepthBox } from "@/components/lessons/DepthBox";
import "@/components/lessons/lesson.css";

export default function PhotoVsPdn() {
  return (
    <div className="lesson-card">
      <h2>Affinity Photo vs. Paint.NET</h2>
      <p className="lesson-description">
        Ja — Affinity Photo ist eher Photoshop als Paint.NET. PDN ist ein
        solider Pixel-Editor fur schnelle Aufgaben. Photo denkt in
        non-destructiven Schichten, Farbprofilen und RAW-Daten.
        Das ist kein Upgrade, sondern ein anderes Werkzeug.
      </p>

      <div className="info-box">
        <strong>Die wichtigste Umstiegs-Einsicht:</strong> In Paint.NET
        arbeitet man <em>destruktiv</em> — eine Gauss-Unschärfe auf eine
        Ebene angewendet, und die Pixel sind weg. In Affinity Photo bleibt
        jede Anpassung als editierbare Ebene bestehen.
      </div>

      <h3>Die groen Unterschiede</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🎨 Paint.NET</div>
          <div className="actor-row">
            <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>
              <li>Einfache Ebenen (keine Gruppen, keine Masken-Ebenen)</li>
              <li>Effekte werden direkt ins Pixel gebacken</li>
              <li>sRGB, 8-Bit — fertig</li>
              <li>Schnell, leichtgewichtig, keine Lernkurve</li>
              <li>Kein RAW-Support</li>
            </ul>
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">📷 Affinity Photo</div>
          <div className="actor-row">
            <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>
              <li>Ebenengruppen, Masken-Ebenen, Anpassungsebenen</li>
              <li>Live-Filter: Unschärfe, Verzerrung — jederzeit editierbar</li>
              <li>RGB, CMYK, LAB, 8/16/32-Bit HDR</li>
              <li>Steilere Lernkurve, mehr Panels</li>
              <li>Eigener RAW-Entwickler (Develop-Persona)</li>
            </ul>
          </div>
        </div>
      </div>

      <h3>Was man zuerst lernen muss</h3>
      <ol className="step-list">
        <li>
          <strong>Anpassungsebenen statt Filter</strong> — statt
          &quot;Bild → Kurven&quot; zieht man eine Kurven-Anpassungsebene
          ins Panel. Die Kurve sitzt obendrauf, das Original-Pixel wird nie
          verandert. Spatere Korrekturen: doppelklick auf die Ebene.
        </li>
        <li>
          <strong>Masken-Ebenen</strong> — in PDN gibt es keine echten
          Ebenenmasken. In Photo malt man auf einer schwarzen Maske mit
          Weiss, um Bereiche freizugeben. Weiss = sichtbar, Schwarz = unsichtbar.
          Das ist das Kernkonzept fur Freistellungen und lokale Korrekturen.
        </li>
        <li>
          <strong>Live-Filter</strong> — ein Gauss-Blur auf einer Ebene in
          Photo ist kein gebackener Effekt, sondern eine Live-Filter-Ebene.
          Doppelklick, Radius andern, fertig. In PDN muss man Strg+Z
          zuruck und den Filter neu anwenden.
        </li>
        <li>
          <strong>Personas</strong> — Photo hat drei Arbeitsmodi (Personas):
          Photo (Normal-Editing), Develop (RAW) und Liquify (Verzerren).
          Man wechselt per Icon-Klick oben links. Beim Wechsel wechseln
          die Werkzeuge komplett.
        </li>
      </ol>

      <h3>Funktionen im direkten Vergleich</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>Aufgabe</th>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>PDN</th>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>Affinity Photo</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Farbe korrigieren', 'Anpassungen → Kurven (gebacken)', 'Anpassungsebene Kurven (editierbar)'],
            ['Freistellen', 'Zauberstab / manuell', 'Auswahl-Verfeinerung + Maskenebene'],
            ['Hintergrund unscharfmachen', 'Gauss-Unschärfe (gebacken)', 'Live-Filter Depth Blur (editierbar)'],
            ['Mehrere Bilder stapeln', 'Ebenen ubereinander', 'Live-Stack-Persona (Rauschen raus, Sterne rein)'],
            ['RAW-Foto entwickeln', 'Nicht moglich', 'Develop-Persona (eigene RAW-Engine)'],
            ['Ebene auf anderes Bild kopieren', 'Auswahl → kopieren → einfugen', 'Identisch, auch per Drag'],
          ].map(([aufgabe, pdn, affinity]) => (
            <tr key={aufgabe} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.45rem 0.75rem' }}>{aufgabe}</td>
              <td style={{ padding: '0.45rem 0.75rem', color: 'var(--muted)' }}>{pdn}</td>
              <td style={{ padding: '0.45rem 0.75rem', fontWeight: 600 }}>{affinity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <DepthBox variant="why" title="Warum Anpassungsebenen so viel besser sind">
        In Paint.NET ist der Workflow &quot;anwenden, schauen, Strg+Z, Wert andern,
        wieder anwenden&quot; — jede Korrektur ist eine Einbahnstrasse. In Photo
        sitzt jede Anpassung als Ebene im Stack. Man sieht sofort, welche
        Effekte aktiv sind, kann sie jederzeit ein/ausschalten, Reihenfolge
        andern, Opazitat reduzieren. Bei komplexen Kompositionen mit 10+
        Korrekturstufen ist das kein Komfort, sondern eine Notwendigkeit.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich mache meinen Gauss-Blur wie in PDN direkt auf die Ebene"'>
        Das geht in Photo — aber dann verliert man den Vorteil. Statt
        &quot;Filters → Blur → Gaussian Blur&quot; auf die Ebene anzuwenden,
        immer einen Live-Filter hinzufugen: Layer-Menu → New Live Filter Layer → Gaussian Blur.
        Dann bleibt der Blur editierbar und kann auch mit einer Maske versehen
        werden (z.B. nur der Hintergrund wird unscharfgestellt).
      </DepthBox>

      <DepthBox variant="deeper" title="Was PDN besser macht">
        Paint.NET ist schneller gestartet, braucht weniger RAM und hat eine
        Lernkurve, die gegen null geht. Fur schnelles &quot;Bild zuschneiden,
        Text drauf, fertig&quot; ist PDN effizienter. Affinity Photo hat mehr
        Panele und Optionen — wer das zum ersten Mal aufmacht, ist erschlagen.
        Die ersten Stunden investiert man hauptsachlich damit, Panels zu
        verstehen und zu schliessen. Das normalisiert sich nach ein, zwei Wochen.
      </DepthBox>

      <DepthBox variant="related" title="Hangt zusammen mit...">
        Die Ebenen- und Masken-Lektion geht tiefer in Pixel-Masken,
        Ebenengruppen und Mischmodi. Die Farbkorrektur-Lektion zeigt,
        warum 16-Bit und LAB-Farbraum bei Gradationskurven einen messbaren
        Unterschied machen.
      </DepthBox>
    </div>
  );
}

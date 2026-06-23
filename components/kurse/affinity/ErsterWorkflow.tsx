import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

export default function ErsterWorkflow() {
  return (
    <div className="lesson-card">
      <h2>Erster Workflow in Affinity</h2>
      <p className="lesson-description">
        Neues Dokument anlegen, ein Bild importieren, bearbeiten und
        sauber exportieren — die funf Schritte, die man in jeder Session braucht.
        Gilt fur Photo und Designer gleichermassen.
      </p>

      <div className="info-box">
        <strong>Orientierungshilfe:</strong> Affinity hat viele Panels. Die
        wichtigsten am Start: <em>Layers</em> (Ebenen), <em>Navigator</em>
        (Ubersicht), <em>Colour</em> (Farbauswahl) und <em>Swatches</em>
        (Farbpalette). Alle anderen kommen erst, wenn man sie braucht.
      </div>

      <h3>Schritt 1: Neues Dokument anlegen</h3>
      <p>
        File → New (Strg+N). Im Dialog wahlt man zwischen Voreinstellungen
        (Print, Web, Devices) oder gibt Masse manuell ein. Wichtig: den
        <strong> Farbraum</strong> am Anfang richtig setzen.
      </p>
      <ul className="step-list">
        <li>
          <strong>Web / Screen:</strong> RGB, 72 dpi, 8-Bit (sRGB) — am
          haufigsten fur Hobbynutzer.
        </li>
        <li>
          <strong>Druck:</strong> CMYK, 300 dpi, 8- oder 16-Bit — wer etwas
          drucken lassen will.
        </li>
        <li>
          <strong>Foto-Retusche:</strong> RGB, 16-Bit — mehr Farb-Spielraum
          bei Korrekturen, grossere Datei.
        </li>
      </ul>

      <h3>Schritt 2: Bild importieren</h3>
      <ol className="step-list">
        <li>
          <strong>Als neue Datei offnen:</strong> File → Open — das Bild
          wird als eigenes Dokument geoffnet, alle Ebenen erhalten.
        </li>
        <li>
          <strong>In bestehendes Dokument platzieren:</strong> File → Place
          (oder Layer → Place Image File). Das Bild kommt als eingebettetes
          Objekt auf eine neue Ebene. Skalierung ohne Qualitasverlust,
          solange man nicht destruktiv rastern muss.
        </li>
        <li>
          <strong>Per Drag:</strong> Bild aus dem Explorer / Finder direkt
          auf die Zeichenflache ziehen — funktioniert in Photo und Designer.
        </li>
      </ol>

      <h3>Schritt 3: Einfache Korrektur</h3>
      <p>
        In Photo: Layer → New Adjustment Layer → Curves. Eine Kurven-Ebene
        erscheint im Ebenen-Panel uber dem Bild. Diagonal-Linie nach oben
        = heller, nach unten = dunkler. Doppelklick auf die Ebene zum
        spateren Editieren. Keine Auswirkung auf die Original-Pixel.
      </p>
      <p>
        In Designer: Layers-Panel → Klick auf das Plus-Symbol → Adjustment →
        Curves. Identische Logik.
      </p>

      <h3>Schritt 4: Ebene transformieren</h3>
      <p>
        Move-Tool (V) auswahlen, Ebene im Layers-Panel oder auf der
        Zeichenflache anklicken. Danach:
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li><strong>Skalieren:</strong> Anfasser an Ecken ziehen, Shift halt Proportionen</li>
        <li><strong>Rotieren:</strong> Cursor ausserhalb der Anfasser → Rotations-Cursor erscheint</li>
        <li><strong>Exakt transformieren:</strong> Transform-Panel (W) — Pixel-genaue Eingabe</li>
      </ul>

      <h3>Schritt 5: Exportieren</h3>
      <p>
        <strong>Schnell-Export:</strong> File → Export (Strg+Alt+Shift+S). Dialog
        wahlt Format (PNG, JPEG, SVG, PDF), Qualitat und Grosse. Einmalig,
        kein Slice-Setup notig.
      </p>
      <p>
        <strong>Export-Persona</strong> (das gruene Symbol oben links) ist fur
        wiederholte Exporte: man definiert Slices oder Artboards einmal, und
        kann danach immer auf Knopfdruck neu exportieren. Nutzlich fur
        Icon-Sets in mehreren Grossen.
      </p>

      <DepthBox variant="why" title="Warum Place statt Open fur Bilder im Workflow?">
        Wenn man ein Bild mit &quot;Open&quot; offnet, hat man ein eigenes Dokument
        mit den Originalmassen. Per &quot;Place&quot; kommt es als Ebene ins aktuelle
        Dokument und kann mit anderen Ebenen kombiniert werden. Die Originaldatei
        bleibt unberuht — das Bild ist nur eingebettet. Bei einem Photo-Compositing
        (z.B. Freistellen + Hintergrund-Austausch) ist das der richtige Weg:
        beide Bilder als Ebenen im selben Dokument, mit Maske kombiniert.
      </DepthBox>

      <DepthBox variant="mistake" title='"Ich speichere als PNG uber File → Save"'>
        File → Save speichert als .afphoto oder .afdesign — nicht als PNG. Das
        ist die native Datei mit allen Ebenen (wichtig!), aber kein fertig
        exportiertes Bild. Fur den Export immer File → Export (oder Export-Persona)
        verwenden. &quot;Save&quot; ist fur die Arbeitsdatei, &quot;Export&quot; ist fur das Ergebnis.
      </DepthBox>

      <DepthBox variant="deeper" title="Dokument-Einstellungen nachtraglich andern">
        Farbraum und Bit-Tiefe kann man nach dem Erstellen unter Document →
        Convert Colour Profile / Document Setup andern. Das ist nicht verlustfrei:
        RGB nach CMYK konvertiert kann Farb-Clippen erzeugen (leuchtende Grun-
        und Orange-Tone konnen sich verschieben). Besser: von Anfang an im
        richtigen Modus starten.
      </DepthBox>

      <DepthBox variant="related" title="Hangt zusammen mit...">
        Die Ebenen- und Masken-Lektion baut direkt auf diesem Workflow auf:
        wie man eine Masken-Ebene auf das platzierte Bild legt, um Teile
        freizustellen. Export-Persona (spater) zeigt den Mehrfach-Export
        im Detail.
      </DepthBox>

      <Aufgabe titel="Erster Workflow komplett" schwierigkeit="leicht" zeit="20 min">
        <p>
          Lege in Affinity Photo oder Designer ein neues RGB-Dokument an
          (1200 x 800 px, 96 dpi). Importiere ein beliebiges Foto per
          &quot;Place&quot;, fuge eine Kurven-Anpassungsebene hinzu,
          verandere Helligkeit, und exportiere das Ergebnis als PNG.
        </p>
        <AufgabeCheckliste items={[
          "Neues Dokument mit korrekten Massen und Farbraum angelegt",
          "Bild per Place importiert (nicht per Open)",
          "Kurven-Anpassungsebene im Layers-Panel sichtbar",
          "Export als PNG via File → Export (nicht Save)",
          "Originale .afphoto/.afdesign-Arbeitsdatei separat gespeichert",
        ]} />
        <KiReview prompt={`Du bist ein erfahrener Affinity-Nutzer. Ich habe meinen ersten Workflow in Affinity (Photo oder Designer) abgeschlossen:

- Dokument: RGB, 1200x800 px, 96 dpi
- Bild per "Place" importiert
- Kurven-Anpassungsebene hinzugefugt
- Als PNG exportiert

Hier sind meine Beobachtungen und offene Fragen:
[DEIN TEXT HIER]

Bitte bewerte:
1. Habe ich "Place" vs "Open" richtig eingesetzt?
2. Ist die Kurven-Anpassungsebene korrekt als editierbare Ebene im Stack, oder habe ich sie auf das Pixel gebacken?
3. Was war bei meinem ersten Durchlauf der unubersichtlichste Teil der Affinity-Oberflache?

Nenn die zwei groten Verbesserungs-Hebel fur meinen Workflow.`} />
      </Aufgabe>
    </div>
  );
}

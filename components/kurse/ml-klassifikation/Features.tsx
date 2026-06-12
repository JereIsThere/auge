import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";

export default function Features() {
  return (
    <div className="lesson-card">
      <h2>Features: von Pixeln zu Vektoren</h2>
      <p className="lesson-description">
        Logistic Regression, SVM und Random Forest können nichts mit einem
        Bild anfangen — sie erwarten einen <strong>Zahlenvektor fester
        Länge</strong> pro Beispiel. Dieser Schritt entscheidet bei den
        klassischen Verfahren über Erfolg oder Misserfolg: Das Modell kann
        nur Muster finden, die in den Features überhaupt noch drinstecken.
      </p>

      <div className="info-box">
        <strong>Feature-Extraktion:</strong> Bild (256×256×3 Pixel) →
        Vektor (z.B. 512 Zahlen), der das Wesentliche zusammenfasst:
        Farbverteilung, Textur, Form.
      </div>

      <h3>Option 1: Flatten — die naive Variante</h3>
      <p>
        Einfach alle Pixel hintereinander in einen Vektor schreiben:
        256×256×3 = <strong>196.608 Dimensionen</strong>. Funktioniert
        formal, ist aber fast immer eine schlechte Idee: riesig, langsam,
        und ein um 3 Pixel verschobenes Blatt ergibt einen komplett anderen
        Vektor.
      </p>

      <h3>Option 2: Farb-Histogramme — der PlantVillage-Favorit</h3>
      <p>
        Krankheiten verändern vor allem die <em>Farbe</em>: braune Flecken,
        gelbe Ränder, weißer Belag. Ein Histogramm zählt, wie viele Pixel in
        welchen Farbbereich fallen — egal <em>wo</em> im Bild sie liegen.
        Damit ist es robust gegen Verschiebung und Rotation.
      </p>
      <CodeBlock lang="python"
        title="features.py — HSV-Histogramm pro Bild"
        code={`import cv2
import numpy as np

def extrahiere_features(pfad, bins=(8, 8, 8)):
    bild = cv2.imread(str(pfad))
    bild = cv2.resize(bild, (128, 128))
    hsv = cv2.cvtColor(bild, cv2.COLOR_BGR2HSV)

    # 3D-Histogramm über Hue, Saturation, Value: 8*8*8 = 512 Werte
    hist = cv2.calcHist([hsv], [0, 1, 2], None, bins,
                        [0, 180, 0, 256, 0, 256])
    hist = cv2.normalize(hist, hist).flatten()
    return hist  # Vektor mit 512 Zahlen, Summe der Quadrate = 1

X_train_feat = np.array([extrahiere_features(p) for p in X_train])
X_test_feat  = np.array([extrahiere_features(p) for p in X_test])
print(X_train_feat.shape)  # (38000, 512)`}
      />
      <p>
        HSV statt RGB, weil dort der Farbton (Hue) ein eigener Kanal ist —
        &bdquo;braun vs. grün&ldquo; steckt dann in einer einzigen
        Dimension statt verschmiert über drei.
      </p>

      <h3>Option 3: Textur-Features</h3>
      <p>
        Manche Krankheiten ändern weniger die Farbe als die{" "}
        <em>Oberfläche</em>: Mehltau wirkt pudrig, Schorf rau. Dafür gibt es
        Textur-Deskriptoren wie <strong>HOG</strong> (Histogram of Oriented
        Gradients — Kantenrichtungen zählen) oder <strong>LBP</strong>{" "}
        (Local Binary Patterns — lokale Hell/Dunkel-Muster). In der Praxis
        kombiniert man oft: Farb-Histogramm + Textur, per{" "}
        <code>np.concatenate</code> zu einem Vektor.
      </p>

      <h3>Und das CNN?</h3>
      <p>
        Das CNN überspringt diese ganze Lektion: Es bekommt die Pixel roh
        und lernt in seinen Convolution-Schichten <em>selbst</em>, welche
        Farb- und Texturmuster relevant sind. Das ist sein fundamentaler
        Vorteil — und der Grund, warum es mehr Daten und Rechenzeit
        braucht. Handgebaute Features sind komprimiertes Vorwissen; das CNN
        muss sich dieses Wissen erst ertrainieren.
      </p>

      <DepthBox variant="why" title="Warum reicht ein Histogramm hier so erstaunlich gut?">
        PlantVillage ist ein Labor-Dataset: ein Blatt, zentriert, neutraler
        Hintergrund, ähnliche Beleuchtung. Die Klassen unterscheiden sich
        deshalb fast vollständig über Farbverteilungen — genau das, was ein
        Histogramm einfängt. Auf Feldfotos (mehrere Blätter, Erde, Schatten,
        Gegenlicht) bricht dieser Ansatz ein, weil das Histogramm dann
        hauptsächlich den Hintergrund beschreibt. Merke: Feature-Wahl ist
        immer eine Wette auf die Datenverteilung.
      </DepthBox>

      <DepthBox variant="mistake" title="Features nach dem Skalieren neu erfinden">
        Zwei Stolperfallen aus der Praxis: <strong>(1)</strong>{" "}
        Histogramm-Bins zu fein wählen (32×32×32 = 32.768 Dimensionen bei
        38.000 Trainingsbildern — das Modell ertrinkt in leeren Bins).{" "}
        <strong>(2)</strong> Vergessen, dass <code>cv2.imread</code>{" "}
        <em>BGR</em> liefert, nicht RGB. Wer danach mit{" "}
        <code>COLOR_RGB2HSV</code> konvertiert, vertauscht still Rot und
        Blau — der Code läuft fehlerfrei durch, nur die Features sind
        Unsinn. Solche stillen Fehler findet kein Compiler, nur ein
        Plot-Check der Zwischenschritte.
      </DepthBox>

      <DepthBox variant="deeper" title="Fluch der Dimensionalität">
        Mit jeder Feature-Dimension wächst der Raum exponentiell, in dem die
        Trainingspunkte liegen — und wird damit <em>leerer</em>. Distanzen
        verlieren an Aussagekraft, Modelle finden Scheinmuster. Faustregeln:
        deutlich weniger Dimensionen als Trainingsbeispiele anstreben, und
        bei Bedarf <strong>PCA</strong> (Principal Component Analysis)
        nachschalten, das die Richtungen mit der meisten Varianz behält.
        512 Histogramm-Dimensionen bei 38.000 Beispielen sind komfortabel;
        196.608 Flatten-Dimensionen sind es nicht.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Allen drei klassischen Praxis-Lektionen (sie nutzen genau dieses{" "}
        <code>extrahiere_features</code>), der{" "}
        <strong>CNN-Intuition</strong> (warum gelernte Features gewinnen)
        und der <strong>LogReg-Tuning-Lektion</strong> (warum diese Features
        skaliert werden müssen).
      </DepthBox>
    </div>
  );
}

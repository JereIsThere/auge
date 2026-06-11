import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";

export default function CnnTransfer() {
  return (
    <div className="lesson-card">
      <h2>Transfer Learning &amp; Overfitting</h2>
      <p className="lesson-description">
        Warum Kanten- und Textur-Detektoren neu lernen, die schon tausendmal
        gelernt wurden? <strong>Transfer Learning</strong> nimmt ein auf
        ImageNet vortrainiertes Netz und tauscht nur den Klassifikator aus.
        Und am Ende dieser Lektion wartet die wichtigste Erkenntnis des
        ganzen Themas — die PlantVillage-Falle.
      </p>

      <div className="info-box">
        <strong>Rezept:</strong> Vortrainierte Basis einfrieren → eigenen
        Kopf (Pooling + Dense 38) drauf → Kopf trainieren → optional die
        obersten Basis-Schichten mit Mini-Lernrate auftauen (Fine-Tuning).
      </div>

      <h3>MobileNetV2 als gefrorene Basis</h3>
      <CodeBlock
        title="transfer.py"
        code={`from tensorflow import keras
from tensorflow.keras import layers

basis = keras.applications.MobileNetV2(
    input_shape=(128, 128, 3),
    include_top=False,        # ImageNet-Klassifikator (1000 Klassen) weg
    weights="imagenet",
)
basis.trainable = False       # Phase 1: Basis komplett einfrieren

modell = keras.Sequential([
    keras.Input(shape=(128, 128, 3)),
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    # MobileNetV2 erwartet Pixel in [-1, 1] — NICHT Rescaling(1/255)!
    layers.Lambda(keras.applications.mobilenet_v2.preprocess_input),
    basis,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.3),
    layers.Dense(38, activation="softmax"),
])

modell.compile(
    optimizer=keras.optimizers.Adam(1e-3),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
modell.fit(train_ds, validation_data=val_ds, epochs=10)`}
      />

      <h3>Phase 2: Fine-Tuning (optional, vorsichtig)</h3>
      <CodeBlock
        title="finetuning.py"
        code={`basis.trainable = True
for layer in basis.layers[:-30]:    # nur die obersten ~30 Schichten auftauen
    layer.trainable = False

modell.compile(
    optimizer=keras.optimizers.Adam(1e-5),   # 100x kleinere Lernrate!
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
modell.fit(train_ds, validation_data=val_ds, epochs=5)`}
      />
      <p>
        Mit eingefrorener Basis trainieren nur ~49.000 Kopf-Parameter —
        das geht auch ohne große GPU in Minuten und erreicht auf
        PlantVillage schnell <strong>97&nbsp;%+</strong>. Fine-Tuning legt
        oft noch ein bis zwei Punkte drauf, kann aber bei zu großer
        Lernrate das vortrainierte Wissen zerstören.
      </p>

      <MlQuelle
        id="howard2017-mobilenets"
        kernaussagen={[
          "MobileNets: CNN-Familie für Mobilgeräte — depthwise separable convolutions sparen ~90 % der Rechenkosten.",
          "Relevant für den PlantVillage-Anwendungsfall: Diagnose-App auf dem Smartphone im Feld.",
        ]}
      />

      <h3>Overfitting erkennen — die Lernkurven lesen</h3>
      <ol className="step-list">
        <li>
          <strong>Gesund:</strong> Training- und Validation-Loss sinken
          gemeinsam, kleiner Abstand.
        </li>
        <li>
          <strong>Overfitting:</strong> Training-Loss sinkt weiter,
          Validation-Loss dreht nach oben — ab da lernt das Netz
          auswendig. Gegenmittel: mehr Augmentation, mehr Dropout, früher
          stoppen, kleineres Netz.
        </li>
        <li>
          <strong>Underfitting:</strong> Beide Kurven stagnieren hoch —
          das Netz ist zu klein, die Lernrate falsch oder die Daten kaputt
          (Rescaling-Bug!).
        </li>
      </ol>

      <h3>Die PlantVillage-Falle</h3>
      <p>
        Jetzt die unbequeme Wahrheit. Mohanty et al. trainierten 2016
        CNNs auf PlantVillage: <strong>99,35&nbsp;%</strong> Accuracy.
        Dieselben Modelle auf Blatt-Fotos aus <em>anderen Quellen</em>{" "}
        getestet: die Accuracy stürzte auf etwa <strong>31&nbsp;%</strong>{" "}
        ab. Das Modell hatte nicht nur Krankheiten gelernt, sondern auch
        Aufnahmebedingungen: einheitlicher Hintergrund, Beleuchtung,
        Kamera. Im Feld — andere Hintergründe, Schatten, mehrere Blätter —
        bricht das alles weg.
      </p>

      <MlQuelle
        id="mohanty2016-deeplearning"
        kernaussagen={[
          "GoogLeNet via Transfer Learning auf PlantVillage: 99,35 % Accuracy auf dem Held-out-Test-Set.",
          "Auf Bildern aus anderen Quellen fällt die Accuracy auf ~31 % — das Modell generalisiert kaum über die Aufnahmebedingungen hinaus.",
          "Die zentrale Lehre: Test-Daten müssen die Einsatz-Bedingungen abbilden, sonst misst man Datensatz-Auswendiglernen.",
        ]}
      />

      <DepthBox variant="why" title="Warum hilft ImageNet-Wissen bei Blättern?">
        ImageNet enthält kaum kranke Blätter — aber die frühen und
        mittleren Schichten eines darauf trainierten Netzes lernen
        universelle Bild-Bausteine: Kanten, Texturen, Farbübergänge,
        einfache Formen. Diese Bausteine sind für Hunde, Autos und
        Blattflecken dieselben. Nur die späten, aufgaben-spezifischen
        Schichten müssen neu — genau die tauschen wir aus. Je näher die
        Zielaufgabe an natürlichen Fotos liegt, desto besser funktioniert
        der Transfer; bei Röntgenbildern oder Spektrogrammen ist der
        Gewinn deutlich kleiner.
      </DepthBox>

      <DepthBox variant="mistake" title="99 % melden und fertig">
        Für die Projektabgabe die Versuchung schlechthin: 99&nbsp;% auf
        dem PlantVillage-Test-Set berichten und den Deckel draufmachen.
        Aber das Test-Set teilt die Aufnahmebedingungen mit dem Training —
        es misst Generalisierung <em>innerhalb des Labors</em>, nicht in
        der Welt. Wer es ernst meint, beschafft eine Handvoll Feldfotos
        (eigene Kamera, echter Garten) als Zweit-Test-Set und berichtet
        beide Zahlen. Die Diskrepanz ist kein peinlicher Makel, sondern
        das interessanteste Ergebnis der Arbeit.
      </DepthBox>

      <DepthBox variant="deeper" title="Domain Shift — das eigentliche Problem benennen">
        Die Falle hat einen Namen: <strong>Domain Shift</strong>. Training-
        und Einsatzverteilung unterscheiden sich — P(Bild) im Labor ≠
        P(Bild) im Feld. Gegenmittel in aufsteigender Aufwandsstufe:
        härtere Augmentation (zufällige Hintergründe, Beleuchtung),
        Mischen mehrerer Datasets, Domain-Adaptation-Verfahren, oder
        schlicht Felddaten sammeln und nachtrainieren. Merksatz für jede
        ML-Arbeit: <em>Ein Modell ist so gut wie die Ähnlichkeit zwischen
        Trainingsverteilung und Einsatzverteilung.</em>
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>Pipeline-Lektion</strong> (das Test-Set misst nur, was
        es repräsentiert), der <strong>Features-Lektion</strong> (auch
        Histogramme funktionieren nur im Labor-Setting) und dem{" "}
        <strong>großen Vergleich</strong> — wo diese Erkenntnis in die
        Gesamtbewertung der vier Verfahren einfließt.
      </DepthBox>
    </div>
  );
}

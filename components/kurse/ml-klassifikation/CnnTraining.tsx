import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";

export default function CnnTraining() {
  return (
    <div className="lesson-card">
      <h2>Praxis: Keras auf PlantVillage</h2>
      <p className="lesson-description">
        Jetzt wird gestapelt: Dataset-Loading direkt aus den Ordnern,
        Augmentation als Teil des Modells, die Mini-Architektur aus der
        Bausteine-Lektion — und ein Training, das sich selbst stoppt,
        bevor es overfittet.
      </p>

      <div className="info-box">
        <strong>Anders als bei sklearn:</strong> Kein Feature-Schritt, kein
        Scaler. Das CNN bekommt Bilder als Tensoren (Höhe × Breite × 3)
        und lernt den Rest selbst. Dafür: Batches, Epochen, Callbacks.
      </div>

      <h3>1. Daten laden — die Ordnerstruktur zahlt sich aus</h3>
      <CodeBlock
        title="cnn_daten.py"
        code={`import tensorflow as tf
from tensorflow import keras

BILD_GROESSE = (128, 128)
BATCH = 32

train_ds, val_ds = keras.utils.image_dataset_from_directory(
    "plantvillage dataset/color",
    validation_split=0.2,
    subset="both",            # liefert (train, val) in einem Aufruf
    seed=42,                  # gleicher Seed = konsistenter Split!
    image_size=BILD_GROESSE,
    batch_size=BATCH,
    label_mode="int",         # Labels als Klassen-Index 0..37
)
klassen = train_ds.class_names   # 38 Ordnernamen, alphabetisch

# Performance: Bilder im Voraus laden, während die GPU rechnet
train_ds = train_ds.prefetch(tf.data.AUTOTUNE)
val_ds = val_ds.prefetch(tf.data.AUTOTUNE)`}
      />

      <h3>2. Modell — Augmentation eingebaut</h3>
      <CodeBlock
        title="cnn_modell.py"
        code={`from tensorflow.keras import layers

modell = keras.Sequential([
    keras.Input(shape=(128, 128, 3)),

    # Augmentation: nur im Training aktiv, bei predict() automatisch aus
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
    layers.Rescaling(1.0 / 255),     # Pixel 0..255 → 0..1

    layers.Conv2D(32, 3, padding="same", activation="relu"),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, padding="same", activation="relu"),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, padding="same", activation="relu"),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dropout(0.3),             # gegen Overfitting im dichten Teil
    layers.Dense(128, activation="relu"),
    layers.Dense(38, activation="softmax"),
])

modell.compile(
    optimizer=keras.optimizers.Adam(1e-3),
    loss="sparse_categorical_crossentropy",  # int-Labels, keine One-Hots
    metrics=["accuracy"],
)
modell.summary()   # IMMER ansehen: stimmen Shapes + Parameterzahl?`}
      />

      <h3>3. Training mit Notbremse</h3>
      <CodeBlock
        title="cnn_training.py"
        code={`stop = keras.callbacks.EarlyStopping(
    monitor="val_loss",
    patience=3,                  # 3 Epochen ohne Besserung → Schluss
    restore_best_weights=True,   # zurück zum besten Stand
)

verlauf = modell.fit(
    train_ds,
    validation_data=val_ds,
    epochs=30,
    callbacks=[stop],
)

# Lernkurven ansehen — Pflicht, nicht Kür:
# verlauf.history["loss"] vs. verlauf.history["val_loss"]
test_loss, test_acc = modell.evaluate(val_ds)
print(f"Validation Accuracy: {test_acc:.3f}")`}
      />
      <p>
        Schon dieses kleine Netz erreicht auf PlantVillage nach wenigen
        Epochen typischerweise <strong>über 90&nbsp;%</strong> Accuracy —
        mehr als die getunten klassischen Verfahren auf
        Histogramm-Features. Die Lernkurven verraten dabei mehr als die
        Endzahl: Laufen Training- und Validation-Loss auseinander, lernt
        das Netz auswendig.
      </p>

      <DepthBox variant="why" title="Warum Augmentation als Modell-Schicht?">
        Random-Flip, -Rotation und -Zoom erzeugen in jeder Epoche leicht
        andere Versionen jedes Bildes — das Netz kann sich einzelne Pixel
        nicht merken und muss Muster lernen. Als <em>Schicht im Modell</em>{" "}
        statt als separater Vorverarbeitungsschritt hat das zwei Vorteile:
        Sie läuft automatisch nur im Training (bei{" "}
        <code>predict</code>/<code>evaluate</code> deaktiviert sie sich
        selbst), und sie kann nicht versehentlich auf das Validation-Set
        angewendet werden — eine ganze Fehlerklasse ist
        konstruktionsbedingt weg.
      </DepthBox>

      <DepthBox variant="mistake" title="Rescaling vergessen — oder doppelt">
        Die zwei häufigsten stillen CNN-Bugs: <strong>(1)</strong> Pixel
        gehen als 0–255 ins Netz (Rescaling vergessen) — der Loss
        startet hoch und das Training kriecht, weil die Aktivierungen
        sofort sättigen. <strong>(2)</strong> Doppelt normalisiert —
        z.B. Rescaling-Layer <em>und</em> später{" "}
        <code>preprocess_input</code> eines vortrainierten Netzes. Beides
        läuft ohne Fehlermeldung. Debugging-Reflex: einmal{" "}
        <code>print(batch.numpy().min(), batch.numpy().max())</code>{" "}
        direkt vor dem Netz — die Wertebereiche müssen zur ersten Schicht
        passen.
      </DepthBox>

      <DepthBox variant="deeper" title="Epochen, Batches, Adam — das Trainings-Vokabular">
        Eine <strong>Epoche</strong> = einmal alle Trainingsbilder gesehen.
        Pro <strong>Batch</strong> (32 Bilder) wird ein Gradient berechnet
        und ein Schritt gemacht — bei 43.000 Bildern also ~1.350 Updates
        pro Epoche. Das ist <em>Stochastic</em> Gradient Descent: Der
        Batch-Gradient ist eine verrauschte Schätzung des echten, aber
        1.350 verrauschte Schritte schlagen einen exakten.{" "}
        <strong>Adam</strong> verfeinert das mit Momentum (Schwung über
        Batches hinweg) und pro Parameter angepassten Lernraten — deshalb
        funktioniert die Default-Lernrate 0,001 fast immer als Start.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>LogReg-Mathe-Lektion</strong> (gleiche Cross-Entropy,
        gleicher Gradient Descent — nur Millionen statt 19.500 Parameter),
        den <strong>Bausteinen</strong> (jede Zeile des Sequential-Modells
        ist dort erklärt) und dem <strong>Transfer Learning</strong>{" "}
        (nächste Lektion: warum man dieses Netz oft gar nicht selbst
        trainiert).
      </DepthBox>
    </div>
  );
}

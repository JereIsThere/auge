import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import { CodeBlock } from "./CodeBlock";
import "@/components/lessons/lesson.css";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Bildklassifikation &amp; PlantVillage</h2>
      <p className="lesson-description">
        Vier Verfahren, ein Problem: Ein Foto von einem Pflanzenblatt kommt
        rein — und der Computer soll sagen, <em>welche Pflanze</em> das ist
        und <em>ob sie krank</em> ist. Random Forest, SVM, CNN und Logistic
        Regression lösen genau diese Aufgabe, nur auf sehr unterschiedlichen
        Wegen. Dieses Thema nimmt alle vier auseinander.
      </p>

      <div className="info-box">
        <strong>Klassifikation heißt:</strong> Aus einem Input (Bild) genau
        eine von <em>k</em> vorher festgelegten Klassen machen. Kein
        Freitext, keine Box um das Blatt — nur ein Label.
      </div>

      <h3>Das Dataset: PlantVillage</h3>
      <p>
        Alle Lektionen nutzen das{" "}
        <a
          href="https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset"
          target="_blank"
          rel="noopener noreferrer"
        >
          PlantVillage-Dataset auf Kaggle
        </a>
        : rund <strong>54.000 Fotos</strong> von Pflanzenblättern, verteilt
        auf <strong>38 Klassen</strong> aus 14 Nutzpflanzen — von{" "}
        <em>Apple___healthy</em> bis <em>Tomato___Late_blight</em>. Jede
        Klasse ist eine Kombination aus Pflanze und Zustand.
      </p>

      <CodeBlock
        lang="text"
        title="Ordnerstruktur (Kaggle-Version)"
        code={`plantvillage dataset/
├── color/                      ← Original-Farbfotos (das nehmen wir)
│   ├── Apple___Apple_scab/
│   ├── Apple___Black_rot/
│   ├── Apple___healthy/
│   ├── ...
│   └── Tomato___healthy/       ← 38 Ordner = 38 Klassen
├── grayscale/                  ← gleiche Bilder, Graustufen
└── segmented/                  ← Hintergrund entfernt`}
      />

      <p>
        Die Ordnerstruktur ist gleichzeitig das Labeling:{" "}
        <strong>Ordnername = Klasse</strong>. Das ist der Standard für
        Bild-Datasets und macht das Einlesen in Python angenehm einfach.
      </p>

      <MlQuelle
        id="hughes2015-plantvillage"
        kernaussagen={[
          "Stellt das PlantVillage-Repository vor: offene Blatt-Fotos für die Entwicklung mobiler Krankheits-Diagnostik.",
          "Motivation: Pflanzenkrankheiten vernichten weltweit erhebliche Ernteanteile, Diagnose-Expertise ist knapp.",
          "Bilder wurden unter kontrollierten Bedingungen aufgenommen (Blatt abgepflückt, neutraler Hintergrund).",
        ]}
      />

      <h3>Die vier Verfahren im Schnelldurchlauf</h3>
      <div className="actors">
        <div className="actor-row">
          <div className="actor-card">
            <div className="actor-title">📈 Logistic Regression</div>
            Gewichtete Summe der Features, durch eine Sigmoid/Softmax
            gedrückt. Linear, schnell, die ehrlichste Baseline.
          </div>
          <div className="actor-card">
            <div className="actor-title">🛣️ SVM</div>
            Sucht nicht irgendeine Trennlinie, sondern die mit dem größten
            Sicherheitsabstand. Mit Kernel-Trick auch nicht-linear.
          </div>
        </div>
        <div className="actor-row">
          <div className="actor-card">
            <div className="actor-title">🌲 Random Forest</div>
            Hunderte Entscheidungsbäume, jeder auf zufälligen Daten- und
            Feature-Ausschnitten — die Mehrheit entscheidet.
          </div>
          <div className="actor-card">
            <div className="actor-title">👁️ CNN</div>
            Lernt seine Bild-Features selbst, statt sie vorgesetzt zu
            bekommen. State of the Art für Bilder — und am teuersten.
          </div>
        </div>
      </div>

      <p>
        Ein wichtiger Unterschied zieht sich durch das ganze Thema: Die drei
        klassischen Verfahren (LogReg, SVM, RF) arbeiten auf{" "}
        <strong>Feature-Vektoren</strong>, die wir vorher aus den Bildern
        extrahieren müssen. Das CNN frisst die <strong>Pixel direkt</strong>{" "}
        und lernt die Features mit.
      </p>

      <DepthBox variant="why" title="Warum lernen wir vier Verfahren statt nur das beste?">
        Weil &bdquo;das beste&ldquo; vom Kontext abhängt. Ein CNN gewinnt bei
        Rohbildern fast immer in der Accuracy — braucht aber GPU, viele
        Daten und Trainingszeit, und seine Entscheidungen sind schwer zu
        erklären. Eine Logistic Regression auf guten Features trainiert in
        Sekunden, ist interpretierbar und reicht für viele Probleme. Wer nur
        ein Verfahren kennt, kann diese Abwägung nicht treffen — und genau
        diese Abwägung ist der Kern von angewandtem ML.
      </DepthBox>

      <DepthBox variant="mistake" title="Klassifikation mit Detektion verwechseln">
        Klassifikation beantwortet nur <em>&bdquo;was ist auf dem
        Bild?&ldquo;</em> — genau ein Label pro Bild. Sie sagt nicht,{" "}
        <em>wo</em> das Blatt ist (das wäre Object Detection) und kann nicht
        mit zwei Blättern verschiedener Pflanzen auf einem Foto umgehen.
        PlantVillage umgeht das durch die Aufnahme-Bedingungen: ein Blatt
        pro Bild, zentriert, neutraler Hintergrund. Genau das wird uns in
        der Transfer-Learning-Lektion als Generalisierungs-Problem wieder
        einholen.
      </DepthBox>

      <DepthBox variant="deeper" title="Die 38 Klassen sind nicht gleich groß">
        Die Klassen sind <strong>unbalanciert</strong>:{" "}
        <em>Orange___Haunglongbing</em> hat über 5.500 Bilder,{" "}
        <em>Potato___healthy</em> nur etwa 150. Das hat Konsequenzen für
        alles, was kommt: Ein Modell, das einfach häufige Klassen rät,
        bekommt schon ordentliche Accuracy geschenkt. Deshalb brauchen wir
        die Metriken-Lektion, stratifizierte Splits und{" "}
        <code>class_weight</code>-Parameter — alles Werkzeuge gegen genau
        dieses Ungleichgewicht.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>ML-Pipeline</strong> (nächste Lektion — wie die Daten
        sauber durchs System fließen), der <strong>Feature-Extraktion</strong>{" "}
        (wie aus 256×256×3 Pixeln ein handlicher Vektor wird) und den{" "}
        <strong>Metriken</strong> (woran wir alle vier Verfahren am Ende
        messen).
      </DepthBox>
    </div>
  );
}

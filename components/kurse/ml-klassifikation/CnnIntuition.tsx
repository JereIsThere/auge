import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function CnnIntuition() {
  return (
    <div className="lesson-card">
      <h2>Warum CNNs Bilder gewinnen</h2>
      <p className="lesson-description">
        Die drei klassischen Verfahren teilen eine Schwäche: Sie sehen nur,
        was wir ihnen als Feature vorkauen. Das{" "}
        <strong>Convolutional Neural Network</strong> dreht den Spieß um —
        es bekommt die rohen Pixel und lernt die Features selbst, als Teil
        des Trainings.
      </p>

      <div className="info-box">
        <strong>Der Paradigmenwechsel:</strong> Feature-Engineering wird
        durch Feature-<em>Learning</em> ersetzt. Das Histogramm haben wir
        entworfen; die CNN-Filter werden gelernt.
      </div>

      <h3>Wo handgebaute Features an die Wand laufen</h3>
      <ol className="step-list">
        <li>
          <strong>Ortsblindheit</strong> — Das Histogramm weiß, dass
          15&nbsp;% der Pixel braun sind. Ob sie ein kreisrundes
          Pilz-Muster bilden oder zufällig verstreut sind: gleicher
          Feature-Vektor.
        </li>
        <li>
          <strong>Form und Struktur</strong> — Konzentrische Ringe
          (typisch für Alternaria) oder geäderte Flecken (Late Blight)
          sind <em>räumliche</em> Muster. In 512 Farb-Bins existieren sie
          schlicht nicht.
        </li>
        <li>
          <strong>Die Decke ist erreicht</strong> — Ab einem Punkt hilft
          kein Tuning mehr: Die Information ist in den Features bereits
          verloren, kein Modell dahinter kann sie zurückholen.
        </li>
      </ol>

      <h3>Die Convolution-Idee in drei Annahmen</h3>
      <p>
        Ein CNN ist kein magischer Kasten, sondern ein normales neuronales
        Netz mit drei eingebauten Annahmen über Bilder:
      </p>
      <div className="flow-step">
        <div className="flow-step-num">1</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Lokalität</div>
          <div className="flow-step-desc">
            Ein Pixel hängt vor allem mit seinen Nachbarn zusammen. Also
            schaut jedes Neuron nur auf einen kleinen Ausschnitt (z.B.
            3×3), nicht aufs ganze Bild.
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">2</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Translations-Invarianz</div>
          <div className="flow-step-desc">
            Ein brauner Fleck ist ein brauner Fleck — egal ob links oben
            oder rechts unten. Also wird <em>derselbe</em> Filter über das
            ganze Bild geschoben (Weight Sharing).
          </div>
        </div>
      </div>
      <div className="flow-step">
        <div className="flow-step-num">3</div>
        <div className="flow-step-body">
          <div className="flow-step-title">Hierarchie</div>
          <div className="flow-step-desc">
            Kanten setzen sich zu Texturen zusammen, Texturen zu Mustern,
            Muster zu Objekten. Also stapelt man Convolution-Schichten —
            jede sieht die Ausgabe der vorherigen.
          </div>
        </div>
      </div>
      <p>
        Diese Annahmen sparen brutal Parameter: Eine voll vernetzte
        Schicht von 128×128×3 Pixeln auf 1.000 Neuronen hätte ~49
        Millionen Gewichte. Eine Convolution-Schicht mit 32 Filtern à
        3×3×3: <strong>896</strong>. Weniger Parameter heißt weniger
        Overfitting und weniger Datenhunger — deshalb funktionieren CNNs
        auf Bildern, wo normale dichte Netze ertrinken.
      </p>

      <MlQuelle
        id="lecun1998-lenet"
        kernaussagen={[
          "LeNet-5: die Architektur-Blaupause — Convolution, Subsampling (Pooling), am Ende dichte Schichten.",
          "Zeigt am Ziffern-Lesen, dass gelernte Features handgebauten überlegen sind.",
          "Formuliert Gradient-basiertes End-to-End-Training, wie es heute Standard ist.",
        ]}
      />
      <MlQuelle
        id="krizhevsky2012-alexnet"
        kernaussagen={[
          "AlexNet gewinnt ImageNet 2012 mit großem Abstand — der Urknall des Deep-Learning-Booms.",
          "Zutaten: GPU-Training, ReLU statt Sigmoid/Tanh, Dropout, Data Augmentation.",
          "Danach verschwinden handgebaute Bild-Features (SIFT, HOG) innerhalb weniger Jahre aus der Spitzenforschung.",
        ]}
      />

      <DepthBox variant="why" title="Warum hat das CNN erst 2012 gewonnen und nicht 1998?">
        LeNet funktionierte 1998 — auf 32×32-Ziffern. Für echte Fotos
        fehlten drei Dinge, die erst um 2012 zusammenkamen:{" "}
        <strong>Daten</strong> (ImageNet: 1,2 Mio. gelabelte Bilder),{" "}
        <strong>Rechenleistung</strong> (GPUs machten das Training
        ~50× schneller) und ein paar <strong>Trainings-Tricks</strong>{" "}
        (ReLU gegen sterbende Gradienten, Dropout gegen Overfitting).
        Der Algorithmus war nie das Problem — die Infrastruktur war es.
        Eine nützliche Lehre: Verfahren sind nicht gut oder schlecht an
        sich, sondern relativ zu Daten und Hardware ihrer Zeit.
      </DepthBox>

      <DepthBox variant="mistake" title="CNN als Pflichtsieg verbuchen">
        Auf PlantVillage gewinnt das CNN — aber knapper als die Theorie
        vermuten lässt: Labor-Fotos mit dominanten Farbunterschieden sind
        Histogramm-freundlich. Den echten Abstand zeigt erst ein härteres
        Test-Szenario (Feldfotos, andere Kameras). Wer in der
        Projektarbeit nur die eine PlantVillage-Zahl vergleicht,
        unterschätzt klassische Verfahren und überschätzt zugleich die
        Übertragbarkeit des CNN — die Transfer-Lektion zeigt diese Falle
        im Detail.
      </DepthBox>

      <DepthBox variant="deeper" title="Was die Filter wirklich lernen">
        Visualisiert man trainierte CNNs, zeigt sich verblüffend
        konsistent dieselbe Hierarchie: Schicht 1 lernt Kanten- und
        Farbdetektoren (oft fast identisch mit den handgebauten
        Gabor-Filtern der klassischen Bildverarbeitung), mittlere
        Schichten Texturen und einfache Formen, späte Schichten
        klassen-spezifische Teile wie Blattadern oder Fleckenränder. Das
        CNN erfindet also das klassische Feature-Engineering nach — nur
        eben optimiert auf genau die Aufgabe statt auf menschliche
        Plausibilität. Werkzeuge zum Selberschauen: Aktivierungs-Maps und
        Grad-CAM.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Den <strong>Bausteinen</strong> (nächste Lektion: Convolution zum
        Anfassen), der <strong>Features-Lektion</strong> (das Gegenmodell:
        handgebaute Features) und der{" "}
        <strong>LogReg-Intuition</strong> — die letzte Schicht jedes
        Klassifikations-CNNs ist eine Softmax-Regression auf gelernten
        Features.
      </DepthBox>
    </div>
  );
}

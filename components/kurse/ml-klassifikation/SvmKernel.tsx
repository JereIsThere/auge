import { DepthBox } from "@/components/lessons/DepthBox";
import { MlQuelle } from "./MlQuelle";
import "@/components/lessons/lesson.css";
import "./ml.css";

export default function SvmKernel() {
  return (
    <div className="lesson-card">
      <h2>Der Kernel-Trick</h2>
      <p className="lesson-description">
        Was, wenn keine gerade Straße existiert? Die SVM-Antwort ist einer
        der elegantesten Tricks des klassischen ML: Hebe die Daten in einen
        höherdimensionalen Raum, in dem sie <em>wieder linear trennbar</em>{" "}
        sind — ohne diesen Raum jemals zu betreten.
      </p>

      <div className="info-box">
        <strong>Kernel-Trick:</strong> Die SVM braucht von den Daten nur
        Skalarprodukte ⟨xᵢ, xⱼ⟩. Ein Kernel k(xᵢ, xⱼ) liefert das
        Skalarprodukt in einem höheren Raum direkt — ohne die
        Transformation auszurechnen.
      </div>

      <h3>Das Ein-Dimensionen-Beispiel</h3>
      <div className="ml-demo">
        <svg viewBox="0 0 600 280" role="img" aria-label="Kernel-Trick: 1D nicht trennbar, in 2D trennbar">
          {/* Oben: 1D-Zahlenstrahl, nicht trennbar */}
          <text x={20} y={28} fontSize={12} fill="currentColor" opacity={0.7}>1D: nicht linear trennbar</text>
          <line x1={40} y1={60} x2={560} y2={60} stroke="currentColor" strokeOpacity={0.4} />
          {/* violett außen, grün innen */}
          <circle cx={80} cy={60} r={6} fill="#8b5cf6" />
          <circle cx={130} cy={60} r={6} fill="#8b5cf6" />
          <circle cx={250} cy={60} r={6} fill="#10b981" />
          <circle cx={300} cy={60} r={6} fill="#10b981" />
          <circle cx={350} cy={60} r={6} fill="#10b981" />
          <circle cx={470} cy={60} r={6} fill="#8b5cf6" />
          <circle cx={520} cy={60} r={6} fill="#8b5cf6" />

          {/* Pfeil */}
          <text x={300} y={105} fontSize={13} textAnchor="middle" fill="currentColor" opacity={0.8}>
            ↓ Abbildung x → (x, (x−300)²) — eine zweite Dimension dazu
          </text>

          {/* Unten: Parabel, trennbar */}
          <text x={20} y={135} fontSize={12} fill="currentColor" opacity={0.7}>2D: linear trennbar</text>
          <line x1={40} y1={250} x2={560} y2={250} stroke="currentColor" strokeOpacity={0.4} />
          {/* Trennlinie horizontal */}
          <line x1={40} y1={195} x2={560} y2={195} stroke="#f59e0b" strokeWidth={2} strokeDasharray="7 5" />
          <text x={445} y={188} fontSize={11} fill="#f59e0b">Trenn-Hyperebene</text>
          {/* gleiche Punkte, Höhe = (x-300)² skaliert */}
          <circle cx={80} cy={250 - 96} r={6} fill="#8b5cf6" />
          <circle cx={130} cy={250 - 57} r={6} fill="#8b5cf6" />
          <circle cx={250} cy={250 - 5} r={6} fill="#10b981" />
          <circle cx={300} cy={250 - 0} r={6} fill="#10b981" />
          <circle cx={350} cy={250 - 5} r={6} fill="#10b981" />
          <circle cx={470} cy={250 - 57} r={6} fill="#8b5cf6" />
          <circle cx={520} cy={250 - 96} r={6} fill="#8b5cf6" />
        </svg>
      </div>
      <p>
        In 1D liegen die grünen Punkte <em>zwischen</em> den violetten —
        keine einzelne Schwelle trennt sie. Eine simple zweite Dimension
        (der quadrierte Abstand zur Mitte) macht sie mit einer horizontalen
        Linie trennbar. Genau diese Idee skaliert der Kernel-Trick auf
        beliebig komplexe Abbildungen.
      </p>

      <h3>Der Trick im Detail</h3>
      <ol className="step-list">
        <li>
          Die SVM-Optimierung (in ihrer dualen Form) berührt die Daten{" "}
          <strong>nur über Skalarprodukte</strong> ⟨xᵢ, xⱼ⟩ — nie über
          einzelne Koordinaten.
        </li>
        <li>
          Statt die Daten mit φ(x) hochzuheben und dann ⟨φ(xᵢ), φ(xⱼ)⟩ zu
          rechnen, definiert man eine Funktion k(xᵢ, xⱼ), die dieses
          Ergebnis <strong>direkt</strong> liefert.
        </li>
        <li>
          Der hochdimensionale Raum wird nie materialisiert — man bezahlt
          nur den Preis der Kernel-Auswertung pro Punktepaar.
        </li>
      </ol>

      <h3>Der wichtigste Kernel: RBF</h3>
      <div className="ml-formel">
        k(x, x&apos;) = exp(−γ · ||x − x&apos;||²)
      </div>
      <p>
        Der <strong>RBF-Kernel</strong> (Radial Basis Function) misst
        schlicht Ähnlichkeit: 1 für identische Punkte, gegen 0 für weit
        entfernte. γ (gamma) steuert, wie schnell die Ähnlichkeit abfällt —
        also wie <em>lokal</em> das Modell denkt. Die Entscheidungsgrenze
        im Originalraum kann damit beliebig gekrümmt sein.
      </p>

      <MlQuelle
        id="boser1992-kernel"
        kernaussagen={[
          "Führt den Kernel-Trick in das Maximum-Margin-Training ein.",
          "Zeigt: Die Optimierung braucht nur Skalarprodukte — beliebige Kernel machen den Klassifikator nicht-linear.",
        ]}
      />

      <DepthBox variant="why" title="Warum ist das billiger als selbst transformieren?">
        Ein Polynom-Feature-Mapping von 512 Dimensionen auf Grad 3 erzeugt
        über 22 Millionen Kombinations-Features — pro Bild. Der
        Polynom-Kernel (⟨x, x&apos;⟩ + c)³ liefert dasselbe Skalarprodukt
        mit einer Operation auf den originalen 512 Zahlen. Beim RBF-Kernel
        ist es noch drastischer: Sein impliziter Feature-Raum ist{" "}
        <em>unendlichdimensional</em> — explizit transformieren ist nicht
        teuer, sondern unmöglich. Der Kernel macht das Unmögliche zu einer
        Zeile Mathematik.
      </DepthBox>

      <DepthBox variant="mistake" title="RBF auf unskalierte Features loslassen">
        ||x − x&apos;||² summiert über <em>alle</em> Dimensionen. Lebt ein
        Feature in [0, 10.000] und die anderen in [0, 1], besteht die
        Distanz praktisch nur aus diesem einen Feature — der Kernel ist
        blind für den Rest. Symptom: Die SVM ist kaum besser als Raten,
        obwohl die Features gut sind. StandardScaler vor jeder
        RBF-SVM ist keine Empfehlung, sondern Pflicht.
      </DepthBox>

      <DepthBox variant="deeper" title="Wann linear, wann RBF?">
        Faustregel aus der Praxis: Bei <strong>vielen Dimensionen und
        vergleichsweise wenigen Beispielen</strong> (Texte, Histogramme,
        Gen-Daten) sind die Daten oft schon fast linear trennbar — linearer
        Kernel reicht, trainiert dramatisch schneller und überfittet
        weniger. RBF lohnt sich bei wenigen Dimensionen mit komplexen
        Grenzen oder wenn der lineare Versuch sichtbar underfittet
        (Train-Score schon schlecht). Für PlantVillage-Histogramme:
        zuerst <code>LinearSVC</code>, RBF nur als Vergleich — die
        Praxis-Lektion zeigt den Zeitunterschied.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Der <strong>SVM-Praxis</strong> (LinearSVC vs. SVC mit RBF in
        Zahlen), dem <strong>SVM-Tuning</strong> (γ ist der zweite große
        Knopf) und den <strong>Embeddings aus dem RAG-Thema</strong> — auch
        dort steckt die Bedeutung in Skalarprodukten zwischen Vektoren.
      </DepthBox>
    </div>
  );
}

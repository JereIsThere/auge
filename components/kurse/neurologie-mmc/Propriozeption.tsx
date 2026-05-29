import { DepthBox } from "@/components/lessons/DepthBox";
import { Aufgabe } from "@/components/lessons/Aufgabe";
import "@/components/lessons/lesson.css";

export default function Propriozeption() {
  return (
    <div className="lesson-card">
      <h2>Propriozeption — der sechste Sinn</h2>
      <p className="lesson-description">
        Schließ die Augen und berühre mit dem Zeigefinger deine Nase. Das
        klappt — obwohl du deine Hand nicht siehst. Verantwortlich ist
        die <strong>Propriozeption</strong>: das System, das ständig meldet,
        wo dein Körper im Raum ist, wie deine Gelenke stehen, wie stark
        deine Muskeln gespannt sind. Ohne sie wäre keine zielgerichtete
        Bewegung möglich.
      </p>

      <div className="info-box">
        Der Begriff stammt von <strong>Charles Sherrington</strong> (1906) —
        „proprius" (lat. eigen) + „receptus" (Empfang). Wörtlich: das
        Gefühl für das Eigene.
      </div>

      <h3>Die drei Sensor-Typen</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🧬 Muskelspindeln</div>
          <div className="actor-row">
            In jedem Muskel verteilt. Messen die <strong>Länge</strong> und
            die <strong>Geschwindigkeit der Längenänderung</strong>. Dadurch
            weiß das ZNS, wie weit ein Gelenk gerade gestreckt ist und wie
            schnell. Reflexbogen für den Patellarsehnenreflex sitzt hier.
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">⚖️ Golgi-Sehnenorgane</div>
          <div className="actor-row">
            In den Sehnen am Übergang Muskel-Knochen. Messen{" "}
            <strong>Spannung</strong> (Kraft). Schützen vor Überlastung —
            bei extremer Spannung lösen sie eine reflexartige Hemmung des
            Muskels aus (autogene Inhibition).
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">🎚 Gelenkrezeptoren</div>
          <div className="actor-row">
            In Gelenkkapseln und Bändern. Melden vor allem Endlagen-
            Positionen und Drehbewegungen. Zusammen mit den Muskelspindeln
            ergibt das das „Lagebild" jedes Gelenks.
          </div>
        </div>
      </div>

      <Aufgabe titel="Selbst-Test — Joint Position Sense" schwierigkeit="leicht" zeit="3 min">
        <p>
          Setz dich entspannt hin, schließe die Augen, halt eine Hand
          ausgestreckt nach vorn. Lass jemanden anderen den Zeigefinger der
          anderen Hand in eine bestimmte Position bringen (sagen wir: zur
          Stirn). Versuche nun mit der ausgestreckten Hand — Augen weiter
          zu — denselben Punkt zu treffen.
        </p>
        <p>
          Das funktioniert für die meisten Menschen mit ~1-2 cm Abweichung.
          Bei propriozeptiven Störungen (z.B. nach Schlaganfall, MS, oder
          peripherer Neuropathie) liegt die Abweichung oft bei 5-10 cm —
          ein klassischer Screening-Test.
        </p>
      </Aufgabe>

      <h3>Wie das ZNS Propriozeption nutzt</h3>
      <ol className="step-list">
        <li>
          <strong>Bewegungsplanung</strong> — vor jeder Bewegung weiß das
          Hirn, wo der Körper steht. Sonst keine zielgerichtete Reach-
          Bewegung möglich.
        </li>
        <li>
          <strong>Bewegungskorrektur on-the-fly</strong> — während der
          Bewegung melden die Sensoren, ob der Plan klappt. Kleinhirn
          vergleicht Soll mit Ist und korrigiert in Millisekunden.
        </li>
        <li>
          <strong>Posturale Kontrolle</strong> — automatisches Tonus-
          Management gegen Schwerkraft. Wenn du dich vorbeugst,
          aktivieren Wadenmuskeln <em>bevor</em> du fällst —
          antizipatorisch.
        </li>
        <li>
          <strong>Lernen</strong> — Bewegungsmuster werden nur dann
          gespeichert, wenn das sensorische Feedback gestimmt hat. Ohne
          Propriozeption kein motorisches Lernen.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum tappen Menschen mit Polyneuropathie?">
        Bei Polyneuropathie (z.B. diabetisch) sind die peripheren Nerven
        geschädigt — auch die propriozeptiven Fasern aus den Füßen. Das
        ZNS weiß nicht mehr, ob der Fuß den Boden berührt hat oder wie
        das Knie gerade steht. Resultat: <em>visuelles Ersetzen</em> —
        die Person muss <em>hinschauen</em>, wo sie hinsetzt. Im Dunkeln
        oder mit geschlossenen Augen wird das Gehen unmöglich. Genau
        dieser Befund ist diagnostisch beweisend.
      </DepthBox>

      <DepthBox variant="mistake" title='"Propriozeption ist nur für Sportler"'>
        Verbreitetes Missverständnis. Propriozeption ist die <em>Basis</em>
        jeder Alltagsbewegung. In der Ergotherapie ist sie zentral für:
        Schreiben, Knöpfe schließen, Greifkraft dosieren, Tasse zum Mund
        führen ohne Wasser zu verschütten. Probleme mit der Propriozeption
        äußern sich oft als „Ungeschicklichkeit" — die eigentliche Ursache
        wird leicht übersehen.
      </DepthBox>

      <DepthBox variant="deeper" title="Statisch vs. dynamisch">
        <ul>
          <li>
            <strong>Statische Propriozeption</strong> — wo bin ich gerade?
            (Joint Position Sense, getestet mit dem Stirn-Finger-Test).
          </li>
          <li>
            <strong>Dynamische Propriozeption</strong> — wie bewege ich mich?
            (Kinästhesie — Geschwindigkeit und Richtung von Bewegung
            wahrnehmen). Getestet mit z.B. „in welche Richtung bewege ich
            gerade dein Bein?" bei geschlossenen Augen.
          </li>
        </ul>
        Beide können unabhängig voneinander gestört sein. Statische
        Defizite stören das Sitzen/Stehen, dynamische das Gehen und
        Greifen.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Sensorische Integration (Propriozeption + Vestibular + Tast =
        zentrale Reha-Triade), Bilaterale Integration (zwei Hände
        koordinieren braucht beidseitige Propriozeption), und
        Konzentrische vs. exzentrische Aktivität (Spindeln feuern in
        beiden Modi anders — relevant für Übungs-Auswahl).
      </DepthBox>
    </div>
  );
}

import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Was ist Kryptografie eigentlich?</h2>

      <DepthBox variant="basic" title="In einem Satz" defaultOpen>
        <p>
          Kryptografie ist <strong>Mathe gegen neugierige Menschen</strong>. Sie
          sorgt dafür, dass du etwas verschicken kannst, ohne dass Fremde es
          lesen, verändern oder fälschen können — selbst wenn sie die ganze
          Leitung abhören.
        </p>
      </DepthBox>

      <p className="lesson-description">
        Kryptografie beantwortet im Kern <strong>drei Fragen</strong>, die
        immer wieder auftauchen, sobald zwei Parteien über einen unsicheren
        Kanal reden:
      </p>

      <ol className="step-list">
        <li>
          <strong>Vertraulichkeit</strong> — Kann jemand mitlesen, was ich
          schicke? (Antwort: Verschlüsselung.)
        </li>
        <li>
          <strong>Integrität</strong> — Ist die Nachricht unverändert
          angekommen? (Antwort: Hashes, MACs.)
        </li>
        <li>
          <strong>Authentizität</strong> — Rede ich wirklich mit der Person,
          mit der ich denke? (Antwort: Signaturen, Zertifikate.)
        </li>
      </ol>

      <DepthBox variant="why" title="Wozu der Aufwand? Geht doch HTTPS einfach?">
        <p>
          „HTTPS" ist kein einzelnes Verfahren, sondern ein <em>Stapel</em> aus
          all dem hier: Diffie-Hellman zum Schlüsseltausch, AES zum
          Verschlüsseln, HMAC oder GCM für Integrität, RSA oder ECDSA für
          Signaturen, Zertifikate für die Identitätsprüfung. Wenn auch nur ein
          Baustein wackelt, kippt die ganze Sicherheit.
        </p>
        <p>
          Deshalb lernt man die Bausteine einzeln — sonst verstehst du nie,
          warum ein Login-Bug die ganze Bank kompromittieren kann.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="„Aber ich habe nichts zu verbergen…“">
        <p>
          Kryptografie ist nicht nur fürs Verstecken. Sie ist auch das, was
          deine Banküberweisung davor schützt, dass jemand „1 €" in „1000 €"
          ändert, und was dafür sorgt, dass ein Software-Update wirklich von
          Microsoft kommt und nicht von einem Angreifer. Integrität und
          Authentizität sind oft wichtiger als Vertraulichkeit.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Von Caesar bis Signal — sehr kurze Version">
        <p>
          Vor ~2000 Jahren: Caesar verschiebt Buchstaben um 3. Mittelalter:
          Vigenère mit wechselndem Schlüssel. 1920er–40er: Rotormaschinen wie
          Enigma. 1970er: Diffie & Hellman + RSA erfinden die <em>asymmetrische</em>{" "}
          Krypto — der bis dahin größte konzeptionelle Sprung. Heute: AES,
          SHA-2, ECC, TLS, Signal, und in den 2020ern beginnen Post-Quantum-Verfahren
          die Standardisierung.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Was Kryptografie NICHT löst">
        <p>
          Krypto schützt die <em>Nachricht unterwegs</em>, nicht die Endpunkte.
          Wenn dein Rechner mit Malware verseucht ist, hilft die beste
          Verschlüsselung nichts — der Angreifer liest mit, bevor verschlüsselt
          wird. Sie schützt auch nicht vor <em>Metadaten</em>: <em>wer</em> mit{" "}
          <em>wem</em> wie lange redet, ist oft genauso aussagekräftig wie der
          Inhalt selbst.
        </p>
        <p>
          Und sie löst keine sozialen Probleme: Phishing, Social Engineering,
          erpresste Schlüssel — all das ist außerhalb der Mathematik.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Wie du am besten weitermachst">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/kerckhoffs">Angreifer & Kerckhoffs-Prinzip</Link>{" "}
            — die Spielregeln klären, bevor wir Verfahren bauen.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/caesar">Caesar</Link> — das einfachste
            denkbare Verfahren, um ein Gefühl zu bekommen.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/symm-asymm">Symmetrisch vs. asymmetrisch</Link>{" "}
            — der wichtigste Unterschied in der modernen Krypto.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

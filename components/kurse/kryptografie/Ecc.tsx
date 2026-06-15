import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";
import { KryptoQuelle } from "./KryptoQuelle";

export default function Ecc() {
  return (
    <div className="lesson-card">
      <h2>Elliptische Kurven (ECC)</h2>

      <DepthBox variant="basic" title="ECC in einer Analogie" defaultOpen>
        <p>
          Stell dir einen Billardtisch mit komischen Banden vor. Du legst die
          Kugel an Punkt <em>G</em> und stößt sie an. Sie prallt nach festen
          mathematischen Regeln ab. Nach <em>k</em> Stößen liegt sie irgendwo —
          nennen wir das <em>k·G</em>.
        </p>
        <p>
          Jemandem zu sagen <em>„hier liegt die Kugel"</em> verrät nicht, wie
          oft du gestoßen hast. Genau das ist ECC: leicht vorwärts zu rechnen
          (<em>k</em> kennen → <em>k·G</em> berechnen), praktisch unmöglich
          rückwärts (<em>k·G</em> sehen → <em>k</em> finden).
        </p>
      </DepthBox>

      <p className="lesson-description">
        ECC ist die moderne Schwester von RSA: dasselbe Konzept (asymmetrische
        Krypto), aber auf einer anderen mathematischen Struktur — Punkten auf
        einer <strong>elliptischen Kurve</strong> über einem endlichen Körper.
        Vorteil: <strong>viel kürzere Schlüssel</strong> bei gleicher Sicherheit.
      </p>

      <h3>Schlüssel-Längen im Vergleich</h3>
      <div className="kv-table">
        <dt>Sicherheit</dt><dd>RSA</dd>
        <dt> </dt><dd>ECC</dd>
        <dt>80 Bit</dt><dd>1024 Bit</dd>
        <dt> </dt><dd>160 Bit</dd>
        <dt>128 Bit</dt><dd>3072 Bit</dd>
        <dt> </dt><dd>256 Bit</dd>
        <dt>192 Bit</dt><dd>7680 Bit</dd>
        <dt> </dt><dd>384 Bit</dd>
        <dt>256 Bit</dt><dd>15360 Bit</dd>
        <dt> </dt><dd>521 Bit</dd>
      </div>

      <div className="info-box">
        Faustregel: ECC-Schlüssel sind etwa <strong>1/10 so lang</strong> wie
        RSA für gleichwertige Sicherheit. Auf eingebetteten Geräten, Smartcards
        und Smartphones — wo Rechenleistung, Speicher und Bandbreite knapp sind —
        macht das einen riesigen Unterschied.
      </div>

      <DepthBox variant="why" title="Warum sind kürzere Schlüssel möglich?">
        <p>
          RSAs Sicherheit beruht auf dem Faktorisieren großer Zahlen. Dafür gibt
          es subexponentiale Algorithmen (Number Field Sieve) — also schneller
          als reines Raten, langsamer als polynomiell. Deshalb muss RSA das mit
          der Schlüssel-Länge ausgleichen.
        </p>
        <p>
          ECC beruht auf dem <em>diskreten Logarithmus auf elliptischen Kurven</em>.
          Dafür ist bisher <strong>kein</strong> subexponentialer Algorithmus
          bekannt — der beste bekannte Angriff ist Pollards Rho mit{" "}
          <code>√n</code> Aufwand. Heißt: ein <em>n</em>-Bit-ECC-Schlüssel
          bietet ~<em>n/2</em> Bit Sicherheit. Sehr effizient.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Wie funktioniert die Punktaddition?">
        <p>
          Eine elliptische Kurve hat die Form <code>y² = x³ + ax + b</code>{" "}
          (für Krypto: über einem endlichen Körper modulo einer großen
          Primzahl). Auf so einer Kurve definiert man eine{" "}
          <strong>Addition von Punkten</strong> rein geometrisch:
        </p>
        <ol className="step-list">
          <li>
            Zwei Punkte <em>P</em> und <em>Q</em>: zeichne eine Gerade durch
            beide. Sie trifft die Kurve in einem dritten Punkt.
          </li>
          <li>
            Spiegle diesen Punkt an der x-Achse — das Ergebnis ist <em>P + Q</em>.
          </li>
          <li>
            <em>P</em> mit sich selbst addieren („Verdoppeln"): nimm die
            Tangente an <em>P</em>, finde den Schnittpunkt, spiegle.
          </li>
        </ol>
        <p>
          Punkt-Multiplikation <em>k·G</em> heißt einfach „<em>G</em> mit sich
          selbst <em>k</em>-mal addieren" — effizient via Doppel-und-Add in
          <code> O(log k)</code>. Rückwärts (gegeben <em>G</em> und <em>k·G</em>,
          finde <em>k</em>) ist das diskrete-Logarithmus-Problem auf der Kurve.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Curve-25519, NIST P-256 — was nehmen?">
        <p>
          Nicht alle Kurven sind gleich. Manche NIST-Kurven (P-256, P-384) sind
          implementierungstechnisch fragil — kleine Programmfehler führen zu
          praktischen Lecks (Seitenkanäle).
        </p>
        <p>
          Bevorzugte moderne Wahl: <strong>Curve25519</strong> (für
          Schlüsseltausch via X25519) und <strong>Ed25519</strong> (für
          Signaturen). Daniel Bernstein hat sie so designt, dass typische
          Implementierungsfehler unmöglich werden. Werden inzwischen von SSH,
          TLS, Signal, WireGuard, etc. genutzt.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Wer hat das erfunden?">
        <p>
          Unabhängig 1985 von <strong>Neal Koblitz</strong> und{" "}
          <strong>Victor Miller</strong>. Praktisch wurde es aber erst Mitte
          der 2000er, als TLS und mobile Geräte nach kompakteren Krypto-Verfahren
          schrien. Heute basiert die Mehrheit moderner Krypto-Protokolle auf
          ECC, nicht mehr auf RSA.
        </p>
      </DepthBox>

      <KryptoQuelle
        id="nist-fips-186-5"
        kernaussagen={[
          "FIPS 186-5 definiert die offiziellen NIST-Kurven: P-256, P-384, P-521 — mit dokumentierten Parametern für transparente, prüfbare Sicherheit.",
          "P-256 (secp256r1) ist heute die meistgenutzte ECC-Kurve — in TLS-Zertifikaten, JWT-Signaturen und Android-Schlüsselspeichern.",
          "Der Standard ordnet konkrete Sicherheitsniveaus zu: P-256 entspricht 128 Bit, P-384 entspricht 192 Bit Sicherheit.",
        ]}
      />

      <DepthBox variant="related" title="Wo ECC dir begegnet">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/diffie-hellman">Diffie-Hellman</Link> →{" "}
            ECDH ist die elliptische Variante, Standard in TLS heute.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/signaturen">Signaturen</Link> → ECDSA,
            Ed25519 — was Apple, GitHub, Bitcoin & Co. nutzen.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/rsa">RSA</Link> — der ältere Verwandte zum
            Vergleich.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/post-quantum">Post-Quantum</Link> — auch ECC
            fällt gegen Quantencomputer (Shors Algorithmus).
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

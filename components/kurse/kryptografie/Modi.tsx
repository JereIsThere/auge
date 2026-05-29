import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

export default function Modi() {
  return (
    <div className="lesson-card">
      <h2>Betriebsmodi & Padding</h2>

      <DepthBox variant="basic" title="Worum geht's hier?" defaultOpen>
        <p>
          Eine Blockchiffre wie AES verschlüsselt <strong>genau 16 Bytes</strong>.
          Was machst du, wenn deine Nachricht 5 MB groß ist? Du brauchst eine
          Regel, <em>wie</em> du die Blöcke verkettest — das nennt man{" "}
          <strong>Betriebsmodus</strong>. Die Wahl ist wichtiger als die
          Chiffre selbst.
        </p>
      </DepthBox>

      <h3>Die wichtigsten Modi</h3>

      <div className="warn-box">
        <strong>ECB (Electronic Codebook) — niemals nutzen.</strong> Jeder Block
        wird unabhängig verschlüsselt. Gleicher Klartext-Block → gleicher
        Geheimtext-Block. Wenn man ein Bild damit verschlüsselt, erkennt man
        das Originalmotiv noch — das berühmte „ECB-Pinguin"-Beispiel.
      </div>

      <div className="info-box">
        <strong>CBC (Cipher Block Chaining):</strong> Jeder Block wird vor der
        Verschlüsselung mit dem vorigen Geheimtext-XORt. Der erste Block
        bekommt einen zufälligen <em>IV</em>. Lange Zeit Standard, hat aber
        keinen Integritätsschutz und ist anfällig für{" "}
        <em>Padding-Oracle-Angriffe</em>.
      </div>

      <div className="info-box">
        <strong>CTR (Counter):</strong> Verschlüsselt einen Zähler statt der
        Daten und XORt das Ergebnis auf den Klartext. Macht aus der Blockchiffre
        eine <em>Stromchiffre</em>. Parallelisierbar, schnell, kein Padding nötig
        — aber tot bei Nonce-Wiederverwendung.
      </div>

      <div className="success-box">
        <strong>GCM (Galois/Counter Mode):</strong> CTR plus eingebauter
        Authentifizierung (MAC). Aktueller Standard für TLS, WireGuard, …
        Liefert Vertraulichkeit <em>und</em> Integrität in einem Schritt
        („AEAD"). <strong>Wenn du nicht sicher bist, nimm GCM.</strong>
      </div>

      <DepthBox variant="why" title="Warum reicht ECB nicht?">
        <p>
          Weil identische Eingabeblöcke identische Ausgabeblöcke produzieren —
          Muster im Klartext bleiben sichtbar. In einem Bitmap-Bild
          wiederholen sich Pixelmuster (z. B. einfarbige Flächen) in 16-Byte-Blöcken,
          und im Geheimtext wiederholen sich dann genau dieselben Block-Muster.
          Du siehst die Silhouette des Originals.
        </p>
        <p>
          Generell: ECB <em>leakt Gleichheit</em>. Das ist in fast jedem
          Anwendungsfall ein Problem.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Padding — und warum es gefährlich ist">
        <p>
          CBC braucht Eingaben, deren Länge ein Vielfaches von 16 ist. Lösung:{" "}
          <strong>PKCS#7-Padding</strong> — fehlen <em>n</em> Bytes bis zum
          nächsten Block, füllt man mit <em>n</em> Bytes vom Wert <em>n</em>{" "}
          auf. Beim Entschlüsseln prüft man das Padding und schneidet es ab.
        </p>
        <p>
          Genau diese Prüfung ist das Problem: Verrät der Server, ob das
          Padding stimmt (über Fehlermeldungen oder Timing), kann ein
          Angreifer Byte für Byte den Klartext rekonstruieren — ganz ohne
          Schlüssel. Das ist der <strong>Padding-Oracle-Angriff</strong>{" "}
          (Vaudenay 2002), und er hat reale Systeme massenhaft kaputt gemacht
          (POODLE, BEAST, Lucky 13, …).
        </p>
        <p>
          Lehre: <em>encrypt-then-MAC</em> oder gleich ein AEAD-Modus wie GCM.
          Niemals nackt CBC ohne Authentifizierung.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="Den Nonce / IV wiederverwenden">
        <p>
          In CTR und GCM ist der <em>Nonce</em> (Number used ONCE) heilig.
          Verwendest du denselben Nonce zweimal mit demselben Schlüssel,
          passiert dir der <strong>Two-Time-Pad-Bruch</strong> aus der
          OTP-Lektion: <code>C₁ ⊕ C₂ = M₁ ⊕ M₂</code>, beide Klartexte
          rekonstruierbar.
        </p>
        <p>
          Bei GCM ist es noch schlimmer: Nonce-Wiederholung erlaubt dem
          Angreifer, den <em>Authentifizierungs-Schlüssel</em> zu berechnen —
          dann kann er beliebige Nachrichten fälschen. Deshalb: Nonce immer
          zufällig oder als monoton steigender Zähler, niemals wiederholen.
        </p>
      </DepthBox>

      <DepthBox variant="why" title="Was ist „AEAD“?">
        <p>
          <strong>Authenticated Encryption with Associated Data.</strong> Ein
          Modus, der drei Sachen gleichzeitig liefert:
        </p>
        <ol className="step-list">
          <li><strong>Vertraulichkeit</strong> — niemand liest den Klartext.</li>
          <li><strong>Integrität</strong> — Manipulation am Geheimtext wird erkannt.</li>
          <li>
            <strong>Authentizität für Zusatzdaten</strong> — z. B. Header-Felder,
            die sichtbar sein dürfen, aber nicht verändert werden.
          </li>
        </ol>
        <p>
          Standard-AEADs heute: <strong>AES-GCM</strong> und{" "}
          <strong>ChaCha20-Poly1305</strong>. Letzteres ist auf Smartphones ohne
          AES-Hardware schneller und wird z. B. von Google bevorzugt.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Drumherum">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/aes">AES</Link> — die Blockchiffre selbst.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/hmac">HMAC</Link> — der klassische Weg,
            Integrität nachzurüsten (wenn man kein AEAD hat).
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/entropie">Zufall</Link> — woher kommen IVs
            und Nonces? Genau dort.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

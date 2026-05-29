import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

export default function PostQuantum() {
  return (
    <div className="lesson-card">
      <h2>Post-Quantum-Kryptografie</h2>

      <DepthBox variant="basic" title="Worum geht's?" defaultOpen>
        <p>
          Quantencomputer sind nicht einfach „schnellere Computer". Sie können{" "}
          <strong>bestimmte mathematische Probleme</strong> exponentiell
          schneller lösen — genau jene, auf denen heute RSA und ECC beruhen.
        </p>
        <p>
          Sobald ein ausreichend großer Quantencomputer existiert, sind diese
          Verfahren tot. Post-Quantum-Krypto entwickelt jetzt schon
          Verfahren, die <em>klassisch wie quanten</em> sicher sind — bevor
          es zu spät ist.
        </p>
      </DepthBox>

      <h3>Was ist betroffen, was nicht?</h3>

      <div className="warn-box">
        <strong>Gebrochen durch Quanten (Shor's Algorithmus, polynomiell):</strong>
        <ul style={{ marginTop: 6 }}>
          <li>RSA — komplett.</li>
          <li>Diffie-Hellman (klassisch und elliptisch) — komplett.</li>
          <li>ECDSA, EdDSA, alles ECC-basierte — komplett.</li>
        </ul>
      </div>

      <div className="success-box">
        <strong>Geschwächt, aber überlebensfähig (Grover's Algorithmus, √-Speedup):</strong>
        <ul style={{ marginTop: 6 }}>
          <li>AES-128 → effektiv 64 Bit. Heißt: nimm AES-256.</li>
          <li>SHA-256 → effektiv 128 Bit Kollisionsresistenz. Noch ok, SHA-384 ist sicherer.</li>
          <li>HMAC, symmetrische Krypto allgemein: einfach Schlüssel verdoppeln.</li>
        </ul>
      </div>

      <DepthBox variant="why" title="„Aber Quantencomputer gibt's doch noch nicht?“">
        <p>
          Stimmt — Stand 2026 hat IBM ~1000 verrauschte Qubits, gebraucht
          würden Millionen fehlertoleranter. Aber:
        </p>
        <ol className="step-list">
          <li>
            <strong>Harvest now, decrypt later.</strong> Geheimdienste zeichnen
            heute schon TLS-Traffic auf und warten, bis sie ihn in 10–20
            Jahren entschlüsseln können. Was du heute verschickst, was lange
            geheim bleiben muss (Patente, Identitäten, Diplomatie), ist{" "}
            <em>jetzt schon gefährdet</em>.
          </li>
          <li>
            <strong>Migration dauert Jahrzehnte.</strong> RSA in alle Banken,
            Geldautomaten, IoT-Geräte, Browser, Smartcards zu bringen, hat 30
            Jahre gedauert. Es rauszunehmen wird ähnlich lange dauern.
          </li>
          <li>
            <strong>Standardisierung läuft.</strong> NIST wählte 2022/2024
            die ersten PQ-Standards aus. Die Migration beginnt jetzt.
          </li>
        </ol>
      </DepthBox>

      <DepthBox variant="deeper" title="Die neuen Standards (NIST 2024)">
        <ul>
          <li>
            <strong>ML-KEM (Kyber):</strong> Schlüsselkapselung (Ersatz für
            DH/ECDH). Gitter-basiert.
          </li>
          <li>
            <strong>ML-DSA (Dilithium):</strong> Signaturen (Ersatz für
            ECDSA/RSA-Sig). Gitter-basiert.
          </li>
          <li>
            <strong>SLH-DSA (SPHINCS+):</strong> Signaturen rein auf Basis von
            Hash-Funktionen. Sehr konservativ, sehr lange Signaturen, aber
            theoretisch am besten verstanden — das „Backup", falls Gitter
            doch noch brechen.
          </li>
          <li>
            <strong>FALCON:</strong> Kompaktere Gitter-Signaturen. Standardisierung
            läuft noch.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="mistake" title="„Hash-Verfahren sind quantensicher“ — fast">
        <p>
          Nicht ganz. Grover's Algorithmus halbiert die effektive Bitsicherheit
          (Aufwand <code>2^(n/2)</code> statt <code>2^n</code> für Preimage).
          SHA-256 bietet damit gegen Quantenangreifer noch 128 Bit Sicherheit —
          ausreichend, aber nicht der ursprüngliche Spielraum.
        </p>
        <p>
          Für Kollisionen ist's komplizierter (BHT-Algorithmus,{" "}
          <code>2^(n/3)</code>) — SHA-256 sinkt theoretisch auf 85 Bit
          Kollisionssicherheit. Daher die Bewegung zu SHA-384/512 für
          langfristige Anwendungen.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Wer hat das angestoßen?">
        <p>
          <strong>1994:</strong> Peter Shor zeigt theoretisch, dass ein
          Quantencomputer große Zahlen polynomiell faktorisieren kann — RSA
          implizit zum Tode verurteilt.
        </p>
        <p>
          <strong>2016:</strong> NIST startet einen offenen PQ-Wettbewerb
          (analog zum AES-Wettbewerb 1997).
        </p>
        <p>
          <strong>2022:</strong> Erste Gewinner stehen fest.{" "}
          <strong>2024:</strong> FIPS-Standards (203, 204, 205) werden
          publiziert. Chrome, Cloudflare, AWS, Signal beginnen mit hybriden
          Bereitstellungen (klassisch + PQ parallel).
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Drumherum">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/rsa">RSA</Link> &{" "}
            <Link href="/thema/kryptografie/lektionen/ecc">ECC</Link> — was migriert werden muss.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/merkle">Merkle-Bäume</Link> — die Idee
            hinter SPHINCS+ hash-basierten Signaturen.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/tls">TLS</Link> — hybride PQ-Modi sind seit
            2023 in TLS 1.3 möglich (X25519 + Kyber768).
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

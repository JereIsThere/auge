import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

export default function SymmAsymm() {
  return (
    <div className="lesson-card">
      <h2>Symmetrisch vs. asymmetrisch</h2>

      <DepthBox variant="basic" title="Der Unterschied in 30 Sekunden" defaultOpen>
        <p>
          <strong>Symmetrisch:</strong> Ein Schlüssel — beide Seiten haben
          denselben. Wie ein Haustürschlüssel: wer ihn hat, kann auf- und
          zuschließen.
        </p>
        <p>
          <strong>Asymmetrisch:</strong> Zwei Schlüssel, die zusammengehören.
          Der eine <em>öffentliche</em> darf jeder kennen, der andere{" "}
          <em>private</em> bleibt geheim. Wie ein Briefkasten: jeder kann etwas
          einwerfen (öffentlicher Schlitz), aber nur du kannst ihn aufschließen
          (privater Schlüssel).
        </p>
      </DepthBox>

      <h3>Die zwei Welten im Vergleich</h3>

      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">🔐 Symmetrisch</div>
          <div className="actor-row">
            <span>Schlüssel</span><span className="mono">1 geheim</span>
          </div>
          <div className="actor-row">
            <span>Geschwindigkeit</span><span className="mono">sehr schnell</span>
          </div>
          <div className="actor-row">
            <span>Beispiele</span><span className="mono">AES, ChaCha20</span>
          </div>
          <div className="actor-row">
            <span>Problem</span><span className="mono">Schlüsseltausch</span>
          </div>
        </div>

        <div className="actor-card bob">
          <div className="actor-title">🔑 Asymmetrisch</div>
          <div className="actor-row">
            <span>Schlüssel</span><span className="mono">2 (pub + priv)</span>
          </div>
          <div className="actor-row">
            <span>Geschwindigkeit</span><span className="mono">~1000× langsamer</span>
          </div>
          <div className="actor-row">
            <span>Beispiele</span><span className="mono">RSA, ECC</span>
          </div>
          <div className="actor-row">
            <span>Problem</span><span className="mono">Identität (PKI)</span>
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum braucht es überhaupt zwei Sorten?">
        <p>
          Symmetrisch ist schnell und effizient, hat aber ein <strong>Henne-Ei-Problem</strong>:
          wie tauscht man den geheimen Schlüssel überhaupt aus, wenn man noch
          gar keinen sicheren Kanal hat? Früher: per Kurier. Heute: zu langsam
          für Millionen Webseiten pro Sekunde.
        </p>
        <p>
          Asymmetrisch löst genau das. Du veröffentlichst deinen{" "}
          <em>Public Key</em>, jeder kann dir verschlüsselte Post schicken oder
          deine Signaturen prüfen — ohne dass ihr je geredet habt. Dafür ist es
          rechenintensiv und nicht praktisch für große Datenmengen.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="Die Lösung: Hybrid-Verschlüsselung">
        <p>
          Praktisch jedes moderne Protokoll (TLS, PGP, Signal, Age) kombiniert
          beide:
        </p>
        <ol className="step-list">
          <li>
            <strong>Asymmetrisch</strong> nutzen, um <em>einmalig</em> einen
            kurzen symmetrischen Sitzungsschlüssel auszutauschen (oder ihn per
            Diffie-Hellman herzuleiten).
          </li>
          <li>
            <strong>Symmetrisch</strong> dann für die eigentlichen Nutzdaten —
            mit voller Geschwindigkeit.
          </li>
        </ol>
        <p>
          So bekommt man das Beste aus beiden Welten: Lösung des
          Schlüsselverteilungsproblems <em>plus</em> Geschwindigkeit. Genau
          das macht HTTPS bei jedem Verbindungsaufbau.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="„Asymmetrisch ist sicherer“ — Mythos">
        <p>
          Nein. Symmetrisch und asymmetrisch lösen unterschiedliche Probleme.
          AES-256 (symmetrisch) ist heute mindestens so sicher wie RSA-3072
          (asymmetrisch) — oft sogar deutlich sicherer pro Bit, weil
          asymmetrische Schlüssel viel länger sein müssen, um gleichwertige
          Sicherheit zu bieten.
        </p>
        <p>
          Schlüssel-Äquivalenz grob: <code>AES-128 ≈ RSA-3072 ≈ ECC-256</code>{" "}
          ≈ 128 Bit Sicherheit.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="Wann kam die asymmetrische Krypto auf?">
        <p>
          Sehr spät, sehr plötzlich. <strong>1976</strong> publizierten Whitfield
          Diffie und Martin Hellman „New Directions in Cryptography" — die
          Idee, dass es Schlüsselpaare geben könnte, hatte zuvor niemand
          ernsthaft angenommen. Zwei Jahre später kam{" "}
          <strong>RSA</strong> (Rivest, Shamir, Adleman) als erstes praktisches
          Verfahren.
        </p>
        <p>
          Pikant: GCHQ-Mathematiker (UK) hatten dieselben Ideen schon ~1970,
          aber als Staatsgeheimnis. Veröffentlicht wurde das erst 1997.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Wie es weitergeht">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/aes">AES</Link> — der wichtigste symmetrische
            Algorithmus.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/diffie-hellman">Diffie-Hellman</Link> — die
            elegante Lösung fürs Schlüsseltausch-Problem.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/rsa">RSA</Link> & <Link href="/thema/kryptografie/lektionen/ecc">ECC</Link>{" "}
            — die zwei großen asymmetrischen Familien.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/signaturen">Digitale Signaturen</Link> — die
            zweite Anwendung asymmetrischer Krypto.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

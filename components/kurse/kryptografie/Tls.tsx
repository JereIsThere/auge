import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";

export default function Tls() {
  return (
    <div className="lesson-card">
      <h2>TLS, Zertifikate & PKI</h2>

      <DepthBox variant="basic" title="Was passiert beim Schloss-Symbol?" defaultOpen>
        <p>
          Wenn du eine HTTPS-Seite öffnest, läuft im Hintergrund ein kompletter
          Krypto-Kongress ab — in unter 100 Millisekunden. TLS (früher SSL)
          ist das Protokoll, das das orchestriert. Es kombiniert{" "}
          <em>fast alles</em>, was du auf dieser Seite lernst, zu einem
          funktionierenden Ganzen.
        </p>
      </DepthBox>

      <h3>Der TLS-Handshake in 4 Schritten</h3>

      <ol className="step-list">
        <li>
          <strong>ClientHello:</strong> Dein Browser sagt „Hallo, ich kann
          TLS 1.3, kann diese Cipher-Suites, hier mein zufälliger Nonce".
        </li>
        <li>
          <strong>ServerHello + Zertifikat:</strong> Der Server antwortet
          „nehmen wir TLS 1.3 mit ECDHE+AES-GCM, hier ist mein Zertifikat,
          hier ein Beweis dass ich den passenden privaten Schlüssel habe".
        </li>
        <li>
          <strong>Schlüsseltausch:</strong> Beide leiten via ECDHE einen
          gemeinsamen geheimen Sitzungsschlüssel ab.
        </li>
        <li>
          <strong>Verschlüsselte Anwendung:</strong> Ab jetzt alles
          AES-GCM-verschlüsselt — HTTP-Requests, Cookies, Inhalte.
        </li>
      </ol>

      <DepthBox variant="why" title="Wozu das Zertifikat?">
        <p>
          Schlüsseltausch allein löst nicht das wichtigste Problem:{" "}
          <em>Wer ist eigentlich dieser Server?</em> Diffie-Hellman erzeugt
          einen gemeinsamen Schlüssel — aber mit wem? Vielleicht mit einem
          Man-in-the-Middle, der zwei Tausche fährt und alles weiterleitet.
        </p>
        <p>
          Ein Zertifikat ist eine <strong>signierte Aussage</strong> einer
          Zertifizierungsstelle: „Ich, Let's Encrypt, bestätige: dieser
          öffentliche Schlüssel gehört zu bank.de". Dein Browser vertraut
          Let's Encrypt (deren Root-Schlüssel ist im OS einprogrammiert) und
          damit dann auch indirekt bank.de.
        </p>
      </DepthBox>

      <DepthBox variant="deeper" title="PKI: die Vertrauenskette">
        <p>
          PKI = Public Key Infrastructure. Aufbau:
        </p>
        <ol className="step-list">
          <li>
            <strong>Root-CAs</strong> (z. B. DigiCert, Let's Encrypt-Root) — ihre
            Public Keys sind in Browsern und OS fest eingebaut. ~150 Stück
            weltweit.
          </li>
          <li>
            <strong>Intermediate-CAs</strong> — von der Root signiert, machen
            die eigentliche Arbeit. Werden separat gehalten, damit die Root
            offline bleiben kann.
          </li>
          <li>
            <strong>Server-Zertifikate</strong> — vom Intermediate für
            konkrete Domains ausgestellt.
          </li>
        </ol>
        <p>
          Dein Browser prüft die ganze Kette: Server-Zert → signiert von
          Intermediate → signiert von Root → Root steht in der Liste. Wenn
          irgendwo eine Signatur nicht stimmt, Zertifikat abgelaufen ist oder
          der Domain-Name nicht passt: Warnsymbol.
        </p>
      </DepthBox>

      <DepthBox variant="mistake" title="„Das grüne Schloss heißt sicher!“">
        <p>
          Bedeutet nur: die Verbindung zu diesem Server ist verschlüsselt und
          authentifiziert. <strong>Nicht</strong>: dass der Server
          vertrauenswürdig ist. Phishing-Seiten haben heute fast immer
          gültige Zertifikate (Let's Encrypt gibt sie kostenlos für jede
          Domain aus). Das Schloss sagt „Du redest wirklich mit{" "}
          <code>paypa1-secure.com</code>" — es weiß nicht, dass das nicht
          PayPal ist.
        </p>
        <p>
          Auch: <em>EV-Zertifikate</em> (früher mit grüner Firmenleiste) sind
          inzwischen aus den meisten Browsern verschwunden — der Mehrwert war
          zu gering.
        </p>
      </DepthBox>

      <DepthBox variant="history" title="SSL → TLS — eine bewegte Geschichte">
        <ul>
          <li><strong>SSL 1.0</strong> — 1994, Netscape, nie veröffentlicht (gebrochen vor Release).</li>
          <li><strong>SSL 2.0</strong> — 1995, Designfehler, schnell ersetzt.</li>
          <li><strong>SSL 3.0</strong> — 1996, POODLE-Angriff 2014 → tot.</li>
          <li><strong>TLS 1.0/1.1</strong> — 1999/2006, seit 2021 offiziell verboten.</li>
          <li><strong>TLS 1.2</strong> — 2008, immer noch verbreitet, ok bei richtiger Konfiguration.</li>
          <li>
            <strong>TLS 1.3</strong> — 2018, kompletter Reset: nur noch moderne
            Cipher-Suites, schneller Handshake (1-RTT statt 2-RTT), kein RSA-Schlüsseltausch
            mehr (nur ECDHE), Forward Secrecy verpflichtend.
          </li>
        </ul>
      </DepthBox>

      <DepthBox variant="why" title="Forward Secrecy — was und warum">
        <p>
          Bei alten Handshakes wurde der Sitzungsschlüssel mit dem
          Server-RSA-Schlüssel transportiert. Falls jemand den Traffic
          aufzeichnete und Jahre später den Server-Schlüssel klaute, konnte
          er rückwirkend alles entschlüsseln.
        </p>
        <p>
          Mit <strong>ephemerem</strong> Diffie-Hellman (ECDHE) werden für
          jede Sitzung frische temporäre Schlüssel benutzt. Nach der Sitzung
          weggeworfen. Selbst wenn der Server-Langzeit-Schlüssel später
          kompromittiert wird, bleiben alte Mitschnitte unentschlüsselbar.
        </p>
      </DepthBox>

      <DepthBox variant="related" title="Die Bausteine in TLS">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/diffie-hellman">Diffie-Hellman</Link> →
            Schlüsseltausch (heute als ECDHE).
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/signaturen">Digitale Signaturen</Link> →
            Server beweist Besitz des privaten Schlüssels.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/aes">AES</Link> +{" "}
            <Link href="/thema/kryptografie/lektionen/modi">GCM</Link> → eigentliche Datenverschlüsselung.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/hash">Hashes</Link> →{" "}
            <Link href="/thema/kryptografie/lektionen/hmac">HMAC</Link>, Zertifikat-Fingerprints,
            Transcript-Hashing.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

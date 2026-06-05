import Link from "next/link";
import "@/components/lessons/lesson.css";
import { DepthBox } from "@/components/lessons/DepthBox";
import { KryptoQuelle } from "./KryptoQuelle";

export default function Kerckhoffs() {
  return (
    <div className="lesson-card">
      <h2>Angreifer-Modelle & das Kerckhoffs-Prinzip</h2>

      <DepthBox variant="basic" title="Die wichtigste Spielregel" defaultOpen>
        <p>
          Nimm an, dein Gegner <strong>kennt dein Verfahren bis ins Detail</strong> —
          und sei trotzdem sicher. Geheim bleiben darf nur der{" "}
          <strong>Schlüssel</strong>. Wenn Sicherheit darauf beruht, dass keiner
          weiß <em>wie</em> du verschlüsselst, ist sie keine Sicherheit, sondern
          eine Wette.
        </p>
      </DepthBox>

      <p className="lesson-description">
        Auguste Kerckhoffs formulierte das 1883 für die französische Militär-Krypto.
        Heute ist es das Fundament jeder seriösen Sicherheit:{" "}
        <strong>Das Verfahren ist öffentlich, der Schlüssel ist geheim.</strong>{" "}
        Klingt paradox? Ist aber der einzige Weg, der wirklich funktioniert.
      </p>

      <DepthBox variant="why" title="Warum nicht das Verfahren selber geheim halten?">
        <p>
          Drei Gründe:
        </p>
        <ol className="step-list">
          <li>
            <strong>Geheimnisse leaken.</strong> Mitarbeiter wechseln, Code wird
            disassembliert, Whistleblower packen aus. Schlüssel kann man
            wechseln — ein Algorithmus, der in tausend Geräten steckt, nicht.
          </li>
          <li>
            <strong>Geprüfte Algorithmen sind sicherer.</strong> AES, RSA, SHA-2
            sind seit Jahrzehnten öffentlich, und die ganze Welt hat versucht,
            sie zu brechen. Was diese Folter überlebt, ist verdammt robust.
          </li>
          <li>
            <strong>Eigenes Verfahren ≈ kaputt.</strong> Krypto sieht einfach
            aus und ist es nicht. Praktisch jedes selbst ausgedachte
            „Geheimverfahren" wurde gebrochen, sobald es Leute angeschaut haben.
          </li>
        </ol>
      </DepthBox>

      <DepthBox variant="mistake" title="„Security through obscurity“">
        <p>
          So nennt man die Strategie „Sicherheit weil keiner weiß wie's geht".
          Sie funktioniert genau so lange, bis irgendwer hinschaut — und in der
          Praxis schaut <em>immer</em> irgendwer hin. DVD-Verschlüsselung (CSS),
          Wegfahrsperren, Skype-Krypto: alle gebrochen, sobald sie geleakt
          wurden.
        </p>
        <p>
          <strong>Wichtig:</strong> Obscurity kann eine <em>Schicht</em> sein
          (Defense in Depth) — sie darf nur nicht die <em>einzige</em> sein.
        </p>
      </DepthBox>

      <h3>Wer ist eigentlich der Angreifer?</h3>
      <p className="lesson-description">
        Bevor man Sicherheit bauen kann, muss man wissen, <em>wovor</em>. In der
        Krypto gibt es ein Spektrum von Angreifer-Modellen — vom Schwächsten zum
        Stärksten:
      </p>

      <div className="info-box">
        <strong>Ciphertext-only:</strong> Der Angreifer sieht nur verschlüsselte
        Texte und muss daraus etwas ableiten. Schwächster Angreifer — und
        trotzdem schon stark genug, um Caesar zu brechen.
      </div>

      <div className="info-box">
        <strong>Known-plaintext:</strong> Er kennt zusätzlich ein paar
        Klartext-Geheimtext-Paare. Realistisch: viele Nachrichten beginnen mit
        „Sehr geehrte Damen und Herren". Genau das half, Enigma zu brechen.
      </div>

      <div className="info-box">
        <strong>Chosen-plaintext (CPA):</strong> Der Angreifer darf sich
        beliebige Klartexte verschlüsseln lassen. Moderne Verfahren <em>müssen</em>{" "}
        gegen das sicher sein — sonst sind sie wertlos.
      </div>

      <div className="warn-box">
        <strong>Chosen-ciphertext (CCA):</strong> Stärkstes übliches Modell — er
        darf auch beliebige Geheimtexte entschlüsseln lassen (außer dem
        Zielciphertext). Klingt absurd, kommt in der Praxis aber durch
        Fehlermeldungen vor (Padding-Oracle-Angriffe).
      </div>

      <DepthBox variant="deeper" title="Was bedeutet eigentlich „sicher“?">
        <p>
          Moderne Krypto definiert Sicherheit als Spiel: ein Angreifer mit
          begrenzten Ressourcen darf alles tun, was sein Modell erlaubt, und
          muss am Ende eine bestimmte Frage beantworten („War das jetzt die
          Verschlüsselung von Nachricht A oder B?"). Wenn er nicht wesentlich
          besser als Raten ist, gilt das Verfahren als sicher.
        </p>
        <p>
          Konkret: <strong>IND-CPA</strong> bedeutet „nicht unterscheidbar unter
          gewählten Klartexten", <strong>IND-CCA2</strong> dasselbe inklusive
          adaptiv gewählter Geheimtexte. AES-GCM ist IND-CCA2-sicher (bei
          richtiger Nutzung), reines AES-CBC ist es nicht.
        </p>
      </DepthBox>

      <KryptoQuelle
        id="katz-lindell-2021"
        kernaussagen={[
          "Kerckhoffs' Prinzip ist formal als EAV-Sicherheit (Eavesdropping Indistinguishability) verankert: der Angreifer kennt den Algorithmus, darf aber aus dem Ciphertext nichts lernen.",
          "Security-through-Obscurity scheitert in der Praxis: geheime Algorithmen werden irgendwann enthüllt — dann ist die Sicherheit sofort null.",
          "Alle modernen Standards (AES, RSA, SHA-256, TLS) sind öffentlich spezifiziert und trotzdem sicher — weil die Sicherheit am Schlüssel hängt, nicht am Geheimnis des Verfahrens.",
        ]}
      />

      <DepthBox variant="related" title="Wo das gleich relevant wird">
        <ul>
          <li>
            <Link href="/thema/kryptografie/lektionen/frequenz">Häufigkeitsanalyse</Link> — ein
            Ciphertext-only-Angriff auf Caesar.
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/modi">Betriebsmodi & Padding</Link> — wie
            CBC ohne Authentifizierung zum CCA-Albtraum wird (Padding Oracle).
          </li>
          <li>
            <Link href="/thema/kryptografie/lektionen/hash">Hashes</Link> — auch hier gibt's
            Angreifer-Modelle: Preimage, Second-Preimage, Kollision.
          </li>
        </ul>
      </DepthBox>
    </div>
  );
}

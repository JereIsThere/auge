import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

const PROMPT_TLS = `Du bist Kryptografie-Mentor und gibst freundliches,
strukturiertes Feedback zu Sicherheitsanalysen.

ICH ÜBE: TLS, PKI und Zertifikate aus der Kryptografie-Lektion.

AUFGABE: Ich habe 5 Websites analysiert und ihre TLS-Konfiguration
dokumentiert. Meine Notizen folgen.

BITTE BEWERTE MEINE ANALYSE:
1. TLS-Version — habe ich korrekt erkannt, welche Versionen akzeptabel
   sind (1.2, 1.3) und welche veraltet (1.0, 1.1, SSL)? Begründe kurz.
2. Cipher Suite — habe ich die wichtigen Bestandteile richtig
   interpretiert? (Schlüsseltausch, Verschlüsselung, MAC/AEAD)
3. Zertifikat — habe ich die Vertrauenskette verstanden? Root-CA,
   Intermediate, Server-Zertifikat, Gültigkeitsdauer?
4. Schlussfolgerungen — sind meine Sicherheitsbewertungen der Sites
   korrekt? Gibt es Fehleinschätzungen?
5. Fehlendes — was hätte ich noch analysieren können, das ich
   übersehen habe (z.B. HSTS, CT-Logs, OCSP)?

Nenn mir am Ende die zwei größten Verbesserungs-Hebel für meine
Analyse — also die Punkte, bei denen mein Verständnis noch am
unschärfsten ist.`;

const PROMPT_DH = `Du bist Kryptografie-Mentor und bewertest
schriftliche Konzept-Erklärungen zu kryptografischen Protokollen.

ICH ÜBE: Diffie-Hellman-Schlüsseltausch, diskreter Logarithmus,
Man-in-the-Middle-Angriff und TLS-Zertifikate als Gegenmaßnahme.

AUFGABE: Ich habe einen Diffie-Hellman-Schlüsseltausch mit kleinen
Zahlen manuell durchgerechnet und dann schriftlich erklärt, wie ein
Man-in-the-Middle-Angriff funktioniert und wie TLS-Zertifikate ihn
verhindern. Meine Lösung folgt.

BITTE BEWERTE:
1. Rechnung — sind alle Schritte korrekt? (g^a mod p, g^b mod p,
   Ableitung des gemeinsamen Geheimnisses auf beiden Seiten?)
2. Sicherheitsargument — habe ich erklärt, WARUM der diskrete
   Logarithmus das Verfahren sicher macht?
3. MitM-Angriff — ist meine Erklärung des Angriffs korrekt und
   vollständig? (Zwei separate DH-Austausche, Weiterleitung)
4. Zertifikat-Gegenmaßnahme — habe ich erklärt, warum ein Zertifikat
   den Angriff verhindert, und welche Rolle die CA dabei spielt?
5. Lücken — gibt es Unklarheiten oder Fehler in meiner Erklärung?

Nenn mir am Ende die zwei größten Verbesserungs-Hebel — die Punkte,
an denen mein Verständnis noch am unvollständigsten ist.`;

const PROMPT_SYSTEM = `Du bist Senior Security-Architekt und gibst
strukturiertes, direktes Feedback zu Krypto-System-Entwürfen.

ICH ÜBE: Kryptografische Bausteine aus den Lektionen zu einem
kohärenten System zusammenzusetzen.

AUFGABE: Ich habe ein Konzept für ein sicheres Dokumentenaustausch-
System für eine Kanzlei entworfen. Das Konzept beschreibt, welche
kryptografischen Bausteine ich einsetze und warum. Mein Entwurf folgt.

BITTE BEWERTE:
1. Schutzziele — deckt mein Entwurf alle drei Schutzziele ab?
   (Vertraulichkeit, Integrität, Authentizität) Wo fehlt etwas?
2. Bausteinwahl — sind die gewählten Verfahren (Verschlüsselung,
   Signaturen, Hashes, Schlüsseltausch) für den Anwendungsfall
   sinnvoll? Gibt es bessere Alternativen?
3. Schlüsselverwaltung — habe ich erklärt, wie Schlüssel generiert,
   verteilt und widerrufen werden? Das ist oft der schwächste Punkt.
4. Angreifermodell — habe ich konkrete Angriffe benannt, gegen die
   mein System schützt — und realistisch eingeräumt, gegen welche
   nicht?
5. Praktikabilität — ist das System für echte Nutzer bedienbar, oder
   ist es theoretisch korrekt aber praktisch unmöglich umzusetzen?

Nenn mir am Ende die zwei größten Verbesserungs-Hebel — die Punkte,
an denen mein Entwurf noch am anfälligsten oder unvollständigsten ist.`;

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben</h2>
      <p className="lesson-description">
        Drei Aufgaben aufsteigender Schwierigkeit — von der Browser-Analyse
        bis zum System-Design. Für jede gibt es einen{" "}
        <strong>KI-Review-Prompt</strong>: du machst die Aufgabe zuerst selbst,
        kopierst dann den Prompt mit deiner Lösung in Claude, ChatGPT oder
        Gemini und bekommst strukturiertes Feedback zu genau den Konzepten
        aus den Lektionen.
      </p>

      <div className="info-box">
        <strong>So bekommst du am meisten raus:</strong> Mach die Aufgabe
        komplett <em>ohne</em> KI-Hilfe. Erst danach Prompt kopieren und
        Lösung einfügen. Wenn das Feedback dich überrascht, ist das ein
        echter Lernmoment — wertvoller als eine glatte erste Antwort.
      </div>

      <Aufgabe
        titel="Aufgabe 1 — TLS-Verbindungen im Alltag analysieren"
        schwierigkeit="leicht"
        zeit="30 min"
      >
        <p>
          Öffne 5 Websites, die du regelmäßig nutzt (z.B. Bank, E-Mail,
          Social Media, Nachrichten, Shopping). Klick auf das{" "}
          <strong>Schloss-Symbol</strong> in der Adressleiste und dann auf
          „Verbindung ist sicher" oder „Zertifikat". Dokumentiere für jede
          Site:
        </p>
        <AufgabeCheckliste
          items={[
            "TLS-Version (z.B. TLS 1.3) — steht unter Verbindungsdetails",
            "Cipher Suite (z.B. TLS_AES_128_GCM_SHA256) — was bedeuten die einzelnen Teile?",
            "Zertifikats-Aussteller (Root-CA und Intermediate) — wem vertraut dein Browser hier?",
            "Gültigkeitszeitraum des Zertifikats — wie lange ist es noch gültig?",
            "Kurzes Fazit pro Site: wie gut konfiguriert ist die Verbindung?",
          ]}
        />
        <KiReview prompt={PROMPT_TLS} />
      </Aufgabe>

      <Aufgabe
        titel="Aufgabe 2 — Diffie-Hellman durchrechnen und MitM erklären"
        schwierigkeit="mittel"
        zeit="45 min"
      >
        <p>
          Zwei Teile. <strong>Teil 1:</strong> Führe einen vollständigen
          Diffie-Hellman-Schlüsseltausch mit diesen kleinen Zahlen manuell
          durch (Taschenrechner erlaubt):
        </p>
        <div className="info-box" style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
          p = 23, g = 5<br />
          Alice wählt geheim: a = 6<br />
          Bob wählt geheim: b = 15<br />
          Berechne: A, B, und den gemeinsamen Schlüssel auf beiden Seiten.
        </div>
        <p>
          <strong>Teil 2:</strong> Erkläre schriftlich (5–10 Sätze): Wie würde
          ein Man-in-the-Middle-Angriff hier funktionieren? Und warum
          verhindert ein TLS-Zertifikat diesen Angriff?
        </p>
        <AufgabeCheckliste
          items={[
            "A = g^a mod p berechnet (Alice schickt das an Bob)",
            "B = g^b mod p berechnet (Bob schickt das an Alice)",
            "Gemeinsamer Schlüssel auf Alices Seite: B^a mod p",
            "Gemeinsamer Schlüssel auf Bobs Seite: A^b mod p — beide gleich?",
            "MitM-Angriff erklärt: was macht Eve konkret, was sieht sie, was sieht sie nicht?",
            "Zertifikat-Gegenmaßnahme erklärt: welche Rolle spielt die CA?",
          ]}
        />
        <KiReview prompt={PROMPT_DH} />
      </Aufgabe>

      <Aufgabe
        titel="Aufgabe 3 — Sicheres Dokumentensystem entwerfen"
        schwierigkeit="schwer"
        zeit="1.5 h"
      >
        <p>
          Eine kleine Kanzlei (5 Anwälte, 1 Sekretariat) möchte vertrauliche
          Mandantendokumente digital austauschen — intern und mit externen
          Partnern. Entwirf ein Konzept (1–2 Seiten Fließtext oder
          strukturierte Stichpunkte), das beschreibt, welche
          kryptografischen Bausteine du wie einsetzt.
        </p>
        <AufgabeCheckliste
          items={[
            "Vertraulichkeit: Wie werden Dokumente verschlüsselt? (Symmetrisch? Asymmetrisch? Beides?)",
            "Integrität: Wie stellt man fest, ob ein Dokument unterwegs verändert wurde?",
            "Authentizität: Wie weiß der Empfänger, von wem das Dokument wirklich stammt?",
            "Schlüsselverwaltung: Wie werden Schlüssel generiert, gespeichert, geteilt — und was passiert, wenn ein Anwalt die Kanzlei verlässt?",
            "Angreifermodell: Gegen welche Angriffe schützt dein System — und gegen welche bewusst nicht?",
            "Konkrete Bausteine benennen: AES-GCM, RSA/ECC, HMAC, TLS, Zertifikate — was davon, warum?",
          ]}
        />
        <KiReview prompt={PROMPT_SYSTEM} />
      </Aufgabe>

      <div className="success-box">
        <strong>Wenn du alle drei gemacht hast:</strong> Nimm dir Aufgabe 3
        nochmal vor — aber diesmal für einen anderen Anwendungsfall (z.B.
        ein Krankenhaus oder eine Redaktion). Was ändert sich am Entwurf?
        Was bleibt gleich? Dieses Variieren ist der Schritt vom Reproduzieren
        zum echten Verstehen.
      </div>
    </div>
  );
}

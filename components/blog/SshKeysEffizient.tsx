// Blog-Artikel von „Kai Key" — SSH-Keys generieren, verwalten & effizient verteilen.
// Reines Markup; Typografie kommt vom .inhalt-Scope der Blog-Seite.
export default function SshKeysEffizient() {
  return (
    <>
      <p>
        Passwort-Login über SSH ist langsam, unsicher und nervt bei jedem
        Connect. Ein Schlüsselpaar löst alle drei Probleme auf einmal — wenn
        man es einmal richtig aufsetzt. Hier die Kurzversion, die für 95 % der
        Fälle reicht.
      </p>

      <h2>Schlüssel generieren: ed25519 statt RSA</h2>
      <p>
        <code>ssh-keygen</code> erzeugt standardmäßig noch RSA-Schlüssel — für
        neue Setups gibt es aber kaum einen Grund, nicht{' '}
        <strong>Ed25519</strong> zu nehmen: kürzere Schlüssel, schnellere
        Signaturen, genauso sicher wie RSA-4096.
      </p>
      <pre><code>{`ssh-keygen -t ed25519 -C "kai@laptop"

# Legt zwei Dateien an:
# ~/.ssh/id_ed25519       ← privat, bleibt IMMER auf der Maschine
# ~/.ssh/id_ed25519.pub   ← öffentlich, darf überall hin`}</code></pre>
      <p>
        Der <code>-C</code>-Kommentar landet als Klartext in der{' '}
        <code>.pub</code>-Datei — praktisch, um Jahre später auf einem Server
        zu sehen, von welcher Maschine welcher Key stammt. Bei der Passphrase
        gilt: leer ist bequem, aber ein geklauter Laptop bedeutet dann
        sofortigen Vollzugriff auf jeden Server, der den Key kennt. Eine
        Passphrase plus <code>ssh-agent</code> (nächster Abschnitt) kostet fast
        nichts an Komfort.
      </p>

      <h2><code>ssh-agent</code>: Passphrase einmal pro Session</h2>
      <p>
        Ohne Agent fragt SSH bei jedem einzelnen Connect nach der Passphrase.
        Der Agent hält den entsperrten Key im Speicher — Passphrase einmal
        eingeben, danach läuft jede Verbindung ohne Nachfrage.
      </p>
      <pre><code>{`eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# macOS: Key dauerhaft im Schlüsselbund merken
ssh-add --apple-use-keychain ~/.ssh/id_ed25519`}</code></pre>
      <p>
        Die meisten Desktop-Umgebungen (GNOME Keyring, macOS) starten den
        Agent automatisch beim Login — <code>ssh-add -l</code> zeigt, welche
        Keys gerade geladen sind.
      </p>

      <h2>Effizient rüberschieben: <code>ssh-copy-id</code></h2>
      <p>
        Den Public Key manuell per Copy-Paste in{' '}
        <code>~/.ssh/authorized_keys</code> einzufügen ist fehleranfällig —
        ein Zeilenumbruch zu viel und der Key funktioniert nicht.{' '}
        <code>ssh-copy-id</code> macht das in einem Befehl, inklusive
        korrekter Dateirechte:
      </p>
      <pre><code>{`ssh-copy-id -i ~/.ssh/id_ed25519.pub nutzer@server.de

# Anderer Port als 22:
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 2222 nutzer@server.de`}</code></pre>
      <p>
        Kein <code>ssh-copy-id</code> zur Hand (z. B. auf macOS ohne Homebrew)?
        Der Ein-Zeiler dahinter, der überall funktioniert:
      </p>
      <pre><code>{`cat ~/.ssh/id_ed25519.pub | ssh nutzer@server.de \\
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"`}</code></pre>
      <p>
        Die Rechte sind kein Detail: SSH verweigert den Key-Login kommentarlos,
        wenn <code>~/.ssh</code> oder <code>authorized_keys</code> für die
        Gruppe oder andere schreibbar sind. Das ist der häufigste Grund, warum
        „es geht einfach nicht" nach dem Kopieren.
      </p>

      <h2><code>~/.ssh/config</code>: Server-Zoo zähmen</h2>
      <p>
        Wer mehr als zwei Server hat, sollte nie wieder{' '}
        <code>ssh -i ~/.ssh/id_ed25519 -p 2222 nutzer@lange-domain.de</code>{' '}
        tippen. Die Config-Datei macht daraus einen Alias:
      </p>
      <pre><code>{`# ~/.ssh/config

Host prod
  HostName lange-domain.de
  User nutzer
  Port 2222
  IdentityFile ~/.ssh/id_ed25519

Host intern
  HostName 10.0.0.42
  User admin
  ProxyJump prod`}</code></pre>
      <p>
        Ab jetzt reicht <code>ssh prod</code>. Der zweite Eintrag zeigt noch
        einen Trick: <code>ProxyJump</code> tunnelt automatisch über{' '}
        <code>prod</code> zu einem Server, der nur intern erreichbar ist — kein
        manuelles <code>-J</code> mehr nötig, und auch{' '}
        <code>scp</code>/<code>rsync</code> nutzen dieselbe Config.
      </p>

      <h2>Ein Key pro Zweck, nicht ein Key für alles</h2>
      <p>
        Statt einem einzigen Universal-Key lohnt sich Trennung nach Kontext —
        privat, Arbeit, CI/CD. Passendes <code>Host</code>-Muster in der
        Config wählt automatisch den richtigen Key aus, ganz ohne{' '}
        <code>-i</code> im Terminal:
      </p>
      <pre><code>{`Host *.privat-server.de
  IdentityFile ~/.ssh/id_ed25519_privat

Host *.firma.de
  IdentityFile ~/.ssh/id_ed25519_arbeit
  IdentitiesOnly yes`}</code></pre>
      <p>
        <code>IdentitiesOnly yes</code> ist hier der wichtige Teil: Ohne die
        Zeile probiert SSH bei vielen geladenen Keys im Agent einfach alle
        durch, bis einer passt oder der Server die Verbindung wegen zu vieler
        Fehlversuche killt. Mit der Zeile wird ausschließlich der angegebene
        Key verwendet.
      </p>
    </>
  );
}

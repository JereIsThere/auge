// Blog-Artikel von „Uwe Unix" — GNU Screen: Basics & Nice-to-knows.
// Reines Markup; Typografie kommt vom .inhalt-Scope der Blog-Seite.
export default function ScreenBasics() {
  return (
    <>
      <p>
        Die SSH-Verbindung bricht ab, der Laptop klappt zu, das Zug-WLAN
        stirbt — und der Build, der seit zwanzig Minuten läuft, ist weg.
        <code>screen</code> löst genau dieses Problem: Ein Terminal-Prozess,
        der auf dem Server weiterlebt, egal was mit der Verbindung passiert.
        Kein Paket-Update nötig, es liegt auf fast jedem Linux-Server schon
        vorinstalliert.
      </p>

      <h2>Das Grundprinzip: Session statt Fenster</h2>
      <p>
        <code>screen</code> startet nicht einfach ein neues Terminal, sondern
        einen eigenen Prozess mit eigenem Terminal-Multiplexer dahinter. Die
        Verbindung von deinem Rechner ist nur ein <em>Fenster</em> in diesen
        Prozess — trennst du dich, läuft die Session einfach weiter.
      </p>
      <pre><code>{`# Neue Session starten
screen

# Session mit Namen starten (empfehlenswert!)
screen -S deploy

# Laufende Sessions auflisten
screen -ls

# Zu einer Session zurückkehren
screen -r deploy`}</code></pre>

      <h2>Die drei Shortcuts, die 90 % abdecken</h2>
      <p>
        Alle <code>screen</code>-Befehle beginnen mit dem Prefix{' '}
        <kbd>Strg</kbd> + <kbd>A</kbd>, danach folgt die eigentliche Taste —
        loslassen dazwischen nicht nötig.
      </p>
      <ul>
        <li>
          <kbd>Strg</kbd> + <kbd>A</kbd>, dann <kbd>D</kbd> — <strong>Detach</strong>:
          Session läuft weiter, du bist wieder im normalen Terminal.
        </li>
        <li>
          <kbd>Strg</kbd> + <kbd>A</kbd>, dann <kbd>C</kbd> — <strong>Neues Fenster</strong>{' '}
          innerhalb derselben Session anlegen.
        </li>
        <li>
          <kbd>Strg</kbd> + <kbd>A</kbd>, dann <kbd>N</kbd> / <kbd>P</kbd> —
          zum nächsten / vorherigen Fenster wechseln.
        </li>
      </ul>
      <p>
        Der Klassiker: <code>screen -S deploy</code>, Build anstoßen,{' '}
        <kbd>Strg</kbd> + <kbd>A</kbd> <kbd>D</kbd>, Laptop zuklappen. Am
        nächsten Tag <code>screen -r deploy</code> — der Build ist entweder
        fertig oder läuft noch, exakt da wo du ihn verlassen hast.
      </p>

      <h2>Nice-to-knows, die man erst nach dem dritten Mal lernt</h2>
      <ul>
        <li>
          <strong>Mehrere Clients gleichzeitig:</strong> Hängt eine Session
          noch an einem toten SSH-Client, meckert <code>screen -r</code> mit{' '}
          „there is a screen on...(Attached)". Fix:{' '}
          <code>screen -d -r deploy</code> — trennt den alten Client zwangsweise
          und übernimmt.
        </li>
        <li>
          <strong>Scrollback-Modus:</strong> <kbd>Strg</kbd> + <kbd>A</kbd>,
          dann <kbd>Esc</kbd> aktiviert den Kopiermodus — Pfeiltasten zum
          Scrollen, <kbd>Leertaste</kbd> zum Markieren, nochmal für Kopie.{' '}
          <kbd>Q</kbd> beendet den Modus wieder.
        </li>
        <li>
          <strong>Fenster benennen:</strong> <kbd>Strg</kbd> + <kbd>A</kbd>,
          dann <kbd>Shift</kbd> + <kbd>A</kbd> vergibt einen Namen fürs aktuelle
          Fenster — bei fünf offenen Fenstern der Unterschied zwischen Übersicht
          und Rätselraten.
        </li>
        <li>
          <strong>Horizontal splitten:</strong> <kbd>Strg</kbd> + <kbd>A</kbd>,
          dann <kbd>S</kbd> teilt die Anzeige, <kbd>Strg</kbd> + <kbd>A</kbd>{' '}
          <kbd>Tab</kbd> springt zwischen den Splits, <kbd>Strg</kbd> +{' '}
          <kbd>A</kbd> dann <kbd>Q</kbd> macht alle Splits bis auf einen wieder
          zu.
        </li>
      </ul>

      <h2>Ein <code>.screenrc</code> spart täglich Klicks</h2>
      <p>
        Wie <code>$PROFILE</code> bei PowerShell gibt es eine Konfigdatei, die
        beim Start automatisch geladen wird:
      </p>
      <pre><code>{`# ~/.screenrc

# Statuszeile unten mit Fensterliste und Uhrzeit
hardstatus alwayslastline
hardstatus string '%{= kG}%H %{= kw}| %-w%{=b bw}%n %t%{-}%+w %= %c'

# Riesiger Scrollback statt der mageren 100 Zeilen Default
defscrollback 5000

# Startmeldung weg
startup_message off`}</code></pre>
      <p>
        Danach zeigt jede Session unten eine Fensterleiste — praktisch, sobald
        mehr als zwei Fenster offen sind.
      </p>

      <h2>screen vs. tmux — kurz und ehrlich</h2>
      <p>
        <code>tmux</code> ist der modernere Nachfolger mit besserem Split-Layout
        und aktiverer Entwicklung. Der Grund, trotzdem <code>screen</code> zu
        kennen: Es ist auf praktisch jedem Server vorinstalliert, während{' '}
        <code>tmux</code> oft erst nachinstalliert werden muss — und auf einem
        fremden Server ohne <code>sudo</code>-Rechte ist das ein Unterschied,
        der zählt.
      </p>
    </>
  );
}

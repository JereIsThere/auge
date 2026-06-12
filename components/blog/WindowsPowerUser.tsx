// Blog-Artikel von „Marco Matrix" — Terminal & Shortcuts für Windows.
// Reines Markup; Typografie kommt vom .inhalt-Scope der Blog-Seite.
export default function WindowsPowerUser() {
  return (
    <>
      <p>
        Das Startmenü ist der langsamste Weg zu allem. Wer Windows ernsthaft
        benutzt, braucht zwei Dinge: ein Terminal, das immer offen ist, und
        eine Handvoll Shortcuts, die in den Fingern sitzen. Mehr nicht.
      </p>

      <h2>Das Terminal immer eine Taste entfernt</h2>
      <p>
        <kbd>Win</kbd> + <kbd>X</kbd>, dann <kbd>I</kbd> — öffnet das Windows
        Terminal aus jedem Kontext. Wer es noch direkter will, legt sich{' '}
        <kbd>Strg</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd> als globalen Hotkey in
        den Terminal-Einstellungen an. Ab da gilt: Explorer ist zum Anschauen,
        das Terminal zum Arbeiten.
      </p>

      <h2>Fünf PowerShell-Basics, die 90 % abdecken</h2>
      <pre><code>{`# 1. Wo bin ich, was liegt hier?
pwd; ls

# 2. Datei-Inhalte ohne Editor
cat .\\config.json

# 3. Alles finden, was irgendwo "fehler" enthält
ls -r | sls "fehler"

# 4. Prozess frisst CPU? Finden und beenden
ps | sort cpu -desc | select -first 5
kill -name notepad

# 5. Verlauf durchsuchen statt neu tippen
# Strg+R im Terminal — rückwärts suchen wie in bash`}</code></pre>
      <p>
        Der unterschätzte Trick darunter: <code>sls</code> (alias für{' '}
        <code>Select-String</code>) ist das <code>grep</code> von Windows. Wer
        einmal mit <code>ls -r | sls</code> durch ein Projekt gesucht hat,
        öffnet dafür nie wieder die Explorer-Suche.
      </p>

      <h2>Die Shortcuts, die wirklich Zeit sparen</h2>
      <ul>
        <li>
          <kbd>Win</kbd> + <kbd>V</kbd> — Zwischenablage-Verlauf. Der eine
          Shortcut, der jeden Tag Kopier-Roundtrips spart.
        </li>
        <li>
          <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> — Screenshot eines
          Bereichs, direkt in die Zwischenablage.
        </li>
        <li>
          <kbd>Win</kbd> + <kbd>1</kbd>…<kbd>9</kbd> — Apps der Taskleiste
          direkt anspringen. Taskleiste einmal bewusst sortieren, dann sitzt
          jede App auf einer Zahl.
        </li>
        <li>
          <kbd>Win</kbd> + <kbd>Pfeiltasten</kbd> — Fenster halbieren,
          vierteln, verschieben. Mit <kbd>Win</kbd> + <kbd>Z</kbd> gibt es
          seit Windows 11 die Snap-Layouts dazu.
        </li>
        <li>
          <kbd>Alt</kbd> + <kbd>Tab</kbd> gedrückt halten statt tippen — die
          Übersicht bleibt offen, Auswahl mit den Pfeiltasten.
        </li>
      </ul>

      <h2>Ein Wochenend-Projekt: PowerShell-Profil</h2>
      <p>
        Die Datei <code>$PROFILE</code> ist die <code>.bashrc</code> von
        PowerShell. Drei Zeilen reichen für den Anfang:
      </p>
      <pre><code>{`# notepad $PROFILE
function dev { cd ~\\projekte }
function gs { git status }
Set-Alias open explorer.exe`}</code></pre>
      <p>
        Danach bringt jede Woche eine Funktion mehr — und nach einem Monat ist
        das Terminal schneller als jede Maus. Wer tiefer einsteigen will:
        Energieoptionen, Autostart-Hygiene und die Gott-Modus-Ordner sind das
        nächste Level.
      </p>
    </>
  );
}

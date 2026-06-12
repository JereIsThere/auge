// Blog-Artikel von „Lina Logic" — KI-generiertes HTML/CSS schneller verstehen.
// Reines Markup; Typografie kommt vom .inhalt-Scope der Blog-Seite.
export default function KiHtmlSchnellLesen() {
  return (
    <>
      <p>
        KI-Assistenten spucken in Sekunden komplette Seiten aus — und genau da
        beginnt das Problem: Wer den Code nur kopiert, steht beim ersten Bug
        vor einer Wand aus fremdem Markup. Dabei lässt sich KI-HTML mit drei
        Lese-Techniken in unter einer Minute erfassen.
      </p>

      <h2>1. Erst das Skelett, dann die Details</h2>
      <p>
        Ignoriere beim ersten Durchgang alles außer den{' '}
        <strong>Container-Elementen</strong>: <code>header</code>,{' '}
        <code>main</code>, <code>section</code>, <code>footer</code> und alles
        mit Klassen wie <code>wrapper</code>, <code>container</code> oder{' '}
        <code>grid</code>. KI-Modelle bauen fast immer eine saubere
        Baumstruktur — wenn du die fünf äußersten Knoten kennst, kennst du die
        Seite.
      </p>
      <pre><code>{`<body>
  <header class="site-header">…</header>
  <main class="container">
    <section class="hero">…</section>
    <section class="features grid">…</section>
  </main>
  <footer>…</footer>
</body>`}</code></pre>
      <p>
        Tipp: Im Browser-Inspector mit <code>Strg/Cmd + F</code> nach{' '}
        <code>section</code> suchen — das zeigt dir die Kapitel der Seite
        schneller als jedes Scrollen.
      </p>

      <h2>2. CSS rückwärts lesen: vom Effekt zur Regel</h2>
      <p>
        Bei KI-CSS nicht von oben nach unten lesen, sondern{' '}
        <strong>vom sichtbaren Problem aus</strong>. Element im Inspector
        anklicken, im Styles-Panel schauen, welche Regel gewinnt — und nur
        diese eine Regel im Code suchen. KI-Stylesheets enthalten oft 30&nbsp;%
        tote Regeln; wer linear liest, liest Müll mit.
      </p>
      <p>
        Die drei häufigsten KI-CSS-Fehler, auf die du dabei stoßen wirst:
      </p>
      <ul>
        <li>
          <strong>Doppelte Layout-Systeme</strong> — Flexbox <em>und</em> Grid
          auf demselben Container. Eins davon ist tot, meistens das Flexbox.
        </li>
        <li>
          <strong>Magic Numbers</strong> — <code>margin-top: 37px</code> statt
          einer Gap am Eltern-Element. Symptom: Es bricht, sobald sich der
          Inhalt ändert.
        </li>
        <li>
          <strong>Überspezifische Selektoren</strong> —{' '}
          <code>div.card &gt; div.body &gt; p.text</code> dort, wo{' '}
          <code>.card p</code> gereicht hätte. Macht jedes spätere Überschreiben
          zum Kampf.
        </li>
      </ul>

      <h2>3. Den Diff lesen, nicht die Datei</h2>
      <p>
        Wenn du die KI um eine Änderung bittest, lass dir nur zeigen,{' '}
        <strong>was sich geändert hat</strong> — und prüfe genau zwei Dinge:
        Hat sie Klassen umbenannt (bricht JS-Selektoren und Tests)? Und hat sie
        „nebenbei" Struktur umgebaut, die du nicht angefragt hast? Diese zwei
        Checks fangen erfahrungsgemäß die Mehrheit der Regressionen ab.
      </p>

      <h2>Der 60-Sekunden-Workflow</h2>
      <ol>
        <li>Skelett scannen: die 5 äußersten Container benennen können</li>
        <li>Sichtbaren Bug im Inspector anklicken, Gewinner-Regel finden</li>
        <li>Nur die eine Regel fixen — nie „das CSS aufräumen lassen"</li>
        <li>Diff der KI-Änderung auf Umbenennungen prüfen</li>
      </ol>
      <p>
        Wer HTML und CSS einmal systematisch gelernt hat, liest KI-Output wie
        eine Zeitung. Die Grundlagen dafür — Box-Modell, Spezifität, Grid —
        sind keine Magie, sondern ein Nachmittag Arbeit.
      </p>
    </>
  );
}

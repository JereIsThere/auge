import { DepthBox } from "@/components/lessons/DepthBox";
import { CodeBlock } from "@/components/lessons/CodeBlock";
import "@/components/lessons/lesson.css";
import "./html-css.css";

const GRUNDGERUEST = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Meine Seite</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <!-- sichtbarer Inhalt kommt hierhin -->
    <h1>Hallo Welt</h1>
  </body>
</html>`;

const SEMANTISCH = `<body>
  <header>      <!-- Logo, Seitentitel -->
    <nav>...</nav>   <!-- Hauptnavigation -->
  </header>

  <main>        <!-- der eine Hauptinhalt der Seite -->
    <article>   <!-- in sich abgeschlossen, z.B. ein Blogpost -->
      <h1>Titel</h1>
      <section>...</section>
      <section>...</section>
    </article>
    <aside>...</aside>   <!-- Randnotiz, verwandte Links -->
  </main>

  <footer>...</footer>   <!-- Impressum, Copyright -->
</body>`;

const DIVSUPPE = `<div class="header">
  <div class="nav">
    <div class="nav-item">Start</div>
  </div>
</div>
<div class="content">
  <div class="post">
    <div class="title">Titel</div>
  </div>
</div>`;

export default function HtmlStruktur() {
  return (
    <div className="lesson-card">
      <h2>Das HTML-Grundgerüst &amp; semantische Tags</h2>
      <p className="lesson-description">
        Jedes HTML-Dokument hat denselben Rahmen: einen{" "}
        <span className="mono">&lt;head&gt;</span> für unsichtbare Metadaten und
        einen <span className="mono">&lt;body&gt;</span> für den sichtbaren
        Inhalt. Und der Inhalt selbst wird mit <em>bedeutungstragenden</em>{" "}
        Tags strukturiert — nicht mit endlosen <span className="mono">div</span>s.
      </p>

      <h3>Das Grundgerüst</h3>
      <CodeBlock lang="html" title="jede Seite startet so" code={GRUNDGERUEST} />

      <dl className="kv-table">
        <dt>&lt;!doctype html&gt;</dt>
        <dd>Schaltet den Browser in den modernen Standard-Modus. Muss ganz oben stehen.</dd>
        <dt>&lt;html lang="de"&gt;</dt>
        <dd>Wurzel-Element. <span className="mono">lang</span> hilft Screenreadern und Übersetzern.</dd>
        <dt>&lt;meta charset="utf-8"&gt;</dt>
        <dd>Zeichensatz. Ohne das werden Umlaute schnell zu „Ã¤".</dd>
        <dt>&lt;meta name="viewport" …&gt;</dt>
        <dd>Die eine Zeile, ohne die nichts mobil-tauglich ist. Mehr dazu in „Responsive".</dd>
        <dt>&lt;head&gt;</dt>
        <dd>Unsichtbar: Titel, CSS-Verweise, Metadaten.</dd>
        <dt>&lt;body&gt;</dt>
        <dd>Alles, was man auf der Seite sieht.</dd>
      </dl>

      <h3>Semantische Tags statt div-Suppe</h3>
      <p>
        HTML5 brachte Tags, die <em>sagen, was ein Bereich ist</em>. Sie sehen
        ohne CSS aus wie ein <span className="mono">div</span> — aber
        Suchmaschinen, Screenreader und du selbst beim Lesen wisst sofort,
        worum es geht.
      </p>

      <CodeBlock lang="html" title="lesbar & maschinenfreundlich" code={SEMANTISCH} />

      <div className="hc-compare">
        <div className="hc-compare-col">
          <h4>✅ Semantisch</h4>
          <CodeBlock
            lang="html"
            code={`<header>
  <nav>
    <a href="/">Start</a>
  </nav>
</header>`}
          />
        </div>
        <div className="hc-compare-col">
          <h4>⚠️ div-Suppe (gleiche Optik, keine Bedeutung)</h4>
          <CodeBlock lang="html" code={DIVSUPPE} />
        </div>
      </div>

      <h3>Die Tags, die 90 % ausmachen</h3>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">📐 Struktur</div>
          <div className="actor-row mono">
            header · nav · main · section · article · aside · footer · div
          </div>
        </div>
        <div className="actor-card bob">
          <div className="actor-title">✍️ Text</div>
          <div className="actor-row mono">
            h1–h6 · p · ul / ol / li · blockquote · strong · em · span
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">🔗 Interaktiv &amp; Medien</div>
          <div className="actor-row mono">
            a · button · img · input · label · form · table
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum sind semantische Tags wichtiger als ihre Optik?">
        Weil zwei Gruppen die Bedeutung lesen, nicht die Pixel.{" "}
        <strong>Screenreader</strong> springen per „Hauptinhalt" direkt zum{" "}
        <span className="mono">&lt;main&gt;</span> und lesen Überschriften als
        Inhaltsverzeichnis. <strong>Suchmaschinen</strong> gewichten einen{" "}
        <span className="mono">&lt;h1&gt;</span> anders als einen
        fettgedruckten <span className="mono">&lt;div&gt;</span>. Mit reiner
        div-Suppe sind beide blind — die Seite sieht gut aus und ist trotzdem
        kaputt für ein Drittel deiner Nutzer.
      </DepthBox>

      <DepthBox variant="mistake" title="Überschriften nach Größe wählen">
        <span className="mono">&lt;h1&gt;</span> bis{" "}
        <span className="mono">&lt;h6&gt;</span> sind eine{" "}
        <em>Gliederungs-Hierarchie</em>, keine Schriftgrößen. „Ich nehm ein h3,
        weil h2 zu groß ist" ist der Klassiker — und zerstört die
        Dokumentstruktur. Richtig: die Ebene nach Bedeutung wählen (genau ein
        h1 pro Seite, darunter h2 für Abschnitte) und die <em>Größe per CSS</em>{" "}
        anpassen.
      </DepthBox>

      <DepthBox variant="deeper" title="Block vs. inline, Void-Elemente, Attribute">
        <ul>
          <li>
            <strong>Block-Elemente</strong> (<span className="mono">div, p, h1, section</span>)
            beginnen auf neuer Zeile und nehmen die volle Breite.
          </li>
          <li>
            <strong>Inline-Elemente</strong> (<span className="mono">span, a, strong</span>)
            fließen im Text mit, nur so breit wie ihr Inhalt.
          </li>
          <li>
            <strong>Void-Elemente</strong> (<span className="mono">img, br, input, meta</span>)
            haben keinen Inhalt und kein schließendes Tag.
          </li>
          <li>
            <strong>Attribute</strong> stehen im Start-Tag:{" "}
            <span className="mono">&lt;a href="…" class="…"&gt;</span>. Sie
            konfigurieren das Element.
          </li>
        </ul>
        Wichtig: ob ein Element block oder inline wirkt, lässt sich mit CSS
        (<span className="mono">display</span>) überschreiben — die obige
        Liste ist nur der Default.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Als Nächstes lernst du, wie CSS diese Elemente auswählt (Selektoren) und
        wie das Box-Modell ihre Abstände bestimmt. Die Block/Inline-Unterscheidung
        kommt bei Flexbox und Grid wieder. Und semantische Tags sind <em>das</em>{" "}
        wichtigste Werkzeug, um später KI-generierte div-Suppe zu entwirren.
      </DepthBox>
    </div>
  );
}

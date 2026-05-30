import { DepthBox } from "@/components/lessons/DepthBox";
import { Code } from "./Code";
import "@/components/lessons/lesson.css";

export default function Einleitung() {
  return (
    <div className="lesson-card">
      <h2>Was Auth.js v5 anders macht</h2>
      <p className="lesson-description">
        <code>next-auth@beta</code> ist <strong>Auth.js v5</strong> — die große
        Überarbeitung der bekanntesten Auth-Bibliothek im Next.js-Ökosystem.
        Der wichtigste Unterschied steht in einem Satz: Statt fünf
        verschiedener APIs für fünf Kontexte gibt es jetzt{" "}
        <em>eine einzige Funktion</em> — <code>auth()</code> — die überall
        funktioniert.
      </p>

      <div className="info-box">
        <strong>Die Kurzfassung:</strong> Du konfigurierst Auth.js{" "}
        <em>einmal</em> in einer zentralen <code>auth.ts</code> und bekommst von
        dort vier Helfer zurück: <code>auth</code>, <code>handlers</code>,{" "}
        <code>signIn</code> und <code>signOut</code>. Damit deckst du Login,
        Logout, Session-Lesen und Route-Schutz im kompletten App Router ab.
      </div>

      <h3>Vorher: fünf APIs für fünf Orte</h3>
      <p>
        In NextAuth v4 hing es vom Kontext ab, wie du an die Session kamst — und
        jede Variante hatte ihre eigenen Tücken:
      </p>
      <div className="actors">
        <div className="actor-card alice">
          <div className="actor-title">v4 — verstreut</div>
          <div className="actor-row">
            <code>getServerSession()</code> im Server,{" "}
            <code>getToken()</code> für das rohe JWT, <code>getSession()</code>{" "}
            im Client, <code>withAuth()</code> für die Middleware,{" "}
            <code>useSession()</code> im React-Tree — fünf Wege, fünf
            Signaturen.
          </div>
        </div>
        <div className="actor-card shared">
          <div className="actor-title">v5 — eine Funktion</div>
          <div className="actor-row">
            <code>auth()</code> ersetzt die ersten vier. Nur der reaktive
            Client-Hook <code>useSession()</code> bleibt — alles andere läuft
            serverseitig über dieselbe Funktion.
          </div>
        </div>
      </div>

      <h3>So sieht der Kern aus</h3>
      <p>
        Eine Datei konfiguriert alles, ein Destructuring gibt dir die vier
        Werkzeuge:
      </p>
      <Code label="auth.ts">{`import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
});`}</Code>
      <ul className="step-list">
        <li>
          <strong>auth</strong> — die Universal-Funktion: Session lesen,
          Routen schützen.
        </li>
        <li>
          <strong>handlers</strong> — die <code>GET</code>/<code>POST</code>{" "}
          Route-Handler für den OAuth-Callback.
        </li>
        <li>
          <strong>signIn / signOut</strong> — als Server Actions oder
          programmatisch aufrufbar.
        </li>
      </ul>

      <DepthBox variant="why" title="Warum ein einziges auth() besser ist">
        Der Kontext, in dem du Code schreibst, sollte nicht bestimmen, wie du
        an den eingeloggten Nutzer kommst. In v4 musste man wissen: &bdquo;Bin
        ich in einem Server Component, einer API-Route oder der
        Middleware?&ldquo;
        — und je nach Antwort eine andere Funktion mit anderer Signatur
        importieren. In v5 fragst du in jedem dieser Kontexte dasselbe{" "}
        <code>await auth()</code> und bekommst überall dasselbe{" "}
        <code>Session</code>-Objekt (oder <code>null</code>) zurück. Weniger zu
        merken, weniger Fehlerquellen.
      </DepthBox>

      <DepthBox variant="mistake" title="Ist next-auth@beta instabil?">
        Das <code>beta</code>-Tag schreckt ab, ist hier aber irreführend: v5
        läuft seit langem produktiv in unzähligen Apps und die Kern-API
        (<code>auth.ts</code>, <code>auth()</code>, der Route-Handler) ist
        stabil. <code>beta</code> markiert vor allem, dass einzelne Adapter
        und Rand-APIs noch finalisiert werden. Pinne die Version in deiner{" "}
        <code>package.json</code>, dann gibt es keine Überraschungen.
      </DepthBox>

      <DepthBox variant="deeper" title="Auth.js vs. NextAuth — der Namens-Salat">
        Das Projekt heißt heute <strong>Auth.js</strong> und ist
        Framework-übergreifend (Next.js, SvelteKit, Express, …). Das npm-Paket
        für Next.js heißt aber weiterhin <code>next-auth</code> — die v5 ziehst
        du dir über das <code>@beta</code>-Tag. Also: Projekt = Auth.js,
        Paket = <code>next-auth@beta</code>, Version = v5. Drei Namen, eine
        Sache.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        OAuth 2.0 / OpenID Connect (das Protokoll hinter den Providern),
        JWT (das Standard-Session-Format), React Server Components (warum{" "}
        <code>auth()</code> serverseitig so elegant ist) und der Edge-Runtime
        (das Stolperstein-Thema, das eine eigene Lektion bekommt).
      </DepthBox>
    </div>
  );
}

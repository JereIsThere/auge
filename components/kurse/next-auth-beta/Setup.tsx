import { DepthBox } from "@/components/lessons/DepthBox";
import { Code } from "./Code";
import "@/components/lessons/lesson.css";

export default function Setup() {
  return (
    <div className="lesson-card">
      <h2>Setup: auth.ts, Route-Handler, Env</h2>
      <p className="lesson-description">
        Vier Dateien, dann läuft Login. Wir installieren das Paket, schreiben
        die zentrale <code>auth.ts</code>, hängen den Zwei-Zeilen-Route-Handler
        ein und setzen die <code>AUTH_</code>-Umgebungsvariablen. Beispiel-
        Provider ist GitHub — jeder andere OAuth-Provider geht genauso.
      </p>

      <div className="info-box">
        <strong>Mentales Modell:</strong> <code>auth.ts</code> ist die
        Single Source of Truth. Alles andere — Route-Handler, Middleware,
        Server Components — <em>importiert</em> nur aus dieser einen Datei.
        Konfiguration steht nie an zwei Stellen.
      </div>

      <h3>Schritt für Schritt</h3>
      <ul className="step-list">
        <li>
          <strong>Installieren.</strong> Das <code>@beta</code>-Tag zieht v5.
        </li>
        <li>
          <strong>auth.ts anlegen.</strong> Provider rein, vier Helfer raus.
        </li>
        <li>
          <strong>Route-Handler einhängen.</strong> Damit OAuth-Callbacks
          eine URL haben.
        </li>
        <li>
          <strong>Env setzen.</strong> <code>AUTH_SECRET</code> plus die
          Provider-Credentials.
        </li>
      </ul>

      <h3>1 · Installieren</h3>
      <Code label="Terminal">{`npm install next-auth@beta
# erzeugt direkt ein Secret und schreibt es in .env.local:
npx auth secret`}</Code>

      <h3>2 · Die zentrale Konfiguration</h3>
      <Code label="auth.ts (Projekt-Wurzel)">{`import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
});`}</Code>
      <p>
        Kein <code>AUTH_GITHUB_ID</code>/<code>AUTH_GITHUB_SECRET</code> im Code
        — Auth.js liest die passend benannten Env-Variablen automatisch. Mehr
        dazu unten.
      </p>

      <h3>3 · Der Route-Handler</h3>
      <p>
        Der OAuth-Flow braucht eine Callback-URL. Auth.js bringt die Logik
        mit; du exportierst sie nur an die richtige Stelle im App Router:
      </p>
      <Code label="app/api/auth/[...nextauth]/route.ts">{`import { handlers } from "@/auth";

export const { GET, POST } = handlers;`}</Code>

      <h3>4 · Umgebungsvariablen</h3>
      <Code label=".env.local">{`AUTH_SECRET=dein-generiertes-secret

AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...`}</Code>

      <dl className="kv-table">
        <dt>AUTH_SECRET</dt>
        <dd>
          Pflicht. Signiert/verschlüsselt das Session-JWT. Mit{" "}
          <code>npx auth secret</code> generiert.
        </dd>
        <dt>AUTH_&lt;PROVIDER&gt;_ID / _SECRET</dt>
        <dd>
          Auto-erkannt: <code>GitHub</code> liest <code>AUTH_GITHUB_ID</code>{" "}
          und <code>AUTH_GITHUB_SECRET</code> von selbst.
        </dd>
        <dt>AUTH_URL</dt>
        <dd>
          Optional. Wird normalerweise aus den Request-Headern erkannt — nur
          bei eigenartigen Proxy-Setups manuell nötig.
        </dd>
      </dl>

      <DepthBox variant="why" title="Warum die AUTH_-Präfix-Konvention?">
        In v4 hießen die Variablen <code>NEXTAUTH_URL</code> und{" "}
        <code>NEXTAUTH_SECRET</code>, und jede Provider-Credential musstest du
        im Code an den Provider durchreichen. v5 vereinheitlicht das: alles
        beginnt mit <code>AUTH_</code>, und Provider-Credentials nach dem
        Schema <code>AUTH_&lt;PROVIDER&gt;_ID/_SECRET</code> werden automatisch
        eingelesen. Dadurch bleibt <code>auth.ts</code> frei von{" "}
        <code>process.env</code>-Gefummel.
      </DepthBox>

      <DepthBox variant="mistake" title="Falscher Pfad beim Route-Handler">
        Der Ordner muss <em>exakt</em>{" "}
        <code>app/api/auth/[...nextauth]/route.ts</code> heißen — die eckigen
        Klammern und die drei Punkte (Catch-all-Route) gehören dazu. Tippst du{" "}
        <code>[nextauth]</code> statt <code>[...nextauth]</code>, schlägt der
        OAuth-Callback fehl, weil <code>/api/auth/callback/github</code> nicht
        matcht. Symptom: Redirect-Loop oder 404 nach dem Provider-Login.
      </DepthBox>

      <DepthBox variant="deeper" title="Was npx auth secret macht">
        Der Befehl erzeugt einen kryptografisch zufälligen 32-Byte-Wert
        (base64) und hängt ihn als <code>AUTH_SECRET</code> an deine{" "}
        <code>.env.local</code> an. Dieser Wert ist der Schlüssel, mit dem das
        Session-JWT signiert (und bei verschlüsselten Sessions zusätzlich
        verschlüsselt) wird. Ändert sich das Secret, werden alle bestehenden
        Sessions ungültig — in Produktion also fix setzen und nicht rotieren,
        ohne es zu wollen.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Die Callback-URL, die du beim Provider (z.B. in der GitHub-OAuth-App)
        hinterlegst — sie muss auf{" "}
        <code>https://deine-domain/api/auth/callback/github</code> zeigen.
        Außerdem die nächste Lektion: Sobald das Setup steht, liest du die
        Session mit <code>auth()</code>.
      </DepthBox>
    </div>
  );
}

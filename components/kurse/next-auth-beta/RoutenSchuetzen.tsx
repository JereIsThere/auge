import { DepthBox } from "@/components/lessons/DepthBox";
import { Code } from "./Code";
import "@/components/lessons/lesson.css";

export default function RoutenSchuetzen() {
  return (
    <div className="lesson-card">
      <h2>Routen schützen: Middleware &amp; authorized</h2>
      <p className="lesson-description">
        Zugriffsschutz hat in v5 zwei Ebenen: ein deklarativer{" "}
        <code>authorized</code>-Callback entscheidet zentral, <em>wer</em>{" "}
        <em>welche</em> Route sehen darf, und die Middleware setzt das vor dem
        Rendern durch. Login und Logout selbst löst du am elegantesten mit{" "}
        <code>signIn</code>/<code>signOut</code> als Server Action.
      </p>

      <div className="info-box">
        <strong>Drei Ebenen des Schutzes:</strong> (1) <em>Middleware</em> —
        blockt ganze Pfade, bevor überhaupt gerendert wird. (2){" "}
        <em>auth() in der Seite</em> — feingranular pro Komponente. (3){" "}
        <em>authorized-Callback</em> — die zentrale Regel, die Ebene 1 nutzt.
      </div>

      <h3>Der authorized-Callback</h3>
      <p>
        Neu in v5: Dieser Callback ist die eine Stelle, an der die
        Zugriffsregel steht. Die Middleware ruft ihn auf — gibt er{" "}
        <code>false</code> zurück, wird zum Login umgeleitet.
      </p>
      <Code label="auth.ts">{`export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    authorized({ request, auth }) {
      const eingeloggt = !!auth?.user;
      const aufDashboard =
        request.nextUrl.pathname.startsWith("/dashboard");

      if (aufDashboard) return eingeloggt; // sonst -> Login
      return true; // alles andere ist offen
    },
  },
});`}</Code>

      <h3>Die Middleware aktivieren</h3>
      <p>
        Eine Datei an der Projekt-Wurzel genügt — sie re-exportiert{" "}
        <code>auth</code> als Middleware. Der <code>matcher</code> grenzt ein,
        auf welchen Pfaden sie überhaupt läuft.
      </p>
      <Code label="middleware.ts (Next.js 15)">{`export { auth as middleware } from "@/auth";

export const config = {
  // statische Assets und _next ausnehmen
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};`}</Code>
      <div className="info-box" style={{ borderLeftColor: "#a855f7" }}>
        <strong>Next.js 16+:</strong> Die Datei heißt dort{" "}
        <code>proxy.ts</code> und der Export <code>auth as proxy</code>. Auf
        Next.js 15 (wie hier) bleibt es <code>middleware.ts</code>.
      </div>

      <h3>Login &amp; Logout als Server Action</h3>
      <p>
        Kein Client-JavaScript nötig: Ein <code>form</code> mit einer inline
        Server Action ruft <code>signIn</code>/<code>signOut</code> direkt auf.
      </p>
      <Code label="eine Server Component">{`import { signIn, signOut } from "@/auth";

export function LoginButton() {
  return (
    <form action={async () => {
      "use server";
      await signIn("github");
    }}>
      <button type="submit">Mit GitHub einloggen</button>
    </form>
  );
}

export function LogoutButton() {
  return (
    <form action={async () => {
      "use server";
      await signOut();
    }}>
      <button type="submit">Abmelden</button>
    </form>
  );
}`}</Code>

      <DepthBox variant="why" title="Warum authorized statt if-Checks in jeder Seite?">
        Verstreust du <code>if (!session) redirect(...)</code> über zwanzig
        Seiten, vergisst du es irgendwann einmal — und genau diese Seite leakt.
        Der <code>authorized</code>-Callback bündelt die Regel an <em>einer</em>{" "}
        Stelle, und die Middleware setzt sie durch, <em>bevor</em> Server-Code
        läuft. Das ist Defense-in-Depth: ein zentrales Tor plus optionale
        Feincheck pro Seite, nicht zwanzig einzelne Türen.
      </DepthBox>

      <DepthBox variant="mistake" title="Middleware als einzige Verteidigung">
        Middleware ist bequem, aber sie ist kein vollständiger Ersatz für
        Checks am Datenzugriff. Verlasse dich bei sensiblen Aktionen{" "}
        <em>zusätzlich</em> auf <code>auth()</code> direkt in der Server Action
        bzw. dem Route Handler, der die Daten anfasst. Die offizielle Empfehlung
        lautet: Middleware für die grobe Umleitung, der Check nah an den Daten
        für die echte Autorisierung.
      </DepthBox>

      <DepthBox variant="deeper" title="signIn/signOut: Action vs. Client">
        Es gibt zwei <code>signIn</code>: das aus <code>@/auth</code> (Server,
        für Server Actions / Programmatik) und das aus{" "}
        <code>next-auth/react</code> (Client-Hook-Variante für{" "}
        <code>onClick</code>). Im App Router ist die Server-Action-Variante der
        Default — sie funktioniert ohne Client-JS und leitet den OAuth-Flow
        serverseitig ein. Mit <code>redirectTo</code> steuerst du, wohin es
        nach erfolgreichem Login geht.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Die nächste Lektion (das Edge-Problem) — der <code>authorized</code>
        -Callback läuft in der Middleware und damit auf der Edge-Runtime, was
        bei DB-Adaptern zum Stolperstein wird. Außerdem die{" "}
        <code>jwt</code>-Callbacks, falls deine Regel auf eine Rolle im Token
        schaut.
      </DepthBox>
    </div>
  );
}

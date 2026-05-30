import { DepthBox } from "@/components/lessons/DepthBox";
import { Code } from "./Code";
import "@/components/lessons/lesson.css";

export default function SessionLesen() {
  return (
    <div className="lesson-card">
      <h2>Session lesen mit auth()</h2>
      <p className="lesson-description">
        Jetzt zahlt sich die Vereinheitlichung aus: In Server Components, Route
        Handlers und Server Actions schreibst du immer{" "}
        <code>const session = await auth()</code>. Nur der Client tanzt aus der
        Reihe — dort gibt es weiterhin den reaktiven Hook{" "}
        <code>useSession()</code>.
      </p>

      <div className="info-box">
        <strong>Faustregel:</strong> Liest du serverseitig (Server Component,
        Action, Handler), nimm <code>auth()</code>. Brauchst du den
        Login-Status <em>reaktiv im Browser</em> (z.B. ein Avatar im Header,
        der sofort umschaltet), nimm <code>useSession()</code> — und wickle die
        App in einen <code>SessionProvider</code>.
      </div>

      <h3>Server Component — der Normalfall</h3>
      <Code label="app/profil/page.tsx">{`import { auth } from "@/auth";

export default async function Profil() {
  const session = await auth();

  if (!session) return <p>Nicht eingeloggt.</p>;

  return <p>Hallo, {session.user?.name}!</p>;
}`}</Code>

      <h3>Route Handler — gleiche Funktion</h3>
      <Code label="app/api/me/route.ts">{`import { auth } from "@/auth";

export const GET = auth((req) => {
  if (!req.auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ user: req.auth.user });
});`}</Code>
      <p>
        Wickelst du den Handler in <code>auth(...)</code>, hängt die Session
        direkt an <code>req.auth</code> — kein separater Aufruf nötig. Du
        könntest stattdessen auch hier <code>await auth()</code> rufen.
      </p>

      <h3>Client — der reaktive Hook</h3>
      <p>
        Der Hook braucht Kontext. Einmal pro App den Provider setzen, dann ist{" "}
        <code>useSession()</code> überall im Client-Tree verfügbar:
      </p>
      <Code label="app/providers.tsx">{`"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}`}</Code>
      <Code label="eine Client-Komponente">{`"use client";
import { useSession } from "next-auth/react";

export function Avatar() {
  const { data: session, status } = useSession();
  if (status === "loading") return <Spinner />;
  return session ? <img src={session.user?.image ?? ""} /> : null;
}`}</Code>

      <h3>Wer was benutzt</h3>
      <div className="actors">
        <div className="actor-card bob">
          <div className="actor-title">Server: await auth()</div>
          <div className="actor-row">
            Server Components · Route Handlers · Server Actions ·
            Middleware. Synchron-fühlend, läuft vor dem Rendern, kein
            Provider nötig.
          </div>
        </div>
        <div className="actor-card alice">
          <div className="actor-title">Client: useSession()</div>
          <div className="actor-row">
            Nur in <code>&quot;use client&quot;</code>-Komponenten, braucht{" "}
            <code>SessionProvider</code>, dafür <em>reaktiv</em>: ändert sich
            der Login-Status, rendert die Komponente neu.
          </div>
        </div>
      </div>

      <DepthBox variant="why" title="Warum auth() im Server fast immer reicht">
        Im App Router rendern Server Components vor der Auslieferung. Du kennst
        den Login-Status also <em>schon beim Rendern</em> und kannst direkt das
        richtige UI schicken — ohne Flackern, ohne Lade-Spinner, ohne dass das
        JWT je den Browser erreicht. <code>useSession()</code> brauchst du nur,
        wenn sich der Status <em>im laufenden Client</em> ändern soll, ohne die
        Seite neu zu laden.
      </DepthBox>

      <DepthBox variant="mistake" title="auth() im Client aufrufen">
        <code>auth()</code> ist eine <em>Server</em>-Funktion. Importierst du
        sie in eine <code>&quot;use client&quot;</code>-Komponente, bekommst du
        einen Build- oder Runtime-Fehler. Umgekehrt gilt dasselbe:{" "}
        <code>useSession()</code> ist ein React-Hook und funktioniert nur im
        Client mit Provider. Merksatz: <code>auth()</code> = Server,{" "}
        <code>useSession()</code> = Client.
      </DepthBox>

      <DepthBox variant="deeper" title="Was im Session-Objekt steckt — und wie du es erweiterst">
        Standardmäßig enthält <code>session.user</code> nur{" "}
        <code>name</code>, <code>email</code> und <code>image</code>. Willst du
        z.B. eine Rolle oder die User-ID mitführen, reichst du sie über die{" "}
        <code>jwt</code>- und <code>session</code>-Callbacks durch: im{" "}
        <code>jwt</code>-Callback ins Token schreiben, im{" "}
        <code>session</code>-Callback von dort aufs Session-Objekt heben. Per
        Module-Augmentation kannst du den <code>Session</code>-Typ dann
        TypeScript-sauber erweitern.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        Die <code>jwt</code>/<code>session</code>-Callbacks (Session-Inhalt
        formen), Server Actions (lesen die Session genauso mit{" "}
        <code>auth()</code>) und die nächste Lektion: Mit derselben Funktion
        schützt du ganze Routen.
      </DepthBox>
    </div>
  );
}

import { Aufgabe, AufgabeCheckliste } from "@/components/lessons/Aufgabe";
import { KiReview } from "@/components/lessons/KiReview";
import "@/components/lessons/lesson.css";

export default function Uebungsaufgaben() {
  return (
    <div className="lesson-card">
      <h2>Übungsaufgaben für Auth.js v5</h2>
      <p className="lesson-description">
        Drei Aufgaben, die aufeinander aufbauen — vom ersten Login bis zur
        geschützten Route mit Split-Config. Bau sie in einer frischen Next.js
        15 App (App Router). Zu jeder Aufgabe gibt es einen KI-Review-Prompt:
        kopieren, deinen Code dranhängen, strukturiertes Feedback bekommen.
      </p>

      <div className="info-box">
        <strong>Setup-Tipp:</strong> Starte mit{" "}
        <code>npx create-next-app@latest</code>, dann{" "}
        <code>npm install next-auth@beta</code> und{" "}
        <code>npx auth secret</code>. Eine GitHub-OAuth-App ist in zwei Minuten
        angelegt — Callback-URL{" "}
        <code>http://localhost:3000/api/auth/callback/github</code>.
      </div>

      <Aufgabe titel="Login-Flow zum Laufen bringen" schwierigkeit="leicht" zeit="45 min">
        <p>
          Bring den kompletten Login-Kreislauf zum Laufen: zentrale{" "}
          <code>auth.ts</code> mit GitHub-Provider, der Catch-all-Route-Handler,
          die Env-Variablen, und ein Login- sowie Logout-Button als Server
          Action. Nach dem Klick landest du wieder auf der Startseite — diesmal
          eingeloggt.
        </p>
        <AufgabeCheckliste
          items={[
            "auth.ts exportiert handlers, signIn, signOut, auth",
            "Route-Handler liegt exakt unter app/api/auth/[...nextauth]/route.ts",
            "AUTH_SECRET + AUTH_GITHUB_ID/_SECRET in .env.local",
            "Login-Button ruft signIn(\"github\") als inline Server Action",
            "Logout-Button ruft signOut() — nach Klick bist du ausgeloggt",
          ]}
        />
        <KiReview
          hinweis="Kopiere den Prompt in eine KI deiner Wahl und hänge deine auth.ts, den Route-Handler und die Button-Komponente an."
          prompt={`Du bist Code-Reviewer für eine Next.js 15 App Router App mit next-auth@beta (Auth.js v5). Ich teile meine auth.ts, den Route-Handler unter app/api/auth/[...nextauth]/route.ts und meine Login/Logout-Buttons.

Prüfe konkret:
1. Exportiert auth.ts genau handlers, signIn, signOut, auth aus einem einzigen NextAuth(...)-Aufruf?
2. Liegt der Route-Handler am korrekten Catch-all-Pfad und exportiert er GET und POST aus handlers?
3. Sind die Env-Variablen korrekt benannt (AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET) — und stehen keine Secrets im Code?
4. Sind die Buttons echte Server Actions ("use server" in der Action) und rufen signIn/signOut aus @/auth (nicht aus next-auth/react)?
5. Ist die GitHub-Callback-URL plausibel?

Sag mir am Ende die zwei größten Verbesserungs-Hebel.`}
        />
      </Aufgabe>

      <Aufgabe titel="Session in drei Kontexten anzeigen" schwierigkeit="mittel" zeit="1 h">
        <p>
          Zeig denselben eingeloggten Nutzer an drei Stellen: in einer Server
          Component (Profilseite), über einen Route Handler{" "}
          (<code>GET /api/me</code> gibt JSON zurück) und reaktiv im Client
          (ein Header-Avatar via <code>useSession()</code> mit{" "}
          <code>SessionProvider</code>). Achte darauf, welche Variante wo
          hingehört.
        </p>
        <AufgabeCheckliste
          items={[
            "Profilseite ist eine async Server Component mit await auth()",
            "Nicht-eingeloggt wird sauber behandelt (Hinweis statt Crash)",
            "/api/me ist mit auth((req) => ...) gewickelt und gibt 401 ohne Session",
            "SessionProvider wickelt die App in einer \"use client\"-Datei",
            "Avatar nutzt useSession() und behandelt den loading-Status",
          ]}
        />
        <KiReview
          hinweis="Kopiere den Prompt und hänge deine Profilseite, den /api/me-Handler, den Provider und die Avatar-Komponente an."
          prompt={`Du bist Code-Reviewer für eine Next.js 15 App Router App mit next-auth@beta (Auth.js v5). Ich teile vier Dateien: eine Profil-Server-Component, einen Route-Handler /api/me, meinen SessionProvider und eine Avatar-Client-Komponente.

Prüfe konkret:
1. Nutzt die Profilseite await auth() serverseitig (nicht useSession) und behandelt sie den null-Fall?
2. Ist /api/me korrekt mit auth(...) gewickelt oder ruft es await auth(), und gibt es bei fehlender Session 401 zurück?
3. Liegt der SessionProvider in einer "use client"-Datei und wickelt er die App an der richtigen Stelle?
4. Verwendet der Avatar useSession() korrekt inkl. status === "loading" und rendert nichts Falsches im ausgeloggten Zustand?
5. Habe ich irgendwo die Client/Server-Grenze verletzt (auth() im Client oder useSession ohne Provider)?

Nenne mir am Ende die zwei größten Verbesserungs-Hebel.`}
        />
      </Aufgabe>

      <Aufgabe titel="Geschützte Route mit Split-Config" schwierigkeit="schwer" zeit="1,5 h">
        <p>
          Schütze einen <code>/dashboard</code>-Bereich: ein{" "}
          <code>authorized</code>-Callback erlaubt ihn nur Eingeloggten, die
          Middleware setzt es durch. Lege die Config so an, dass sie auch mit
          einem DB-Adapter edge-tauglich bliebe — also als Split-Config
          (<code>auth.config.ts</code> + <code>auth.ts</code>), wobei die
          Middleware nur den edge-sicheren Kern lädt.
        </p>
        <AufgabeCheckliste
          items={[
            "authorized-Callback erlaubt /dashboard nur bei !!auth?.user",
            "auth.config.ts enthält Provider + Callbacks, KEINEN Adapter",
            "auth.ts spreizt ...authConfig und ergänzt (optional) den Adapter + strategy: \"jwt\"",
            "middleware.ts baut NextAuth(authConfig) — importiert NICHT @/auth",
            "matcher nimmt _next und statische Assets aus",
            "Ausgeloggt + /dashboard aufrufen leitet zum Login um",
          ]}
        />
        <KiReview
          hinweis="Kopiere den Prompt und hänge auth.config.ts, auth.ts, middleware.ts und eine /dashboard-Seite an."
          prompt={`Du bist Senior-Reviewer für Auth.js v5 (next-auth@beta) im Next.js 15 App Router mit Fokus auf die Edge-Runtime. Ich teile auth.config.ts, auth.ts, middleware.ts und eine /dashboard-Seite.

Prüfe konkret und streng:
1. Ist die Config sauber gesplittet? auth.config.ts darf NUR edge-sichere Optionen (Provider, Callbacks) enthalten — kein DB-Adapter, kein Node-only-Import.
2. Importiert die Middleware ausschließlich auth.config (NICHT @/auth)? Erkläre, warum ein @/auth-Import hier den Edge-Bundle sprengen würde.
3. Ist der authorized-Callback korrekt: gibt er für /dashboard nur bei eingeloggtem Nutzer true zurück und lässt andere Pfade offen?
4. Falls ein Adapter genutzt wird: ist session.strategy auf "jwt" gesetzt, damit die Middleware ohne DB-Lookup verifizieren kann?
5. Verlasse ich mich allein auf die Middleware, oder gibt es zusätzlich einen Check nahe an den Daten? Bewerte das sicherheitskritisch.
6. Ist der matcher sinnvoll (statische Assets ausgenommen)?

Nenne mir am Ende die zwei größten Verbesserungs-Hebel und ein konkretes Edge-Runtime-Risiko, das mir noch droht.`}
        />
      </Aufgabe>
    </div>
  );
}

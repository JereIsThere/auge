import { DepthBox } from "@/components/lessons/DepthBox";
import { Code } from "./Code";
import "@/components/lessons/lesson.css";

export default function EdgeSplit() {
  return (
    <div className="lesson-card">
      <h2>Das Edge-Problem &amp; die Split-Config</h2>
      <p className="lesson-description">
        Sobald du einen Datenbank-Adapter (Prisma, Drizzle, …) für{" "}
        Database-Sessions einsetzt, kann deine Middleware kaputtgehen — mit
        kryptischen Fehlern über fehlende Node-Module. Der Grund: Middleware
        läuft auf der <strong>Edge-Runtime</strong>, und viele DB-Treiber tun
        das nicht. Die Lösung heißt <em>Split-Config</em>.
      </p>

      <div className="info-box">
        <strong>Die Diagnose in einem Satz:</strong> Middleware = Edge-Runtime.
        DB-Adapter = oft nur Node-Runtime. Lädt deine Middleware die volle{" "}
        <code>auth.ts</code> <em>mitsamt</em> Adapter, zieht sie damit
        Node-only-Code in die Edge — und es knallt beim Build oder zur Laufzeit.
      </div>

      <h3>Warum überhaupt Edge?</h3>
      <ul className="step-list">
        <li>
          Middleware läuft <strong>vor</strong> jeder passenden Anfrage,
          möglichst nah am Nutzer — dafür eine schlanke, schnelle Runtime ohne
          das volle Node-API.
        </li>
        <li>
          Datenbank-Treiber brauchen aber oft genau dieses Node-API
          (TCP-Sockets, <code>crypto</code>, native Bindings).
        </li>
        <li>
          Folge: Der Adapter darf nicht in den Edge-Bundle — die Middleware
          darf nur den <em>edge-sicheren</em> Teil der Config sehen.
        </li>
      </ul>

      <h3>Die Lösung: Config aufteilen</h3>
      <p>
        Du trennst die Konfiguration in einen edge-sicheren Kern (Provider +
        Callbacks, <em>kein</em> Adapter) und die volle Config (Kern +
        Adapter). Die Middleware nutzt nur den Kern.
      </p>

      <Code label="auth.config.ts — edge-sicher, kein Adapter">{`import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [GitHub],
  callbacks: {
    authorized({ request, auth }) {
      const aufDashboard =
        request.nextUrl.pathname.startsWith("/dashboard");
      return aufDashboard ? !!auth?.user : true;
    },
  },
} satisfies NextAuthConfig;`}</Code>

      <Code label="auth.ts — volle Config mit Adapter (Node-Runtime)">{`import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});`}</Code>

      <Code label="middleware.ts — nur der edge-sichere Kern">{`import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};`}</Code>

      <DepthBox variant="why" title="Warum strategy: jwt beim Adapter?">
        Mit einem DB-Adapter wäre die Default-Session-Strategie{" "}
        <code>database</code> — jeder Session-Lookup ginge dann gegen die DB.
        Genau das kann die Edge-Middleware aber nicht. Setzt du{" "}
        <code>session.strategy: &quot;jwt&quot;</code>, lebt die Session im
        signierten Cookie, und die Middleware kann sie <em>ohne</em>{" "}
        DB-Zugriff verifizieren — der Adapter bleibt nur für persistente Daten
        (User-Tabelle, verknüpfte Accounts) zuständig.
      </DepthBox>

      <DepthBox variant="mistake" title="Fehler: Module not found (net / dns / fs) in der Middleware">
        Dieser Fehler ist die Signatur des Edge-Problems: Ein Node-only-Modul
        (vom DB-Treiber) ist über die volle <code>auth.ts</code> in den
        Edge-Bundle gerutscht. Fast immer die Ursache: Die Middleware
        importiert <code>@/auth</code> statt <code>auth.config</code>. Lass die
        Middleware <em>nur</em> den edge-sicheren Kern laden, dann verschwindet
        der Fehler.
      </DepthBox>

      <DepthBox variant="deeper" title="Brauche ich die Split-Config immer?">
        Nein. Ohne DB-Adapter — also reine JWT-Sessions, Credentials oder nur
        OAuth ohne Persistenz — funktioniert eine einzige <code>auth.ts</code>{" "}
        problemlos in der Middleware. Die Aufteilung lohnt sich genau dann,
        wenn ein nicht-edge-fähiger Adapter ins Spiel kommt. Im Zweifel: erst
        einfach halten, splitten sobald der erste Edge-Fehler auftaucht.
      </DepthBox>

      <DepthBox variant="related" title="Hängt zusammen mit…">
        JWT- vs. Database-Sessions (die Wahl, die das Edge-Verhalten bestimmt),
        die <code>authorized</code>-Lektion (der Callback wandert in den
        edge-sicheren Kern) und Next.js' Runtime-Modell (Edge vs. Node) ganz
        allgemein.
      </DepthBox>
    </div>
  );
}

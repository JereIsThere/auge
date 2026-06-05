"use client";

import { useState } from "react";
import { KryptoQuelle } from "./KryptoQuelle";
import "@/components/lessons/lesson.css";

type Step = {
  title: string;
  from: string;
  to: string;
  desc: string;
  payload?: string;
};

const steps: Step[] = [
  {
    title: "Nutzer klickt 'Login mit Google'",
    from: "👤 Nutzer",
    to: "🌐 App (Client)",
    desc: "Der Nutzer möchte sich bei einer App anmelden, ohne dort sein Google-Passwort einzugeben.",
  },
  {
    title: "App leitet zum Authorization Server weiter",
    from: "🌐 App",
    to: "🔐 Authorization Server (Google)",
    desc: "Die App schickt den Browser zu Google – mit client_id, redirect_uri, scope und state.",
    payload:
      "GET /authorize?\n  client_id=APP_ID\n  &redirect_uri=https://app.example/callback\n  &scope=profile email\n  &state=xyz123\n  &response_type=code",
  },
  {
    title: "Nutzer loggt sich bei Google ein & stimmt zu",
    from: "👤 Nutzer",
    to: "🔐 Google",
    desc: "Google authentifiziert den Nutzer (Passwort, 2FA) und zeigt den Consent-Screen: 'App XY möchte Zugriff auf Profil und E-Mail – erlauben?'",
  },
  {
    title: "Google schickt Authorization Code zurück",
    from: "🔐 Google",
    to: "🌐 App",
    desc: "Über den Browser-Redirect erhält die App einen kurzlebigen Code. Der Code allein reicht noch nicht – er muss erst gegen ein Token getauscht werden.",
    payload: "302 Redirect → https://app.example/callback?code=AUTH_CODE&state=xyz123",
  },
  {
    title: "App tauscht Code gegen Access Token",
    from: "🌐 App-Backend",
    to: "🔐 Google",
    desc: "Direkt von Server zu Server (nicht über den Browser!) – mit client_secret. Das ist der entscheidende Schritt: niemand außer der App kann diesen Tausch machen.",
    payload:
      "POST /token\n  code=AUTH_CODE\n  &client_id=APP_ID\n  &client_secret=SECRET\n  &grant_type=authorization_code",
  },
  {
    title: "Google antwortet mit Access Token (+ Refresh Token)",
    from: "🔐 Google",
    to: "🌐 App",
    desc: "Access Token ist meist ein JWT, gültig z. B. 1 Stunde. Refresh Token kann später ein neues Access Token holen, ohne dass der Nutzer wieder klicken muss.",
    payload:
      '{\n  "access_token": "ya29.a0Af...",\n  "expires_in": 3600,\n  "refresh_token": "1//0g...",\n  "token_type": "Bearer"\n}',
  },
  {
    title: "App ruft mit Token die Daten ab",
    from: "🌐 App",
    to: "📦 Resource Server (Google API)",
    desc: "Das Access Token wird im Authorization-Header mitgeschickt. Der Resource Server prüft das Token und liefert die Daten.",
    payload: "GET /userinfo\nAuthorization: Bearer ya29.a0Af...",
  },
];

export default function OAuth() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="lesson-card">
      <h2>OAuth 2.0 – Authorization Code Flow</h2>
      <p className="lesson-description">
        OAuth ist <strong>kein Verschlüsselungsverfahren</strong>, sondern ein
        Protokoll für <strong>delegierte Autorisierung</strong>. Es löst die Frage:
        „Wie kann eine App in meinem Namen auf meine Daten bei einem anderen Dienst
        zugreifen – ohne dass ich der App mein Passwort gebe?&ldquo;
      </p>

      <div className="info-box">
        <strong>Die vier Rollen:</strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          <li><strong>Resource Owner</strong> – du, der Nutzer</li>
          <li><strong>Client</strong> – die App, die Zugriff will</li>
          <li><strong>Authorization Server</strong> – stellt Tokens aus (z. B. Google)</li>
          <li><strong>Resource Server</strong> – hält die Daten (z. B. Google API)</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2.5">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flow-step ${
              i === current ? "active" : i < current ? "done" : ""
            }`}
            onClick={() => setCurrent(i)}
            style={{ cursor: "pointer" }}
          >
            <div className="flow-step-num">{i < current ? "✓" : i + 1}</div>
            <div className="flow-step-body">
              <div className="flow-step-title">{s.title}</div>
              <div className="flow-step-desc">
                <span className="pill">{s.from}</span> → <span className="pill">{s.to}</span>
                <div style={{ marginTop: 6 }}>{s.desc}</div>
                {i === current && s.payload && (
                  <pre
                    style={{
                      marginTop: 10,
                      background: "#0f172a",
                      color: "#e2e8f0",
                      padding: 12,
                      borderRadius: 8,
                      fontSize: "0.78rem",
                      overflowX: "auto",
                    }}
                  >
                    {s.payload}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex" style={{ gap: 10, marginTop: 4 }}>
        <button
          className="toggle-code"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
        >
          ← Zurück
        </button>
        <button
          className="toggle-code"
          onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
          disabled={current === steps.length - 1}
        >
          Nächster Schritt →
        </button>
        <button className="toggle-code" onClick={() => setCurrent(0)}>
          ↻ Reset
        </button>
      </div>

      <h3>Warum nicht einfach Passwort weitergeben?</h3>
      <ol className="step-list">
        <li>Die App müsste das Klartext-Passwort speichern – riesiges Risiko.</li>
        <li>Der Nutzer könnte den Zugriff nicht gezielt für eine App widerrufen, ohne überall das Passwort zu ändern.</li>
        <li>Keine Beschränkung auf Teilrechte (Scopes): &bdquo;nur lesen&ldquo;, &bdquo;nur Profil&ldquo; etc.</li>
        <li>Kein 2FA möglich, da die App selbst einloggen müsste.</li>
      </ol>

      <h3>Wichtige Begriffe</h3>
      <dl className="kv-table">
        <dt>Access Token</dt>
        <dd>Kurzlebig, wird bei jedem API-Aufruf mitgeschickt. Oft JWT.</dd>
        <dt>Refresh Token</dt>
        <dd>Langlebig, holt neue Access Tokens ohne erneutes Login.</dd>
        <dt>Scope</dt>
        <dd>Definiert, was die App darf (z. B. „read:email&ldquo;).</dd>
        <dt>state</dt>
        <dd>Zufallswert gegen CSRF-Angriffe – muss zurückkommen wie geschickt.</dd>
        <dt>PKCE</dt>
        <dd>Erweiterung für native/SPA-Clients ohne client_secret.</dd>
      </dl>

      <KryptoQuelle
        id="rfc-6749"
        kernaussagen={[
          "RFC 6749 definiert vier Grant-Typen: Authorization Code, Implicit, Resource Owner Password und Client Credentials — für unterschiedliche Client-Szenarien.",
          "Der Authorization Code Flow (hier gezeigt) ist der einzige Grant-Typ, der ein client_secret sicher einsetzen kann, da der Code-Tausch Server-zu-Server erfolgt.",
          "Scopes sind absichtlich nicht vom RFC standardisiert — jeder Authorization Server definiert seine eigenen (z.B. 'read:email', 'repo').",
        ]}
      />

      <div className="warn-box">
        <strong>OAuth ≠ OpenID Connect.</strong> OAuth regelt nur die Autorisierung
        („darf die App das?&ldquo;). Wenn du wissen willst <strong>wer</strong> der
        Nutzer ist, nutzt man <strong>OpenID Connect</strong> – eine OAuth-Erweiterung
        mit einem zusätzlichen <code>id_token</code> (signiertes JWT mit Nutzerinfos).
      </div>
    </div>
  );
}

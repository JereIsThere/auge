// Client-side Auth — SHA-256 Passwort-Hash gegen sessionStorage
// Standard-Passwort: "admin"  →  Hash unten
// Neuen Hash erzeugen (Browser-Konsole):
//   const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('dein-passwort'));
//   console.log([...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join(''));

const PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
const SESSION_KEY   = 'auge_admin_session';

async function sha256(text: string): Promise<string> {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === PASSWORD_HASH;
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    const next = encodeURIComponent(location.pathname + location.search);
    location.href = `/login/?next=${next}`;
  }
}

export async function login(password: string): Promise<boolean> {
  const hash = await sha256(password);
  if (hash === PASSWORD_HASH) {
    sessionStorage.setItem(SESSION_KEY, hash);
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
  location.href = '/login/';
}

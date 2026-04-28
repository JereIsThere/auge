import { requireAuth, logout } from '../auth';

requireAuth();

document.getElementById('btn-logout')!.addEventListener('click', logout);

// ── OrientDB Config ───────────────────────────────────────────────

interface OrientConfig {
  host: string;
  port: string;
  db: string;
  user: string;
  pass: string;
}

const CFG_KEY = 'auge_orient_cfg';

function loadConfig(): OrientConfig {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) return JSON.parse(raw) as OrientConfig;
  } catch { /* ignore */ }
  return { host: 'localhost', port: '2480', db: '', user: 'admin', pass: '' };
}

function saveConfig(c: OrientConfig) {
  localStorage.setItem(CFG_KEY, JSON.stringify(c));
}

function readConfig(): OrientConfig {
  return {
    host: (document.getElementById('cfg-host') as HTMLInputElement).value.trim(),
    port: (document.getElementById('cfg-port') as HTMLInputElement).value.trim(),
    db:   (document.getElementById('cfg-db')   as HTMLInputElement).value.trim(),
    user: (document.getElementById('cfg-user') as HTMLInputElement).value.trim(),
    pass: (document.getElementById('cfg-pass') as HTMLInputElement).value,
  };
}

function applyConfig(c: OrientConfig) {
  (document.getElementById('cfg-host') as HTMLInputElement).value = c.host;
  (document.getElementById('cfg-port') as HTMLInputElement).value = c.port;
  (document.getElementById('cfg-db')   as HTMLInputElement).value = c.db;
  (document.getElementById('cfg-user') as HTMLInputElement).value = c.user;
  (document.getElementById('cfg-pass') as HTMLInputElement).value = c.pass;
}

// ── State & UI ───────────────────────────────────────────────────

let connected = false;
let currentConfig: OrientConfig | null = null;

const dot   = document.getElementById('db-status-dot')   as HTMLElement;
const label = document.getElementById('db-status-label') as HTMLElement;
const panel = document.getElementById('query-panel')     as HTMLElement;
const btnConnect    = document.getElementById('btn-connect')    as HTMLButtonElement;
const btnDisconnect = document.getElementById('btn-disconnect') as HTMLButtonElement;

function setConnected(ok: boolean, cfg?: OrientConfig) {
  connected = ok;
  currentConfig = ok && cfg ? cfg : null;
  dot.className   = 'status-dot ' + (ok ? 'dot-ok' : '');
  label.textContent = ok ? `verbunden — ${cfg!.db} @ ${cfg!.host}:${cfg!.port}` : 'nicht verbunden';
  panel.style.display    = ok ? '' : 'none';
  btnConnect.disabled    = ok;
  btnDisconnect.disabled = !ok;
  log(ok ? `✓ Verbunden mit ${cfg!.host}:${cfg!.port}/${cfg!.db}` : '✗ Verbindung getrennt');
}

// ── OrientDB REST-Client ──────────────────────────────────────────
// OrientDB HTTP API: http://host:port/command/db/sql  (POST)
// Auth: Basic base64(user:pass)

function orientBase(cfg: OrientConfig): string {
  return `http://${cfg.host}:${cfg.port}`;
}

function basicAuth(cfg: OrientConfig): string {
  return 'Basic ' + btoa(`${cfg.user}:${cfg.pass}`);
}

async function testConnection(cfg: OrientConfig): Promise<void> {
  // GET /listDatabases — öffentlicher Endpoint zur Verbindungsprüfung
  const res = await fetch(`${orientBase(cfg)}/listDatabases`, {
    headers: { Authorization: basicAuth(cfg) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}

async function runQuery(cfg: OrientConfig, sql: string): Promise<unknown> {
  const res = await fetch(`${orientBase(cfg)}/command/${encodeURIComponent(cfg.db)}/sql`, {
    method: 'POST',
    headers: {
      Authorization: basicAuth(cfg),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command: sql }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json();
}

// ── Event-Listener ───────────────────────────────────────────────

document.getElementById('btn-connect')!.addEventListener('click', async () => {
  const cfg = readConfig();
  if (!cfg.db) { log('⚠ Datenbank-Name fehlt.'); return; }
  saveConfig({ ...cfg, pass: '' }); // Passwort nicht speichern
  btnConnect.disabled = true;
  btnConnect.textContent = 'Verbinde…';
  try {
    await testConnection(cfg);
    setConnected(true, cfg);
  } catch (err) {
    log(`✗ Verbindungsfehler: ${String(err)}`);
    btnConnect.disabled = false;
  }
  btnConnect.textContent = 'Verbinden';
});

document.getElementById('btn-disconnect')!.addEventListener('click', () => {
  setConnected(false);
});

document.getElementById('btn-run')!.addEventListener('click', async () => {
  if (!connected || !currentConfig) return;
  const sql = (document.getElementById('query-input') as HTMLTextAreaElement).value.trim();
  if (!sql) return;
  const resultEl = document.getElementById('query-result')!;
  resultEl.textContent = 'Läuft…';
  try {
    const data = await runQuery(currentConfig, sql);
    renderResult(data, resultEl);
    log(`✓ Query ausgeführt: ${sql.slice(0, 60)}…`);
  } catch (err) {
    resultEl.innerHTML = `<span class="result-error">${String(err)}</span>`;
    log(`✗ Query-Fehler: ${String(err)}`);
  }
});

document.getElementById('query-input')!.addEventListener('keydown', (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    document.getElementById('btn-run')!.click();
  }
});

// ── Result Rendering ─────────────────────────────────────────────

function renderResult(data: unknown, el: HTMLElement) {
  if (!data || typeof data !== 'object') {
    el.textContent = JSON.stringify(data, null, 2);
    return;
  }
  const result = (data as Record<string, unknown>).result;
  const rows = Array.isArray(result) ? result : [data];

  if (rows.length === 0) {
    el.innerHTML = '<span class="result-empty">Keine Ergebnisse.</span>';
    return;
  }

  const keys = [...new Set(rows.flatMap(r => Object.keys(r as object)))];
  const thead = `<tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr>`;
  const tbody = rows.map(row => {
    const r = row as Record<string, unknown>;
    return `<tr>${keys.map(k => `<td>${JSON.stringify(r[k] ?? '')}</td>`).join('')}</tr>`;
  }).join('');
  el.innerHTML = `<div class="result-scroll"><table class="result-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
}

// ── Log ──────────────────────────────────────────────────────────

const logEl = document.getElementById('log-output')!;

function log(msg: string) {
  const now = new Date().toLocaleTimeString('de-DE', { hour12: false });
  const line = document.createElement('div');
  line.className = 'log-line';
  line.textContent = `[${now}] ${msg}`;
  logEl.prepend(line);
  if (logEl.children.length > 100) logEl.lastElementChild?.remove();
}

// ── Init ─────────────────────────────────────────────────────────

const savedCfg = loadConfig();
applyConfig(savedCfg);
setConnected(false);
panel.style.display = 'none';
log('Admin geladen.');

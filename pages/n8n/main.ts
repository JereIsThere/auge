const LS_KEY = 'auge_n8n_conn';

interface Conn {
  baseUrl: string;
  apiKey: string;
}

interface WfNode {
  type: string;
  name: string;
  parameters: { path?: string; httpMethod?: string; [k: string]: unknown };
  webhookId?: string;
}

interface Wf {
  id: string;
  name: string;
  active: boolean;
  nodes: WfNode[];
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function save(c: Conn) {
  localStorage.setItem(LS_KEY, JSON.stringify(c));
}

function load(): Conn | null {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? 'null'); }
  catch { return null; }
}

function clear() {
  localStorage.removeItem(LS_KEY);
}

async function getWorkflows(conn: Conn): Promise<Wf[]> {
  const all: Wf[] = [];
  let cursor: string | null = null;
  do {
    const qs = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
    const res = await fetch(`${conn.baseUrl}/api/v1/workflows?limit=250${qs}`, {
      headers: { 'X-N8N-API-KEY': conn.apiKey },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    const json = await res.json() as { data: Wf[]; nextCursor?: string };
    all.push(...json.data);
    cursor = json.nextCursor ?? null;
  } while (cursor);
  return all;
}

function webhookNodes(wf: Wf): WfNode[] {
  return wf.nodes.filter(n => n.type === 'n8n-nodes-base.webhook');
}

function nodePath(node: WfNode): string {
  return (node.parameters.path as string | undefined) || node.webhookId || '?';
}

function nodeMethod(node: WfNode): string {
  return ((node.parameters.httpMethod as string | undefined) || 'GET').toUpperCase();
}

async function triggerWebhook(conn: Conn, path: string, method: string, body: string) {
  const url = `${conn.baseUrl}/webhook/${path}`;
  const isGet = method === 'GET';
  const res = await fetch(url, {
    method,
    headers: isGet ? {} : { 'Content-Type': 'application/json' },
    body: isGet ? undefined : (body.trim() || '{}'),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

// ── Render ────────────────────────────────────────────────────────────────────

const app = document.getElementById('app')!;

function renderAuth(error?: string) {
  app.innerHTML = `
<form class="n8n-auth" id="auth-form" novalidate>
  <label class="n8n-field">
    <span class="n8n-label">n8n&nbsp;URL</span>
    <input class="n8n-input" id="url-in" type="url"
      placeholder="https://your-n8n.com" autocomplete="url" required />
  </label>
  <label class="n8n-field">
    <span class="n8n-label">API-Schlüssel</span>
    <input class="n8n-input" id="key-in" type="password"
      placeholder="••••••••••••••••" autocomplete="off" required />
  </label>
  ${error ? `<p class="n8n-error" role="alert">${esc(error)}</p>` : ''}
  <button class="n8n-btn" type="submit">Verbinden</button>
  <p class="n8n-hint">API-Schlüssel anlegen: n8n → Einstellungen → n8n&nbsp;API</p>
</form>`;

  const form = document.getElementById('auth-form') as HTMLFormElement;
  const urlIn = document.getElementById('url-in') as HTMLInputElement;
  const keyIn = document.getElementById('key-in') as HTMLInputElement;

  const stored = load();
  if (stored) { urlIn.value = stored.baseUrl; keyIn.value = stored.apiKey; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button') as HTMLButtonElement;
    btn.textContent = '…';
    btn.disabled = true;
    const conn: Conn = {
      baseUrl: urlIn.value.replace(/\/+$/, ''),
      apiKey: keyIn.value.trim(),
    };
    try {
      const wfs = await getWorkflows(conn);
      save(conn);
      renderWorkflows(conn, wfs);
    } catch (err) {
      renderAuth((err as Error).message);
    }
  });
}

function renderWorkflows(conn: Conn, wfs: Wf[]) {
  const items = wfs
    .map(wf => ({ wf, hooks: webhookNodes(wf) }))
    .filter(x => x.hooks.length > 0);

  const header = `
<div class="n8n-header">
  <span class="n8n-url">${esc(conn.baseUrl)}</span>
  <button class="n8n-btn n8n-btn-sm" id="disconnect-btn">Trennen</button>
</div>`;

  if (items.length === 0) {
    app.innerHTML = header + '<p class="n8n-empty">Keine aktiven Workflows mit Webhook-Trigger gefunden.</p>';
    document.getElementById('disconnect-btn')!.addEventListener('click', disconnect);
    return;
  }

  const cards = items.map(({ wf, hooks }) => {
    const hookRows = hooks.map((node, i) => `
<div class="n8n-hook" data-wf="${esc(wf.id)}" data-idx="${i}"
     data-path="${esc(nodePath(node))}" data-method="${esc(nodeMethod(node))}">
  <span class="n8n-hook-path">
    <span class="n8n-method">${esc(nodeMethod(node))}</span>
    <span class="n8n-hook-name">${esc(node.name)}</span>
    <code class="n8n-path-code">/webhook/${esc(nodePath(node))}</code>
  </span>
  <button class="n8n-run-btn" aria-label="Webhook ausführen">▶</button>
</div>
<div class="n8n-panel" id="panel-${esc(wf.id)}-${i}" hidden></div>`).join('');

    return `
<div class="card n8n-card${wf.active ? '' : ' n8n-inactive'}">
  <div class="card-num">#${esc(wf.id)}</div>
  <div class="card-name">${esc(wf.name)}</div>
  <div class="card-meta">
    <span class="card-status ${wf.active ? 'status-finished' : 'status-todo'}">${wf.active ? 'aktiv' : 'inaktiv'}</span>
  </div>
  <div class="n8n-hooks">${hookRows}</div>
</div>`;
  }).join('');

  app.innerHTML = header + `<div class="n8n-grid">${cards}</div>`;

  document.getElementById('disconnect-btn')!.addEventListener('click', disconnect);

  app.querySelectorAll<HTMLElement>('.n8n-run-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const hook = btn.closest<HTMLElement>('.n8n-hook')!;
      const { wf: wfId, idx, path, method } = hook.dataset as Record<string, string>;
      const panelId = `panel-${wfId}-${idx}`;
      const panel = document.getElementById(panelId)!;
      const isOpen = !panel.hidden;

      app.querySelectorAll<HTMLElement>('.n8n-panel').forEach(p => {
        p.hidden = true;
        p.innerHTML = '';
      });
      app.querySelectorAll<HTMLElement>('.n8n-run-btn').forEach(b => { b.textContent = '▶'; });

      if (!isOpen) {
        btn.textContent = '▼';
        openPanel(panel, conn, path, method);
      }
    });
  });
}

function openPanel(panel: HTMLElement, conn: Conn, path: string, method: string) {
  const isGet = method === 'GET';
  panel.hidden = false;
  panel.innerHTML = `
<div class="n8n-panel-inner">
  ${!isGet ? `
  <label class="n8n-field">
    <span class="n8n-label">Payload <span class="n8n-hint-inline">(JSON, optional)</span></span>
    <textarea class="n8n-payload" id="payload-ta" rows="4" placeholder="{}"></textarea>
  </label>` : ''}
  <button class="n8n-btn n8n-send-btn" id="send-btn">
    ${esc(method)} /webhook/${esc(path)}
  </button>
  <div class="n8n-result" id="result" hidden></div>
</div>`;

  document.getElementById('send-btn')!.addEventListener('click', async () => {
    const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
    const resultDiv = document.getElementById('result')!;
    const payload = (document.getElementById('payload-ta') as HTMLTextAreaElement | null)?.value ?? '';

    sendBtn.disabled = true;
    sendBtn.textContent = '…';
    resultDiv.hidden = true;

    try {
      const { ok, status, text } = await triggerWebhook(conn, path, method, payload);
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON, use raw */ }
      resultDiv.hidden = false;
      resultDiv.className = `n8n-result ${ok ? 'n8n-ok' : 'n8n-err'}`;
      resultDiv.innerHTML = `<span class="n8n-status">${status}</span><pre class="n8n-body"></pre>`;
      (resultDiv.querySelector('.n8n-body') as HTMLPreElement).textContent = pretty;
    } catch (err) {
      resultDiv.hidden = false;
      resultDiv.className = 'n8n-result n8n-err';
      resultDiv.innerHTML = `<span class="n8n-status">Netzwerkfehler</span><pre class="n8n-body"></pre>`;
      (resultDiv.querySelector('.n8n-body') as HTMLPreElement).textContent = (err as Error).message;
    }

    sendBtn.disabled = false;
    sendBtn.textContent = `${method} /webhook/${path}`;
  });
}

function disconnect() {
  clear();
  renderAuth();
}

// ── Boot ──────────────────────────────────────────────────────────────────────

(async () => {
  const conn = load();
  if (conn) {
    try {
      const wfs = await getWorkflows(conn);
      renderWorkflows(conn, wfs);
    } catch {
      renderAuth();
    }
  } else {
    renderAuth();
  }
})();

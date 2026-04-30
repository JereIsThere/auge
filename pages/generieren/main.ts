// generieren — Lernseite via n8n-AI-Chat-Webhook + JS-Post-Processing.
// Erste Stufe: simple Chat-Roundtrip, Markdown raus, hier zu sauberem HTML
// gerendert. Träumer→Denker-Pipeline kommt später als eigener Endpoint.

const DEFAULT_WEBHOOK = 'https://n8n.jeremias-groehl.de/webhook/ai-chat';
const DEFAULT_PUBLISH_WEBHOOK = 'https://n8n.jeremias-groehl.de/webhook/auge-publish';
const STORE_KEY = 'auge.generieren.v1';

type State = {
  webhookUrl: string;
  publishWebhookUrl: string;
  topic: string;
  level: string;
  model: string;
  extra: string;
  lastMarkdown: string;
};

const state: State = loadState() ?? {
  webhookUrl: DEFAULT_WEBHOOK,
  publishWebhookUrl: DEFAULT_PUBLISH_WEBHOOK,
  topic: '',
  level: 'mittel',
  model: 'claude-sonnet-4-6',
  extra: '',
  lastMarkdown: '',
};
if (!state.publishWebhookUrl) state.publishWebhookUrl = DEFAULT_PUBLISH_WEBHOOK;

const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;

const form = $<HTMLFormElement>('genForm');
const topicEl = $<HTMLInputElement>('topic');
const levelEl = $<HTMLSelectElement>('level');
const modelEl = $<HTMLSelectElement>('model');
const webhookEl = $<HTMLInputElement>('webhook');
const extraEl = $<HTMLTextAreaElement>('extra');
const publishWebhookEl = $<HTMLInputElement>('publishWebhook');
const submitBtn = $<HTMLButtonElement>('genSubmit');
const cancelBtn = $<HTMLButtonElement>('genCancel');
const statusEl = $<HTMLDivElement>('status');
const resultEl = $<HTMLElement>('result');
const actionsEl = $<HTMLDivElement>('resultActions');
const copyBtn = $<HTMLButtonElement>('copyBtn');
const downloadMdBtn = $<HTMLButtonElement>('downloadMdBtn');
const downloadHtmlBtn = $<HTMLButtonElement>('downloadHtmlBtn');
const newBtn = $<HTMLButtonElement>('newBtn');
const submitPrBtn = $<HTMLButtonElement>('submitPrBtn');
const prResultEl = $<HTMLDivElement>('prResult');

// Hydrate UI from state
topicEl.value = state.topic;
levelEl.value = state.level;
modelEl.value = state.model;
webhookEl.value = state.webhookUrl;
publishWebhookEl.value = state.publishWebhookUrl;
extraEl.value = state.extra;

let abortController: AbortController | null = null;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  generate();
});
cancelBtn.addEventListener('click', () => abortController?.abort());
copyBtn.addEventListener('click', () => copyToClipboard(state.lastMarkdown));
downloadMdBtn.addEventListener('click', () =>
  download(`${slugify(state.topic) || 'lernseite'}.md`, state.lastMarkdown, 'text/markdown'),
);
downloadHtmlBtn.addEventListener('click', () => downloadHtml());
newBtn.addEventListener('click', () => {
  resultEl.hidden = true;
  resultEl.innerHTML = '';
  actionsEl.hidden = true;
  prResultEl.hidden = true;
  prResultEl.innerHTML = '';
  state.lastMarkdown = '';
  saveState();
  topicEl.focus();
});
submitPrBtn.addEventListener('click', submitPR);

[topicEl, levelEl, modelEl, webhookEl, publishWebhookEl, extraEl].forEach((el) =>
  el.addEventListener('change', () => {
    state.topic = topicEl.value.trim();
    state.level = levelEl.value;
    state.model = modelEl.value;
    state.webhookUrl = webhookEl.value.trim() || DEFAULT_WEBHOOK;
    state.publishWebhookUrl = publishWebhookEl.value.trim() || DEFAULT_PUBLISH_WEBHOOK;
    state.extra = extraEl.value.trim();
    saveState();
  }),
);

// ── core: generate ──────────────────────────────────────────────
async function generate() {
  const topic = topicEl.value.trim();
  if (!topic) {
    setStatus('Thema fehlt.', 'error');
    return;
  }
  state.topic = topic;
  state.level = levelEl.value;
  state.model = modelEl.value;
  state.webhookUrl = webhookEl.value.trim() || DEFAULT_WEBHOOK;
  state.extra = extraEl.value.trim();
  saveState();

  submitBtn.disabled = true;
  cancelBtn.hidden = false;
  resultEl.hidden = true;
  resultEl.innerHTML = '';
  actionsEl.hidden = true;
  setStatus('warte auf modell', 'busy');

  abortController = new AbortController();
  try {
    const md = await fetchLernsite({
      webhook: state.webhookUrl,
      topic: state.topic,
      level: state.level,
      model: state.model,
      extra: state.extra,
      signal: abortController.signal,
    });
    state.lastMarkdown = md;
    saveState();
    renderResult(md);
    setStatus('fertig', 'ok');
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      setStatus('abgebrochen.', 'error');
    } else {
      console.error(err);
      setStatus(`fehler · ${(err as Error).message ?? err}`, 'error');
    }
  } finally {
    submitBtn.disabled = false;
    cancelBtn.hidden = true;
    abortController = null;
  }
}

async function submitPR() {
  if (!state.lastMarkdown) {
    setPrResult('Erstmal generieren, dann einreichen.', 'error');
    return;
  }

  const titleFromMd = state.lastMarkdown.match(/^#\s+(.+)$/m)?.[1].trim();
  const title = titleFromMd || state.topic.trim() || 'Lernseite';
  const suggestedSlug = slugify(title);

  const slug = (window.prompt(
    'Slug für die neue Page (wird zu pages/<slug>/):',
    suggestedSlug,
  ) || '').trim();

  if (!slug) return;

  const publishUrl = state.publishWebhookUrl || DEFAULT_PUBLISH_WEBHOOK;
  const htmlBody = renderMarkdown(state.lastMarkdown);

  submitPrBtn.disabled = true;
  setPrResult(`PR wird angelegt …`, 'busy');

  try {
    const res = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        title,
        htmlBody,
        markdown: state.lastMarkdown,
        description: extractDescription(state.lastMarkdown).slice(0, 160),
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}${errText ? ' · ' + errText.slice(0, 200) : ''}`);
    }
    const data = await res.json();
    if (!data.ok || !data.prUrl) {
      throw new Error(data.error || 'kein prUrl in Antwort');
    }
    setPrResult(
      `<strong>PR offen.</strong> <a href="${escapeHtml(data.prUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.prUrl)}</a>` +
        `<span class="meta">branch <code>${escapeHtml(data.branch)}</code> · path <code>${escapeHtml(data.path)}</code></span>` +
        `<span class="meta">Mergen + danach <code>npm run deploy</code> → live.</span>`,
      'ok',
    );
  } catch (err) {
    setPrResult(`Fehler: ${(err as Error).message ?? err}`, 'error');
  } finally {
    submitPrBtn.disabled = false;
  }
}

function extractDescription(md: string): string {
  const noFences = md.replace(/```[\s\S]*?```/g, '');
  const lines = noFences.split(/\r?\n/);
  for (const raw of lines) {
    const t = raw.trim();
    if (!t) continue;
    if (/^#{1,6}\s/.test(t)) continue;
    if (/^>/.test(t)) return t.replace(/^>+\s*/, '');
    if (/^[-*]\s/.test(t)) continue;
    return t;
  }
  return md.slice(0, 200);
}

function setPrResult(html: string, kind: '' | 'busy' | 'ok' | 'error' = '') {
  prResultEl.className = `gen-pr-result ${kind}`.trim();
  prResultEl.innerHTML = html;
  prResultEl.hidden = false;
}

async function fetchLernsite(opts: {
  webhook: string;
  topic: string;
  level: string;
  model: string;
  extra: string;
  signal: AbortSignal;
}): Promise<string> {
  const systemPrompt = buildSystemPrompt(opts.level, opts.extra);
  const userMessage = `Thema: ${opts.topic}\nLevel: ${opts.level}`;

  const payload = {
    sessionId: `auge-gen-${slugify(opts.topic)}-${Date.now().toString(36)}`,
    user: 'auge-generator',
    model: opts.model,
    systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  };

  const res = await fetch(opts.webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: opts.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}${text ? ' · ' + text.slice(0, 160) : ''}`);
  }
  const data = await res.json();
  const md =
    data?.message?.content ??
    data?.content ??
    data?.text ??
    data?.output ??
    '';
  if (!md || typeof md !== 'string') {
    throw new Error('leere antwort vom webhook');
  }
  return md.trim();
}

function buildSystemPrompt(level: string, extra: string): string {
  const tone = {
    einsteiger: 'Erkläre wie für einen interessierten Anfänger, ohne Jargon. Beispiele aus dem Alltag.',
    mittel: 'Setze grundlegendes Vorwissen voraus. Klar, präzise, mit konkreten Beispielen.',
    fortgeschritten: 'Nimm an, der Leser kennt das Feld. Geh in die Tiefe, erwähne Edge-Cases und Implikationen.',
  }[level] ?? 'Klar, präzise, mit konkreten Beispielen.';

  const extraLine = extra ? `\n\nZusätzlich: ${extra}` : '';

  return `Du erstellst eine kompakte Lernseite zu einem Konzept im Stil eines aufgeräumten Notizbuchs. Antworte AUSSCHLIESSLICH in Markdown, ohne erklärende Vorrede oder Schlusssatz, ohne Code-Fence ums Ganze.

${tone}${extraLine}

Halte dich an diese Struktur (Reihenfolge zwingend, leere Sektionen weglassen):

# {Titel ohne Anführungszeichen}
> 1-Satz-TL;DR. Was ist's und warum lohnt's sich.

## Worum geht's
2-3 Sätze Kontext, motivierend.

## Kernidee
Die zentrale Mechanik in eigenen Worten, 3-6 Sätze. Bei Bedarf eine kurze Analogie.

## Wie's funktioniert
Step-by-step, nummerierte Liste oder kurze Absätze.

## Codebeispiel (nur falls programmierbar)
\`\`\`sprache
// kurz, lesbar, kommentiert
\`\`\`

## Häufige Stolpersteine
- 3-5 typische Fehler oder Missverständnisse mit kurzem Fix.

## Mini-Übung
Eine konkrete kleine Aufgabe für die Hand. Vor + nach dem Lernen lösbar.

## Weiterlesen
- 2-3 spezifische Suchbegriffe oder Quellen.

Regeln:
- Deutsch, du-Form, kein Du-mit-großem-D in Sätzen.
- Keine Floskeln ("In diesem Artikel werden wir…").
- Keine Sterne, Emojis nur sehr sparsam.
- Code-Fences mit Sprach-Hint (\`\`\`js, \`\`\`ts, \`\`\`py, \`\`\`bash, …).
- Keine externen Links die du dir ausdenkst — nur Suchbegriffe oder echte etablierte Quellen.`;
}

// ── render & post-process ──────────────────────────────────────
function renderResult(md: string) {
  resultEl.innerHTML = renderMarkdown(md);
  resultEl.hidden = false;
  actionsEl.hidden = false;

  // Headings → IDs für Anker
  resultEl.querySelectorAll<HTMLHeadingElement>('h1, h2, h3').forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent ?? '');
  });

  // Code-Block Copy-Button
  resultEl.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-pre';
    btn.textContent = 'copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code')?.innerText ?? pre.innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 1200);
      });
    });
    pre.appendChild(btn);
  });

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Tiny safe Markdown → HTML (escapes, dann strukturiert).
function renderMarkdown(src: string): string {
  if (!src) return '';

  const fences: { lang: string; code: string }[] = [];
  src = src.replace(/```([a-zA-Z0-9_+\-]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const i = fences.push({ lang: (lang as string) || '', code: code as string }) - 1;
    return ` FENCE${i} `;
  });

  src = escapeHtml(src);
  src = src.replace(/`([^`\n]+?)`/g, (_m, c) => `<code>${c}</code>`);

  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    if (/^&gt;\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^&gt;\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^&gt;\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      out.push('<ul>' + buf.map((b) => `<li>${inline(b)}</li>`).join('') + '</ul>');
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      out.push('<ol>' + buf.map((b) => `<li>${inline(b)}</li>`).join('') + '</ol>');
      continue;
    }

    const fence = line.match(/^ FENCE(\d+) $/);
    if (fence) {
      const f = fences[+fence[1]];
      const langLabel = f.lang ? `<span class="lang">${escapeHtml(f.lang)}</span>` : '';
      const cls = f.lang ? ` class="lang-${escapeHtml(f.lang)}"` : '';
      out.push(`<pre>${langLabel}<code${cls}>${escapeHtml(f.code.replace(/\n$/, ''))}</code></pre>`);
      i++;
      continue;
    }

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^&gt;\s?/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i]) &&
      !/^ FENCE\d+ $/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(buf.join('\n').replace(/\n/g, '<br>'))}</p>`);
  }

  return out.join('');
}

function inline(s: string): string {
  s = s.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_\n]+?)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_])_([^_\n]+?)_/g, '$1<em>$2</em>');
  s = s.replace(
    /\[([^\]]+)\]\(((?:https?:|mailto:)[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return s;
}

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

// ── status & state helpers ─────────────────────────────────────
function setStatus(msg: string, kind: '' | 'busy' | 'ok' | 'error' = '') {
  statusEl.className = `gen-status ${kind}`.trim();
  if (kind === 'busy') {
    statusEl.innerHTML = `${escapeHtml(msg)} <span class="dots"><span></span><span></span><span></span></span>`;
  } else {
    statusEl.textContent = msg;
  }
}

function loadState(): State | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as State) : null;
  } catch {
    return null;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — silently ignore */
  }
}

async function copyToClipboard(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    setStatus('markdown kopiert', 'ok');
  } catch {
    setStatus('clipboard nicht verfügbar', 'error');
  }
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadHtml() {
  if (!state.lastMarkdown) return;
  const title = (state.lastMarkdown.match(/^#\s+(.+)$/m)?.[1] ?? state.topic ?? 'Lernseite').trim();
  const body = renderMarkdown(state.lastMarkdown);
  const html = `<!DOCTYPE html>
<html lang="de"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body { font: 16px/1.6 Georgia, serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; background: #06000e; color: #c8c0d8; }
  h1, h2, h3 { color: #fff; }
  h2 { border-bottom: 1px solid rgba(107,0,204,.4); padding-bottom: .3rem; margin-top: 2rem; }
  pre { background: rgba(0,0,0,.5); padding: 1rem; border-radius: 4px; overflow: auto; font-family: 'Courier New', monospace; font-size: .85rem; }
  code { background: rgba(0,0,0,.4); padding: 1px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: .9em; color: #ffd2b8; }
  pre code { background: transparent; padding: 0; color: #e7e7e7; }
  blockquote { border-left: 3px solid #6b00cc; padding-left: 1rem; opacity: .85; font-style: italic; margin: 1rem 0; }
  a { color: #00d4c8; }
</style>
</head><body>${body}</body></html>`;
  download(`${slugify(state.topic) || 'lernseite'}.html`, html, 'text/html');
}

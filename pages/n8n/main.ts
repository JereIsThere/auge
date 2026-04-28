import { requireAuth, logout } from '../auth';

requireAuth();

document.getElementById('btn-logout')!.addEventListener('click', logout);

// ── Config ───────────────────────────────────────────────────────

const CFG_KEY = 'auge_n8n_cfg';

function loadBaseUrl(): string {
  return localStorage.getItem(CFG_KEY) ?? '';
}
function saveBaseUrl(url: string) {
  localStorage.setItem(CFG_KEY, url);
}

const baseUrlInput = document.getElementById('cfg-base-url') as HTMLInputElement;
baseUrlInput.value = loadBaseUrl();
baseUrlInput.addEventListener('change', () => saveBaseUrl(baseUrlInput.value.trim().replace(/\/$/, '')));

function getBaseUrl(): string {
  return baseUrlInput.value.trim().replace(/\/$/, '');
}

// ── Log ──────────────────────────────────────────────────────────

const logEl = document.getElementById('log-output')!;

function log(msg: string) {
  const now  = new Date().toLocaleTimeString('de-DE', { hour12: false });
  const line = document.createElement('div');
  line.className   = 'log-line';
  line.textContent = `[${now}] ${msg}`;
  logEl.prepend(line);
  if (logEl.children.length > 80) logEl.lastElementChild?.remove();
}

// ── Image helpers ────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function base64ToObjectUrl(b64: string, mime = 'image/png'): string {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

// ── Fashion Agent ─────────────────────────────────────────────────

let selectedFile: File | null = null;

const uploadArea  = document.getElementById('upload-area')   as HTMLDivElement;
const fileInput   = document.getElementById('file-input')    as HTMLInputElement;
const previewWrap = document.getElementById('preview-wrap')  as HTMLDivElement;
const previewImg  = document.getElementById('preview-img')   as HTMLImageElement;
const btnClear    = document.getElementById('btn-clear')     as HTMLButtonElement;
const btnRun      = document.getElementById('btn-run-fashion') as HTMLButtonElement;
const runText     = document.getElementById('run-text')      as HTMLSpanElement;
const runSpinner  = document.getElementById('run-spinner')   as HTMLSpanElement;
const runStatus   = document.getElementById('run-status')    as HTMLSpanElement;
const outputImg   = document.getElementById('output-img')    as HTMLImageElement;
const outputPlaceholder = document.getElementById('output-placeholder') as HTMLElement;
const geminiOut   = document.getElementById('gemini-prompt-out') as HTMLDivElement;
const geminiText  = document.getElementById('gemini-prompt-text') as HTMLParagraphElement;
const btnDownload = document.getElementById('btn-download')  as HTMLButtonElement;

function selectFile(file: File) {
  if (file.size > 10 * 1024 * 1024) { runStatus.textContent = '⚠ Datei zu groß (max 10 MB)'; return; }
  selectedFile = file;
  const url = URL.createObjectURL(file);
  previewImg.src = url;
  previewWrap.hidden = false;
  uploadArea.style.display = 'none';
  btnRun.disabled = false;
  runStatus.textContent = '';
}

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
fileInput.addEventListener('change', () => { if (fileInput.files?.[0]) selectFile(fileInput.files[0]); });

uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer?.files[0];
  if (file) selectFile(file);
});

btnClear.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  previewWrap.hidden = true;
  uploadArea.style.display = '';
  btnRun.disabled = true;
  URL.revokeObjectURL(previewImg.src);
});

btnRun.addEventListener('click', async () => {
  if (!selectedFile) return;
  const base = getBaseUrl();
  if (!base) { runStatus.textContent = '⚠ Base-URL fehlt.'; return; }

  const promptOverride = (document.getElementById('prompt-override') as HTMLTextAreaElement).value.trim();
  const aspectRatio    = (document.getElementById('aspect-ratio') as HTMLSelectElement).value;

  btnRun.disabled  = true;
  runText.textContent = 'Läuft…';
  runSpinner.hidden   = false;
  runStatus.textContent = '';
  geminiOut.hidden = true;

  try {
    const imageBase64 = await fileToBase64(selectedFile);
    const body: Record<string, unknown> = {
      image:       imageBase64,
      mimeType:    selectedFile.type || 'image/jpeg',
      aspectRatio,
    };
    if (promptOverride) body.promptOverride = promptOverride;

    log(`→ POST ${base}/webhook/fashion-agent`);

    const res = await fetch(`${base}/webhook/fashion-agent`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => res.statusText);
      throw new Error(`HTTP ${res.status}: ${txt}`);
    }

    const data = await res.json() as Record<string, unknown>;
    log(`✓ Antwort erhalten (${JSON.stringify(data).length} Zeichen)`);

    // Ergebnis auswerten
    const imgB64 = extractImage(data);
    if (imgB64) {
      const objUrl = base64ToObjectUrl(imgB64);
      outputImg.src = objUrl;
      outputImg.hidden = false;
      outputPlaceholder.hidden = true;
      btnDownload.hidden = false;
      btnDownload.onclick = () => {
        const a = document.createElement('a');
        a.href     = objUrl;
        a.download = `fashion_${Date.now()}.png`;
        a.click();
      };
    } else if (typeof data.url === 'string') {
      outputImg.src = data.url;
      outputImg.hidden = false;
      outputPlaceholder.hidden = true;
      btnDownload.hidden = false;
      btnDownload.onclick = () => window.open(data.url as string, '_blank');
    } else {
      runStatus.textContent = 'Kein Bild in der Antwort. Roh-Daten im Log.';
      log('Antwort: ' + JSON.stringify(data).slice(0, 300));
    }

    // Gemini-Prompt anzeigen falls vorhanden
    const prompt = extractGeminiPrompt(data);
    if (prompt) {
      geminiText.textContent = prompt;
      geminiOut.hidden = false;
    }

    runStatus.textContent = '✓ Fertig.';
  } catch (err) {
    runStatus.textContent = `✗ ${String(err)}`;
    log(`✗ Fashion-Agent Fehler: ${String(err)}`);
  } finally {
    btnRun.disabled  = false;
    runText.textContent = 'Generieren';
    runSpinner.hidden   = true;
  }
});

function extractImage(data: Record<string, unknown>): string | null {
  // Vertex AI Imagen response format
  if (data.predictions && Array.isArray(data.predictions)) {
    const pred = (data.predictions as Array<Record<string, unknown>>)[0];
    if (pred?.bytesBase64Encoded) return pred.bytesBase64Encoded as string;
  }
  // Einfaches { image: "base64..." }
  if (typeof data.image === 'string') return data.image;
  if (typeof data.imageBase64 === 'string') return data.imageBase64;
  return null;
}

function extractGeminiPrompt(data: Record<string, unknown>): string | null {
  if (typeof data.generatedPrompt === 'string') return data.generatedPrompt;
  if (typeof data.prompt === 'string') return data.prompt;
  if (data.geminiResponse && typeof (data.geminiResponse as Record<string,unknown>).text === 'string') {
    return (data.geminiResponse as Record<string,unknown>).text as string;
  }
  return null;
}

// ── Custom Webhook ───────────────────────────────────────────────

document.getElementById('btn-custom')!.addEventListener('click', async () => {
  const base   = getBaseUrl();
  const path   = (document.getElementById('custom-path')   as HTMLInputElement).value.trim();
  const method = (document.getElementById('custom-method') as HTMLSelectElement).value;
  const body   = (document.getElementById('custom-body')   as HTMLTextAreaElement).value.trim();
  const result = document.getElementById('custom-result')  as HTMLPreElement;

  if (!base || !path) { log('⚠ Base-URL oder Pfad fehlt.'); return; }

  log(`→ ${method} ${base}${path}`);
  result.hidden = true;

  try {
    const opts: RequestInit = { method };
    if (method === 'POST' && body) {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body    = body;
    }
    const res  = await fetch(`${base}${path}`, opts);
    const text = await res.text();
    let display: string;
    try { display = JSON.stringify(JSON.parse(text), null, 2); } catch { display = text; }
    result.textContent = `HTTP ${res.status}\n\n${display}`;
    result.hidden = false;
    log(`✓ ${method} ${path} → ${res.status}`);
  } catch (err) {
    result.textContent = String(err);
    result.hidden = false;
    log(`✗ ${String(err)}`);
  }
});

log('n8n Workflow-Trigger geladen.');

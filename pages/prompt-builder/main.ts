type NodeType = 'system' | 'user' | 'assistant' | 'variable';

interface PromptNode {
  id: string;
  type: NodeType;
  content: string;
  varName: string;
  varValue: string;
}

const NODE_META: Record<NodeType, { label: string; color: string; placeholder: string }> = {
  system: {
    label: 'SYSTEM',
    color: '#6b00cc',
    placeholder: 'Du bist ein hilfreicher Assistent. Antworte präzise und strukturiert.',
  },
  user: {
    label: 'USER',
    color: '#00d4c8',
    placeholder: 'Erkläre {{thema}} in einfachen Worten und gib ein Beispiel.',
  },
  assistant: {
    label: 'ASSISTANT',
    color: '#d4a200',
    placeholder: 'Beispielantwort (few-shot prompt)...',
  },
  variable: {
    label: '✱ VAR',
    color: '#ff7c3a',
    placeholder: '',
  },
};

// --- State ---

let nodes: PromptNode[] = [];
let counter = 0;

function uid(): string {
  return `node_${++counter}_${Date.now().toString(36)}`;
}

// --- Core operations ---

function addNode(type: NodeType): void {
  const node: PromptNode = {
    id: uid(),
    type,
    content: '',
    varName: type === 'variable' ? `var${counter}` : '',
    varValue: '',
  };
  nodes.push(node);
  persist();
  renderAll();
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>(`[data-node-id="${node.id}"] textarea, [data-node-id="${node.id}"] input[type="text"]`);
    el?.focus();
  });
}

function removeNode(id: string): void {
  nodes = nodes.filter(n => n.id !== id);
  persist();
  renderAll();
}

function moveNode(id: string, dir: -1 | 1): void {
  const i = nodes.findIndex(n => n.id === id);
  const j = i + dir;
  if (j < 0 || j >= nodes.length) return;
  [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
  persist();
  renderAll();
}

// --- Variable resolution ---

function getVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const n of nodes) {
    if (n.type === 'variable' && n.varName.trim()) {
      vars[n.varName.trim()] = n.varValue;
    }
  }
  return vars;
}

function applyVars(text: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (t, [k, v]) => t.replaceAll(`{{${k}}}`, v || `{{${k}}}`),
    text
  );
}

// --- Prompt assembly ---

function assemblePrompt(): string {
  const vars = getVars();
  return nodes
    .filter(n => n.type !== 'variable')
    .map(n => `[${NODE_META[n.type].label}]\n${applyVars(n.content, vars)}`)
    .join('\n\n---\n\n');
}

function buildGeminiPayload(): Record<string, unknown> {
  const vars = getVars();
  const systemNodes = nodes.filter(n => n.type === 'system');
  const convNodes = nodes.filter(n => n.type === 'user' || n.type === 'assistant');

  const payload: Record<string, unknown> = {};

  if (systemNodes.length > 0) {
    payload.system_instruction = {
      parts: [{ text: systemNodes.map(n => applyVars(n.content, vars)).join('\n\n') }],
    };
  }

  payload.contents = convNodes.map(n => ({
    role: n.type === 'user' ? 'user' : 'model',
    parts: [{ text: applyVars(n.content, vars) }],
  }));

  return payload;
}

// --- DOM helpers ---

function insertAtCursor(ta: HTMLTextAreaElement, text: string): void {
  const s = ta.selectionStart;
  const e = ta.selectionEnd;
  ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
  const pos = s + text.length;
  ta.setSelectionRange(pos, pos);
  ta.focus();
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}

function autoResize(ta: HTMLTextAreaElement): void {
  ta.style.height = 'auto';
  ta.style.height = `${Math.max(ta.scrollHeight, 72)}px`;
}

function mkBtn(text: string, title: string, cls: string, fn: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = cls;
  b.textContent = text;
  b.title = title;
  b.addEventListener('click', fn);
  return b;
}

function mkField(labelText: string, inputEl: HTMLElement): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'pb-field';
  const lbl = document.createElement('label');
  lbl.className = 'pb-flbl';
  lbl.textContent = labelText;
  wrap.append(lbl, inputEl);
  return wrap;
}

// --- Node rendering ---

function makeNodeEl(node: PromptNode, idx: number, total: number): HTMLElement {
  const meta = NODE_META[node.type];

  const outer = document.createElement('div');
  outer.className = 'pb-node';
  outer.dataset.nodeId = node.id;
  outer.setAttribute('role', 'listitem');

  // Connector above (skip for first)
  if (idx > 0) {
    const conn = document.createElement('div');
    conn.className = 'pb-conn';
    conn.setAttribute('aria-hidden', 'true');
    outer.appendChild(conn);
  }

  const card = document.createElement('div');
  card.className = `pb-card pb-card--${node.type}`;
  card.style.setProperty('--nc', meta.color);

  // Header
  const hdr = document.createElement('div');
  hdr.className = 'pb-hdr';

  const badge = document.createElement('span');
  badge.className = 'pb-badge';
  badge.textContent = meta.label;

  const ctrls = document.createElement('div');
  ctrls.className = 'pb-ctrls';

  const upBtn = mkBtn('↑', 'Nach oben', 'pb-ibtn', () => moveNode(node.id, -1));
  const dnBtn = mkBtn('↓', 'Nach unten', 'pb-ibtn', () => moveNode(node.id, 1));
  const delBtn = mkBtn('×', 'Node löschen', 'pb-ibtn pb-ibtn--del', () => removeNode(node.id));

  upBtn.disabled = idx === 0;
  dnBtn.disabled = idx === total - 1;

  ctrls.append(upBtn, dnBtn, delBtn);
  hdr.append(badge, ctrls);
  card.appendChild(hdr);

  // Body
  const body = document.createElement('div');
  body.className = 'pb-body';

  if (node.type === 'variable') {
    const nameInp = document.createElement('input');
    nameInp.type = 'text';
    nameInp.className = 'pb-inp';
    nameInp.value = node.varName;
    nameInp.placeholder = 'variable_name';

    const valInp = document.createElement('input');
    valInp.type = 'text';
    valInp.className = 'pb-inp';
    valInp.value = node.varValue;
    valInp.placeholder = 'Standardwert...';

    const hint = document.createElement('p');
    hint.className = 'pb-var-hint';
    hint.textContent = `Verwende {{${node.varName || 'name'}}} in anderen Nodes`;

    nameInp.addEventListener('input', () => {
      node.varName = nameInp.value.replace(/\s/g, '_');
      nameInp.value = node.varName;
      hint.textContent = `Verwende {{${node.varName || 'name'}}} in anderen Nodes`;
      persist();
      updatePreview();
    });

    valInp.addEventListener('input', () => {
      node.varValue = valInp.value;
      persist();
      updatePreview();
    });

    body.append(mkField('Name', nameInp), mkField('Wert', valInp), hint);
  } else {
    const tw = document.createElement('div');
    tw.className = 'pb-tw';

    const ta = document.createElement('textarea');
    ta.className = 'pb-ta';
    ta.value = node.content;
    ta.placeholder = meta.placeholder;
    ta.rows = 3;
    ta.spellcheck = false;

    ta.addEventListener('input', () => {
      node.content = ta.value;
      autoResize(ta);
      persist();
      updatePreview();
    });

    requestAnimationFrame(() => autoResize(ta));

    // Wildcard button — inserts {{placeholder}} at cursor
    const wcBtn = document.createElement('button');
    wcBtn.className = 'pb-wc';
    wcBtn.textContent = '✱';
    wcBtn.title = '{{placeholder}} einfügen';
    wcBtn.addEventListener('click', () => {
      // If there are variable nodes, offer to pick one
      const varNames = nodes
        .filter(n => n.type === 'variable' && n.varName.trim())
        .map(n => n.varName.trim());

      if (varNames.length > 0) {
        showVarPicker(ta, wcBtn, varNames);
      } else {
        insertAtCursor(ta, '{{placeholder}}');
      }
    });

    tw.append(ta, wcBtn);
    body.appendChild(mkField('Inhalt', tw));
  }

  card.appendChild(body);
  outer.appendChild(card);
  return outer;
}

// --- Variable picker popup ---

function showVarPicker(ta: HTMLTextAreaElement, anchor: HTMLElement, varNames: string[]): void {
  document.getElementById('pb-varpicker')?.remove();

  const picker = document.createElement('div');
  picker.id = 'pb-varpicker';
  picker.className = 'pb-varpicker';
  picker.setAttribute('role', 'listbox');
  picker.setAttribute('aria-label', 'Variable auswählen');

  const header = document.createElement('p');
  header.className = 'pb-varpicker-hdr';
  header.textContent = 'Variable einfügen';
  picker.appendChild(header);

  const insert = (name: string) => {
    insertAtCursor(ta, `{{${name}}}`);
    picker.remove();
  };

  for (const name of varNames) {
    const opt = document.createElement('button');
    opt.className = 'pb-varpicker-opt';
    opt.textContent = `{{${name}}}`;
    opt.setAttribute('role', 'option');
    opt.addEventListener('click', () => insert(name));
    picker.appendChild(opt);
  }

  const newOpt = document.createElement('button');
  newOpt.className = 'pb-varpicker-opt pb-varpicker-new';
  newOpt.textContent = '+ neue Variable';
  newOpt.addEventListener('click', () => {
    picker.remove();
    insertAtCursor(ta, '{{placeholder}}');
    addNode('variable');
  });
  picker.appendChild(newOpt);

  const rect = anchor.getBoundingClientRect();
  const scrollY = window.scrollY;
  picker.style.top = `${rect.bottom + scrollY + 4}px`;
  picker.style.left = `${rect.left}px`;

  document.body.appendChild(picker);

  const close = (e: MouseEvent) => {
    if (!picker.contains(e.target as Node) && e.target !== anchor) {
      picker.remove();
      document.removeEventListener('click', close);
    }
  };
  setTimeout(() => document.addEventListener('click', close), 0);
}

// --- Render ---

const nodesEl = document.getElementById('pb-nodes')!;
const emptyEl = document.getElementById('pb-empty')!;
const previewEl = document.getElementById('pb-preview')!;

function renderAll(): void {
  nodesEl.innerHTML = '';
  emptyEl.hidden = nodes.length > 0;

  const total = nodes.length;
  nodes.forEach((node, idx) => nodesEl.appendChild(makeNodeEl(node, idx, total)));

  updatePreview();
}

function updatePreview(): void {
  previewEl.textContent = assemblePrompt() || '(leer)';
}

// --- Gemini API ---

async function sendToGemini(): Promise<void> {
  const keyEl = document.getElementById('pb-apikey') as HTMLInputElement;
  const modelEl = document.getElementById('pb-model') as HTMLSelectElement;
  const sendBtn = document.getElementById('btn-send') as HTMLButtonElement;
  const respWrap = document.getElementById('pb-resp-wrap')!;
  const respEl = document.getElementById('pb-resp')!;
  const errEl = document.getElementById('pb-err')!;

  const apiKey = keyEl.value.trim();
  if (!apiKey) {
    showError('Bitte Gemini API Key eingeben.', errEl);
    return;
  }

  const payload = buildGeminiPayload();
  const contents = payload.contents as unknown[];
  if (!contents || contents.length === 0) {
    showError('Mindestens einen User- oder Assistant-Node hinzufügen.', errEl);
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = '⏳ Sende...';
  errEl.hidden = true;
  respWrap.hidden = true;

  try {
    const model = modelEl.value;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = (data as { error?: { message?: string } } | null)?.error?.message;
      throw new Error(msg ?? `HTTP ${res.status}`);
    }

    const text: string =
      (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] } | null)
        ?.candidates?.[0]?.content?.parts?.[0]?.text ?? '(keine Antwort)';

    respEl.textContent = text;
    respWrap.hidden = false;
  } catch (err) {
    showError(`Fehler: ${(err as Error).message}`, errEl);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = '▶ Senden';
  }
}

function showError(msg: string, el: HTMLElement): void {
  el.textContent = msg;
  el.hidden = false;
}

// --- n8n Export ---

function exportN8n(): void {
  const vars = getVars();
  const modelEl = document.getElementById('pb-model') as HTMLSelectElement;
  const model = modelEl.value;

  const varEntries = Object.entries(vars);
  const hasVars = varEntries.length > 0;

  const systemNodes = nodes.filter(n => n.type === 'system');
  const convNodes = nodes.filter(n => n.type === 'user' || n.type === 'assistant');

  // Build Gemini request body (variables substituted with n8n $json expressions)
  function n8nText(text: string): string {
    // Replace {{varName}} → n8n $json["varName"] expression
    const parts = text.split(/({{[^}]+}})/g);
    if (parts.length === 1) return text;
    // If mixing static + dynamic, we leave static text as-is and note the vars
    // For simplicity in the JSON body, substitute defaults and add comment
    return applyVars(text, vars);
  }

  const bodyObj: Record<string, unknown> = {};
  if (systemNodes.length > 0) {
    bodyObj.system_instruction = {
      parts: [{ text: systemNodes.map(n => n8nText(n.content)).join('\n\n') }],
    };
  }
  bodyObj.contents = convNodes.map(n => ({
    role: n.type === 'user' ? 'user' : 'model',
    parts: [{ text: n8nText(n.content) }],
  }));

  // Build n8n workflow nodes
  const wfNodes: unknown[] = [
    {
      parameters: {},
      id: crypto.randomUUID(),
      name: 'Start',
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [0, 300],
    },
  ];

  if (hasVars) {
    wfNodes.push({
      parameters: {
        fields: {
          values: varEntries.map(([name, value]) => ({ name, stringValue: value })),
        },
        options: {},
      },
      id: crypto.randomUUID(),
      name: 'Variables',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [250, 300],
    });
  }

  wfNodes.push({
    parameters: {
      method: 'POST',
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      sendQuery: true,
      queryParameters: {
        parameters: [{ name: 'key', value: '={{ $env["GEMINI_API_KEY"] }}' }],
      },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: JSON.stringify(bodyObj, null, 2),
      options: {},
    },
    id: crypto.randomUUID(),
    name: 'Gemini API',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [hasVars ? 500 : 250, 300],
  });

  const connections: Record<string, unknown> = {
    Start: {
      main: [[{ node: hasVars ? 'Variables' : 'Gemini API', type: 'main', index: 0 }]],
    },
  };
  if (hasVars) {
    connections['Variables'] = {
      main: [[{ node: 'Gemini API', type: 'main', index: 0 }]],
    };
  }

  const workflow = {
    name: 'Prompt Builder — Gemini',
    nodes: wfNodes,
    connections,
    active: false,
    settings: { executionOrder: 'v1' },
    versionId: crypto.randomUUID(),
    meta: { templateCredsSetupCompleted: true },
    pinData: {},
    tags: [],
  };

  const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'prompt-builder-workflow.json';
  a.click();
  URL.revokeObjectURL(url);
}

// --- Persistence ---

const STORAGE_KEY = 'pb_state_v1';

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, counter }));
}

function loadPersisted(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as { nodes?: PromptNode[]; counter?: number };
    if (Array.isArray(saved.nodes)) {
      nodes = saved.nodes;
      counter = saved.counter ?? saved.nodes.length;
    }
  } catch {
    // ignore corrupt storage
  }
}

// --- Init ---

function init(): void {
  loadPersisted();

  // Persist API key separately (never included in node state)
  const keyEl = document.getElementById('pb-apikey') as HTMLInputElement;
  const savedKey = localStorage.getItem('pb_apikey');
  if (savedKey) keyEl.value = savedKey;
  keyEl.addEventListener('input', () => localStorage.setItem('pb_apikey', keyEl.value));

  // Toolbar: add nodes
  document.getElementById('pb-toolbar')!.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-type]');
    if (btn?.dataset.type) addNode(btn.dataset.type as NodeType);
  });

  document.getElementById('btn-clear')!.addEventListener('click', () => {
    if (nodes.length === 0 || confirm('Alle Nodes löschen?')) {
      nodes = [];
      counter = 0;
      persist();
      renderAll();
    }
  });

  document.getElementById('btn-export-n8n')!.addEventListener('click', exportN8n);
  document.getElementById('btn-send')!.addEventListener('click', () => void sendToGemini());

  document.getElementById('btn-copy')!.addEventListener('click', () => {
    const btn = document.getElementById('btn-copy')!;
    navigator.clipboard.writeText(assemblePrompt()).then(() => {
      const orig = btn.textContent!;
      btn.textContent = '✓ Kopiert';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    }).catch(() => {});
  });

  renderAll();
}

init();

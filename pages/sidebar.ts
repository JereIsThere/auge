import rawPages from './pages.json';
import rawDomains from './domains.json';

type Kind = 'topic' | 'page' | 'comingsoon' | 'category';
type Status = 'todo' | 'in-progress' | 'finished' | 'archived';
interface Page { slug: string; kind: Kind; title: string; status: Status; category: string; levels?: string[] }
interface DomainGroup { id: string; label: string; description: string; liveCount: number; color?: string; emoji?: string; }
interface Domain { id: string; label: string; description: string; groups: DomainGroup[]; color?: string; emoji?: string; }

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const stripEmoji = (s: string) =>
  s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').trim();

const displayTitle = (p: Page) =>
  p.title === p.slug
    ? p.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : stripEmoji(p.title);

// Domain/group lookup maps
const domainData = rawDomains as Domain[];
const groupMap = new Map<string, { d: Domain; g: DomainGroup }>();
for (const d of domainData) {
  for (const g of d.groups) groupMap.set(g.id, { d, g });
}

function render(): void {
  const el = document.getElementById('sidebar');
  if (!el) return;

  const pages   = rawPages as Page[];
  const activeSlug = location.pathname.replace(/^\/+|\/+$/g, '');
  const live    = pages.filter(p => p.kind !== 'comingsoon' && p.kind !== 'category' && !p.category.startsWith('_'));
  const soon    = pages.filter(p => p.kind === 'comingsoon');

  const linkHtml = (p: Page) => {
    const a   = p.slug === activeSlug;
    const wip = p.status === 'in-progress' ? ' <span class="sb-wip" aria-label="aktiv">◉</span>' : '';
    return `<li class="sb-item${a ? ' is-active' : ''}">
<a href="/${esc(p.slug)}/" class="sb-link${a ? ' is-current' : ''}">
<span class="sb-dot" aria-hidden="true">${a ? '▸' : '·'}</span>
<span class="sb-lbl">${esc(displayTitle(p))}</span>${wip}
</a>
</li>`;
  };

  let h = `<div class="sb-top">
  <a href="/" class="sb-brand" aria-label="Startseite">
    <span class="sb-sym" aria-hidden="true">◈</span>
    <span class="sb-wordmark">AUGE</span>
  </a>
  <button class="sb-x" id="sb-x" aria-label="Sidebar schließen">✕</button>
</div>
<div class="sb-search-row">
  <input id="sb-q" class="sb-q" type="search" placeholder="suchen…" autocomplete="off" spellcheck="false" aria-label="Topic suchen">
  <button class="sb-cmd-btn" id="sb-cmd-open" title="Schnellsuche öffnen (⌘K)">⌘K</button>
</div>
<nav class="sb-nav" id="sb-nav" aria-label="Topics">
`;

  const usedSlugs = new Set<string>();

  // Domain → Group → Topics
  for (const d of domainData) {
    const dGroups: string[] = [];
    for (const g of d.groups) {
      const items = live.filter(p => p.category === g.id);
      if (!items.length) continue;
      items.forEach(p => usedSlugs.add(p.slug));
      dGroups.push(`<section class="sb-section" data-cat="${esc(g.id)}"${g.color ? ` style="--gc:${g.color}"` : ''}>
<span class="sb-section-hd">${g.emoji ? `<span aria-hidden="true">${g.emoji}</span> ` : ''}${esc(g.label)}</span>
<ul class="sb-list">${items.map(linkHtml).join('')}</ul>
</section>`);
    }
    if (!dGroups.length) continue;
    h += `<div class="sb-domain" data-domain="${esc(d.id)}"${d.color ? ` style="--dc:${d.color}"` : ''}>
<span class="sb-domain-hd">${d.emoji ? `<span aria-hidden="true">${d.emoji}</span> ` : ''}${esc(d.label)}</span>
${dGroups.join('')}</div>`;
  }

  // Standalone pages not in any domain group
  const other = live.filter(p => !usedSlugs.has(p.slug));
  const otherCats = [...new Set(other.map(p => p.category))].sort();
  for (const cat of otherCats) {
    const items = other.filter(p => p.category === cat);
    const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ');
    h += `<section class="sb-section" data-cat="${esc(cat)}">
<span class="sb-section-hd">${esc(label)}</span>
<ul class="sb-list">${items.map(linkHtml).join('')}</ul>
</section>`;
  }

  if (soon.length) {
    const shown = soon.slice(0, 7);
    h += `<section class="sb-section sb-section-soon">
<span class="sb-section-hd">GEPLANT</span>
<ul class="sb-list">
${shown.map(p => `<li class="sb-item sb-item-dim">
<span class="sb-link sb-link-dim">
<span class="sb-dot" aria-hidden="true">·</span>
<span class="sb-lbl">${esc(displayTitle(p))}</span>
</span>
</li>`).join('')}
${soon.length > 7 ? `<li class="sb-item"><span class="sb-more">+${soon.length - 7} weitere</span></li>` : ''}
</ul>
</section>`;
  }

  h += `</nav>`;
  el.innerHTML = h;

  const qEl  = document.getElementById('sb-q') as HTMLInputElement | null;
  const navEl = document.getElementById('sb-nav');
  qEl?.addEventListener('input', () => {
    const v = qEl.value.toLowerCase().trim();
    navEl?.querySelectorAll<HTMLElement>('.sb-item').forEach(li => {
      const t = li.querySelector('.sb-lbl')?.textContent?.toLowerCase() ?? '';
      li.style.display = !v || t.includes(v) ? '' : 'none';
    });
    navEl?.querySelectorAll<HTMLElement>('.sb-section').forEach(sec => {
      const any = [...sec.querySelectorAll<HTMLElement>('.sb-item')].some(l => l.style.display !== 'none');
      sec.style.display = any ? '' : 'none';
    });
    navEl?.querySelectorAll<HTMLElement>('.sb-domain').forEach(dom => {
      const any = [...dom.querySelectorAll<HTMLElement>('.sb-section')].some(s => s.style.display !== 'none');
      dom.style.display = any ? '' : 'none';
    });
  });

  document.getElementById('sb-x')?.addEventListener('click', closeSb);
  document.getElementById('sb-cmd-open')?.addEventListener('click', () => openCmd());
}

function initToggle(): void {
  document.getElementById('sb-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.setAttribute('data-open', '');
    document.getElementById('sb-overlay')?.setAttribute('data-open', '');
  });
  document.getElementById('sb-overlay')?.addEventListener('click', closeSb);
}

function closeSb(): void {
  document.getElementById('sidebar')?.removeAttribute('data-open');
  document.getElementById('sb-overlay')?.removeAttribute('data-open');
}

// ── Command Palette ──────────────────────────────────────────────

// Group label lookup for command palette display
const groupLabelMap = new Map<string, string>();
for (const d of domainData) {
  for (const g of d.groups) groupLabelMap.set(g.id, g.label);
}

let cmdIdx = -1;

function openCmd(): void {
  const overlay = document.getElementById('cmd');
  const qEl = document.getElementById('cmd-q') as HTMLInputElement | null;
  if (!overlay || !qEl) return;
  overlay.removeAttribute('hidden');
  qEl.value = '';
  cmdIdx = -1;
  renderCmdList('');
  requestAnimationFrame(() => qEl.focus());
}

function closeCmd(): void {
  document.getElementById('cmd')?.setAttribute('hidden', '');
}

function renderCmdList(q: string): void {
  const listEl = document.getElementById('cmd-list');
  if (!listEl) return;
  const all = (rawPages as Page[]).filter(p => p.kind !== 'comingsoon' && p.kind !== 'category' && !p.category.startsWith('_'));
  const filtered = q
    ? all.filter(p =>
        (p.title || p.slug).toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      )
    : all;

  const items = filtered.slice(0, 14);
  listEl.innerHTML = items.map((p, i) => {
    const catLabel = groupLabelMap.get(p.category) ?? p.category.replace(/-/g, ' ');
    const gInfo = groupMap.get(p.category);
    const emojiStr = gInfo?.g.emoji ? `<span aria-hidden="true">${gInfo.g.emoji}</span> ` : '';
    return `<li class="cmd-item${i === cmdIdx ? ' is-sel' : ''}" role="option" aria-selected="${i === cmdIdx}" data-href="/${esc(p.slug)}/">
  <span class="cmd-cat">${emojiStr}${esc(catLabel)}</span>
  <span class="cmd-title">${esc(displayTitle(p))}</span>
  <span class="cmd-arr" aria-hidden="true">→</span>
</li>`;
  }).join('');

  listEl.querySelectorAll<HTMLElement>('.cmd-item').forEach((li, i) => {
    li.addEventListener('mouseenter', () => { cmdIdx = i; highlightCmd(); });
    li.addEventListener('click', () => {
      const href = li.dataset.href;
      if (href) { closeCmd(); location.href = href; }
    });
  });
}

function highlightCmd(): void {
  document.getElementById('cmd-list')?.querySelectorAll<HTMLElement>('.cmd-item').forEach((li, i) => {
    li.classList.toggle('is-sel', i === cmdIdx);
    li.setAttribute('aria-selected', String(i === cmdIdx));
    if (i === cmdIdx) li.scrollIntoView({ block: 'nearest' });
  });
}

function initCommandPalette(): void {
  const overlay = document.getElementById('cmd');
  const qEl = document.getElementById('cmd-q') as HTMLInputElement | null;
  if (!overlay || !qEl) return;

  qEl.addEventListener('input', () => {
    cmdIdx = -1;
    renderCmdList(qEl.value.toLowerCase().trim());
  });

  qEl.addEventListener('keydown', (e) => {
    const items = document.getElementById('cmd-list')?.querySelectorAll<HTMLElement>('.cmd-item');
    if (!items) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cmdIdx = Math.min(cmdIdx + 1, items.length - 1);
      highlightCmd();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cmdIdx = Math.max(cmdIdx - 1, 0);
      highlightCmd();
    } else if (e.key === 'Enter') {
      const sel = items[cmdIdx];
      if (sel?.dataset.href) { closeCmd(); location.href = sel.dataset.href; }
    } else if (e.key === 'Escape') {
      closeCmd();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCmd();
  });

  document.getElementById('cmd-close')?.addEventListener('click', closeCmd);
  document.getElementById('cmd-open-btn')?.addEventListener('click', openCmd);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      overlay.hasAttribute('hidden') ? openCmd() : closeCmd();
    }
    if (e.key === '/' && !(e.target as HTMLElement).matches('input, textarea, [contenteditable]')) {
      e.preventDefault();
      if (overlay.hasAttribute('hidden')) openCmd();
    }
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
      closeCmd();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { render(); initToggle(); initCommandPalette(); });
} else {
  render();
  initToggle();
  initCommandPalette();
}

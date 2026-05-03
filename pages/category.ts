import pages from './pages.json';

type Status = 'todo' | 'in-progress' | 'finished' | 'archived';
type Kind = 'topic' | 'page' | 'comingsoon' | 'category';

interface TopicMeta {
  slug: string;
  kind: Kind;
  title: string;
  description: string;
  levels?: string[];
  status: Status;
  category: string;
}

const escape = (s: string) =>
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const stripEmoji = (s: string) =>
  s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').trim();

const displayTitle = (p: TopicMeta) =>
  stripEmoji(p.title || p.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

const cat = document.body.dataset.category ?? '';
const el  = document.getElementById('cat-content');

if (el && cat) {
  const all  = (pages as unknown as TopicMeta[]).filter(p => p.category === cat);
  const live = all.filter(p => p.kind !== 'comingsoon');
  const soon = all.filter(p => p.kind === 'comingsoon');

  const card = (p: TopicMeta, locked = false) => {
    const lvls = (p.levels ?? []).map(l =>
      `<span class="lvl lvl-${escape(l)}" title="${escape(l)}">${l[0].toUpperCase()}</span>`
    ).join('');
    const statusLabel = p.status === 'in-progress' ? 'aktiv' : p.status === 'finished' ? '' : (p.status ?? '');
    const statusHtml = statusLabel
      ? `<span class="card-status status-${escape(p.status)}">${escape(statusLabel)}</span>`
      : '';
    const inner = `
  <span class="card-name">${escape(displayTitle(p))}</span>
  ${p.description ? `<span class="card-desc">${escape(p.description)}</span>` : ''}
  <div class="card-meta">
    ${lvls ? `<div class="card-levels">${lvls}</div>` : ''}
    ${statusHtml}
  </div>`;
    return locked
      ? `<div class="card card-locked" aria-hidden="true">${inner}\n</div>`
      : `<a href="/${escape(p.slug)}/" class="card">${inner}\n</a>`;
  };

  el.innerHTML = `<div class="cat-grid">\n${live.map(p => card(p)).join('')}${soon.map(p => card(p, true)).join('')}</div>`;
}

import pages from './pages.json';

type Status = 'todo' | 'in-progress' | 'finished' | 'archived';
type Kind = 'topic' | 'page' | 'comingsoon';

interface TopicMeta {
  slug: string;
  kind: Kind;
  title: string;
  description: string;
  levels?: string[];
  status: Status;
  category: string;
  tags?: string[];
  order?: number;
  hidden?: boolean;
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderCard(p: TopicMeta, index: number): string {
  const num = String(index + 1).padStart(2, '0');
  const cyr = escape(p.slug.toUpperCase());
  const title = escape(p.title);
  const desc = p.description ? `<span class="card-desc">${escape(p.description)}</span>` : '';
  const levels = p.levels?.length
    ? `<span class="card-levels" aria-label="Levels">${p.levels.map(l =>
        `<span class="lvl lvl-${l}" title="${escape(l)}">${l[0]}</span>`
      ).join('')}</span>`
    : '';
  const statusBadge = `<span class="card-status status-${p.status}">${escape(p.status)}</span>`;

  if (p.kind === 'comingsoon') {
    return `<div class="card card-locked" aria-disabled="true">
      <div class="card-preview"><span class="card-num">${num}</span></div>
      <div class="card-body">
        <span class="card-name">${escape(p.slug)}</span>
        <span class="card-cyr">${cyr}</span>
        ${statusBadge}
      </div>
    </div>`;
  }
  return `<a href="/${p.slug}/" class="card card-${p.kind}">
    <div class="card-preview">
      <img src="/${p.slug}/preview.jpg" alt="" loading="lazy" onerror="this.style.display='none'">
      <span class="card-num">${num}</span>
    </div>
    <div class="card-body">
      <span class="card-name">${title}</span>
      <span class="card-cyr">${cyr}</span>
      ${desc}
      <span class="card-meta">
        ${statusBadge}
        ${levels}
      </span>
      <span class="card-arr" aria-hidden="true">→</span>
    </div>
  </a>`;
}

const stack = document.querySelector<HTMLDivElement>('#links-stack');
if (stack) {
  const all = (pages as unknown as TopicMeta[]).filter(p => !p.hidden);
  const categories = [...new Set(all.map(p => p.category))].sort();
  const single = categories.length === 1;

  if (single) {
    stack.innerHTML = all.map(renderCard).join('');
  } else {
    stack.innerHTML = categories.map(cat => {
      const items = all.filter(p => p.category === cat);
      return `<section class="cat-section" aria-labelledby="cat-${cat}">
        <h2 class="cat-heading" id="cat-${cat}">${escape(cat)}</h2>
        <div class="cat-grid">
          ${items.map((p, i) => renderCard(p, i)).join('')}
        </div>
      </section>`;
    }).join('');
  }
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

initCursor();
initBackdrop();

// ── CURSOR ───────────────────────────────────────────────────
function initCursor() {
  const cur = document.getElementById('cur');
  const dot = document.getElementById('cur-dot');
  if (!cur || !dot || !finePointer) {
    cur?.remove();
    dot?.remove();
    document.body.classList.remove('cursor-hidden');
    return;
  }

  document.body.classList.add('cursor-hidden');

  let cx = innerWidth / 2;
  let cy = innerHeight / 2;
  let tx = cx;
  let ty = cy;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function frame() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    cur!.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    dot!.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  document.querySelectorAll('a').forEach((a) => {
    a.addEventListener('mouseenter', () => cur.classList.add('cur-hover'));
    a.addEventListener('mouseleave', () => cur.classList.remove('cur-hover'));
  });
}

// ── BACKDROP (Cyrillic + Embers in einem Canvas) ─────────────
function initBackdrop() {
  const cyrCanvas = document.getElementById('cyr-canvas') as HTMLCanvasElement | null;
  const emberCanvas = document.getElementById('ember-canvas') as HTMLCanvasElement | null;

  // Wir brauchen nur EIN Canvas — das zweite verstecken/entfernen
  emberCanvas?.remove();
  if (!cyrCanvas) return;

  if (reducedMotion) {
    cyrCanvas.remove();
    return;
  }

  const ctx = cyrCanvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(devicePixelRatio || 1, 2);
  const ms = { x: innerWidth / 2, y: innerHeight / 2 };

  type Glyph = { x: number; y: number; speed: number; a: number; sz: number; ch: string; tick: number; nextChange: number };
  type Ember = { x: number; y: number; vx: number; vy: number; r: number; life: number; decay: number; h: number; s: number; l: number };

  const CYR = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  const COLS: Array<[number, number, number]> = [[180, 100, 65], [270, 90, 58], [45, 100, 52]];

  let w = 0;
  let h = 0;
  let glyphs: Glyph[] = [];
  let embers: Ember[] = [];

  function resize() {
    w = innerWidth;
    h = innerHeight;
    cyrCanvas!.width = w * dpr;
    cyrCanvas!.height = h * dpr;
    cyrCanvas!.style.width = w + 'px';
    cyrCanvas!.style.height = h + 'px';
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    glyphs = Array.from({ length: Math.floor(w / 32) }, () => makeGlyph(true));
    embers = Array.from({ length: Math.min(80, Math.floor(w / 20)) }, () => makeEmber(true));
  }

  function makeGlyph(scatter: boolean): Glyph {
    return {
      x: Math.random() * w,
      y: scatter ? Math.random() * h : -20,
      speed: Math.random() * 0.35 + 0.08,
      a: Math.random() * 0.1 + 0.02,
      sz: Math.floor(Math.random() * 10 + 9),
      ch: CYR[(Math.random() * CYR.length) | 0],
      tick: 0,
      nextChange: 80 + Math.random() * 140,
    };
  }

  function makeEmber(scatter: boolean): Ember {
    const c = COLS[(Math.random() * COLS.length) | 0];
    return {
      x: Math.random() * w,
      y: scatter ? Math.random() * h : h + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.6 + 0.15),
      r: Math.random() * 2.2 + 0.4,
      life: 1,
      decay: Math.random() * 0.004 + 0.0008,
      h: c[0],
      s: c[1],
      l: c[2],
    };
  }

  document.addEventListener('mousemove', (e) => {
    ms.x = e.clientX;
    ms.y = e.clientY;
  }, { passive: true });

  let resizeTimer: number | undefined;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120) as unknown as number;
  });

  resize();

  // Throttle Glyph-Update auf ~25fps, Embers laufen voll mit rAF
  let lastGlyph = 0;
  let last = performance.now();

  function frame(now: number) {
    const dt = Math.min(33, now - last);
    last = now;
    ctx!.clearRect(0, 0, w, h);

    // Glyphs: nur alle ~40ms updaten
    const updateGlyphs = now - lastGlyph > 40;
    if (updateGlyphs) lastGlyph = now;

    ctx!.font = '11px Georgia, serif';
    for (const g of glyphs) {
      if (updateGlyphs) {
        g.tick++;
        if (g.tick > g.nextChange) {
          g.ch = CYR[(Math.random() * CYR.length) | 0];
          g.tick = 0;
          g.nextChange = 80 + Math.random() * 140;
        }
        g.y += g.speed;
        if (g.y > h + 20) {
          g.y = -20;
          g.x = Math.random() * w;
        }
      }
      ctx!.font = `${g.sz}px Georgia, serif`;
      ctx!.fillStyle = `rgba(107,0,204,${g.a})`;
      ctx!.fillText(g.ch, g.x, g.y);
    }

    // Embers
    for (const e of embers) {
      const dx = ms.x - e.x;
      const dy = ms.y - e.y;
      const d = Math.hypot(dx, dy);
      if (d < 220 && d > 0.1) {
        const f = ((220 - d) / 220) * 0.07 * 0.25;
        e.vx += (dx / d) * f;
        e.vy += (dy / d) * f;
      }
      e.vx *= 0.988;
      e.vy *= 0.988;
      e.x += e.vx * (dt / 16);
      e.y += e.vy * (dt / 16);
      e.life -= e.decay;
      if (e.life <= 0 || e.x < 0 || e.x > w || e.y < -10 || e.y > h) {
        Object.assign(e, makeEmber(false));
      }
      const a = e.life * 0.75;
      ctx!.beginPath();
      ctx!.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx!.fillStyle = `hsla(${e.h},${e.s}%,${e.l}%,${a})`;
      ctx!.fill();
      // Glow nur bei größeren Partikeln + alle 2. Frame würde ich gerne sparen,
      // aber Radial-Gradients sind teuer — wir lassen sie weg für die kleinen.
      if (e.r > 1.4) {
        const g = ctx!.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5);
        g.addColorStop(0, `hsla(${e.h},${e.s}%,${e.l}%,${a * 0.25})`);
        g.addColorStop(1, 'transparent');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(e.x, e.y, e.r * 5, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

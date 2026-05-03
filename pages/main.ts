import './sidebar';
import pages from './pages.json';

type Status = 'todo' | 'in-progress' | 'finished' | 'archived';
type Kind   = 'topic' | 'page' | 'comingsoon';

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
}

const escape = (s: string) =>
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const stripEmoji = (s: string) =>
  s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').trim();

const displayTitle = (p: TopicMeta) =>
  stripEmoji(p.title || p.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

const stack = document.getElementById('links-stack');
if (stack) {
  const all        = (pages as unknown as TopicMeta[]).filter(p => !p.category.startsWith('_'));
  const categories = [...new Set(all.map(p => p.category))].sort();

  stack.innerHTML = categories.map(cat => {
    const items = all.filter(p => p.category === cat);
    const live  = items.filter(p => p.kind !== 'comingsoon');
    const soon  = items.filter(p => p.kind === 'comingsoon');

    const liveHtml = live.map(p => {
      const lvls = (p.levels ?? []).map(l =>
        `<span class="lvl lvl-${escape(l)}" title="${escape(l)}">${l[0].toUpperCase()}</span>`
      ).join('');
      const statusLabel = p.status === 'in-progress' ? 'aktiv'
        : p.status === 'finished' ? '' : p.status ?? '';
      const statusHtml = statusLabel
        ? `<span class="card-status status-${escape(p.status)}">${escape(statusLabel)}</span>`
        : '';
      return `<a href="/${escape(p.slug)}/" class="card">
  <span class="card-name">${escape(displayTitle(p))}</span>
  ${p.description ? `<span class="card-desc">${escape(p.description)}</span>` : ''}
  <div class="card-meta">
    ${lvls ? `<div class="card-levels">${lvls}</div>` : ''}
    ${statusHtml}
  </div>
</a>`;
    }).join('');

    const soonHtml = soon.slice(0, 3).map(p =>
      `<div class="card card-locked" aria-hidden="true">
  <span class="card-name">${escape(displayTitle(p))}</span>
  ${p.description ? `<span class="card-desc">${escape(p.description)}</span>` : ''}
  <div class="card-meta"><span class="card-status status-todo">geplant</span></div>
</div>`
    ).join('');

    return `<section class="cat-section">
<h2 class="cat-heading">${escape(cat.toUpperCase())}</h2>
<div class="cat-grid">${liveHtml}${soonHtml}</div>
</section>`;
  }).join('');
}

// ── Runtime ──────────────────────────────────────────────────
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer   = matchMedia('(pointer: fine)').matches;

initCursor();
initBackdrop();

// ── CURSOR ───────────────────────────────────────────────────
function initCursor() {
  const cur = document.getElementById('cur');
  const dot = document.getElementById('cur-dot');
  if (!cur || !dot || !finePointer) {
    cur?.remove(); dot?.remove();
    document.body.classList.remove('cursor-hidden');
    return;
  }
  document.body.classList.add('cursor-hidden');
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function frame() {
    cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
    cur!.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
    dot!.style.transform = `translate3d(${tx}px,${ty}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.querySelectorAll('a').forEach(a => {
    a.addEventListener('mouseenter', () => cur.classList.add('cur-hover'));
    a.addEventListener('mouseleave', () => cur.classList.remove('cur-hover'));
  });
}

// ── BACKDROP ─────────────────────────────────────────────────
function initBackdrop() {
  const cyrCanvas = document.getElementById('cyr-canvas') as HTMLCanvasElement | null;
  document.getElementById('ember-canvas')?.remove();
  if (!cyrCanvas) return;
  if (reducedMotion) { cyrCanvas.remove(); return; }

  const ctx = cyrCanvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(devicePixelRatio || 1, 2);
  const ms  = { x: innerWidth / 2, y: innerHeight / 2 };

  type Glyph = { x:number; y:number; speed:number; a:number; sz:number; ch:string; tick:number; nextChange:number };
  type Ember = { x:number; y:number; vx:number; vy:number; r:number; life:number; decay:number; h:number; s:number; l:number };

  const CYR  = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  const COLS: Array<[number,number,number]> = [[270,80,60],[25,95,60],[200,90,55]];

  let w=0, h=0, glyphs: Glyph[]=[], embers: Ember[]=[];

  function resize() {
    w = innerWidth; h = innerHeight;
    cyrCanvas!.width  = w * dpr; cyrCanvas!.height = h * dpr;
    cyrCanvas!.style.width = w+'px'; cyrCanvas!.style.height = h+'px';
    ctx!.setTransform(dpr,0,0,dpr,0,0);
    glyphs = Array.from({length: Math.floor(w/36)}, () => mkGlyph(true));
    embers = Array.from({length: Math.min(70, Math.floor(w/22))}, () => mkEmber(true));
  }

  function mkGlyph(scatter: boolean): Glyph {
    return { x: Math.random()*w, y: scatter ? Math.random()*h : -20,
      speed: Math.random()*0.3+0.06, a: Math.random()*0.08+0.015,
      sz: Math.floor(Math.random()*9+8), ch: CYR[(Math.random()*CYR.length)|0],
      tick:0, nextChange: 90+Math.random()*150 };
  }
  function mkEmber(scatter: boolean): Ember {
    const c = COLS[(Math.random()*COLS.length)|0];
    return { x: Math.random()*w, y: scatter ? Math.random()*h : h+10,
      vx:(Math.random()-.5)*.5, vy:-(Math.random()*.55+.12),
      r: Math.random()*2+.35, life:1, decay: Math.random()*.004+.0007,
      h:c[0], s:c[1], l:c[2] };
  }

  document.addEventListener('mousemove', e => { ms.x=e.clientX; ms.y=e.clientY; }, {passive:true});
  let rt: number|undefined;
  addEventListener('resize', () => { clearTimeout(rt); rt=setTimeout(resize,120) as unknown as number; });
  resize();

  let lastG=0, last=performance.now();
  function frame(now: number) {
    const dt=Math.min(33,now-last); last=now;
    ctx!.clearRect(0,0,w,h);
    const upd=now-lastG>40; if(upd) lastG=now;
    for (const g of glyphs) {
      if(upd){ g.tick++; if(g.tick>g.nextChange){g.ch=CYR[(Math.random()*CYR.length)|0];g.tick=0;g.nextChange=90+Math.random()*150;} g.y+=g.speed; if(g.y>h+20){g.y=-20;g.x=Math.random()*w;} }
      ctx!.font=`${g.sz}px Georgia,serif`;
      ctx!.fillStyle=`rgba(139,92,246,${g.a})`;
      ctx!.fillText(g.ch,g.x,g.y);
    }
    for (const e of embers) {
      const dx=ms.x-e.x,dy=ms.y-e.y,d=Math.hypot(dx,dy);
      if(d<200&&d>.1){const f=((200-d)/200)*.06*.25;e.vx+=(dx/d)*f;e.vy+=(dy/d)*f;}
      e.vx*=.988; e.vy*=.988; e.x+=e.vx*(dt/16); e.y+=e.vy*(dt/16);
      e.life-=e.decay;
      if(e.life<=0||e.x<0||e.x>w||e.y<-10||e.y>h) Object.assign(e,mkEmber(false));
      const a=e.life*.7;
      ctx!.beginPath(); ctx!.arc(e.x,e.y,e.r,0,Math.PI*2);
      ctx!.fillStyle=`hsla(${e.h},${e.s}%,${e.l}%,${a})`; ctx!.fill();
      if(e.r>1.3){const g2=ctx!.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*5);g2.addColorStop(0,`hsla(${e.h},${e.s}%,${e.l}%,${a*.22})`);g2.addColorStop(1,'transparent');ctx!.fillStyle=g2;ctx!.beginPath();ctx!.arc(e.x,e.y,e.r*5,0,Math.PI*2);ctx!.fill();}
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// Evolventenverzahnung nach DIN 867 / ISO 53
// Alle Maße in mm, Winkel in Radiant intern

const DEG = Math.PI / 180;

interface GearParams {
  m: number;
  z: number;
  alpha: number;   // Druckwinkel [rad]
  bore: number;
  hubExtra: number;
  shift: number;   // Profilverschiebung x
}

interface GearGeometry {
  d:  number;
  da: number;
  df: number;
  db: number;
}

function gearGeometry(p: GearParams): GearGeometry {
  const d  = p.m * p.z;
  const ha = p.m * (1 + p.shift);
  const hf = p.m * (1.25 - p.shift);
  return {
    d,
    da: d + 2 * ha,
    df: d - 2 * hf,
    db: d * Math.cos(p.alpha),
  };
}

// Evolvente: Punkt auf dem Evolventen-Profil bei Parameter t (≥ 0)
function involute(rb: number, t: number): [number, number] {
  return [
    rb * (Math.cos(t) + t * Math.sin(t)),
    rb * (Math.sin(t) - t * Math.cos(t)),
  ];
}

// Winkel auf dem Grundkreis, bei dem die Evolvente den Radius r schneidet
function involuteAngleAtR(rb: number, r: number): number {
  if (r <= rb) return 0;
  return Math.sqrt((r / rb) ** 2 - 1);
}

const fmt = (n: number) => n.toFixed(4);

// Gemeinsame Hilfsfunktion: berechnet phiOffset für einen Zahn
function calcPhiOffset(p: GearParams, rb: number): number {
  const alphaP = involuteAngleAtR(rb, p.m * p.z / 2);
  const [epx, epy] = involute(rb, alphaP);
  const thetaP = Math.atan2(epy, epx);
  return Math.PI / p.z / 2 - thetaP;
}

// ── SVG-Pfad für ein Zahnrad (für Export) ────────────────────────

function buildGearPath(p: GearParams): string {
  const g    = gearGeometry(p);
  const rb   = g.db / 2;
  const ra   = g.da / 2;
  const rf   = Math.max(g.df / 2, rb * 0.99);
  const toothAngle = (2 * Math.PI) / p.z;
  const steps = 24;

  const tMax      = involuteAngleAtR(rb, ra);
  const tStart    = involuteAngleAtR(rb, Math.max(rf, rb));
  const phiOffset = calcPhiOffset(p, rb);

  const [ex0, ey0] = involute(rb, tStart);
  const angR0 = Math.atan2(ey0, ex0) + phiOffset;

  let path = '';

  // Startpunkt auf Fußkreis (rechte Seite von Zahn 0)
  path += `M ${fmt(rf * Math.cos(angR0))} ${fmt(rf * Math.sin(angR0))} `;

  for (let i = 0; i < p.z; i++) {
    const baseRot = i * toothAngle;

    // Rechte Flanke
    for (let s = 0; s <= steps; s++) {
      const t = tStart + (tMax - tStart) * s / steps;
      const [ex, ey] = involute(rb, t);
      const ang = Math.atan2(ey, ex) + phiOffset + baseRot;
      const r = Math.hypot(ex, ey);
      path += `L ${fmt(r * Math.cos(ang))} ${fmt(r * Math.sin(ang))} `;
    }

    // Kopfbogen
    const [exTop, eyTop] = involute(rb, tMax);
    const angRT = Math.atan2(eyTop, exTop) + phiOffset + baseRot;
    const angLT = -(Math.atan2(eyTop, exTop) + phiOffset - baseRot) + baseRot;
    for (let s = 1; s <= 6; s++) {
      const a = angRT + (angLT - angRT) * s / 6;
      path += `L ${fmt(ra * Math.cos(a))} ${fmt(ra * Math.sin(a))} `;
    }

    // Linke Flanke (gespiegelt)
    for (let s = steps; s >= 0; s--) {
      const t = tStart + (tMax - tStart) * s / steps;
      const [ex, ey] = involute(rb, t);
      const ang = -(Math.atan2(ey, ex) + phiOffset - baseRot) + baseRot;
      const r = Math.hypot(ex, ey);
      path += `L ${fmt(r * Math.cos(ang))} ${fmt(r * Math.sin(ang))} `;
    }

    // Fußbogen zum nächsten Zahn
    const nextR = angR0 + (i + 1) * toothAngle;
    path += `A ${fmt(rf)} ${fmt(rf)} 0 0 1 ${fmt(rf * Math.cos(nextR))} ${fmt(rf * Math.sin(nextR))} `;
  }

  path += 'Z';

  // Bohrung (Gegenuhrzeigersinn für fill-rule evenodd)
  const br = p.bore / 2;
  path += ` M ${fmt(br)} 0 A ${fmt(br)} ${fmt(br)} 0 1 0 ${fmt(-br)} 0 A ${fmt(br)} ${fmt(br)} 0 1 0 ${fmt(br)} 0 Z`;

  if (p.hubExtra > 0.5) {
    const hr = p.bore / 2 + p.hubExtra;
    path += ` M ${fmt(hr)} 0 A ${fmt(hr)} ${fmt(hr)} 0 1 1 ${fmt(-hr)} 0 A ${fmt(hr)} ${fmt(hr)} 0 1 1 ${fmt(hr)} 0 Z`;
    path += ` M ${fmt(br)} 0 A ${fmt(br)} ${fmt(br)} 0 1 0 ${fmt(-br)} 0 A ${fmt(br)} ${fmt(br)} 0 1 0 ${fmt(br)} 0 Z`;
  }

  return path;
}

function buildGearSVG(p: GearParams, includeGuides = false): string {
  const g   = gearGeometry(p);
  const pad = g.da * 0.15;
  const size = g.da + pad * 2;
  const cx  = size / 2;

  let circles = '';
  if (includeGuides) {
    const addCircle = (r: number, color: string, label: string) =>
      `<circle cx="${fmt(cx)}" cy="${fmt(cx)}" r="${fmt(r)}" fill="none" stroke="${color}" stroke-width="0.3" stroke-dasharray="2 2" opacity="0.5"/>` +
      `<text x="${fmt(cx + r + 0.5)}" y="${fmt(cx)}" fill="${color}" font-size="2" opacity="0.7">${label}</text>`;
    circles += addCircle(g.d  / 2, '#00d4c8', 'd');
    circles += addCircle(g.da / 2, '#d4a200', 'da');
    circles += addCircle(g.df / 2, '#6b00cc', 'df');
    circles += addCircle(g.db / 2, '#888888', 'db');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
  width="${fmt(size)}mm" height="${fmt(size)}mm"
  viewBox="0 0 ${fmt(size)} ${fmt(size)}"
  fill-rule="evenodd">
  <!-- z=${p.z} m=${p.m} alpha=${(p.alpha / DEG).toFixed(1)}deg bore=${p.bore}mm shift=${p.shift} -->
  ${circles}
  <g transform="translate(${fmt(cx)},${fmt(cx)})">
    <path d="${buildGearPath(p)}" fill="#c8c0d8" stroke="#6b00cc" stroke-width="0.2"/>
  </g>
</svg>`;
}

// ── Canvas-Rendering ─────────────────────────────────────────────

const canvas = document.getElementById('gear-canvas') as HTMLCanvasElement;
const ctx    = canvas.getContext('2d')!;
const info   = document.getElementById('canvas-info')!;

let showGear2 = false;
let animAngle = 0;
let rafId = 0;

function resizeCanvas() {
  const wrap = canvas.parentElement!;
  const dpr  = Math.min(devicePixelRatio || 1, 2);
  const w    = wrap.clientWidth;
  const h    = wrap.clientHeight;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function readParams(): GearParams {
  const get = (id: string) => parseFloat((document.getElementById(id) as HTMLInputElement).value);
  return {
    m:        get('p-module'),
    z:        Math.round(get('p-teeth')),
    alpha:    get('p-angle') * DEG,
    bore:     get('p-bore'),
    hubExtra: get('p-hub'),
    shift:    get('p-shift'),
  };
}

function readZ2(): number {
  return Math.round(parseFloat((document.getElementById('p-teeth2') as HTMLInputElement).value));
}

function drawGearOnCtx(
  p: GearParams,
  cx: number, cy: number,
  rot: number,
  fillColor: string,
  strokeColor: string,
) {
  const g    = gearGeometry(p);
  const rb   = g.db / 2;
  const ra   = g.da / 2;
  const rf   = Math.max(g.df / 2, rb * 0.99);
  const toothAngle = (2 * Math.PI) / p.z;
  const steps = 18;

  const tMax      = involuteAngleAtR(rb, ra);
  const tStart    = involuteAngleAtR(rb, Math.max(rf, rb));
  const phiOffset = calcPhiOffset(p, rb);

  const [ex0, ey0] = involute(rb, tStart);
  const angR0 = Math.atan2(ey0, ex0) + phiOffset;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  ctx.beginPath();
  ctx.moveTo(rf * Math.cos(angR0), rf * Math.sin(angR0));

  for (let i = 0; i < p.z; i++) {
    const baseRot = i * toothAngle;

    // Rechte Flanke
    for (let s = 0; s <= steps; s++) {
      const t = tStart + (tMax - tStart) * s / steps;
      const [ex, ey] = involute(rb, t);
      const ang = Math.atan2(ey, ex) + phiOffset + baseRot;
      const r = Math.hypot(ex, ey);
      ctx.lineTo(r * Math.cos(ang), r * Math.sin(ang));
    }

    // Kopfbogen
    const [exTop, eyTop] = involute(rb, tMax);
    const angRT = Math.atan2(eyTop, exTop) + phiOffset + baseRot;
    const angLT = -(Math.atan2(eyTop, exTop) + phiOffset - baseRot) + baseRot;
    for (let s = 1; s <= 6; s++) {
      const a = angRT + (angLT - angRT) * s / 6;
      ctx.lineTo(ra * Math.cos(a), ra * Math.sin(a));
    }

    // Linke Flanke
    for (let s = steps; s >= 0; s--) {
      const t = tStart + (tMax - tStart) * s / steps;
      const [ex, ey] = involute(rb, t);
      const ang = -(Math.atan2(ey, ex) + phiOffset - baseRot) + baseRot;
      const r = Math.hypot(ex, ey);
      ctx.lineTo(r * Math.cos(ang), r * Math.sin(ang));
    }

    // Fußbogen
    const angL  = -(angR0 - baseRot) + baseRot;
    const nextR = angR0 + (i + 1) * toothAngle;
    ctx.arc(0, 0, rf, angL, nextR, false);
  }

  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill('evenodd');
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Bohrung
  ctx.beginPath();
  ctx.arc(0, 0, p.bore / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#06000e';
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  if (p.hubExtra > 0.5) {
    ctx.beginPath();
    ctx.arc(0, 0, p.bore / 2 + p.hubExtra, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, p.bore / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#06000e';
    ctx.fill();
  }

  ctx.restore();
}

function getCanvasDims(): [number, number] {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  return [canvas.width / dpr, canvas.height / dpr];
}

function renderFrame() {
  const p   = readParams();
  const g   = gearGeometry(p);
  const [w, h] = getCanvasDims();

  ctx.clearRect(0, 0, w, h);

  if (!showGear2) {
    const scale = Math.min(w, h) * 0.82 / g.da;
    const ccx = w / 2;
    const ccy = h / 2;

    ctx.save();
    ctx.scale(scale, scale);
    drawGearOnCtx(p, ccx / scale, ccy / scale, animAngle, 'rgba(107,0,204,0.55)', '#6b00cc');

    // Hilfskreise
    const drawCircle = (r: number, color: string) => {
      ctx.beginPath();
      ctx.arc(ccx / scale, ccy / scale, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.3;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    drawCircle(g.d  / 2, 'rgba(0,212,200,0.5)');
    drawCircle(g.da / 2, 'rgba(212,162,0,0.4)');
    drawCircle(g.df / 2, 'rgba(107,0,204,0.4)');
    ctx.restore();

    updateDerived(p, g);
  } else {
    const z2 = readZ2();
    const p2: GearParams = { ...p, z: z2 };
    const g2 = gearGeometry(p2);
    const cd = (g.d + g2.d) / 2;

    const totalW = g.da / 2 + cd + g2.da / 2;
    const scale  = Math.min(w / totalW, h / Math.max(g.da, g2.da)) * 0.85;
    const cx1    = (w - totalW * scale) / 2 / scale + g.da / 2;
    const cx2    = cx1 + cd;
    const ccy    = h / scale / 2;
    const ratio  = p.z / z2;

    ctx.save();
    ctx.scale(scale, scale);
    drawGearOnCtx(p,  cx1, ccy,  animAngle,                         'rgba(107,0,204,0.55)', '#6b00cc');
    drawGearOnCtx(p2, cx2, ccy, -animAngle * ratio + Math.PI / z2,  'rgba(0,180,120,0.45)', '#00d4c8');

    const drawCircle2 = (ccx: number, r: number) => {
      ctx.beginPath();
      ctx.arc(ccx, ccy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,200,0.3)';
      ctx.lineWidth = 0.3;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    drawCircle2(cx1, g.d  / 2);
    drawCircle2(cx2, g2.d / 2);
    ctx.restore();

    updateDerivedPair(p, p2, g, g2, cd);
  }

  animAngle += 0.008;
  rafId = requestAnimationFrame(renderFrame);
}

function updateDerived(p: GearParams, g: GearGeometry) {
  const set = (id: string, v: string) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('d-pitch', `${g.d.toFixed(2)} mm`);
  set('d-outer', `${g.da.toFixed(2)} mm`);
  set('d-root',  `${g.df.toFixed(2)} mm`);
  set('d-base',  `${g.db.toFixed(2)} mm`);
  (document.getElementById('d-ratio-row') as HTMLElement).hidden = true;
  (document.getElementById('d-cd-row')    as HTMLElement).hidden = true;
  info.textContent = `m=${p.m} · z=${p.z} · α=${(p.alpha / DEG).toFixed(1)}° · d=${g.d.toFixed(1)} mm · da=${g.da.toFixed(1)} mm`;
}

function updateDerivedPair(p: GearParams, p2: GearParams, g: GearGeometry, g2: GearGeometry, cd: number) {
  const set = (id: string, v: string) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('d-pitch', `${g.d.toFixed(2)} mm`);
  set('d-outer', `${g.da.toFixed(2)} mm`);
  set('d-root',  `${g.df.toFixed(2)} mm`);
  set('d-base',  `${g.db.toFixed(2)} mm`);
  (document.getElementById('d-ratio-row') as HTMLElement).hidden = false;
  (document.getElementById('d-cd-row')    as HTMLElement).hidden = false;
  set('d-ratio', `${p.z} : ${p2.z} = 1 : ${(p2.z / p.z).toFixed(3)}`);
  set('d-cd',    `${cd.toFixed(2)} mm`);
  void g2;
}

// ── Event-Listener ───────────────────────────────────────────────

function bindInputs() {
  document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(inp => {
    const outId = inp.id.replace('p-', 'o-');
    const out   = document.getElementById(outId) as HTMLOutputElement | null;
    inp.addEventListener('input', () => {
      if (out) {
        const v = parseFloat(inp.value);
        const decimals = inp.step.includes('.') ? inp.step.split('.')[1].length : 0;
        out.value = v.toFixed(decimals);
      }
    });
    inp.dispatchEvent(new Event('input'));
  });

  const cb    = document.getElementById('p-show2') as HTMLInputElement;
  const z2row = (document.getElementById('p-teeth2') as HTMLInputElement)
                  .closest('.param-row') as HTMLElement;
  z2row.style.opacity       = '0.4';
  z2row.style.pointerEvents = 'none';

  cb.addEventListener('change', () => {
    showGear2 = cb.checked;
    z2row.style.opacity       = showGear2 ? '1' : '0.4';
    z2row.style.pointerEvents = showGear2 ? '' : 'none';
  });
}

document.getElementById('btn-svg')!.addEventListener('click', () => {
  const p    = readParams();
  const svg  = buildGearSVG(p, true);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `zahnrad_m${p.m}_z${p.z}.svg`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('btn-copy')!.addEventListener('click', async () => {
  const p   = readParams();
  const svg = buildGearSVG(p, false);
  await navigator.clipboard.writeText(svg);
  const btn = document.getElementById('btn-copy')!;
  btn.textContent = 'Kopiert ✓';
  setTimeout(() => { btn.textContent = 'SVG kopieren'; }, 1800);
});

let resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 100);
});

resizeCanvas();
bindInputs();
cancelAnimationFrame(rafId);
rafId = requestAnimationFrame(renderFrame);

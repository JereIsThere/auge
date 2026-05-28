'use client';

import { useEffect, useRef } from 'react';

const CYRILLISCH =
  'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя';

interface Glyph {
  x: number;
  y: number;
  speed: number;
  zeichen: string;
  helligkeit: number;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  leben: number; // 0–1
}

export default function CyrillicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let breite = window.innerWidth;
    let höhe = window.innerHeight;
    canvas.width = breite;
    canvas.height = höhe;

    const schriftGröße = 16;
    const spalten = Math.floor(breite / schriftGröße);

    const glyphen: Glyph[] = Array.from({ length: spalten }, (_, i) => ({
      x: i * schriftGröße,
      y: Math.random() * höhe,
      speed: 0.4 + Math.random() * 0.8,
      zeichen: zufälligesZeichen(),
      helligkeit: 0.2 + Math.random() * 0.5,
    }));

    const embers: Ember[] = [];
    let mausX = breite / 2;
    let mausY = höhe / 2;
    let letzteGlypheZeit = 0;
    let rafId = 0;

    function zufälligesZeichen() {
      return CYRILLISCH[Math.floor(Math.random() * CYRILLISCH.length)];
    }

    function onMaus(e: MouseEvent) {
      mausX = e.clientX;
      mausY = e.clientY;
      // Neue Embers beim Mausbewegen spawnen
      if (Math.random() < 0.3) {
        embers.push({
          x: mausX + (Math.random() - 0.5) * 30,
          y: mausY + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          leben: 1,
        });
      }
    }

    function onResize() {
      if (!canvasRef.current) return;
      breite = window.innerWidth;
      höhe = window.innerHeight;
      canvasRef.current.width = breite;
      canvasRef.current.height = höhe;
    }

    window.addEventListener('mousemove', onMaus, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    function frame(now: number) {
      rafId = requestAnimationFrame(frame);

      // Transparenter Überzug für Spur-Effekt
      ctx.fillStyle = 'rgba(6,0,14,0.18)';
      ctx.fillRect(0, 0, breite, höhe);

      // Glyphen ~25fps
      if (now - letzteGlypheZeit > 40) {
        letzteGlypheZeit = now;
        ctx.font = `${schriftGröße}px monospace`;
        for (const g of glyphen) {
          const alpha = g.helligkeit;
          ctx.fillStyle = `rgba(0,212,200,${alpha})`;
          ctx.fillText(g.zeichen, g.x, g.y);

          g.y += g.speed;
          if (g.y > höhe + schriftGröße) {
            g.y = -schriftGröße;
            g.zeichen = zufälligesZeichen();
          }
          if (Math.random() < 0.02) g.zeichen = zufälligesZeichen();
        }
      }

      // Embers 60fps
      for (let i = embers.length - 1; i >= 0; i--) {
        const em = embers[i];
        // Anziehung zur Maus
        const dx = mausX - em.x;
        const dy = mausY - em.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        em.vx += (dx / dist) * 0.15;
        em.vy += (dy / dist) * 0.15;
        em.vx *= 0.92;
        em.vy *= 0.92;
        em.x += em.vx;
        em.y += em.vy;
        em.leben -= 0.015;

        if (em.leben <= 0) {
          embers.splice(i, 1);
          continue;
        }

        const r = em.leben * 3;
        const gradient = ctx.createRadialGradient(em.x, em.y, 0, em.x, em.y, r);
        gradient.addColorStop(0, `rgba(240,192,0,${em.leben})`);
        gradient.addColorStop(1, 'rgba(107,0,204,0)');
        ctx.beginPath();
        ctx.arc(em.x, em.y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMaus);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.7,
      }}
      aria-hidden
    />
  );
}

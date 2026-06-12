import type { Kategorie, Thema } from '@/types';
import { KATEGORIE_FARBEN, lektionenFlach } from '@/types';
import styles from './ThemenPie.module.css';

interface Props {
  /** Featured-Themen, bereits in Anzeige-Reihenfolge (nach Kategorie gruppiert). */
  themen: Thema[];
}

/** Hex-Farbe in Richtung einer Zielfarbe mischen (anteil 0–1). */
function mischeFarbe(hex: string, ziel: string, anteil: number): string {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(hex);
  const [r2, g2, b2] = h(ziel);
  const mix = (a: number, b: number) => Math.round(a + (b - a) * anteil);
  return `#${[mix(r1, r2), mix(g1, g2), mix(b1, b2)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Kreissektor als SVG-Pfad (Winkel in Radiant, 0 = 12 Uhr). */
function sektorPfad(cx: number, cy: number, r: number, start: number, ende: number): string {
  const punkt = (w: number) => [cx + r * Math.sin(w), cy - r * Math.cos(w)];
  const [x1, y1] = punkt(start);
  const [x2, y2] = punkt(ende);
  const gross = ende - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${gross} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

export default function ThemenPie({ themen }: Props) {
  const spielbar = (t: Thema) => lektionenFlach(t).filter((l) => !l.kommtNoch).length;
  const gesamt = themen.reduce((sum, t) => sum + spielbar(t), 0);
  if (gesamt === 0) return null;

  // Farbabstufung: Themen derselben Kategorie teilen die Kategorie-Farbe,
  // jedes weitere Thema wird stufenweise Richtung Weiß aufgehellt.
  const katIndex = new Map<Kategorie, number>();
  const katAnzahl = themen.reduce<Map<Kategorie, number>>(
    (acc, t) => acc.set(t.kategorie, (acc.get(t.kategorie) ?? 0) + 1),
    new Map()
  );

  let winkel = 0;
  const sektoren = themen.map((t) => {
    const i = katIndex.get(t.kategorie) ?? 0;
    katIndex.set(t.kategorie, i + 1);
    const n = katAnzahl.get(t.kategorie) ?? 1;
    const farbe = mischeFarbe(
      KATEGORIE_FARBEN[t.kategorie],
      '#f4eeff',
      n > 1 ? (i / (n - 1)) * 0.55 : 0
    );
    const anteil = spielbar(t) / gesamt;
    const start = winkel;
    winkel += anteil * 2 * Math.PI;
    return { thema: t, farbe, start, ende: winkel, lektionen: spielbar(t) };
  });

  return (
    <div className={styles.wrapper} role="img" aria-label="Verteilung der Lektionen über die Themen">
      <svg viewBox="0 0 160 160" className={styles.pie} aria-hidden>
        {sektoren.map(({ thema, farbe, start, ende }) => (
          <a key={thema.slug} href={`#thema-${thema.slug}`}>
            <path
              d={sektorPfad(80, 80, 74, start, ende)}
              fill={farbe}
              className={styles.sektor}
            >
              <title>{`${thema.titel} · ${spielbar(thema)} Lektionen`}</title>
            </path>
          </a>
        ))}
        {/* Donut-Loch mit Gesamtzahl */}
        <circle cx="80" cy="80" r="42" className={styles.loch} />
        <text x="80" y="76" textAnchor="middle" className={styles.lochZahl}>
          {gesamt}
        </text>
        <text x="80" y="94" textAnchor="middle" className={styles.lochLabel}>
          Lektionen
        </text>
      </svg>

      <ul className={styles.legende}>
        {sektoren.map(({ thema, farbe, lektionen }) => (
          <li key={thema.slug}>
            <a href={`#thema-${thema.slug}`} className={styles.legendeLink}>
              <span className={styles.punkt} style={{ background: farbe }} aria-hidden />
              <span className={styles.legendeTitel}>{thema.titel}</span>
              <span className={styles.legendeZahl}>{lektionen}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

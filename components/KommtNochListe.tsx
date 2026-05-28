import type { Thema } from '@/types';
import { KATEGORIE_FARBEN, KATEGORIE_LABELS } from '@/types';
import styles from './KommtNochListe.module.css';

interface Props {
  themen: Thema[];
}

export default function KommtNochListe({ themen }: Props) {
  // Gruppieren nach Kategorie, sortiert nach Anzahl absteigend
  const nachKat = themen.reduce<Record<string, Thema[]>>((acc, t) => {
    (acc[t.kategorie] ??= []).push(t);
    return acc;
  }, {});

  const gruppen = Object.entries(nachKat).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className={styles.wrapper}>
      {gruppen.map(([kat, themenInKat]) => {
        const farbe = KATEGORIE_FARBEN[kat as keyof typeof KATEGORIE_FARBEN];
        return (
          <section
            key={kat}
            className={styles.gruppe}
            style={{ '--farbe': farbe } as React.CSSProperties}
          >
            <h3 className={styles.gruppeTitel}>
              {KATEGORIE_LABELS[kat as keyof typeof KATEGORIE_LABELS]}
              <span className={styles.gruppeAnzahl}>{themenInKat.length}</span>
            </h3>
            <ul className={styles.themenListe}>
              {themenInKat.map((t) => (
                <li key={t.slug} className={styles.themaItem}>
                  <span className={styles.themaTitel}>{t.titel}</span>
                  <span className={styles.themaBeschreibung}>{t.kurzbeschreibung}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

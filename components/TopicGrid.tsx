'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SchemaLayout, ThemaSummary, Kategorie } from '@/types';
import { KATEGORIE_LABELS, KATEGORIE_FARBEN, STATUS_LABELS } from '@/types';
import styles from './TopicGrid.module.css';

interface Props {
  layout: SchemaLayout;
}

export default function TopicGrid({ layout }: Props) {
  const sektionen =
    layout.typ === 'gesplittet' && layout.primaer
      ? [
          { kategorie: layout.primaer.kategorie, themen: layout.primaer.themen, primaer: true },
          ...layout.sekundaer.map((s) => ({ ...s, primaer: false })),
        ]
      : layout.typ === 'einseitig' && layout.primaer
        ? [{ kategorie: layout.primaer.kategorie, themen: layout.primaer.themen, primaer: true }]
        : layout.sekundaer.map((s) => ({ ...s, primaer: false }));

  return (
    <div className={styles.wrapper}>
      {sektionen.map((s) => (
        <KategorieSektion
          key={s.kategorie}
          kategorie={s.kategorie}
          themen={s.themen}
          primaer={s.primaer}
        />
      ))}
    </div>
  );
}

function KategorieSektion({
  kategorie,
  themen,
  primaer,
}: {
  kategorie: Kategorie;
  themen: ThemaSummary[];
  primaer: boolean;
}) {
  const [offen, setOffen] = useState(primaer);
  const farbe = KATEGORIE_FARBEN[kategorie];
  const fertige = themen.filter((t) => t.status === 'fertig').length;
  const inArbeit = themen.filter((t) => t.status === 'in-arbeit').length;

  return (
    <section
      className={styles.sektion}
      data-offen={offen}
      style={{ '--farbe': farbe } as React.CSSProperties}
    >
      <button
        className={styles.sektionHeader}
        onClick={() => setOffen((v) => !v)}
        aria-expanded={offen}
      >
        <span className={styles.sektionPfeil} aria-hidden>›</span>

        <span className={styles.sektionTitel}>
          {KATEGORIE_LABELS[kategorie]}
        </span>

        <span className={styles.sektionBadges}>
          <span className={styles.badge}>{themen.length}</span>
          {inArbeit > 0 && (
            <span className={styles.badgeAktiv}>{inArbeit} aktiv</span>
          )}
          {fertige > 0 && (
            <span className={styles.badgeFertig}>{fertige} fertig</span>
          )}
        </span>

        {!offen && (
          <span className={styles.vorschauTitel}>
            {themen.slice(0, 3).map((t) => t.titel).join(' · ')}
            {themen.length > 3 && ` · +${themen.length - 3}`}
          </span>
        )}
      </button>

      {offen && (
        <div className={primaer ? styles.gridGroß : styles.gridKlein}>
          {themen.map((t) => (
            <ThemaKarte key={t.slug} thema={t} farbe={farbe} />
          ))}
        </div>
      )}
    </section>
  );
}

function ThemaKarte({ thema, farbe }: { thema: ThemaSummary; farbe: string }) {
  const tags = thema.tags ?? [];

  return (
    <Link
      href={`/thema/${thema.slug}`}
      className={styles.karte}
      style={{ '--farbe': farbe } as React.CSSProperties}
      aria-label={thema.titel}
    >
      <div className={styles.karteKopf}>
        <h3 className={styles.karteTitel}>{thema.titel}</h3>
        <div className={styles.statusDot} data-status={thema.status} title={STATUS_LABELS[thema.status]} />
      </div>

      {thema.kurzbeschreibung && (
        <p className={styles.karteVorschau}>{thema.kurzbeschreibung}</p>
      )}

      <div className={styles.karteFooter}>
        {thema.spielbarAnzahl > 0 ? (
          <span className={styles.lektionsAnzahl}>
            {thema.spielbarAnzahl} {thema.spielbarAnzahl === 1 ? 'Lektion' : 'Lektionen'}
          </span>
        ) : (
          <span className={styles.ausstehend}>kommt noch</span>
        )}
        {thema.status === 'in-arbeit' && (
          <span className={styles.inArbeit}>in Arbeit</span>
        )}
      </div>

      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

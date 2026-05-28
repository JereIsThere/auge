import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { themaFinden, alleThemen } from '@/themen';
import { KATEGORIE_LABELS, KATEGORIE_FARBEN, STATUS_LABELS, lektionenFlach } from '@/types';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return alleThemen().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const thema = themaFinden(slug);
  if (!thema) return { title: 'Nicht gefunden' };
  return {
    title: thema.titel,
    description: thema.kurzbeschreibung,
  };
}

export default async function ThemaSeite({ params }: Props) {
  const { slug } = await params;
  const thema = themaFinden(slug);
  if (!thema) notFound();

  const kategoriefarbe = KATEGORIE_FARBEN[thema.kategorie];
  const lektionen = lektionenFlach(thema);
  const fertige = lektionen.filter((l) => !l.kommtNoch).length;
  const erstesSpielbar = lektionen.find((l) => !l.kommtNoch);

  return (
    <div className={styles.seite}>
      <nav className={styles.breadcrumb} aria-label="Navigation">
        <Link href="/">Auge</Link>
        <span aria-hidden>›</span>
        <span
          className={styles.kategoriePill}
          style={{ '--farbe': kategoriefarbe } as React.CSSProperties}
        >
          {KATEGORIE_LABELS[thema.kategorie]}
        </span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.titel}>{thema.titel}</h1>

        {thema.kurzbeschreibung && (
          <p className={styles.unterTitel}>{thema.kurzbeschreibung}</p>
        )}

        <div className={styles.meta}>
          <span className={styles.statusBadge} data-status={thema.status}>
            {STATUS_LABELS[thema.status]}
          </span>
          {fertige > 0 && (
            <span className={styles.metaText}>
              {fertige} {fertige === 1 ? 'Lektion' : 'Lektionen'}
            </span>
          )}
          {thema.tags && thema.tags.length > 0 && (
            <div className={styles.tags}>
              {thema.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        {erstesSpielbar && (
          <Link
            href={`/thema/${thema.slug}/lektionen/${erstesSpielbar.slug}`}
            className={styles.ctaPrimary}
          >
            Lektion starten →
          </Link>
        )}
      </header>

      {thema.beschreibung && (
        <section className={styles.einleitung}>
          <p>{thema.beschreibung}</p>
        </section>
      )}

      {thema.pfade && thema.pfade.length > 0 && (
        <section className={styles.pfadeBereich} aria-label="Lernpfade">
          <h2 className={styles.h2}>Wo soll ich anfangen?</h2>
          <p className={styles.h2Untertitel}>Drei Reisen durch das Material – such dir aus, was zu dir passt.</p>
          <div className={styles.pfadeGrid}>
            {thema.pfade.map((pfad) => {
              const erste = pfad.lektionenSlugs[0];
              return (
                <div key={pfad.slug} className={styles.pfadKarte}>
                  <div className={styles.pfadKopf}>
                    {pfad.icon && <span className={styles.pfadIcon}>{pfad.icon}</span>}
                    <h3 className={styles.pfadTitel}>{pfad.titel}</h3>
                  </div>
                  <p className={styles.pfadBeschreibung}>{pfad.beschreibung}</p>
                  <ol className={styles.pfadSchritte}>
                    {pfad.lektionenSlugs.slice(0, 5).map((s, i) => {
                      const l = lektionen.find((x) => x.slug === s);
                      if (!l) return null;
                      return (
                        <li key={s}>
                          <span className={styles.pfadNummer}>{i + 1}</span>
                          {l.titel}
                        </li>
                      );
                    })}
                  </ol>
                  {erste && (
                    <Link
                      href={`/thema/${thema.slug}/lektionen/${erste}`}
                      className={styles.pfadCta}
                    >
                      Pfad starten →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className={styles.landkarteBereich} aria-label="Alle Lektionen">
        <h2 className={styles.h2}>Die ganze Landkarte</h2>

        {thema.gruppen.length === 0 ? (
          <div className={styles.leer}>
            <p>Dieses Thema wird noch ausgearbeitet.</p>
            <p className={styles.leerHinweis}>
              Sobald Lektionen vorhanden sind, erscheinen sie hier.
            </p>
          </div>
        ) : (
          <div className={styles.gruppenGrid}>
            {thema.gruppen.map((gruppe) => (
              <div key={gruppe.titel} className={styles.gruppe}>
                <h3 className={styles.gruppeTitel}>{gruppe.titel}</h3>
                {gruppe.untertitel && (
                  <p className={styles.gruppeUntertitel}>{gruppe.untertitel}</p>
                )}
                <ul className={styles.lektionsListe}>
                  {gruppe.lektionen.map((lektion) => {
                    if (lektion.kommtNoch) {
                      return (
                        <li key={lektion.slug} className={styles.lektionItemMuted}>
                          <span className={styles.lektionIcon}>{lektion.icon ?? '○'}</span>
                          <span>{lektion.titel}</span>
                          <span className={styles.kommtNoch}>kommt noch</span>
                        </li>
                      );
                    }
                    return (
                      <li key={lektion.slug}>
                        <Link
                          href={`/thema/${thema.slug}/lektionen/${lektion.slug}`}
                          className={styles.lektionItem}
                        >
                          <span className={styles.lektionIcon}>{lektion.icon ?? '●'}</span>
                          <span>{lektion.titel}</span>
                          <span className={styles.pfeil}>→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>← Alle Themen</Link>
      </footer>
    </div>
  );
}

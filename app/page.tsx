import Link from 'next/link';
import type { Metadata } from 'next';
import { alleThemen } from '@/themen';
import { berechneSchemaLayout } from '@/lib/schema';
import { KATEGORIE_FARBEN, lektionenFlach } from '@/types';
import { getActiveThemaEdits } from '@/lib/active-prs';
import CyrillicCanvas from '@/components/CyrillicCanvas';
import KommtNochListe from '@/components/KommtNochListe';
import BlogFeed from '@/components/BlogFeed';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Auge',
};

// ISR: Seite wird alle 10 Minuten neu gerendert → Live-PR-Status bleibt aktuell.
export const revalidate = 600;

// Themen-spezifisches Icon für die Featured-Karten.
const THEMA_ICON: Record<string, string> = {
  kryptografie: '🔐',
  rag: '🧬',
  mcp: '🛠️',
  aquarell: '🎨',
  'procreate-rendering': '🖌️',
  'neurologie-mmc': '🧠',
  'next-auth-beta': '🔑',
  'html-css': '🌐',
};

export default async function Home() {
  const themen = alleThemen();
  const activeEdits = await getActiveThemaEdits();
  const activeSlugs = new Set(activeEdits.map((e) => e.slug));

  // Featured = was spielbar oder in Arbeit ist. Kommt-noch = Platzhalter.
  const featured = themen.filter((t) => t.status !== 'kommt-noch');
  const kommtNoch = themen.filter((t) => t.status === 'kommt-noch');
  const layout = berechneSchemaLayout(kommtNoch);

  // CTAs: erstes "fertig"-Thema als primary, zweites als secondary.
  const fertige = featured.filter((t) => t.status === 'fertig');
  const cta1 = fertige[0];
  const cta2 = fertige[1];

  return (
    <>
      <CyrillicCanvas />

      <div className={styles.bühne}>
        <div className={styles.hauptInhalt}>
          <section className={styles.hero}>
            <h1 className={styles.titel}>
              <span className={styles.titelGlitch} aria-hidden>Auge</span>
              <span className={styles.titelEcht}>Auge</span>
            </h1>
            <p className={styles.pitch}>
              Interaktive Lektionen mit aufklappbaren Tiefen-Boxen und
              wissenschaftlichen Quellen am Ort der Referenz.
            </p>
            {(cta1 || cta2) && (
              <div className={styles.ctaRow}>
                {cta1 && (
                  <Link href={`/thema/${cta1.slug}`} className={styles.ctaPrimary}>
                    → {cta1.titel} starten
                  </Link>
                )}
                {cta2 && (
                  <Link href={`/thema/${cta2.slug}`} className={styles.ctaSecondary}>
                    → {cta2.titel} erkunden
                  </Link>
                )}
              </div>
            )}
          </section>

          {featured.length > 0 && (
            <section className={styles.featuredBereich} aria-label="Aktuelle Themen">
              <div className={styles.sektionLabel}>
                <h2>Aktuelle Themen</h2>
                <span className={styles.sektionMeta}>
                  {fertige.length} spielbar
                  {featured.length - fertige.length > 0 && ` · ${featured.length - fertige.length} in Arbeit`}
                </span>
              </div>

              <div className={styles.featuredGrid}>
                {featured.map((thema) => {
                  const flach = lektionenFlach(thema);
                  const spielbar = flach.filter((l) => !l.kommtNoch).length;
                  const gruppen = thema.gruppen.length;
                  const pfade = thema.pfade?.length ?? 0;
                  const farbe = KATEGORIE_FARBEN[thema.kategorie];
                  const icon = THEMA_ICON[thema.slug] ?? '📘';
                  const istFertig = thema.status === 'fertig';
                  const liveEdit = activeSlugs.has(thema.slug)
                    ? activeEdits.find((e) => e.slug === thema.slug)
                    : undefined;

                  return (
                    <article
                      key={thema.slug}
                      className={styles.featuredKarte}
                      style={{ '--farbe': farbe } as React.CSSProperties}
                      data-live={liveEdit ? 'true' : undefined}
                    >
                      {liveEdit && (
                        <a
                          href={liveEdit.prUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.liveEditBanner}
                          title={`PR #${liveEdit.prNumber}: ${liveEdit.prTitle}`}
                        >
                          <span className={styles.liveDot} aria-hidden />
                          live edit
                        </a>
                      )}
                      <header className={styles.featuredKopf}>
                        <span className={styles.featuredIcon} aria-hidden>{icon}</span>
                        <Link href={`/thema/${thema.slug}`} className={styles.featuredTitel}>
                          {thema.titel}
                        </Link>
                        <span
                          className={styles.featuredStatus}
                          data-status={thema.status}
                        >
                          {istFertig ? 'fertig' : 'in Arbeit'}
                        </span>
                      </header>

                      <p className={styles.featuredPitch}>
                        {thema.kurzbeschreibung}
                      </p>

                      <div className={styles.featuredZahlen}>
                        {istFertig ? (
                          <>
                            <span><strong>{spielbar}</strong> Lektionen</span>
                            {gruppen > 1 && <span><strong>{gruppen}</strong> Gruppen</span>}
                            {pfade > 0 && <span><strong>{pfade}</strong> Pfade</span>}
                          </>
                        ) : (
                          <span>
                            <strong>{spielbar}</strong> spielbar von <strong>{flach.length}</strong> geplant
                          </span>
                        )}
                      </div>

                      {thema.pfade && thema.pfade.length > 0 && (
                        <nav className={styles.featuredPfade} aria-label="Lernpfade">
                          {thema.pfade.map((p) => (
                            <Link
                              key={p.slug}
                              href={`/thema/${thema.slug}/lektionen/${p.lektionenSlugs[0]}`}
                              className={styles.featuredPfad}
                            >
                              {p.icon && <span aria-hidden>{p.icon}</span>}
                              {p.titel}
                            </Link>
                          ))}
                        </nav>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {kommtNoch.length > 0 && (
            <section className={styles.kommtNochBereich} aria-label="Geplante Themen">
              <div className={styles.kommtNochLabel}>
                Kommt noch · {kommtNoch.length} {kommtNoch.length === 1 ? 'Thema' : 'Themen'} geplant
              </div>

              <div className={styles.schemaLine}>
                <span className={styles.schemaPill}>Schema</span>
                {layout.analyse}
              </div>

              <KommtNochListe themen={kommtNoch} />
            </section>
          )}
        </div>

        <BlogFeed />
      </div>
    </>
  );
}

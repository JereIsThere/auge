import type { Metadata } from 'next';
import { alleThemenLaden } from '@/lib/orientdb';
import { berechneSchemaLayout } from '@/lib/schema';
import GeneriereForm from './GeneriereForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Generieren',
  description: 'Neues Lernthema generieren – Träumer, Denker und Denker² in einem Durchlauf.',
};

export const revalidate = 0;

export default async function GeneriereSeite() {
  const themen = await alleThemenLaden();
  const layout = berechneSchemaLayout(themen);

  const fertigeThemen = themen.filter((t) => t.status === 'fertig').length;
  const inArbeit = themen.filter(
    (t) => t.status !== 'fertig' && t.status !== 'ausstehend'
  ).length;

  return (
    <div className={styles.seite}>
      {/* Linke Spalte: Statistik + Schema-Info */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarKarte}>
          <h2 className={styles.sidebarTitel}>Wissensbasis</h2>
          <dl className={styles.stats}>
            <div className={styles.statRow}>
              <dt>Themen gesamt</dt>
              <dd>{themen.length}</dd>
            </div>
            <div className={styles.statRow}>
              <dt>Fertig generiert</dt>
              <dd className={styles.statFertig}>{fertigeThemen}</dd>
            </div>
            {inArbeit > 0 && (
              <div className={styles.statRow}>
                <dt>In Arbeit</dt>
                <dd className={styles.statInArbeit}>{inArbeit}</dd>
              </div>
            )}
          </dl>
        </div>

        {themen.length > 0 && (
          <div className={styles.sidebarKarte}>
            <h2 className={styles.sidebarTitel}>Aktuelle Verteilung</h2>
            <p className={styles.analyseText}>{layout.analyse}</p>

            <div className={styles.verteilungBalken}>
              {layout.typ === 'gesplittet' && layout.primaer && (
                <>
                  <div
                    className={styles.balken}
                    data-kategorie={layout.primaer.kategorie}
                    style={{ width: `${layout.primaer.anteil * 100}%` }}
                    title={`${layout.primaer.kategorie}: ${Math.round(layout.primaer.anteil * 100)}%`}
                  />
                  {layout.sekundaer.map((s) => (
                    <div
                      key={s.kategorie}
                      className={styles.balken}
                      data-kategorie={s.kategorie}
                      style={{ width: `${s.anteil * 100}%` }}
                      title={`${s.kategorie}: ${Math.round(s.anteil * 100)}%`}
                    />
                  ))}
                </>
              )}
              {layout.typ !== 'gesplittet' &&
                layout.sekundaer.map((s) => (
                  <div
                    key={s.kategorie}
                    className={styles.balken}
                    data-kategorie={s.kategorie}
                    style={{ width: `${s.anteil * 100}%` }}
                    title={`${s.kategorie}: ${Math.round(s.anteil * 100)}%`}
                  />
                ))}
            </div>
          </div>
        )}

        {themen.length > 0 && (
          <div className={styles.sidebarKarte}>
            <h2 className={styles.sidebarTitel}>Zuletzt generiert</h2>
            <ul className={styles.letzteThemen}>
              {themen.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <a href={`/thema/${t.slug}`} className={styles.letzteThemenLink}>
                    <span className={styles.letzteThemenTitel}>{t.titel}</span>
                    <span
                      className={styles.letzteThemenStatus}
                      data-status={t.status}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Rechte Spalte: Generierungsformular */}
      <div className={styles.formBereich}>
        <div className={styles.formKopf}>
          <h1 className={styles.formTitel}>Neues Thema generieren</h1>
          <p className={styles.formBeschreibung}>
            Träumer, Denker und Denker² werden nacheinander generiert.
            Fakten werden direkt in OrientDB geschrieben.
          </p>
        </div>

        <GeneriereForm vorhandeneThemen={themen} />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { Thema, Stufe } from '@/types';
import styles from './LevelViewer.module.css';

const STUFEN: { id: Stufe; label: string; beschreibung: string }[] = [
  { id: 'traumer', label: 'Träumer', beschreibung: 'Intuitiver Einstieg' },
  { id: 'denker', label: 'Denker', beschreibung: 'Strukturiertes Wissen' },
  { id: 'denker2', label: 'Denker²', beschreibung: 'Vollständige Synthese' },
];

interface Props {
  thema: Thema;
}

export default function LevelViewer({ thema }: Props) {
  // Starte mit der höchsten verfügbaren Stufe
  const defaultStufe: Stufe = thema.stufen.traumer ? 'traumer' : 'denker';
  const [aktiveStufe, setAktiveStufe] = useState<Stufe>(defaultStufe);

  const inhalt = thema.stufen[aktiveStufe];

  return (
    <div className={styles.wrapper}>
      <div className={styles.stufenNav} role="tablist" aria-label="Wissensstufe wählen">
        {STUFEN.map(({ id, label, beschreibung }) => {
          const verfügbar = !!thema.stufen[id];
          return (
            <button
              key={id}
              role="tab"
              aria-selected={aktiveStufe === id}
              aria-controls={`panel-${id}`}
              disabled={!verfügbar}
              onClick={() => setAktiveStufe(id)}
              className={styles.stufenBtn}
              data-aktiv={aktiveStufe === id}
              data-verfügbar={verfügbar}
              title={verfügbar ? beschreibung : 'Noch nicht generiert'}
            >
              <span className={styles.stufenLabel}>{label}</span>
              <span className={styles.stufenBeschreibung}>{beschreibung}</span>
              {!verfügbar && <span className={styles.gesperrt} aria-hidden>—</span>}
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${aktiveStufe}`}
        role="tabpanel"
        className={styles.inhaltPanel}
      >
        {inhalt ? (
          <>
            {inhalt.zusammenfassung && (
              <p className={styles.zusammenfassung}>{inhalt.zusammenfassung}</p>
            )}
            <div
              className={styles.htmlInhalt}
              dangerouslySetInnerHTML={{ __html: inhalt.html }}
            />
            <time className={styles.zeitstempel} dateTime={inhalt.erstelltAm}>
              Generiert: {new Date(inhalt.erstelltAm).toLocaleDateString('de-DE', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </time>
          </>
        ) : (
          <div className={styles.nichtVerfügbar}>
            <p>Diese Stufe wurde noch nicht generiert.</p>
          </div>
        )}
      </div>

      {thema.fakten.length > 0 && (
        <details className={styles.faktenDetails}>
          <summary className={styles.faktenSummary}>
            {thema.fakten.length} gesicherte {thema.fakten.length === 1 ? 'Tatsache' : 'Tatsachen'}
          </summary>
          <ul className={styles.faktenListe}>
            {thema.fakten.map((f) => (
              <li key={f.id} className={styles.fakt}>
                {f.inhalt}
                {f.quelle && (
                  <span className={styles.faktQuelle}> — {f.quelle}</span>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

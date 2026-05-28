'use client';

import { useState, useTransition, useCallback } from 'react';
import type { Thema, Kategorie, GenerierStatus } from '@/types';
import { KATEGORIE_LABELS, KATEGORIE_FARBEN, GENERIER_STATUS_LABELS } from '@/types';
import { kategorieSuggestion, vorschauNachGenerierung } from '@/lib/schema';
import styles from './GeneriereForm.module.css';

const ALLE_KATEGORIEN: Kategorie[] = ['cs', 'art', 'math', 'sprache', 'sonstiges'];

interface GenerierErgebnis {
  id: string;
  slug: string;
  status: GenerierStatus;
  fehler?: string;
}

interface Props {
  vorhandeneThemen: Thema[];
}

export default function GeneriereForm({ vorhandeneThemen }: Props) {
  const [titel, setTitel] = useState('');
  const [kategorie, setKategorie] = useState<Kategorie>('cs');
  const [kategorieManual, setKategorieManual] = useState(false);
  const [tags, setTags] = useState('');
  const [isPending, startTransition] = useTransition();

  const [ergebnis, setErgebnis] = useState<GenerierErgebnis | null>(null);
  const [laufenderStatus, setLaufenderStatus] = useState<GenerierStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  // Automatische Kategorien-Suggestion beim Eintippen
  function onTitelChange(wert: string) {
    setTitel(wert);
    if (!kategorieManual && wert.length > 3) {
      setKategorie(kategorieSuggestion(wert));
    }
    setFehler(null);
  }

  // Duplikat-Check
  const existiert = titel.trim().length > 2 &&
    vorhandeneThemen.some(
      (t) => t.titel.toLowerCase() === titel.trim().toLowerCase() ||
        t.slug === slugify(titel)
    );

  // Schema-Vorschau
  const schemaVorschau = titel.trim().length > 2
    ? vorschauNachGenerierung(vorhandeneThemen, kategorie)
    : null;

  const pollStatus = useCallback(async (slug: string) => {
    setPolling(true);
    const maxVersuche = 60; // 5 Minuten bei 5s Intervall
    let versuch = 0;

    const intervall = setInterval(async () => {
      versuch++;
      try {
        const res = await fetch(`/api/themen/${slug}/status`);
        if (!res.ok) return;
        const { status } = await res.json() as { status: GenerierStatus };
        setLaufenderStatus(status);

        if (status === 'fertig' || status === 'fehler' || versuch >= maxVersuche) {
          clearInterval(intervall);
          setPolling(false);
          if (status === 'fehler') {
            setFehler('Generierung fehlgeschlagen. Bitte erneut versuchen.');
          }
        }
      } catch {
        // Kurze Netzwerkfehler ignorieren, weiter polling
      }
    }, 5000);
  }, []);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    if (!titel.trim() || existiert) return;

    setFehler(null);
    setErgebnis(null);
    setLaufenderStatus('ausstehend');

    startTransition(async () => {
      try {
        const res = await fetch('/api/generieren', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titel: titel.trim(),
            kategorie,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          }),
        });

        if (!res.ok) {
          const body = await res.json() as { fehler?: string };
          setFehler(body.fehler ?? 'Unbekannter Fehler');
          setLaufenderStatus(null);
          return;
        }

        const daten = await res.json() as GenerierErgebnis;
        setErgebnis(daten);
        setLaufenderStatus(daten.status);

        if (daten.status !== 'fertig') {
          pollStatus(daten.slug);
        }
      } catch (err) {
        setFehler(err instanceof Error ? err.message : 'Netzwerkfehler');
        setLaufenderStatus(null);
      }
    });
  }

  const läuft = isPending || polling;
  const fertig = laufenderStatus === 'fertig';

  return (
    <div className={styles.wrapper}>
      <form onSubmit={absenden} className={styles.form}>
        {/* Titel-Eingabe */}
        <div className={styles.feldGruppe}>
          <label htmlFor="titel" className={styles.label}>
            Thema
          </label>
          <input
            id="titel"
            type="text"
            value={titel}
            onChange={(e) => onTitelChange(e.target.value)}
            placeholder="z.B. Fourier-Transformation, Ölmalerei, Japanisch…"
            className={styles.eingabe}
            disabled={läuft}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {existiert && (
            <p className={styles.hinweisWarn}>
              Ein Thema mit diesem Namen existiert bereits.{' '}
              <a href={`/thema/${slugify(titel)}`}>Zum Thema →</a>
            </p>
          )}
        </div>

        {/* Kategorie */}
        <div className={styles.feldGruppe}>
          <label className={styles.label}>
            Kategorie
            {!kategorieManual && (
              <span className={styles.labelHinweis}>automatisch erkannt</span>
            )}
          </label>
          <div className={styles.kategorieGrid}>
            {ALLE_KATEGORIEN.map((k) => (
              <button
                key={k}
                type="button"
                className={styles.kategorieBtn}
                data-aktiv={kategorie === k}
                style={{ '--farbe': KATEGORIE_FARBEN[k] } as React.CSSProperties}
                disabled={läuft}
                onClick={() => {
                  setKategorie(k);
                  setKategorieManual(true);
                }}
              >
                {KATEGORIE_LABELS[k]}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className={styles.feldGruppe}>
          <label htmlFor="tags" className={styles.label}>
            Tags
            <span className={styles.labelHinweis}>kommagetrennt, optional</span>
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="z.B. programmierung, mathematik, anfänger"
            className={styles.eingabe}
            disabled={läuft}
          />
        </div>

        {/* Schema-Vorschau */}
        {schemaVorschau && !existiert && (
          <div className={styles.schemaVorschau}>
            <span className={styles.schemaVorschauLabel}>Schema-Auswirkung</span>
            {schemaVorschau.änderung ? (
              <p className={styles.schemaÄnderung}>{schemaVorschau.änderung}</p>
            ) : (
              <p className={styles.schemaKeinÄnderung}>
                Kein Layoutwechsel – passt sich in bestehende Struktur ein.
              </p>
            )}
            <p className={styles.schemaNachher}>{schemaVorschau.nachher.analyse}</p>
          </div>
        )}

        {/* Fehler */}
        {fehler && (
          <div className={styles.fehlerBox} role="alert">
            {fehler}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={läuft || !titel.trim() || existiert}
        >
          {läuft ? 'Generiert…' : 'Generieren starten'}
        </button>
      </form>

      {/* Fortschrittsanzeige */}
      {laufenderStatus && (
        <GenerierFortschritt status={laufenderStatus} slug={ergebnis?.slug} />
      )}
    </div>
  );
}

function GenerierFortschritt({
  status,
  slug,
}: {
  status: GenerierStatus;
  slug?: string;
}) {
  const schritte: { id: GenerierStatus; label: string; beschreibung: string }[] = [
    { id: 'traumer_laeuft', label: 'Träumer', beschreibung: 'Spielerischer Einstieg wird erzeugt' },
    { id: 'denker_laeuft', label: 'Denker', beschreibung: 'Strukturiertes Wissen wird aufgebaut' },
    { id: 'denker2_laeuft', label: 'Denker²', beschreibung: 'Vollständige Synthese + Fakten' },
    { id: 'fertig', label: 'Fertig', beschreibung: 'In OrientDB gespeichert' },
  ];

  const reihenfolge: GenerierStatus[] = [
    'ausstehend', 'traumer_laeuft', 'denker_laeuft', 'denker2_laeuft', 'fertig',
  ];
  const aktuellerIndex = reihenfolge.indexOf(status);

  return (
    <div className={styles.fortschritt} role="status" aria-live="polite">
      <div className={styles.fortschrittSchritte}>
        {schritte.map((schritt, i) => {
          const schrittIndex = reihenfolge.indexOf(schritt.id);
          const erledigt = aktuellerIndex > schrittIndex || schritt.id == 'fertig';
          const aktiv = aktuellerIndex === schrittIndex;
          return (
            <div
              key={schritt.id}
              className={styles.schritt}
              data-erledigt={erledigt}
              data-aktiv={aktiv}
            >
              <div className={styles.schrittDot}>
                {erledigt ? '✓' : aktiv ? '…' : '·'}
              </div>
              <div className={styles.schrittInfo}>
                <span className={styles.schrittLabel}>{schritt.label}</span>
                <span className={styles.schrittBeschreibung}>{schritt.beschreibung}</span>
              </div>
            </div>
          );
        })}
      </div>

      {status === 'fertig' && slug && (
        <a href={`/thema/${slug}`} className={styles.ergebnisLink}>
          Thema ansehen →
        </a>
      )}

      {status === 'fehler' && (
        <p className={styles.fehlerHinweis}>
          {GENERIER_STATUS_LABELS.fehler}
        </p>
      )}
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

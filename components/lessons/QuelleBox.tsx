import type { ReactNode } from 'react';
import type { Quelle } from '@/types';
import { QUELLE_ICONS, QUELLE_TYP_LABELS, quelleKurz, quelleUrl } from '@/types';

/**
 * Quelle-Infobox am Ort der Referenz. Zeigt Bibliografie-Eintrag plus
 * vom Lektion-Autor kontextspezifisch ausgewählte Kernaussagen.
 *
 * Die Quelle wird vom Aufrufer übergeben (resolved aus dem
 * themen/<slug>/quellen.ts-Modul), damit dieser Component
 * client/server-neutral bleibt.
 */
export function QuelleBox({
  quelle,
  kernaussagen,
  children,
}: {
  quelle: Quelle;
  /** Bullet-Points: was steht in dieser Quelle, was hier zitiert wird. */
  kernaussagen?: string[];
  /** Alternative zu kernaussagen: freier Inhalt. */
  children?: ReactNode;
}) {
  const url = quelleUrl(quelle);
  const kurz = quelleKurz(quelle);
  const icon = QUELLE_ICONS[quelle.typ];

  const autoren =
    'autoren' in quelle
      ? quelle.autoren.join(', ')
      : 'autor' in quelle
        ? quelle.autor
        : undefined;

  // Klassen-Style: angelehnt an DepthBox, aber strukturierter Layout.
  return (
    <aside className="quelle-box">
      <header className="quelle-head">
        <span className="quelle-icon" aria-hidden>{icon}</span>
        <span className="quelle-typ">{QUELLE_TYP_LABELS[quelle.typ]}</span>
        <span className="quelle-kurz">·</span>
        <span className="quelle-kurz">{kurz}</span>
      </header>

      <h4 className="quelle-titel">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {quelle.titel}
          </a>
        ) : (
          quelle.titel
        )}
      </h4>

      {autoren && (
        <p className="quelle-meta">
          {autoren}
          {quelle.typ === 'paper' && quelle.venue && (
            <span className="quelle-venue"> · {quelle.venue}</span>
          )}
          {quelle.typ === 'buch' && quelle.verlag && (
            <span className="quelle-venue"> · {quelle.verlag}</span>
          )}
          {quelle.typ === 'talk' && quelle.venue && (
            <span className="quelle-venue"> · {quelle.venue}</span>
          )}
          {quelle.typ === 'blog' && quelle.site && (
            <span className="quelle-venue"> · {quelle.site}</span>
          )}
        </p>
      )}

      {(kernaussagen?.length ?? 0) > 0 && (
        <ul className="quelle-kernaussagen">
          {kernaussagen!.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      )}

      {children}

      {url && (
        <a
          className="quelle-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 {url.replace(/^https?:\/\//, '')}
        </a>
      )}
    </aside>
  );
}

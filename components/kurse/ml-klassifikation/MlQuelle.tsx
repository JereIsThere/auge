import type { ReactNode } from 'react';
import { QuelleBox } from '@/components/lessons/QuelleBox';
import { mlQuelleFinden } from '@/themen/ml-klassifikation/quellen';

/**
 * Convenience-Wrapper: zieht die ML-Quelle per ID aus
 * themen/ml-klassifikation/quellen.ts und rendert sie als QuelleBox.
 *
 * Verwendung in den Lektionen:
 *   <MlQuelle id="breiman2001-rf" kernaussagen={["…", "…"]} />
 */
export function MlQuelle({
  id,
  kernaussagen,
  children,
}: {
  id: string;
  kernaussagen?: string[];
  children?: ReactNode;
}) {
  const quelle = mlQuelleFinden(id);
  if (!quelle) {
    return (
      <div
        style={{
          padding: '8px 12px',
          border: '1px dashed #dc2626',
          borderRadius: 6,
          color: '#b91c1c',
          fontSize: '0.85rem',
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        Unbekannte Quelle: <code>{id}</code> – fehlt in
        themen/ml-klassifikation/quellen.ts
      </div>
    );
  }
  return (
    <QuelleBox quelle={quelle} kernaussagen={kernaussagen}>
      {children}
    </QuelleBox>
  );
}

import type { ReactNode } from 'react';
import { QuelleBox } from '@/components/lessons/QuelleBox';
import { kryptoQuelleFinden } from '@/themen/kryptografie/quellen';

export function KryptoQuelle({
  id,
  kernaussagen,
  children,
}: {
  id: string;
  kernaussagen?: string[];
  children?: ReactNode;
}) {
  const quelle = kryptoQuelleFinden(id);
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
        Unbekannte Quelle: <code>{id}</code> – fehlt in themen/kryptografie/quellen.ts
      </div>
    );
  }
  return (
    <QuelleBox quelle={quelle} kernaussagen={kernaussagen}>
      {children}
    </QuelleBox>
  );
}

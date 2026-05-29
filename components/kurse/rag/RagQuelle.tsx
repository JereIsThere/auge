import type { ReactNode } from 'react';
import { QuelleBox } from '@/components/lessons/QuelleBox';
import { ragQuelleFinden } from '@/themen/rag/quellen';

/**
 * Convenience-Wrapper: zieht die RAG-Quelle per ID aus themen/rag/quellen.ts
 * und rendert sie als QuelleBox am Ort der Referenz.
 *
 * Verwendung in den RAG-Lektionen:
 *   <RagQuelle id="liu2024-lostmiddle" kernaussagen={["…", "…"]} />
 */
export function RagQuelle({
  id,
  kernaussagen,
  children,
}: {
  id: string;
  kernaussagen?: string[];
  children?: ReactNode;
}) {
  const quelle = ragQuelleFinden(id);
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
        Unbekannte Quelle: <code>{id}</code> – fehlt in themen/rag/quellen.ts
      </div>
    );
  }
  return (
    <QuelleBox quelle={quelle} kernaussagen={kernaussagen}>
      {children}
    </QuelleBox>
  );
}

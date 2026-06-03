import type { Thema } from '@/types';
import { PLATZHALTER_THEMEN } from './_platzhalter';
import kryptografie from './kryptografie/meta';
import rag from './rag/meta';
import mcp from './mcp/meta';
import aquarell from './aquarell/meta';
import procreateRendering from './procreate-rendering/meta';
import neurologieMmc from './neurologie-mmc/meta';
import nextAuthBeta from './next-auth-beta/meta';
import htmlCss from './html-css/meta';

// Registry aller Themen.
//
// • Ausgearbeitete Themen leben in themen/<slug>/meta.ts mit Gruppen,
//   Lektionen, Pfaden – werden hier direkt importiert und vorn einsortiert.
// • Platzhalter-Themen (status "kommt-noch") leben in _platzhalter.ts —
//   knappe Stubs mit Kurzbeschreibung, keine Lektionen.

export const THEMEN: Thema[] = [
  kryptografie,
  rag,
  mcp,
  aquarell,
  procreateRendering,
  neurologieMmc,
  nextAuthBeta,
  htmlCss,
  ...PLATZHALTER_THEMEN,
];

export function alleThemen(): Thema[] {
  return THEMEN;
}

export function themaFinden(slug: string): Thema | undefined {
  return THEMEN.find((t) => t.slug === slug);
}

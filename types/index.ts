import type { ComponentType } from 'react';

export type Kategorie = 'cs' | 'art' | 'math' | 'sprache' | 'sonstiges';

export type ThemaStatus = 'kommt-noch' | 'in-arbeit' | 'fertig';

export interface Lektion {
  slug: string;
  titel: string;
  icon?: string;
  kurzbeschreibung?: string;
  /** Handgebaut: dynamischer Component-Import. */
  loader?: () => Promise<{ default: ComponentType }>;
  /** Marker, wenn die Lektion noch nicht implementiert ist. */
  kommtNoch?: boolean;
}

export interface LektionsGruppe {
  titel: string;
  untertitel?: string;
  lektionen: Lektion[];
}

export interface Pfad {
  slug: string;
  titel: string;
  beschreibung: string;
  icon?: string;
  /** Lektions-Slugs in empfohlener Reihenfolge. */
  lektionenSlugs: string[];
  /** Tailwind-Gradient-Klassen, z.B. "from-emerald-500 to-teal-600". */
  akzent?: string;
}

export interface Thema {
  slug: string;
  titel: string;
  kategorie: Kategorie;
  /** Kurzer Untertitel für die Karte. */
  kurzbeschreibung: string;
  /** Längere Beschreibung für den Thema-Hub. */
  beschreibung?: string;
  tags?: string[];
  status: ThemaStatus;
  gruppen: LektionsGruppe[];
  pfade?: Pfad[];
  /** Akzent für die Hero-Karte des Thema-Hubs. */
  akzent?: string;
}

// Serialisierbare Variante eines Themas für Client-Komponenten
// (Loader-Funktionen lassen sich nicht durch die Client-Grenze reichen).
export interface ThemaSummary {
  slug: string;
  titel: string;
  kategorie: Kategorie;
  kurzbeschreibung: string;
  status: ThemaStatus;
  tags?: string[];
  lektionsAnzahl: number;
  spielbarAnzahl: number;
}

export function themaSummary(thema: Thema): ThemaSummary {
  const flach = lektionenFlach(thema);
  return {
    slug: thema.slug,
    titel: thema.titel,
    kategorie: thema.kategorie,
    kurzbeschreibung: thema.kurzbeschreibung,
    status: thema.status,
    tags: thema.tags,
    lektionsAnzahl: flach.length,
    spielbarAnzahl: flach.filter((l) => !l.kommtNoch).length,
  };
}

// Aus der Themenverteilung berechnetes Landing-Layout
export interface SchemaLayout {
  typ: 'gesplittet' | 'gleichmaessig' | 'einseitig';
  primaer?: {
    kategorie: Kategorie;
    themen: ThemaSummary[];
    anteil: number; // 0–1
  };
  sekundaer: Array<{
    kategorie: Kategorie;
    themen: ThemaSummary[];
    anteil: number;
  }>;
  analyse: string;
}

export const KATEGORIE_LABELS: Record<Kategorie, string> = {
  cs: 'Informatik',
  art: 'Kunst',
  math: 'Mathematik',
  sprache: 'Sprache',
  sonstiges: 'Sonstiges',
};

export const KATEGORIE_FARBEN: Record<Kategorie, string> = {
  cs: '#00d4c8',
  art: '#d4a200',
  math: '#6b00cc',
  sprache: '#00cc6b',
  sonstiges: '#cc006b',
};

export const STATUS_LABELS: Record<ThemaStatus, string> = {
  'kommt-noch': 'kommt noch',
  'in-arbeit': 'in Arbeit',
  fertig: 'fertig',
};

// Hilfsfunktion: alle Lektionen eines Themas flach
export function lektionenFlach(thema: Thema): Lektion[] {
  return thema.gruppen.flatMap((g) => g.lektionen);
}

export function lektionFinden(thema: Thema, slug: string): Lektion | undefined {
  return lektionenFlach(thema).find((l) => l.slug === slug);
}

export function nachbarLektionen(
  thema: Thema,
  slug: string
): { vorher?: Lektion; nachher?: Lektion } {
  const flach = lektionenFlach(thema);
  const i = flach.findIndex((l) => l.slug === slug);
  if (i === -1) return {};
  return {
    vorher: i > 0 ? flach[i - 1] : undefined,
    nachher: i < flach.length - 1 ? flach[i + 1] : undefined,
  };
}

// ────────────────────────────────────────────────────────────
// Wissenschaftliche Quellen
// ────────────────────────────────────────────────────────────

interface QuelleBase {
  /** Stabiler Identifier, z.B. "liu2024-lostmiddle". */
  id: string;
  titel: string;
  jahr: number;
  /** Direkter Link (DOI, arXiv, Verlag, etc.) – optional. */
  url?: string;
}

export interface QuellePaper extends QuelleBase {
  typ: 'paper';
  autoren: string[];
  /** Konferenz/Journal, z.B. "TACL", "NeurIPS 2020". */
  venue?: string;
  /** arXiv-ID ohne Prefix, z.B. "2307.03172". */
  arxiv?: string;
  doi?: string;
}

export interface QuelleBuch extends QuelleBase {
  typ: 'buch';
  autoren: string[];
  verlag?: string;
  isbn?: string;
}

export interface QuelleRfc extends QuelleBase {
  typ: 'rfc';
  /** Nummer, z.B. 8446 für TLS 1.3. */
  nummer: number;
}

export interface QuelleStandard extends QuelleBase {
  typ: 'standard';
  /** Vergebende Org, z.B. "NIST", "IEEE", "ISO". */
  organisation: string;
  /** z.B. "FIPS 197", "ISO/IEC 14882:2020". */
  nummer: string;
}

export interface QuelleBlog extends QuelleBase {
  typ: 'blog';
  autor: string;
  /** Optionaler Site-Name, z.B. "OpenAI Blog". */
  site?: string;
}

export interface QuelleTalk extends QuelleBase {
  typ: 'talk';
  autoren: string[];
  /** Konferenz/Event, z.B. "Stanford CS25". */
  venue?: string;
}

export type Quelle =
  | QuellePaper
  | QuelleBuch
  | QuelleRfc
  | QuelleStandard
  | QuelleBlog
  | QuelleTalk;

export const QUELLE_ICONS: Record<Quelle['typ'], string> = {
  paper: '📄',
  buch: '📕',
  rfc: '📃',
  standard: '📋',
  blog: '📝',
  talk: '🎤',
};

export const QUELLE_TYP_LABELS: Record<Quelle['typ'], string> = {
  paper: 'Paper',
  buch: 'Buch',
  rfc: 'RFC',
  standard: 'Standard',
  blog: 'Blog',
  talk: 'Talk',
};

// ────────────────────────────────────────────────────────────
// Blog & Live Feed
// ────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  titel: string;
  datum: string;
  autor: string;
  kurztext: string;
  icon?: string;
  /** Artikel-Component, analog zum Lektions-Loader. */
  loader?: () => Promise<{ default: ComponentType }>;
  /** Slug eines passenden Themas — wird unterm Artikel verlinkt. */
  themaSlug?: string;
}

/** Kurzform „Autor et al. Jahr" für Marker im Fließtext. */
export function quelleKurz(q: Quelle): string {
  if (q.typ === 'rfc') return `RFC ${q.nummer}`;
  if (q.typ === 'standard') return `${q.organisation} ${q.nummer}`;
  const autoren =
    'autoren' in q ? q.autoren : 'autor' in q ? [q.autor] : [];
  if (autoren.length === 0) return `${q.titel} (${q.jahr})`;
  const ersterNachname = autoren[0].split(/\s+/).slice(-1)[0];
  const suffix = autoren.length > 1 ? ' et al.' : '';
  return `${ersterNachname}${suffix} ${q.jahr}`;
}

/** Bestmögliche URL einer Quelle (arXiv → DOI → URL → RFC-Editor). */
export function quelleUrl(q: Quelle): string | undefined {
  if (q.typ === 'paper') {
    if (q.arxiv) return `https://arxiv.org/abs/${q.arxiv}`;
    if (q.doi) return `https://doi.org/${q.doi}`;
  }
  if (q.typ === 'rfc') return `https://www.rfc-editor.org/rfc/rfc${q.nummer}`;
  return q.url;
}

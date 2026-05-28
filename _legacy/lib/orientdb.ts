import type { Thema, Kategorie, GenerierStatus } from '@/types';
import exampleData from '@/data/example.json';

const useExample = process.env.USE_EXAMPLE_DATA === 'true' || !process.env.ORIENTDB_HOST;

const BASE_URL = `http://${process.env.ORIENTDB_HOST ?? 'localhost'}:${process.env.ORIENTDB_PORT ?? 2480}`;
const DB = process.env.ORIENTDB_DATABASE ?? 'auge';
const AUTH = Buffer.from(
  `${process.env.ORIENTDB_USERNAME ?? 'root'}:${process.env.ORIENTDB_PASSWORD ?? ''}`
).toString('base64');

async function query<T>(sql: string): Promise<T[]> {
  const res = await fetch(`${BASE_URL}/query/${DB}/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AUTH}`,
    },
    body: JSON.stringify({ query: sql }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`OrientDB query failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result ?? [];
}

async function command(sql: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/command/${DB}/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${AUTH}`,
    },
    body: JSON.stringify({ command: sql }),
  });
  if (!res.ok) throw new Error(`OrientDB command failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Initialisiert das Schema in OrientDB (einmalig ausführen)
export async function initialisiereSchema(): Promise<void> {
  await command(`CREATE CLASS Thema EXTENDS V IF NOT EXISTS`);
  await command(`CREATE CLASS Fakt EXTENDS V IF NOT EXISTS`);
  await command(`CREATE CLASS HatFakt EXTENDS E IF NOT EXISTS`);
  await command(`CREATE PROPERTY Thema.slug STRING IF NOT EXISTS`);
  await command(`CREATE INDEX Thema.slug ON Thema (slug) UNIQUE IF NOT EXISTS`);
}

function mapOrientRow(row: Record<string, unknown>): Thema {
  return {
    id: String(row['@rid'] ?? row['id'] ?? ''),
    slug: String(row['slug'] ?? ''),
    titel: String(row['titel'] ?? ''),
    kategorie: (row['kategorie'] as Kategorie) ?? 'sonstiges',
    tags: (row['tags'] as string[]) ?? [],
    stufen: {
      traumer: row['stufe1Html']
        ? {
            html: String(row['stufe1Html']),
            zusammenfassung: row['stufe1Zusammenfassung'] as string | undefined,
            erstelltAm: String(row['stufe1ErstelltAm'] ?? ''),
          }
        : undefined,
      denker: row['stufe2Html']
        ? {
            html: String(row['stufe2Html']),
            zusammenfassung: row['stufe2Zusammenfassung'] as string | undefined,
            erstelltAm: String(row['stufe2ErstelltAm'] ?? ''),
          }
        : undefined,
      denker2: row['stufe3Html']
        ? {
            html: String(row['stufe3Html']),
            zusammenfassung: row['stufe3Zusammenfassung'] as string | undefined,
            erstelltAm: String(row['stufe3ErstelltAm'] ?? ''),
          }
        : undefined,
    },
    fakten: [],
    status: (row['status'] as GenerierStatus) ?? 'ausstehend',
    erstelltAm: String(row['erstelltAm'] ?? ''),
    aktualisiertAm: String(row['aktualisiertAm'] ?? ''),
  };
}

export async function alleThemenLaden(): Promise<Thema[]> {
  if (useExample) {
    return exampleData.themen as Thema[];
  }
  try {
    const rows = await query<Record<string, unknown>>(
      `SELECT @rid, slug, titel, kategorie, tags, status,
              stufe1Html, stufe1Zusammenfassung, stufe1ErstelltAm,
              stufe2Html, stufe2Zusammenfassung, stufe2ErstelltAm,
              stufe3Html, stufe3Zusammenfassung, stufe3ErstelltAm,
              erstelltAm, aktualisiertAm
       FROM Thema ORDER BY erstelltAm DESC`
    );
    return rows.map(mapOrientRow);
  } catch (err) {
    console.error('[OrientDB] alleThemenLaden fehlgeschlagen:', err);
    return [];
  }
}

export async function themaLaden(slug: string): Promise<Thema | null> {
  if (useExample) {
    return (exampleData.themen as Thema[]).find((t) => t.slug === slug) ?? null;
  }
  try {
    const rows = await query<Record<string, unknown>>(
      `SELECT @rid, slug, titel, kategorie, tags, status,
              stufe1Html, stufe1Zusammenfassung, stufe1ErstelltAm,
              stufe2Html, stufe2Zusammenfassung, stufe2ErstelltAm,
              stufe3Html, stufe3Zusammenfassung, stufe3ErstelltAm,
              erstelltAm, aktualisiertAm
       FROM Thema WHERE slug = '${slug.replace(/'/g, "\\'")}'`
    );
    return rows.length > 0 ? mapOrientRow(rows[0]) : null;
  } catch (err) {
    console.error('[OrientDB] themaLaden fehlgeschlagen:', err);
    return null;
  }
}

export async function themaErstellen(
  slug: string,
  titel: string,
  kategorie: Kategorie,
  tags: string[]
): Promise<string> {
  if (useExample) {
    // Im Example-Modus geben wir nur den Slug zurück
    return slug;
  }
  const tagsJson = JSON.stringify(tags);
  const jetzt = new Date().toISOString();
  const res = await command(
    `INSERT INTO Thema (slug, titel, kategorie, tags, status, erstelltAm, aktualisiertAm)
     VALUES ('${slug}', '${titel.replace(/'/g, "\\'")}', '${kategorie}',
             ${tagsJson}, 'ausstehend', '${jetzt}', '${jetzt}')`
  );
  const result = res as { result?: Array<{ '@rid': string }> };
  return result.result?.[0]?.['@rid'] ?? slug;
}

export async function statusAktualisieren(
  slug: string,
  status: GenerierStatus,
  update?: {
    stufe?: 1 | 2 | 3;
    html?: string;
    zusammenfassung?: string;
  }
): Promise<void> {
  if (useExample) return;

  const jetzt = new Date().toISOString();
  let setSql = `status = '${status}', aktualisiertAm = '${jetzt}'`;

  if (update?.stufe && update.html) {
    const n = update.stufe;
    setSql += `, stufe${n}Html = '${update.html.replace(/'/g, "\\'")}', stufe${n}ErstelltAm = '${jetzt}'`;
    if (update.zusammenfassung) {
      setSql += `, stufe${n}Zusammenfassung = '${update.zusammenfassung.replace(/'/g, "\\'")}'`;
    }
  }

  await command(
    `UPDATE Thema SET ${setSql} WHERE slug = '${slug.replace(/'/g, "\\'")}'`
  );
}

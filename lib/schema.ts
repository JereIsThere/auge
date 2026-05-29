import type { Thema, ThemaSummary, Kategorie, SchemaLayout } from '@/types';
import { themaSummary } from '@/types';

// Erkennt die Themenverteilung und berechnet ein passendes Landing-Layout.
// Beispiel: 7 CS, 2 Art, 1 Math → typ:'gesplittet', CS primär, Art+Math sekundär
export function berechneSchemaLayout(themen: Thema[]): SchemaLayout {
  const summaries = themen.map(themaSummary);

  if (summaries.length === 0) {
    return { typ: 'gleichmaessig', sekundaer: [], analyse: 'Noch keine Themen vorhanden.' };
  }

  const zählung: Partial<Record<Kategorie, number>> = {};
  for (const t of summaries) {
    zählung[t.kategorie] = (zählung[t.kategorie] ?? 0) + 1;
  }

  const sortiert = (Object.entries(zählung) as [Kategorie, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const gesamt = summaries.length;
  const themenNachKat = groupBy(summaries, (t) => t.kategorie);

  const [hauptKat, hauptAnzahl] = sortiert[0];
  const hauptAnteil = hauptAnzahl / gesamt;

  if (hauptAnteil > 0.5 && sortiert.length > 1) {
    const sekundaer = sortiert.slice(1).map(([kat, n]) => ({
      kategorie: kat,
      themen: themenNachKat[kat] ?? [],
      anteil: n / gesamt,
    }));

    const sekundaerLabels = sekundaer.map((s) => kategorieLabel(s.kategorie)).join(', ');
    const analyse =
      `Schwerpunkt ${kategorieLabel(hauptKat)} (${Math.round(hauptAnteil * 100)} % der Themen). ` +
      `${sekundaerLabels} ${sekundaer.length === 1 ? 'ist' : 'sind'} klar abgetrennt.`;

    return {
      typ: 'gesplittet',
      primaer: { kategorie: hauptKat, themen: themenNachKat[hauptKat] ?? [], anteil: hauptAnteil },
      sekundaer,
      analyse,
    };
  }

  if (sortiert.length === 1) {
    return {
      typ: 'einseitig',
      primaer: { kategorie: hauptKat, themen: summaries, anteil: 1 },
      sekundaer: [],
      analyse: `Alle Themen gehören zu ${kategorieLabel(hauptKat)}.`,
    };
  }

  const sekundaer = sortiert.map(([kat, n]) => ({
    kategorie: kat,
    themen: themenNachKat[kat] ?? [],
    anteil: n / gesamt,
  }));
  const analyse =
    `Ausgeglichene Verteilung über ${sortiert.length} Bereiche: ` +
    sortiert.map(([k, n]) => `${kategorieLabel(k)} (${n})`).join(', ') +
    '.';

  return { typ: 'gleichmaessig', sekundaer, analyse };
}

function groupBy<T>(arr: T[], fn: (t: T) => Kategorie): Partial<Record<Kategorie, T[]>> {
  return arr.reduce(
    (acc, t) => {
      const k = fn(t);
      (acc[k] ??= []).push(t);
      return acc;
    },
    {} as Partial<Record<Kategorie, T[]>>
  );
}

function kategorieLabel(k: Kategorie): string {
  const labels: Record<Kategorie, string> = {
    cs: 'Informatik',
    art: 'Kunst',
    math: 'Mathematik',
    sprache: 'Sprache',
    sonstiges: 'Sonstiges',
  };
  return labels[k];
}

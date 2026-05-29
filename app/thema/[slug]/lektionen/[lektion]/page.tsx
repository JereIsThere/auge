import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { alleThemen, themaFinden } from '@/themen';
import {
  KATEGORIE_LABELS,
  lektionFinden,
  nachbarLektionen,
} from '@/types';
import { LessonsScope } from '@/components/lessons/LessonsScope';
import { LessonsSidebar } from '@/components/lessons/LessonsSidebar';
import { ThemeToggle } from '@/components/lessons/ThemeToggle';
import '@/components/lessons/lesson.css';

interface Props {
  params: Promise<{ slug: string; lektion: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string; lektion: string }[] = [];
  for (const t of alleThemen()) {
    for (const g of t.gruppen) {
      for (const l of g.lektionen) {
        if (!l.kommtNoch && l.loader) {
          params.push({ slug: t.slug, lektion: l.slug });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lektion } = await params;
  const thema = themaFinden(slug);
  if (!thema) return { title: 'Nicht gefunden' };
  const l = lektionFinden(thema, lektion);
  if (!l) return { title: 'Lektion nicht gefunden' };
  return {
    title: `${l.titel} · ${thema.titel}`,
    description: l.kurzbeschreibung ?? thema.kurzbeschreibung,
  };
}

export default async function LektionsSeite({ params }: Props) {
  const { slug, lektion } = await params;
  const thema = themaFinden(slug);
  if (!thema) notFound();
  const l = lektionFinden(thema, lektion);
  if (!l) notFound();
  if (l.kommtNoch || !l.loader) {
    return (
      <LessonsScope>
        <ThemeToggle />
        <div className="flex min-h-screen">
          <LessonsSidebar thema={thema} aktuellerSlug={lektion} />
          <main className="flex-1 px-10 py-10">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Diese Lektion ist noch in Arbeit.
                </p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Sobald sie fertig ist, kannst du sie hier durcharbeiten.
                </p>
                <Link
                  href={`/thema/${thema.slug}`}
                  className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  ← Zurück zur Themen-Übersicht
                </Link>
              </div>
            </div>
          </main>
        </div>
      </LessonsScope>
    );
  }

  const Component = (await l.loader()).default;
  const { vorher, nachher } = nachbarLektionen(thema, lektion);

  return (
    <LessonsScope>
      <ThemeToggle />
      <div className="flex min-h-screen">
        <LessonsSidebar thema={thema} aktuellerSlug={lektion} />
        <main className="flex-1 px-10 py-10">
          <div className="mx-auto max-w-3xl flex flex-col gap-8">
            <nav className="text-xs text-zinc-500 dark:text-zinc-400">
              <Link href="/" className="hover:underline">Auge</Link>
              <span aria-hidden> · </span>
              <Link href={`/thema/${thema.slug}`} className="hover:underline">
                {KATEGORIE_LABELS[thema.kategorie]}: {thema.titel}
              </Link>
            </nav>

            <Component />

            <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
              {vorher && !vorher.kommtNoch ? (
                <Link
                  href={`/thema/${thema.slug}/lektionen/${vorher.slug}`}
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                >
                  ← {vorher.titel}
                </Link>
              ) : (
                <span />
              )}
              {nachher && !nachher.kommtNoch ? (
                <Link
                  href={`/thema/${thema.slug}/lektionen/${nachher.slug}`}
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                >
                  {nachher.titel} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </main>
      </div>
    </LessonsScope>
  );
}

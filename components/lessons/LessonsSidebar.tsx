import Link from "next/link";
import type { Thema } from "@/types";

interface Props {
  thema: Thema;
  aktuellerSlug?: string;
}

export function LessonsSidebar({ thema, aktuellerSlug }: Props) {
  return (
    <nav className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link
          href={`/thema/${thema.slug}`}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← {thema.titel}
        </Link>
        <h2 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
          Lektionen
        </h2>
      </div>
      <div className="flex flex-col gap-5">
        {thema.gruppen.map((gruppe) => (
          <div key={gruppe.titel}>
            <div className="mb-1.5 px-3 text-[11px] font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              {gruppe.titel}
            </div>
            <ul className="flex flex-col gap-0.5">
              {gruppe.lektionen.map((lektion) => {
                const isActive = lektion.slug === aktuellerSlug;
                const baseClass =
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
                const activeClass =
                  "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white";
                const idleClass =
                  "text-zinc-700 hover:bg-white hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white";
                const mutedClass =
                  "text-zinc-400 italic dark:text-zinc-600";

                if (lektion.kommtNoch) {
                  return (
                    <li key={lektion.slug}>
                      <span
                        className={`${baseClass} ${mutedClass} cursor-not-allowed`}
                        title="kommt noch"
                      >
                        <span className="w-5 text-center">{lektion.icon ?? "·"}</span>
                        {lektion.titel}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={lektion.slug}>
                    <Link
                      href={`/thema/${thema.slug}/lektionen/${lektion.slug}`}
                      className={`${baseClass} ${isActive ? activeClass : idleClass}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="w-5 text-center">{lektion.icon ?? "•"}</span>
                      {lektion.titel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

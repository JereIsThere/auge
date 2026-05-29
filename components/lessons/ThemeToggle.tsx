"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("auge-lessons-theme", next);
    setTheme(next);
  }

  const icon = theme === "dark" ? "☀️" : "🌙";
  const label = theme === "dark" ? "Hell" : "Dunkel";

  return (
    <button
      onClick={toggle}
      title={`Wechseln zu ${label}`}
      aria-label={`Wechseln zu ${label} (aktuell: ${theme === "dark" ? "Dunkel" : "Hell"})`}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:scale-105 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:border-zinc-500"
    >
      <span aria-hidden className="text-base leading-none">
        {mounted ? icon : "🌙"}
      </span>
      <span>{mounted ? label : ""}</span>
    </button>
  );
}

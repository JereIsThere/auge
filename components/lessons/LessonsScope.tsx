"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Lokaler Wrapper für den Lektions-Bereich. Setzt einen hellen Lern-Look
 * (mit dark/light-Toggle), während die Auge-Codex-Frame außenrum dunkel
 * bleibt. Synchronisiert die Dark-Mode-Klasse auf `<html>` mit
 * localStorage, damit Tailwind-`dark:`-Klassen in den Lektionen greifen.
 */
export function LessonsScope({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auge-lessons-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = stored === "dark" || (stored !== "light" && prefersDark);
      document.documentElement.classList.toggle("dark", isDark);
    } catch {
      /* ignore */
    }

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return <div className="lessons-scope">{children}</div>;
}

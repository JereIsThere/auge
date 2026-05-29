"use client";

import { useState } from "react";
import Link from "next/link";

function caesar(text: string, shift: number): string {
  return text
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
      }
      return c;
    })
    .join("");
}

export function MiniCaesar() {
  const [text, setText] = useState("Hallo Welt");
  const [shift, setShift] = useState(3);

  const out = caesar(text, shift);

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-800/70">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
          Mini-Demo · Caesar-Verschiebung
        </span>
        <Link
          href="/thema/kryptografie/lektionen/caesar"
          className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Volle Lektion →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
          placeholder="Tippe etwas..."
        />

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            Shift
          </label>
          <input
            type="range"
            min={-25}
            max={25}
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className="flex-1 accent-indigo-500 dark:accent-indigo-400"
          />
          <span className="w-10 text-center font-mono text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            {shift > 0 ? `+${shift}` : shift}
          </span>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-mono break-all text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          {out || "…"}
        </div>
      </div>
    </div>
  );
}

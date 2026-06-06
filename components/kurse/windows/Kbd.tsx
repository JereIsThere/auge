import type { ReactNode } from "react";
import "./windows.css";

/** Eine einzelne Taste als Keycap. */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

/**
 * Eine Tastenkombination. `keys` ist ein "+"-getrennter String
 * (z.B. "Win+R") oder ein Array von Tastennamen. Rendert Keycaps mit
 * dezenten "+"-Trennern. Directiveless — nutzbar in Server- und
 * Client-Lektionen (wie DepthBox).
 */
export function Combo({ keys }: { keys: string | string[] }) {
  const liste = Array.isArray(keys)
    ? keys
    : keys.split("+").map((k) => k.trim());
  return (
    <span className="win-combo">
      {liste.map((k, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {i > 0 ? <span className="win-combo-plus" aria-hidden>+</span> : null}
          <Kbd>{k}</Kbd>
        </span>
      ))}
    </span>
  );
}

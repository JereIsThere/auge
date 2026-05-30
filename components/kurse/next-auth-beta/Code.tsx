import type { ReactNode } from "react";

/**
 * Kleiner Code-Block für die Auth.js-Lektionen.
 * Dunkles Terminal-Theme, monospace, horizontal scrollbar.
 * Optional ein Datei-/Sprach-Label im Kopf.
 */
export function Code({
  label,
  children,
}: {
  /** z.B. "auth.ts" oder "Terminal". */
  label?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ margin: "12px 0" }}>
      {label && (
        <div
          className="mono"
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.04em",
            color: "#64748b",
            background: "#f1f5f9",
            border: "1px solid #e5e7eb",
            borderBottom: "none",
            borderRadius: "6px 6px 0 0",
            padding: "4px 12px",
            display: "inline-block",
          }}
        >
          {label}
        </div>
      )}
      <pre
        className="mono"
        style={{
          fontSize: "0.82rem",
          lineHeight: 1.55,
          background: "#1a1a1a",
          color: "#e5e7eb",
          padding: "12px 16px",
          borderRadius: label ? "0 6px 6px 6px" : 6,
          whiteSpace: "pre",
          overflowX: "auto",
          margin: 0,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

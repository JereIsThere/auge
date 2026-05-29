import type { ReactNode } from "react";

export type DepthVariant = "basic" | "why" | "mistake" | "deeper" | "related" | "history";

const META: Record<DepthVariant, { icon: string; label: string; cls: string }> = {
  basic: { icon: "🌱", label: "Erstmal einfach", cls: "depth-box depth-basic" },
  why: { icon: "🤔", label: "Warum eigentlich?", cls: "depth-box depth-why" },
  mistake: { icon: "⚠️", label: "Häufiger Denkfehler", cls: "depth-box depth-mistake" },
  deeper: { icon: "🔬", label: "Tiefer rein", cls: "depth-box depth-deeper" },
  related: { icon: "🔗", label: "Hängt zusammen mit…", cls: "depth-box depth-related" },
  history: { icon: "📜", label: "Geschichte", cls: "depth-box depth-history" },
};

export function DepthBox({
  variant,
  title,
  defaultOpen = false,
  children,
}: {
  variant: DepthVariant;
  title?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const m = META[variant];
  return (
    <details className={m.cls} {...(defaultOpen ? { open: true } : {})}>
      <summary className="depth-summary">
        <span className="depth-icon" aria-hidden>{m.icon}</span>
        <span className="depth-label">{m.label}</span>
        {title ? <span className="depth-title"> — {title}</span> : null}
        <span className="depth-chevron" aria-hidden>›</span>
      </summary>
      <div className="depth-body">{children}</div>
    </details>
  );
}

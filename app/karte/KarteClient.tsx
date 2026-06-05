'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  NODES, getEdges, getNode,
  STATUS_COLOR, STATUS_LABEL, NODE_RADIUS, GLOW_RADIUS,
  type EcoNode,
} from '@/lib/ecosystem'
import styles from './karte.module.css'

const VW = 1000
const VH = 640

// ── Geometrie ────────────────────────────────────────────────────────────────

/** Quadratic-Bezier-Pfad mit seitlichem Versatz für organische Kurven. */
function edgePath(from: EcoNode, to: EcoNode): string {
  const dx = to.mx - from.mx
  const dy = to.my - from.my
  const len = Math.hypot(dx, dy)
  // Senkrechter Einheitsvektor
  const nx = -dy / len
  const ny =  dx / len
  const curve = len * 0.22
  const cx = (from.mx + to.mx) / 2 + nx * curve
  const cy = (from.my + to.my) / 2 + ny * curve
  return `M ${from.mx} ${from.my} Q ${cx} ${cy} ${to.mx} ${to.my}`
}

// ── Dekorative Elemente ──────────────────────────────────────────────────────

// Accent-Circles: manuelle "Sterne" für atmosphere (deterministic, kein Math.random)
const ACCENT_STARS = [
  [72,  44], [183, 87], [640, 55], [830, 30], [940, 95],
  [65, 180], [420,165], [780,145], [955,200], [115,285],
  [470,230], [600,200], [880,340], [30, 400], [190,380],
  [550,350], [870,545], [730,580], [430,600], [240,620],
  [960,480], [50, 550], [650,490],
] as const

// ── Popup-Panel ──────────────────────────────────────────────────────────────

function Popup({
  node,
  onClose,
  onSelectDep,
}: {
  node: EcoNode
  onClose: () => void
  onSelectDep: (id: string) => void
}) {
  const color = STATUS_COLOR[node.status]

  return (
    <aside className={styles.popup} onClick={e => e.stopPropagation()}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Schließen">
        ✕
      </button>

      <div className={styles.popupHead}>
        <span className={styles.popupEmoji} aria-hidden>{node.emoji}</span>
        <div className={styles.popupMeta}>
          <h2 className={styles.popupName} style={{ color }}>{node.name}</h2>
          <span className={styles.badge} data-status={node.status}>
            <span className={styles.badgeDot} style={{ background: color }} />
            {STATUS_LABEL[node.status]}
          </span>
        </div>
      </div>

      {node.port && (
        <div className={styles.popupPort} style={{ color }}>:{node.port}</div>
      )}

      <p className={styles.popupTagline}>{node.tagline}</p>

      <ul className={styles.popupDetails}>
        {node.details.map((d, i) => <li key={i}>{d}</li>)}
      </ul>

      {node.deps.length > 0 && (
        <div className={styles.popupDeps}>
          <span className={styles.depsLabel}>Abhängig von</span>
          <div className={styles.depChips}>
            {node.deps.map(depId => {
              const dep = getNode(depId)
              return dep ? (
                <button
                  key={depId}
                  className={styles.depChip}
                  onClick={() => onSelectDep(depId)}
                >
                  {dep.emoji} {dep.name}
                </button>
              ) : null
            })}
          </div>
        </div>
      )}

      {node.url && (
        <a
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.popupLink}
          style={{ color }}
        >
          ↗ GitHub
        </a>
      )}
    </aside>
  )
}

// ── Haupt-Komponente ─────────────────────────────────────────────────────────

export default function KarteClient({ activeRepoIds = [] }: { activeRepoIds?: string[] }) {
  const [selected, setSelected] = useState<EcoNode | null>(null)
  const [hovered,  setHovered]  = useState<string | null>(null)
  const activeSet = new Set(activeRepoIds)

  const edges = getEdges()

  // ESC schließt Popup
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const selectNode = useCallback((node: EcoNode) => setSelected(node), [])
  const selectById = useCallback((id: string) => {
    const n = getNode(id)
    if (n) setSelected(n)
  }, [])

  // Welche IDs sind "verbunden" mit dem hover-Node?
  const connectedIds = hovered
    ? new Set([
        hovered,
        ...edges.filter(e => e.from.id === hovered || e.to.id === hovered)
              .flatMap(e => [e.from.id, e.to.id]),
      ])
    : null

  return (
    <div className={styles.root}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navigation">
        <a href="/">auge</a>
        <span aria-hidden>/</span>
        <span>karte</span>
      </nav>

      {/* SVG-Karte */}
      <div
        className={styles.mapWrap}
        onClick={() => setSelected(null)}
      >
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className={styles.map}
          role="img"
          aria-label="Auge-Ökosystem – 2D Karte aller Projekte"
        >
          <defs>
            {/* Glow-Filter pro Status */}
            <filter id="glow-live" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="10" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-prog" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-plan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Feines Dot-Grid */}
            <pattern id="dotGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="0"  cy="0"  r="0.7" fill="rgba(200,192,216,0.14)" />
              <circle cx="40" cy="0"  r="0.7" fill="rgba(200,192,216,0.14)" />
              <circle cx="0"  cy="40" r="0.7" fill="rgba(200,192,216,0.14)" />
              <circle cx="40" cy="40" r="0.7" fill="rgba(200,192,216,0.14)" />
            </pattern>

            {/* Gradient für jede Edge */}
            {edges.map(({ from, to }) => (
              <linearGradient
                key={`grad-${from.id}-${to.id}`}
                id={`grad-${from.id}-${to.id}`}
                x1={from.mx} y1={from.my}
                x2={to.mx}   y2={to.my}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor={STATUS_COLOR[from.status]} stopOpacity="0.55" />
                <stop offset="100%" stopColor={STATUS_COLOR[to.status]}   stopOpacity="0.25" />
              </linearGradient>
            ))}
          </defs>

          {/* ── Hintergrund ───────────────────────────────────────────── */}
          <rect width={VW} height={VH} fill="#06000e" />
          <rect width={VW} height={VH} fill="url(#dotGrid)" />

          {/* Akzent-Sterne */}
          {ACCENT_STARS.map(([x, y], i) => (
            <circle
              key={i}
              cx={x} cy={y}
              r={i % 5 === 0 ? 1.2 : 0.75}
              fill="rgba(200,192,216,0.22)"
            />
          ))}

          {/* Atmosphären-Zonen (sehr subtil) */}
          <ellipse cx={350} cy={420} rx={240} ry={175} fill="rgba(212,162,0,0.018)" />
          <ellipse cx={690} cy={390} rx={225} ry={190} fill="rgba(107,0,204,0.022)" />
          <ellipse cx={500} cy={160} rx={310} ry={160} fill="rgba(0,212,200,0.012)" />

          {/* Orbitale Ringe um auge */}
          {[100, 175, 265, 370].map((r, i) => (
            <circle
              key={r}
              cx={500} cy={115}
              r={r}
              fill="none"
              stroke="rgba(0,212,200,0.05)"
              strokeWidth={i === 0 ? 1.5 : 0.8}
            />
          ))}

          {/* Zonen-Labels */}
          <text x={68} y={295} fill="rgba(212,162,0,0.22)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.2em">
            APPS
          </text>
          <text x={820} y={215} fill="rgba(107,0,204,0.3)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.2em">
            INFRA
          </text>

          {/* Karten-Titel */}
          <text x={26} y={28} fill="rgba(200,192,216,0.2)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.18em">
            ÖKOSYSTEM · KARTE
          </text>

          {/* ── Edges ─────────────────────────────────────────────────── */}
          {edges.map(({ from, to }) => {
            const isHighlighted = !connectedIds || (connectedIds.has(from.id) && connectedIds.has(to.id))
            const isPlanned = from.status === 'planned' || to.status === 'planned'
            return (
              <path
                key={`${from.id}-${to.id}`}
                d={edgePath(from, to)}
                fill="none"
                stroke={`url(#grad-${from.id}-${to.id})`}
                strokeWidth={isHighlighted ? 1.8 : 0.8}
                strokeDasharray={isPlanned ? '5 7' : undefined}
                opacity={isHighlighted ? 0.75 : 0.18}
                style={{ transition: 'opacity 0.25s, stroke-width 0.25s' }}
              />
            )
          })}

          {/* ── Nodes ─────────────────────────────────────────────────── */}
          {NODES.map(node => {
            const color    = STATUS_COLOR[node.status]
            const r        = NODE_RADIUS[node.status]
            const glowR    = GLOW_RADIUS[node.status]
            const isLive   = node.status === 'live'
            const isPlan   = node.status === 'planned'
            const isHov    = hovered === node.id
            const isSel    = selected?.id === node.id
            const isDimmed = connectedIds !== null && !connectedIds.has(node.id)
            const filterId = isLive ? 'glow-live' : isPlan ? 'glow-plan' : 'glow-prog'
            const isActive = activeSet.has(node.id)

            return (
              <g
                key={node.id}
                transform={`translate(${node.mx},${node.my})`}
                onClick={e => { e.stopPropagation(); selectNode(node) }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
                aria-label={`${node.name} — ${STATUS_LABEL[node.status]}`}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && selectNode(node)}
              >
                {/* Äußerer Glow */}
                <circle
                  r={isHov ? glowR * 1.2 : glowR}
                  fill={color}
                  opacity={isPlan ? 0.04 : isHov ? 0.12 : 0.065}
                  filter={`url(#${filterId})`}
                  style={{ transition: 'opacity 0.2s, r 0.2s' }}
                />

                {/* Haupt-Circle */}
                <circle
                  r={isHov ? r + 2 : r}
                  fill={isPlan ? 'rgba(6,0,14,0.75)' : color}
                  fillOpacity={isPlan ? 1 : 0.18}
                  stroke={color}
                  strokeWidth={isPlan ? 1 : 0}
                  strokeDasharray={isPlan ? '4 3' : undefined}
                  opacity={isDimmed ? 0.25 : 1}
                  style={{ transition: 'r 0.2s, opacity 0.25s, fill-opacity 0.2s' }}
                />

                {/* Live-Edit-Ring — pulsiert wenn aktiver PR offen */}
                {isActive && (
                  <circle
                    r={r + 14}
                    fill="none"
                    stroke="#00d4c8"
                    strokeWidth="1"
                    opacity="0.5"
                    strokeDasharray="3 4"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Selektions-Ring */}
                {(isSel || isHov) && (
                  <circle
                    r={r + (isSel ? 8 : 5)}
                    fill="none"
                    stroke={color}
                    strokeWidth={isSel ? 1.5 : 0.8}
                    opacity={isSel ? 0.8 : 0.45}
                    style={{ transition: 'r 0.2s, opacity 0.2s' }}
                  />
                )}

                {/* Emoji */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={r * 0.88}
                  opacity={isDimmed ? 0.25 : isPlan ? 0.65 : 1}
                  style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    transition: 'opacity 0.25s',
                  }}
                >
                  {node.emoji}
                </text>

                {/* Name */}
                <text
                  y={r + 15}
                  textAnchor="middle"
                  fill={color}
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.1em"
                  opacity={isDimmed ? 0.2 : isPlan ? 0.55 : 0.88}
                  style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    transition: 'opacity 0.25s',
                  }}
                >
                  {node.name}
                </text>

                {/* Port */}
                {node.port && (
                  <text
                    y={r + 28}
                    textAnchor="middle"
                    fill="rgba(200,192,216,0.35)"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    :{node.port}
                  </text>
                )}
              </g>
            )
          })}

          {/* ── Legende ───────────────────────────────────────────────── */}
          <g transform={`translate(26, ${VH - 34})`}>
            {([
              ['live',        'live'],
              ['in-progress', 'in progress'],
              ['planned',     'planned'],
            ] as const).map(([status, label], i) => (
              <g key={status} transform={`translate(${i * 98}, 0)`}>
                <circle r={4} fill={STATUS_COLOR[status]} opacity={status === 'planned' ? 0.5 : 0.85} />
                <text x="12" y="4" fill="rgba(200,192,216,0.45)" fontSize="9" fontFamily="var(--font-mono)">
                  {label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Popup-Panel */}
      {selected && (
        <Popup
          node={selected}
          onClose={() => setSelected(null)}
          onSelectDep={selectById}
        />
      )}
    </div>
  )
}

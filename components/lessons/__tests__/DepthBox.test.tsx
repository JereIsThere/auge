import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DepthBox, type DepthVariant } from '../DepthBox'

const VARIANTS: Array<{ variant: DepthVariant; icon: string; label: string }> = [
  { variant: 'basic',   icon: '🌱', label: 'Erstmal einfach' },
  { variant: 'why',     icon: '🤔', label: 'Warum eigentlich?' },
  { variant: 'mistake', icon: '⚠️', label: 'Häufiger Denkfehler' },
  { variant: 'deeper',  icon: '🔬', label: 'Tiefer rein' },
  { variant: 'related', icon: '🔗', label: 'Hängt zusammen mit…' },
  { variant: 'history', icon: '📜', label: 'Geschichte' },
]

describe('DepthBox', () => {
  it.each(VARIANTS)('rendert Variant $variant mit Icon $icon und Label $label', ({ variant, label }) => {
    render(<DepthBox variant={variant}>Inhalt</DepthBox>)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('rendert Kinder-Inhalt', () => {
    render(<DepthBox variant="why">Testinhalt hier</DepthBox>)
    expect(screen.getByText('Testinhalt hier')).toBeInTheDocument()
  })

  it('zeigt optionalen Titel an', () => {
    render(<DepthBox variant="deeper" title="Der spezielle Titel">Inhalt</DepthBox>)
    expect(screen.getByText(/Der spezielle Titel/)).toBeInTheDocument()
  })

  it('rendert ohne Titel wenn nicht angegeben', () => {
    const { container } = render(<DepthBox variant="basic">Inhalt</DepthBox>)
    expect(container.querySelector('.depth-title')).toBeNull()
  })

  it('ist standardmäßig geschlossen (kein open-Attribut)', () => {
    const { container } = render(<DepthBox variant="why">Inhalt</DepthBox>)
    const details = container.querySelector('details')
    expect(details).not.toHaveAttribute('open')
  })

  it('setzt open-Attribut wenn defaultOpen=true', () => {
    const { container } = render(
      <DepthBox variant="why" defaultOpen>Inhalt</DepthBox>
    )
    const details = container.querySelector('details')
    expect(details).toHaveAttribute('open')
  })

  it('verwendet <details>/<summary>-Semantik', () => {
    const { container } = render(<DepthBox variant="mistake">Inhalt</DepthBox>)
    expect(container.querySelector('details')).toBeInTheDocument()
    expect(container.querySelector('summary')).toBeInTheDocument()
  })

  it('setzt korrekten CSS-Klassen-Präfix je Variant', () => {
    const { container } = render(<DepthBox variant="related">Inhalt</DepthBox>)
    expect(container.querySelector('.depth-box.depth-related')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Aufgabe, AufgabeCheckliste } from '../Aufgabe'

describe('Aufgabe', () => {
  it('rendert Titel', () => {
    render(<Aufgabe titel="Café mit Schatten">Aufgaben-Inhalt</Aufgabe>)
    expect(screen.getByText('Café mit Schatten')).toBeInTheDocument()
  })

  it('rendert Kinder', () => {
    render(<Aufgabe titel="Test">Mein Inhalt</Aufgabe>)
    expect(screen.getByText('Mein Inhalt')).toBeInTheDocument()
  })

  it('zeigt Schwierigkeit mittel (Standard) als ●●○', () => {
    render(<Aufgabe titel="Test">Inhalt</Aufgabe>)
    expect(screen.getByText('●●○')).toBeInTheDocument()
  })

  it('zeigt Schwierigkeit leicht als ●○○', () => {
    render(<Aufgabe titel="Test" schwierigkeit="leicht">Inhalt</Aufgabe>)
    expect(screen.getByText('●○○')).toBeInTheDocument()
  })

  it('zeigt Schwierigkeit schwer als ●●●', () => {
    render(<Aufgabe titel="Test" schwierigkeit="schwer">Inhalt</Aufgabe>)
    expect(screen.getByText('●●●')).toBeInTheDocument()
  })

  it('zeigt Zeit wenn angegeben', () => {
    render(<Aufgabe titel="Test" zeit="45 min">Inhalt</Aufgabe>)
    expect(screen.getByText('⏱ 45 min')).toBeInTheDocument()
  })

  it('zeigt keine Zeit wenn nicht angegeben', () => {
    render(<Aufgabe titel="Test">Inhalt</Aufgabe>)
    expect(screen.queryByText(/⏱/)).toBeNull()
  })

  it('enthält Aufgabe-Marker', () => {
    render(<Aufgabe titel="Test">Inhalt</Aufgabe>)
    expect(screen.getByText('Aufgabe')).toBeInTheDocument()
  })

  it('setzt aria-label auf Schwierigkeit', () => {
    render(<Aufgabe titel="Test" schwierigkeit="schwer">Inhalt</Aufgabe>)
    expect(screen.getByLabelText('Schwierigkeit schwer')).toBeInTheDocument()
  })
})

describe('AufgabeCheckliste', () => {
  it('rendert alle Items', () => {
    render(<AufgabeCheckliste items={['Item A', 'Item B', 'Item C']} />)
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
    expect(screen.getByText('Item C')).toBeInTheDocument()
  })

  it('rendert als ul-Liste', () => {
    const { container } = render(<AufgabeCheckliste items={['Eins', 'Zwei']} />)
    expect(container.querySelector('ul')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(2)
  })

  it('rendert leere Liste ohne Fehler', () => {
    const { container } = render(<AufgabeCheckliste items={[]} />)
    expect(container.querySelector('ul')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })
})

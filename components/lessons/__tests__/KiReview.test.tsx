import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KiReview } from '../KiReview'

// navigator.clipboard ist in jsdom nicht verfügbar — als konfigurierbares Mock setzen,
// damit userEvent es für Interaktionstests ebenfalls nutzen kann.
const mockWriteText = vi.fn().mockResolvedValue(undefined)
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
  configurable: true,
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('KiReview', () => {
  const PROMPT = 'Bewerte dieses Aquarellbild nach Komposition und Farbkontrast.'

  it('zeigt den Prompt-Text in der Textarea an', () => {
    render(<KiReview prompt={PROMPT} />)
    expect(screen.getByRole('textbox')).toHaveValue(PROMPT)
  })

  it('Textarea ist read-only', () => {
    render(<KiReview prompt={PROMPT} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('zeigt Standard-Hinweis wenn kein Hinweis angegeben', () => {
    render(<KiReview prompt={PROMPT} />)
    expect(screen.getByText(/Kopiere den Prompt/)).toBeInTheDocument()
  })

  it('zeigt eigenen Hinweis wenn angegeben', () => {
    render(<KiReview prompt={PROMPT} hinweis="Mein eigener Hinweis." />)
    expect(screen.getByText('Mein eigener Hinweis.')).toBeInTheDocument()
    expect(screen.queryByText(/Kopiere den Prompt/)).toBeNull()
  })

  it('zeigt Copy-Button', () => {
    render(<KiReview prompt={PROMPT} />)
    expect(screen.getByRole('button', { name: /Prompt kopieren/i })).toBeInTheDocument()
  })

  it('Button-Text wechselt nach dem Kopieren zu "✓ kopiert"', async () => {
    const user = userEvent.setup()
    render(<KiReview prompt={PROMPT} />)

    await user.click(screen.getByRole('button', { name: /Prompt kopieren/i }))

    expect(await screen.findByText(/✓ kopiert/)).toBeInTheDocument()
  })

  it('berechnet Textarea-Zeilen anhand von Zeilenumbrüchen im Prompt', () => {
    const mehrzeilig = 'Zeile 1\nZeile 2\nZeile 3\nZeile 4\nZeile 5'
    render(<KiReview prompt={mehrzeilig} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    // rows = min(14, max(6, zeilenanzahl + 1)) → 5 Zeilen + 1 = 6
    expect(Number(textarea.rows)).toBe(6)
  })

  it('zeigt den Heading-Bereich "KI-Review starten"', () => {
    render(<KiReview prompt={PROMPT} />)
    expect(screen.getByText('KI-Review starten')).toBeInTheDocument()
  })
})

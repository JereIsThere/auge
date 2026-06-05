import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuelleBox } from '../QuelleBox'
import type { QuellePaper, QuelleBuch, QuelleRfc, QuelleBlog } from '@/types'

// ── Test-Fixtures ────────────────────────────────────────────────────────────

const PAPER: QuellePaper = {
  typ: 'paper',
  id: 'liu2024',
  titel: 'Lost in the Middle: How Language Models Use Long Contexts',
  jahr: 2024,
  autoren: ['Nelson F. Liu', 'Kevin Lin', 'John Hewitt'],
  venue: 'TACL',
  arxiv: '2307.03172',
}

const BUCH: QuelleBuch = {
  typ: 'buch',
  id: 'katz2021',
  titel: 'Introduction to Modern Cryptography',
  jahr: 2021,
  autoren: ['Jonathan Katz', 'Yehuda Lindell'],
  verlag: 'CRC Press',
}

const RFC: QuelleRfc = {
  typ: 'rfc',
  id: 'rfc8446',
  titel: 'The Transport Layer Security (TLS) Protocol Version 1.3',
  jahr: 2018,
  nummer: 8446,
  url: 'https://www.rfc-editor.org/rfc/rfc8446',
}

const BLOG: QuelleBlog = {
  typ: 'blog',
  id: 'attention2017',
  titel: 'Attention Is All You Need',
  jahr: 2017,
  autor: 'Ashish Vaswani',
  site: 'arXiv Blog',
  url: 'https://arxiv.org/abs/1706.03762',
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('QuelleBox — Paper', () => {
  it('rendert Titel des Papers', () => {
    render(<QuelleBox quelle={PAPER} />)
    expect(screen.getByText(PAPER.titel)).toBeInTheDocument()
  })

  it('zeigt Autoren', () => {
    render(<QuelleBox quelle={PAPER} />)
    expect(screen.getByText(/Nelson F. Liu/)).toBeInTheDocument()
  })

  it('zeigt Venue', () => {
    render(<QuelleBox quelle={PAPER} />)
    expect(screen.getByText(/TACL/)).toBeInTheDocument()
  })

  it('Titel ist ein Link zur arXiv-URL', () => {
    render(<QuelleBox quelle={PAPER} />)
    const link = screen.getByRole('link', { name: PAPER.titel })
    expect(link).toHaveAttribute('href', 'https://arxiv.org/abs/2307.03172')
  })

  it('zeigt Kurzform "Liu et al. 2024" im Header', () => {
    render(<QuelleBox quelle={PAPER} />)
    expect(screen.getByText('Liu et al. 2024')).toBeInTheDocument()
  })

  it('zeigt Typ-Label "Paper"', () => {
    render(<QuelleBox quelle={PAPER} />)
    expect(screen.getByText('Paper')).toBeInTheDocument()
  })

  it('rendert Kernaussagen als Liste', () => {
    render(
      <QuelleBox quelle={PAPER} kernaussagen={['Kernaussage A', 'Kernaussage B']} />
    )
    expect(screen.getByText('Kernaussage A')).toBeInTheDocument()
    expect(screen.getByText('Kernaussage B')).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('rendert Kinder statt Kernaussagen', () => {
    render(<QuelleBox quelle={PAPER}><p>Freier Inhalt</p></QuelleBox>)
    expect(screen.getByText('Freier Inhalt')).toBeInTheDocument()
  })
})

describe('QuelleBox — Buch', () => {
  it('zeigt Verlag', () => {
    render(<QuelleBox quelle={BUCH} />)
    expect(screen.getByText(/CRC Press/)).toBeInTheDocument()
  })

  it('Titel ohne Link wenn keine URL', () => {
    render(<QuelleBox quelle={BUCH} />)
    // Titel erscheint als Text, nicht als Link
    expect(screen.queryByRole('link', { name: BUCH.titel })).toBeNull()
    expect(screen.getByText(BUCH.titel)).toBeInTheDocument()
  })
})

describe('QuelleBox — RFC', () => {
  it('zeigt Typ-Label "RFC"', () => {
    render(<QuelleBox quelle={RFC} />)
    expect(screen.getByText('RFC')).toBeInTheDocument()
  })

  it('zeigt Kurzform "RFC 8446"', () => {
    render(<QuelleBox quelle={RFC} />)
    expect(screen.getByText('RFC 8446')).toBeInTheDocument()
  })

  it('Titel ist ein Link zur rfc-editor.org-URL', () => {
    render(<QuelleBox quelle={RFC} />)
    const link = screen.getByRole('link', { name: RFC.titel })
    expect(link).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc8446')
  })
})

describe('QuelleBox — Blog', () => {
  it('zeigt Autor', () => {
    render(<QuelleBox quelle={BLOG} />)
    expect(screen.getByText(/Ashish Vaswani/)).toBeInTheDocument()
  })

  it('zeigt Site-Name', () => {
    render(<QuelleBox quelle={BLOG} />)
    expect(screen.getByText(/arXiv Blog/)).toBeInTheDocument()
  })
})

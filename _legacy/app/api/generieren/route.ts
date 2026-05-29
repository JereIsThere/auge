import { NextResponse } from 'next/server';
import type { Kategorie } from '@/types';
import { themaErstellen, themaLaden } from '@/lib/orientdb';

interface AnfrageBody {
  titel: string;
  kategorie: Kategorie;
  tags?: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const ERLAUBTE_KATEGORIEN: Kategorie[] = ['cs', 'art', 'math', 'sprache', 'sonstiges'];

export async function POST(req: Request) {
  try {
    let body: AnfrageBody;
    try {
      body = await req.json() as AnfrageBody;
    } catch {
      return NextResponse.json({ fehler: 'Ungültiger Request-Body' }, { status: 400 });
    }

    const { titel, kategorie, tags = [] } = body;

    if (!titel || typeof titel !== 'string' || titel.trim().length < 2) {
      return NextResponse.json({ fehler: 'Titel zu kurz (min. 2 Zeichen)' }, { status: 400 });
    }

    if (!ERLAUBTE_KATEGORIEN.includes(kategorie)) {
      return NextResponse.json({ fehler: 'Ungültige Kategorie' }, { status: 400 });
    }

    const bereinigteTitel = titel.trim().slice(0, 200);
    const slug = slugify(bereinigteTitel);

    // Duplikat-Check
    const vorhanden = await themaLaden(slug);
    if (vorhanden) {
      return NextResponse.json(
        { fehler: 'Thema existiert bereits', slug: vorhanden.slug },
        { status: 409 }
      );
    }

    // In OrientDB anlegen
    const id = await themaErstellen(slug, bereinigteTitel, kategorie, tags);

    // n8n-Webhook triggern (falls konfiguriert)
    const webhookUrl = process.env.N8N_WEBHOOK_GENERIEREN;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, titel: bereinigteTitel, kategorie, tags }),
        });
      } catch (err) {
        console.error('[Generieren] n8n Webhook fehlgeschlagen:', err);
      }
    }

    return NextResponse.json({ id, slug, status: 'ausstehend' }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/generieren]', err);
    return NextResponse.json(
      { fehler: 'Interner Fehler – OrientDB erreichbar?' },
      { status: 500 }
    );
  }
}

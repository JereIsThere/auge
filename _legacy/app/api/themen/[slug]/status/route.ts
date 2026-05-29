import { NextResponse } from 'next/server';
import { themaLaden } from '@/lib/orientdb';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const thema = await themaLaden(slug);
    if (!thema) {
      return NextResponse.json({ fehler: 'Nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ status: thema.status, slug: thema.slug });
  } catch (err) {
    console.error(`[GET /api/themen/${slug}/status]`, err);
    return NextResponse.json({ fehler: 'Datenbankfehler' }, { status: 500 });
  }
}
